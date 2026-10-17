"use client";

import { useParticleCanvas, type Rgb, type Scene, type SceneState } from "./particle-canvas.client";

/**
 * The Himalaya as it lines the northern horizon from the Kathmandu valley, drawn as a halftone of dots. The light
 * follows the real time in Nepal (alpenglow at dawn and dusk, stars at night), the cursor works like a headlamp that
 * names the nearest high peak, and a click sends a gust of wind rolling through the ridges.
 */

const GAP = 5;
const ALPHA_STEPS = 12;
const GUST_SECONDS = 2.6;
const LAMP_RADIUS = 80;
const EVEREST_METRES = 8849;
const ALPENGLOW: Rgb = [255, 120, 70];
const DOT_SIZE = [1.2, 1.45, 1.7, 2];
/** Each layer is brightest along its ridge and fades towards its floor further down, so the layers separate. */
const RIDGE_ALPHA = [0.42, 0.34, 0.28, 0.22];
const FLOOR_ALPHA = [0.12, 0.09, 0.07, 0.06];
const SHADE_AMOUNT = [0.45, 0.3, 0.2, 0.1];

type Peak = { name: string; metres: number; at: number; width: number };

// West to east, which is left to right when facing north from the valley.
const PEAKS: Peak[] = [
  { name: "Dhaulagiri", metres: 8167, at: 0.06, width: 0.11 },
  { name: "Annapurna", metres: 8091, at: 0.18, width: 0.12 },
  { name: "Manaslu", metres: 8163, at: 0.32, width: 0.11 },
  { name: "Langtang Lirung", metres: 7234, at: 0.45, width: 0.09 },
  { name: "Cho Oyu", metres: 8188, at: 0.6, width: 0.11 },
  { name: "Everest", metres: 8849, at: 0.71, width: 0.1 },
  { name: "Lhotse", metres: 8516, at: 0.77, width: 0.07 },
  { name: "Makalu", metres: 8485, at: 0.86, width: 0.1 },
  { name: "Kangchenjunga", metres: 8586, at: 0.96, width: 0.11 },
];

/** Foothill layers in front of the high range: baseline and amplitude as fractions of the banner height. */
const HILLS = [
  { base: 0.78, amplitude: 0.26, frequency: 5.2, seed: 11, sharpness: 1.6 },
  { base: 0.9, amplitude: 0.2, frequency: 3.4, seed: 23, sharpness: 1.3 },
  { base: 1.02, amplitude: 0.17, frequency: 2.2, seed: 37, sharpness: 1.1 },
];

function hash(i: number, j: number) {
  const value = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function noise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const top = hash(ix, iy) + (hash(ix + 1, iy) - hash(ix, iy)) * ux;
  const bottom = hash(ix, iy + 1) + (hash(ix + 1, iy + 1) - hash(ix, iy + 1)) * ux;
  return top + (bottom - top) * uy;
}

function fbm(x: number, y: number) {
  return 0.55 * noise(x, y) + 0.3 * noise(x * 2.03, y * 2.03) + 0.15 * noise(x * 4.11, y * 4.11);
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/** Screen y of a layer's ridge at horizontal position `u` (0–1). Layer 0 is the high range, 3 the nearest hills. */
function ridgeline(layer: number, u: number, height: number) {
  if (layer === 0) {
    // A jagged connecting ridge, with each named peak rising out of it as a rough pyramid.
    const jag = 0.05 * noise(u * 48, 5) + 0.03 * noise(u * 110, 9);
    let lift = 0.26 + 0.22 * fbm(u * 9, 1.3) + jag;
    PEAKS.forEach((peak, index) => {
      // Lopsided flanks and varied steepness, so the skyline doesn't read as a row of identical pyramids.
      const skew = (hash(index, 3) - 0.5) * 0.7;
      const flank = u < peak.at ? peak.width * (1 + skew) : peak.width * (1 - skew);
      const t = 1 - Math.abs(u - peak.at) / flank;
      if (t > 0) lift = Math.max(lift, (peak.metres / EVEREST_METRES) * t ** (0.95 + hash(index, 7) * 0.7) + jag * t);
    });
    return height * (0.62 - 0.52 * lift);
  }
  const hill = HILLS[layer - 1];
  const shape = clamp((fbm(u * hill.frequency, hill.seed) - 0.2) / 0.6);
  return height * (hill.base - hill.amplitude * shape ** hill.sharpness);
}

/** How the range is lit right now in Nepal: alpenglow strength, how dark it is, and where the light comes from. */
function nepalLight(now: Date) {
  const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kathmandu" });
  const [hour, minute] = now
    .toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kathmandu" })
    .split(":")
    .map(Number);
  const hours = hour + minute / 60;
  const glow = clamp(Math.max(1 - Math.abs(hours - 6.1) / 1.1, 1 - Math.abs(hours - 18.3) / 1.1));
  const night = clamp(Math.max((5.6 - hours) / 0.6, (hours - 19) / 0.6));
  // Facing north, the morning sun sits to the right (east) and the evening sun to the left.
  const lightX = Math.cos((Math.PI * (hours - 6)) / 12);
  const phase = night > 0.5 ? "NIGHT" : glow > 0.25 ? "ALPENGLOW" : "DAYLIGHT";
  return { label: `${time.toUpperCase()} IN KATHMANDU · ${phase}`, shortLabel: `${time.toUpperCase()} · ${phase}`, glow, night, lightX };
}

function monoFont(size: number) {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains").trim();
  return `500 ${size}px ${family || "ui-monospace"}, ui-monospace, monospace`;
}

export function createRangeScene(state: SceneState): Scene {
  let count = 0;
  let xs = new Float32Array(0);
  let ys = new Float32Array(0);
  let layers = new Int8Array(0);
  let alphas = new Float32Array(0);
  let snows = new Float32Array(0);
  let slopes = new Float32Array(0);
  let phases = new Float32Array(0);
  let summits: { peak: Peak; x: number; y: number }[] = [];
  let font = "";
  let light = nepalLight(new Date());
  let lightCheckedAt = -Infinity;

  function fill(context: CanvasRenderingContext2D, paths: Path2D[], [r, g, b]: Rgb) {
    paths.forEach((path, step) => {
      context.fillStyle = `rgba(${r},${g},${b},${(step + 0.5) / ALPHA_STEPS})`;
      context.fill(path);
    });
  }

  return {
    resize(width, height) {
      const cols = Math.ceil(width / GAP);
      const rows = Math.ceil(height / GAP);
      const ridges = Array.from({ length: 4 }, (_, layer) =>
        Float32Array.from({ length: cols + 2 }, (_, col) => ridgeline(layer, ((col - 0.5) * GAP) / width, height)),
      );
      const capacity = cols * rows;
      xs = new Float32Array(capacity);
      ys = new Float32Array(capacity);
      layers = new Int8Array(capacity);
      alphas = new Float32Array(capacity);
      snows = new Float32Array(capacity);
      slopes = new Float32Array(capacity);
      phases = new Float32Array(capacity);
      count = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = (col + 0.5) * GAP;
          const y = (row + 0.5) * GAP;
          let layer = -1;
          for (let candidate = 3; candidate >= 0; candidate--) {
            if (y >= ridges[candidate][col + 1]) {
              layer = candidate;
              break;
            }
          }
          if (layer < 0 && hash(col, row) < 0.985) continue; // open sky keeps only a sparse field of stars
          const index = count++;
          xs[index] = x;
          ys[index] = y;
          layers[index] = layer;
          phases[index] = hash(row, col) * Math.PI * 2;
          if (layer < 0) continue;
          const ridge = ridges[layer][col + 1];
          const depth = y - ridge;
          const rim = depth < GAP ? 0.25 : 0;
          const fade = clamp(1 - depth / (height * 0.22));
          const snow = layer === 0 ? clamp(1 - depth / (height * 0.2)) : 0;
          snows[index] = snow;
          alphas[index] = FLOOR_ALPHA[layer] + (RIDGE_ALPHA[layer] - FLOOR_ALPHA[layer]) * fade + 0.25 * snow + rim;
          slopes[index] = (ridges[layer][col + 2] - ridges[layer][col]) / (2 * GAP);
        }
      }
      summits = PEAKS.map((peak) => ({ peak, x: peak.at * width, y: ridgeline(0, peak.at, height) }));
      font = monoFont(10);
    },
    draw(context, width, height, seconds) {
      if (Math.abs(seconds - lightCheckedAt) > 1) {
        light = nepalLight(new Date());
        lightCheckedAt = seconds;
      }
      const { glow, night, lightX } = light;
      const pointer = state.pointer;
      state.taps = state.taps.filter((tap) => seconds - tap.time < GUST_SECONDS);
      const base = Array.from({ length: ALPHA_STEPS }, () => new Path2D());
      const warm = Array.from({ length: ALPHA_STEPS }, () => new Path2D());
      const add = (paths: Path2D[], alpha: number, x: number, y: number, size: number) => {
        if (alpha < 0.02) return;
        paths[Math.min(ALPHA_STEPS - 1, Math.floor(alpha * ALPHA_STEPS))].rect(x - size / 2, y - size / 2, size, size);
      };

      for (let index = 0; index < count; index++) {
        const x = xs[index];
        let y = ys[index];
        const layer = layers[index];
        if (layer < 0) {
          const twinkle = 0.5 + 0.5 * Math.sin(seconds * 1.7 + phases[index]);
          add(base, night * (0.2 + 0.45 * twinkle), x, y, 1.2);
          continue;
        }
        let alpha = alphas[index] * (1 - 0.15 * night);
        let size = DOT_SIZE[layer];
        alpha *= 1 + SHADE_AMOUNT[layer] * clamp(slopes[index] * lightX * 1.5, -1, 1);
        if (layer === 1 || layer === 2) {
          // Valley mist drifting between the nearer ridges.
          const mist = fbm(x * 0.005 - seconds * 0.025, layer * 9 + y * 0.012);
          alpha *= 1 - clamp((mist - 0.52) * 3, 0, 0.8);
        }
        for (const tap of state.taps) {
          const age = seconds - tap.time;
          const band = Math.exp(-(((Math.abs(x - tap.x) - age * 320) / 40) ** 2)) * Math.exp(-age * 1.2);
          y -= band * 2 * (layer + 1);
          alpha += band * 0.2;
        }
        if (pointer.active) {
          const reach = 1 - Math.hypot(x - pointer.x, y - pointer.y) / LAMP_RADIUS;
          if (reach > 0) {
            alpha += 0.5 * reach * reach;
            size *= 1 + 1.2 * reach * reach;
          }
        }
        add(base, clamp(alpha), x, y, size);
        if (snows[index] > 0 && glow > 0.05) add(warm, glow * snows[index] * 0.85, x, y, size);
      }

      context.clearRect(0, 0, width, height);
      fill(context, base, state.rgb);
      fill(context, warm, ALPENGLOW);

      const [r, g, b] = state.rgb;
      context.font = font;
      if (pointer.active) {
        const nearest = summits.reduce((best, summit) => (Math.abs(summit.x - pointer.x) < Math.abs(best.x - pointer.x) ? summit : best));
        if (Math.abs(nearest.x - pointer.x) < width * 0.05) {
          const text = `${nearest.peak.name.toUpperCase()} · ${nearest.peak.metres.toLocaleString("en-US")} M`;
          const textWidth = context.measureText(text).width;
          context.strokeStyle = `rgba(${r},${g},${b},0.7)`;
          context.lineWidth = 1;
          context.beginPath();
          context.arc(nearest.x, nearest.y, 3.5, 0, Math.PI * 2);
          context.stroke();
          context.fillStyle = `rgba(${r},${g},${b},0.85)`;
          const left = clamp(nearest.x - textWidth / 2, 8, width - textWidth - 8);
          context.fillText(text, left, Math.max(12, nearest.y - 10));
        }
      }
      const narrow = width < 480;
      const hint = pointer.active ? (narrow ? "TAP FOR A GUST" : "CLICK FOR A GUST OF WIND") : narrow ? light.shortLabel : light.label;
      context.fillStyle = `rgba(${r},${g},${b},0.42)`;
      context.fillText(hint, width - context.measureText(hint).width - 14, height - 14);
    },
  };
}

export function RangeField() {
  const ref = useParticleCanvas(createRangeScene);
  return <canvas ref={ref} className="range-field" aria-hidden="true" />;
}
