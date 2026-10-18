/**
 * Read-aloud voices for the immersive reader, generated with Gemini text-to-speech. Each preset pairs a Gemini
 * prebuilt voice with a delivery style. Custom voices made with scripts/design-voices.mjs (Gemini Voice design) can
 * replace `voice`; so far one exists in the project: Grizzled Detective = "voice_hz4o6786th71". To use an exact voice from AI Studio's voice library (or a designed voice
 * such as a Nepali-accented one), replace `voice` with that voice's id from `GET /v1beta/voices`.
 */
export const speechVoices = [
  { id: "detective", label: "Grizzled Detective", description: "Low, gravelly noir", voice: "Algenib", style: "Low, gravelly film-noir detective narration: unhurried, world-weary, with dry understatement. Keep every word clear." },
  { id: "meditation", label: "Meditation Guide", description: "Airy & soothing", voice: "Achernar", style: "Airy, calm and soothing like a meditation guide: slow, gentle, with soft pauses between sentences." },
  { id: "announcer", label: "Hype Announcer", description: "Booming arena energy", voice: "Fenrir", style: "Booming arena-announcer energy: big, bold and hyped up, while keeping every word easy to follow." },
  { id: "monarch", label: "Regal Monarch", description: "Poised & commanding", voice: "Gacrux", style: "Poised, regal and commanding: measured, deliberate and dignified." },
  { id: "dj", label: "Late-Night DJ", description: "Smooth & velvety", voice: "Algieba", style: "Smooth, velvety late-night radio DJ: warm, low, relaxed and intimate." },
  { id: "sidekick", label: "Cheeky Sidekick", description: "Bright & playful · Nepali accent", voice: "Puck", style: "Bright, playful and cheeky sidekick energy, speaking English with a natural Nepali accent." },
] as const;

export type SpeechVoiceId = (typeof speechVoices)[number]["id"];
export const defaultSpeechVoice: SpeechVoiceId = "dj";
export const isSpeechVoice = (value: string): value is SpeechVoiceId => speechVoices.some((voice) => voice.id === value);
