import { getBlog, getWork } from "@/content/catalog";
import { speechBlocks } from "@/lib/speech/blocks";
import { isSpeechVoice, speechVoices } from "@/config/speech-voices";
import { immersiveReaderEnabled } from "@/config/features";

/**
 * Speaks one paragraph of a published article in one of the reader's preset voices, using Gemini text-to-speech.
 * Only real article paragraphs and preset voices are accepted, and each clip is cached for a year by URL (the text
 * hash is part of it), so every paragraph-and-voice pair is generated once.
 */

const MODEL = process.env.GEMINI_TTS_MODEL?.trim() || "gemini-3.8-flash-tts";
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

type GeminiStep = { type?: string; content?: { type?: string; data?: string }[] };

function fail(status: number, message: string) {
  return new Response(message, { status, headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" } });
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const kind = params.get("kind");
  const slug = params.get("slug") ?? "";
  const index = Number(params.get("block"));
  const voiceId = params.get("voice") ?? "";
  const hash = params.get("h") ?? "";

  // While the reader is hidden, nothing should spend the Gemini quota.
  if (!immersiveReaderEnabled) return fail(404, "Not found.");
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return fail(503, "Read-aloud is not configured.");
  if (!isSpeechVoice(voiceId)) return fail(400, "Unknown voice.");
  if (!/^[\w-]+$/.test(slug) || !Number.isInteger(index) || index < 0) return fail(400, "Bad request.");

  const entry = kind === "insight" ? getBlog(slug) : kind === "work" ? getWork(slug) : undefined;
  if (!entry) return fail(404, "Not found.");
  const markdown = kind === "work" ? entry.content.replace(/^#\s+[^\n]+\n/, "") : entry.content;
  const block = speechBlocks(entry.title, markdown)[index];
  // The hash ties the URL to the current text, so edited paragraphs get fresh audio instead of a stale cached clip.
  if (!block || block.hash !== hash) return fail(404, "Not found.");

  const preset = speechVoices.find((voice) => voice.id === voiceId)!;
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      model: MODEL,
      input: [{ type: "user_input", content: [{ type: "text", text: block.text, annotations: [{ type: "speech_metadata", style: preset.style }] }] }],
      response_format: { type: "audio" },
      generation_config: { speech_config: [{ voice: preset.voice }] },
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("Gemini TTS failed", response.status, detail.slice(0, 500));
    if (response.status === 429) {
      // Pass the quota back so the reader can wait and retry instead of giving up.
      const seconds = Number(response.headers.get("retry-after") ?? detail.match(/retry in (\d+)/i)?.[1] ?? 30);
      return new Response("Voice is busy.", { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": String(Math.min(Math.max(seconds, 1), 120)) } });
    }
    return fail(502, "Speech generation failed.");
  }
  const result = (await response.json()) as { steps?: GeminiStep[] };
  const audio = result.steps
    ?.filter((step) => step.type === "model_output")
    .flatMap((step) => step.content ?? [])
    .filter((part) => part.type === "audio" && part.data)
    .at(-1)?.data;
  if (!audio) return fail(502, "Speech generation returned no audio.");

  return new Response(Buffer.from(audio, "base64"), {
    headers: {
      "Content-Type": "audio/wav",
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
