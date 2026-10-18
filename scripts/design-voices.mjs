// Creates the immersive reader's six voices with Gemini Voice design and stores them in your Google project.
// Usage: node scripts/design-voices.mjs <folder-for-sample-audio> [preset ids…]
// Reads GEMINI_API_KEY from .env.local (never printed). Prints each preset's new `voice_…` id; put those ids in
// src/config/speech-voices.ts. Stored voices last a year after their last use; you can have up to 200 per project.
import fs from "node:fs";
import path from "node:path";

const designs = {
  detective: {
    display_name: "Grizzled Detective",
    gender: "male",
    pitch: "low",
    input:
      "A middle-aged man's low, gravelly voice with a rough, smoky texture, like a world-weary 1940s film-noir detective narrating his case. Unhurried, dry and understated, with a slight rasp, yet every word is clear.",
  },
  meditation: {
    display_name: "Meditation Guide",
    gender: "female",
    pitch: "medium",
    input:
      "A calm woman's airy, breathy voice, soft and warm, speaking slowly and soothingly like a meditation guide, with gentle pacing and a peaceful, reassuring tone.",
  },
  announcer: {
    display_name: "Hype Announcer",
    gender: "male",
    pitch: "medium",
    input:
      "A powerful male arena announcer with a booming, resonant voice and huge energy, projecting with excitement like introducing a championship fight, yet articulate and easy to follow.",
  },
  monarch: {
    display_name: "Regal Monarch",
    gender: "female",
    pitch: "medium",
    input:
      "A mature woman's poised, regal voice with commanding authority and refined diction, measured and deliberate, like a queen addressing her court.",
  },
  dj: {
    display_name: "Late-Night DJ",
    gender: "male",
    pitch: "low",
    input:
      "A smooth, velvety male voice with a low, warm tone, relaxed and intimate, like a late-night jazz radio DJ talking to listeners after midnight.",
  },
  sidekick: {
    display_name: "Cheeky Sidekick",
    gender: "male",
    pitch: "medium",
    region_code: "NP",
    accent: "Nepali English",
    input:
      "A bright, playful young man from Kathmandu speaking English with a natural, clearly Nepali accent: cheeky, upbeat and quick-witted like a fun sidekick, warm and friendly.",
  },
};

const outDir = process.argv[2];
if (!outDir) throw new Error("Pass a folder for the sample audio, e.g. node scripts/design-voices.mjs ./voice-samples");
const only = process.argv.slice(3);
const key = fs.readFileSync(".env.local", "utf8").match(/^GEMINI_API_KEY=(.+)$/m)?.[1]?.trim();
if (!key) throw new Error("GEMINI_API_KEY is missing from .env.local");
fs.mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function design(id, { input, region_code, ...meta }) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/voices", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        store: true,
        voice: {
          type: "prompted",
          language_code: region_code ? `en-${region_code}` : "en-US",
          region_code: region_code ?? "US",
          ...meta,
          prompted: { input },
        },
      }),
    });
    const text = await response.text();
    if (response.status === 429) {
      const wait = Number(response.headers.get("retry-after") ?? text.match(/retry in (\d+)/i)?.[1] ?? 60);
      console.log(`  ${id}: rate limited, waiting ${wait + 5}s (attempt ${attempt})`);
      await sleep((wait + 5) * 1000);
      continue;
    }
    if (response.status >= 500) {
      console.log(`  ${id}: Google returned ${response.status}, retrying in 30s (attempt ${attempt})`);
      await sleep(30_000);
      continue;
    }
    if (!response.ok) throw new Error(`${id}: ${response.status} ${text.slice(0, 400)}`);
    const voice = JSON.parse(text);
    const audio = voice.sample_audio?.data;
    if (audio) fs.writeFileSync(path.join(outDir, `${id}.wav`), Buffer.from(audio, "base64"));
    return voice.id ?? voice.name;
  }
  throw new Error(`${id}: still unavailable after 5 attempts`);
}

const results = {};
for (const [id, spec] of Object.entries(designs)) {
  if (only.length && !only.includes(id)) continue;
  results[id] = await design(id, spec);
  console.log(`${id}: ${results[id]}`);
  await sleep(25_000);
}
console.log(JSON.stringify(results, null, 2));
