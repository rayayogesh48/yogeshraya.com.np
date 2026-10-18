"use client";

import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Check, Focus, Headphones, Loader2, Minus, Play, Plus, Square, Type, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { EASE } from "@/components/motion/portfolio-motion.client";
import { defaultSpeechVoice, isSpeechVoice, speechVoices, type SpeechVoiceId } from "@/config/speech-voices";

type Preferences = {
  size: number;
  font: "sans" | "serif";
  spacing: "normal" | "relaxed";
  page: "site" | "paper" | "night";
  voice: SpeechVoiceId;
  rate: number;
};

const SIZES = [16, 18, 20, 22];
const DEFAULTS: Preferences = { size: 1, font: "sans", spacing: "normal", page: "site", voice: defaultSpeechVoice, rate: 1 };
const RATES = ["0.8", "1", "1.25", "1.5"] as const;

/** Server-prepared paragraphs for read-aloud; each `hash` pins its cached audio to the exact text. */
export type ReaderSpeech = { kind: "insight" | "work"; slug: string; blocks: { text: string; hash: string }[] };
type SpeechStatus = "idle" | "loading" | "playing";
type Clip = { url: string } | { retryAfter: number } | { failed: true };
const MAX_RETRIES = 4;

const normalize = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
const STORAGE_KEY = "reader-preferences";
/** Set once a visitor has seen and acted on the reader introduction, so it only ever shows once. */
const INTRO_KEY = "reader-intro-seen";
const INTRO_DELAY_MS = 900;
const WORDS_PER_MINUTE = 200;
/** Blocks the reader can focus and read aloud, in document order. */
const BLOCKS = "h1, h2, h3, h4, p, li, blockquote, figcaption, td";

function loadPreferences(): Preferences {
  try {
    const saved = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") };
    // Older settings stored a device voice; anything that isn't one of the presets falls back to the default.
    return isSpeechVoice(saved.voice) ? saved : { ...saved, voice: defaultSpeechVoice };
  } catch {
    return DEFAULTS;
  }
}

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (value: T) => void }) {
  return (
    <div className="reader-setting" role="group" aria-label={label}>
      <span className="reader-setting-label">{label}</span>
      <div className="reader-segmented">
        {options.map(([option, text]) => (
          <button type="button" key={option} aria-pressed={value === option} onClick={() => onChange(option)}>
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * A distraction-free reading view for long-form pages: adjustable text, a paragraph focus mode, and read-aloud in
 * natural-sounding Gemini voices (served and cached by /api/speech). The article content is passed in already
 * rendered and only mounts while the reader is open. Read-aloud only appears when `speech` is provided.
 */
export function ImmersiveReader({ title, meta, content, speech }: { title: string; meta?: string; content: ReactNode; speech?: ReaderSpeech }) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);
  const [focusMode, setFocusMode] = useState(false);
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const speaking = status !== "idle";
  const [speechError, setSpeechError] = useState("");
  const [previewing, setPreviewing] = useState<SpeechVoiceId | null>(null);
  const canSpeak = Boolean(speech?.blocks.length);
  // Playback runs across many callbacks, so it reads the latest settings from refs; `run` retires old playback chains.
  const prefsRef = useRef(prefs);
  const speakingRef = useRef(speaking);
  const run = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewRef = useRef<HTMLAudioElement | null>(null);
  const speechIndex = useRef(0);
  // Downloaded clips keyed by voice and paragraph, shared by playback and look-ahead so each is requested once.
  const clips = useRef(new Map<string, Promise<Clip>>());
  const [waitSeconds, setWaitSeconds] = useState(0);
  // The portal target only exists in the browser; render it after mount so server and client markup match.
  const [mounted, setMounted] = useState(false);
  // One-time introduction for first-time visitors: a highlighted button and a short callout.
  const [intro, setIntro] = useState(false);
  const [progress, setProgress] = useState(0);
  const [words, setWords] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const displayRef = useRef<HTMLButtonElement>(null);
  const blockIndex = useRef(0);

  useEffect(() => {
    setPrefs(loadPreferences());
    setMounted(true);
    let seen = true;
    try {
      // If storage is unavailable we can't remember a dismissal, so stay quiet rather than show it on every visit.
      seen = localStorage.getItem(INTRO_KEY) === "1";
    } catch {}
    if (seen) return;
    const timer = setTimeout(() => setIntro(true), INTRO_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismissIntro = useCallback(() => {
    setIntro(false);
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {}
  }, []);

  const openReader = useCallback(() => {
    dismissIntro();
    setOpen(true);
  }, [dismissIntro]);

  // The introduction steps aside on Escape, or once the visitor has scrolled into the article.
  useEffect(() => {
    if (!intro) return;
    const onScroll = () => {
      if (window.scrollY > 480) dismissIntro();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismissIntro();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [intro, dismissIntro]);

  const update = (patch: Partial<Preferences>) =>
    setPrefs((current) => {
      const next = { ...current, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

  // The date/role line above the title isn't worth reading aloud or focusing on.
  const blocks = useCallback(
    () => [...(articleRef.current?.querySelectorAll<HTMLElement>(BLOCKS) ?? [])].filter((block) => !block.classList.contains("reader-meta")),
    [],
  );

  const markCurrent = useCallback(
    (index: number) => {
      blocks().forEach((block, i) => block.toggleAttribute("data-current", i === index));
      blockIndex.current = index;
    },
    [blocks],
  );

  useEffect(() => {
    prefsRef.current = prefs;
    speakingRef.current = speaking;
  });

  const urlFor = useCallback(
    (index: number, voice: SpeechVoiceId) => {
      if (!speech) return "";
      const params = new URLSearchParams({ kind: speech.kind, slug: speech.slug, block: String(index), voice, h: speech.blocks[index].hash });
      return `/api/speech?${params}`;
    },
    [speech],
  );

  /** Fetches (once) the clip for a paragraph; a rate limit is returned as a wait instead of a failure. */
  const clip = useCallback(
    (index: number, voice: SpeechVoiceId) => {
      const key = `${voice}:${index}`;
      const existing = clips.current.get(key);
      if (existing) return existing;
      const request: Promise<Clip> = fetch(urlFor(index, voice))
        .then(async (response): Promise<Clip> => {
          if (response.status === 429) return { retryAfter: Number(response.headers.get("retry-after")) || 30 };
          if (!response.ok) return { failed: true };
          return { url: URL.createObjectURL(await response.blob()) };
        })
        .catch((): Clip => ({ failed: true }));
      clips.current.set(key, request);
      // Waits and failures aren't kept, so the next attempt asks again.
      request.then((result) => "url" in result || clips.current.delete(key));
      return request;
    },
    [urlFor],
  );

  /** The on-screen paragraph for each spoken block, matched by text in reading order (null when not shown). */
  const speechTargets = useCallback(() => {
    const dom = blocks().map((element) => ({ element, text: normalize(element.innerText) }));
    let from = 0;
    return (speech?.blocks ?? []).map(({ text }) => {
      const wanted = normalize(text).slice(0, 80);
      const found = dom.findIndex((candidate, index) => index >= from && candidate.text.length > 0 && (candidate.text.startsWith(wanted) || wanted.startsWith(candidate.text)));
      if (found < 0) return null;
      from = found + 1;
      return found;
    });
  }, [blocks, speech]);

  const stopPreview = useCallback(() => {
    previewRef.current?.pause();
    setPreviewing(null);
  }, []);

  const stopSpeaking = useCallback(() => {
    run.current += 1;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setStatus("idle");
  }, []);

  const close = useCallback(() => {
    stopSpeaking();
    stopPreview();
    setSettingsOpen(false);
    setOpen(false);
  }, [stopSpeaking, stopPreview]);

  // Read aloud one block at a time, so the highlight and scroll follow along. One <audio> element is reused, which
  // keeps browsers' autoplay rules satisfied after the first tap on Listen.
  const speakFrom = useCallback(
    (start: number) => {
      if (!speech) return;
      stopPreview();
      setSpeechError("");
      run.current += 1;
      const thisRun = run.current;
      const targets = speechTargets();
      const audio = audioRef.current ?? (audioRef.current = new Audio());
      const giveUp = () => {
        if (thisRun !== run.current) return;
        stopSpeaking();
        setSpeechError("Voice unavailable right now");
      };
      const playAt = async (index: number, attempt = 0) => {
        if (thisRun !== run.current) return;
        if (index >= speech.blocks.length) return stopSpeaking();
        speechIndex.current = index;
        const target = targets[index];
        if (target != null) {
          markCurrent(target);
          blocks()[target]?.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        }
        setStatus("loading");
        const voice = prefsRef.current.voice;
        const result = await clip(index, voice);
        if (thisRun !== run.current) return;
        if ("retryAfter" in result) {
          if (attempt >= MAX_RETRIES) return giveUp();
          // Count down visibly, then ask again for the same paragraph.
          for (let left = result.retryAfter; left > 0; left--) {
            setWaitSeconds(left);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            if (thisRun !== run.current) return setWaitSeconds(0);
          }
          setWaitSeconds(0);
          return playAt(index, attempt + 1);
        }
        if ("failed" in result) return giveUp();
        audio.src = result.url;
        audio.playbackRate = prefsRef.current.rate;
        audio.preservesPitch = true;
        audio.onplaying = () => thisRun === run.current && setStatus("playing");
        audio.onended = () => void playAt(index + 1);
        audio.onerror = giveUp;
        audio.play().catch(giveUp);
        // Look one paragraph ahead so the next starts without a gap.
        if (index + 1 < speech.blocks.length) void clip(index + 1, voice);
      };
      void playAt(start);
    },
    [speech, speechTargets, clip, markCurrent, blocks, stopSpeaking, stopPreview],
  );

  /** Start from the paragraph in focus (or the top), mapping on-screen position to the spoken blocks. */
  const listen = () => {
    const targets = speechTargets();
    const start = targets.findIndex((target) => target != null && target >= blockIndex.current);
    speakFrom(Math.max(0, start));
  };

  // A new voice restarts the current paragraph in that voice; speed applies to what's already playing.
  useEffect(() => {
    if (speakingRef.current) speakFrom(speechIndex.current);
  }, [prefs.voice, speakFrom]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = prefs.rate;
  }, [prefs.rate]);

  /** Plays the article title in a voice so visitors can compare before choosing. */
  const preview = (voice: SpeechVoiceId) => {
    if (previewing === voice) return stopPreview();
    stopSpeaking();
    const audio = previewRef.current ?? (previewRef.current = new Audio());
    const failed = (message: string) => {
      setPreviewing(null);
      setSpeechError(message);
    };
    setPreviewing(voice);
    setSpeechError("");
    void clip(0, voice).then((result) => {
      if ("retryAfter" in result) return failed(`Voice is busy, try again in ${result.retryAfter}s`);
      if ("failed" in result) return failed("Voice unavailable right now");
      audio.src = result.url;
      audio.onended = () => setPreviewing(null);
      audio.onerror = () => failed("Voice unavailable right now");
      audio.play().catch(() => failed("Voice unavailable right now"));
    });
  };

  // Open/close side effects: lock page scroll, move focus in, and give it back to the trigger afterwards.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>(".reader-close")?.focus();
    setWords(articleRef.current?.innerText.split(/\s+/).filter(Boolean).length ?? 0);
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = previous;
      trigger?.focus();
    };
  }, [open]);

  useEffect(() => {
    const cache = clips.current;
    return () => {
      stopSpeaking();
      stopPreview();
      for (const request of cache.values()) void request.then((result) => "url" in result && URL.revokeObjectURL(result.url));
      cache.clear();
    };
  }, [stopSpeaking, stopPreview]);

  // Escape works wherever focus is: it closes the settings panel first (returning focus to its button), then the reader.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (settingsOpen) {
        setSettingsOpen(false);
        displayRef.current?.focus();
      } else close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, settingsOpen, close]);

  // `R` opens the reader from anywhere on the page (not while typing).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (open || event.metaKey || event.ctrlKey || event.altKey || target.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        openReader();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openReader]);

  // Progress, and in focus mode the paragraph closest to the middle of the screen (unless read-aloud leads).
  const onScroll = () => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const max = scroller.scrollHeight - scroller.clientHeight;
    setProgress(max > 0 ? scroller.scrollTop / max : 1);
    if (!focusMode || speaking) return;
    const middle = scroller.getBoundingClientRect().top + scroller.clientHeight * 0.45;
    let best = 0;
    let bestDistance = Infinity;
    blocks().forEach((block, index) => {
      const rect = block.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - middle);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    if (best !== blockIndex.current) markCurrent(best);
  };

  useEffect(() => {
    if (open && focusMode) onScroll();
    // Recompute when focus mode turns on; onScroll reads the latest refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusMode, open]);

  const onDialogKey = (event: ReactKeyboardEvent) => {
    if (event.key === "Tab") {
      // Keep keyboard focus inside the reader while it is open.
      const focusable = [...(dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])") ?? [])].filter(
        (element) => !element.hasAttribute("disabled") && element.offsetParent !== null,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  };

  const minutesLeft = Math.max(1, Math.ceil((words * (1 - progress)) / WORDS_PER_MINUTE));

  return (
    <>
      <span className="reader-anchor">
        <button
          ref={triggerRef}
          type="button"
          className="chip reader-trigger"
          onClick={openReader}
          aria-keyshortcuts="r"
          aria-haspopup="dialog"
          aria-describedby={intro ? "reader-intro-text" : undefined}
          data-intro={intro ? "on" : undefined}
        >
          <BookOpen size={14} aria-hidden="true" />
          <span>Immersive reader</span>
          <kbd aria-hidden="true">R</kbd>
        </button>
        <AnimatePresence>
          {intro && (
            <motion.div
              className="reader-intro"
              aria-labelledby="reader-intro-title"
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <span className="reader-intro-caret" aria-hidden="true" />
              <p className="reader-intro-title" id="reader-intro-title">
                <span className="reader-intro-badge">New</span>
                Try the immersive reader
              </p>
              <p className="reader-intro-text" id="reader-intro-text">
                Read without distractions: larger text, a paragraph focus mode, or listen to it aloud.
              </p>
              <div className="reader-intro-actions">
                <button type="button" className="reader-intro-primary" onClick={openReader}>
                  Try it
                </button>
                <button type="button" className="reader-intro-secondary" onClick={dismissIntro}>
                  Got it
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <span className="sr-only" role="status">
          {intro ? "New: an immersive reader is available for this page. Press R or use the Immersive reader button." : ""}
        </span>
      </span>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={dialogRef}
                className="reader"
                role="dialog"
                aria-modal="true"
                aria-label={`Immersive reader: ${title}`}
                data-page={prefs.page}
                data-font={prefs.font}
                data-spacing={prefs.spacing}
                data-focus={focusMode || speaking ? "on" : undefined}
                style={{ "--reader-size": `${SIZES[prefs.size]}px` } as CSSProperties}
                onKeyDown={onDialogKey}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className="reader-bar">
                  <button type="button" className="reader-icon-btn reader-close" onClick={close} aria-label="Close immersive reader">
                    <X size={18} />
                  </button>
                  <span className="reader-bar-title" aria-hidden="true">
                    {title}
                  </span>
                  <span className="reader-left" role="status">
                    {speechError ||
                      (waitSeconds > 0
                        ? `Voice is busy, continuing in ${waitSeconds}s`
                        : status === "loading"
                          ? "Loading voice…"
                          : progress >= 0.99
                            ? "Finished"
                            : `${minutesLeft} min left`)}
                  </span>
                  <div className="reader-actions">
                    <button
                      type="button"
                      className="reader-icon-btn"
                      aria-label="Focus"
                      aria-pressed={focusMode}
                      onClick={() => setFocusMode((value) => !value)}
                      title="Focus on one paragraph at a time"
                    >
                      <Focus size={17} aria-hidden="true" />
                      <span className="reader-btn-label">Focus</span>
                    </button>
                    {canSpeak && (
                      <button
                        type="button"
                        className="reader-icon-btn"
                        aria-label={speaking ? "Stop" : "Listen"}
                        aria-pressed={speaking}
                        onClick={() => (speaking ? stopSpeaking() : listen())}
                        title={speaking ? "Stop reading aloud" : "Read aloud"}
                      >
                        {status === "loading" ? (
                          <Loader2 size={16} className="reader-spin" aria-hidden="true" />
                        ) : speaking ? (
                          <Square size={15} aria-hidden="true" />
                        ) : (
                          <Headphones size={17} aria-hidden="true" />
                        )}
                        <span className="reader-btn-label">{speaking ? "Stop" : "Listen"}</span>
                      </button>
                    )}
                    <button
                      ref={displayRef}
                      type="button"
                      className="reader-icon-btn"
                      aria-label="Display"
                      aria-expanded={settingsOpen}
                      aria-controls="reader-settings"
                      onClick={() => setSettingsOpen((value) => !value)}
                      title="Text and page settings"
                    >
                      <Type size={17} aria-hidden="true" />
                      <span className="reader-btn-label">Display</span>
                    </button>
                  </div>
                  <AnimatePresence>
                    {settingsOpen && (
                      <motion.div
                        id="reader-settings"
                        className="reader-settings"
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: EASE }}
                      >
                        <div className="reader-setting" role="group" aria-label="Text size">
                          <span className="reader-setting-label">Text size</span>
                          <div className="reader-stepper">
                            <button type="button" aria-label="Smaller text" disabled={prefs.size === 0} onClick={() => update({ size: prefs.size - 1 })}>
                              <Minus size={15} />
                            </button>
                            <span aria-live="polite">{SIZES[prefs.size]}px</span>
                            <button type="button" aria-label="Larger text" disabled={prefs.size === SIZES.length - 1} onClick={() => update({ size: prefs.size + 1 })}>
                              <Plus size={15} />
                            </button>
                          </div>
                        </div>
                        <Segmented label="Font" value={prefs.font} options={[["sans", "Sans"], ["serif", "Serif"]]} onChange={(font) => update({ font })} />
                        <Segmented label="Spacing" value={prefs.spacing} options={[["normal", "Normal"], ["relaxed", "Relaxed"]]} onChange={(spacing) => update({ spacing })} />
                        <Segmented label="Page" value={prefs.page} options={[["site", "Site"], ["paper", "Paper"], ["night", "Night"]]} onChange={(page) => update({ page })} />
                        {canSpeak && (
                          <>
                            <div className="reader-setting reader-setting-stack" role="group" aria-label="Voice">
                              <span className="reader-setting-label">Voice</span>
                              <ul className="reader-voices">
                                {speechVoices.map((voice) => (
                                  <li key={voice.id} className="reader-voice" data-selected={prefs.voice === voice.id ? "" : undefined}>
                                    <button type="button" className="reader-voice-pick" aria-pressed={prefs.voice === voice.id} onClick={() => update({ voice: voice.id })}>
                                      <span className="reader-voice-name">
                                        {voice.label}
                                        {prefs.voice === voice.id && <Check size={13} aria-hidden="true" />}
                                      </span>
                                      <span className="reader-voice-desc">{voice.description}</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="reader-voice-preview"
                                      aria-label={previewing === voice.id ? `Stop ${voice.label} preview` : `Preview ${voice.label}`}
                                      onClick={() => preview(voice.id)}
                                    >
                                      {previewing === voice.id ? <Square size={12} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <Segmented
                              label="Speed"
                              value={String(prefs.rate) as (typeof RATES)[number]}
                              options={RATES.map((rate) => [rate, `${rate}×`])}
                              onChange={(rate) => update({ rate: Number(rate) })}
                            />
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="reader-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
                </div>
                <div className="reader-scroll" ref={scrollRef} onScroll={onScroll} tabIndex={0} aria-label="Article">
                  <article className="reader-article" ref={articleRef}>
                    {meta && <p className="reader-meta">{meta}</p>}
                    <h1>{title}</h1>
                    {content}
                  </article>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
