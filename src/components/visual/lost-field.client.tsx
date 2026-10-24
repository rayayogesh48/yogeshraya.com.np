"use client";

import { useParticleCanvas, type Rgb, type Scene, type SceneState } from "./particle-canvas.client";
import { ALPENGLOW, clamp, fbm, hash, monoFont, nepalLight } from "./range-field.client";

/**
 * The error scene: the status code ("404", "500") rising as snow-capped peaks in the same dot halftone as the hero's Himalaya, above
 * rolling foothills and a starry sky. Light follows the time in Nepal, the cursor is a headlamp, and a click sends
 * a gust of wind through the range.
 */

const gapFor = (width: number) => (width < 480 ? 5 : 6);
const ALPHA_STEPS = 12;
const GUST_SECONDS = 2.6;
const LAMP_RADIUS = 90;

/** Rasterises the code into a mask the size of the scene, sitting on the foothills. */
function digitMask(code: string, width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return { data: new Uint8ClampedArray(0), width: 0 };
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-inter-tight").trim() || "system-ui";
  let size = height * 0.86;
  context.font = `800 ${size}px ${family}, system-ui, sans-serif`;
  const measured = context.measureText(code).width;
  // Fit the digits to about 82% of the width on narrow screens.
  if (measured > width * 0.82) {
    size *= (width * 0.82) / measured;
    context.font = `800 ${size}px ${family}, system-ui, sans-serif`;
  }
  context.textAlign = "center";
  context.textBaseline = "alphabetic";
  context.fillStyle = "#fff";
  // The baseline sits in the foothills, so the digits look like peaks rising out of them.
  context.fillText(code, width / 2, height * 0.94);
  return { data: context.getImageData(0, 0, canvas.width, canvas.height).data, width: canvas.width };
}

/** Rolling foothills in front of the digits: screen y of the ridge at horizontal position u (0–1). */
const hillRidge = (u: number, height: number, seed: number, base: number, amplitude: number) =>
  height * (base - amplitude * clamp((fbm(u * 3.2, seed) - 0.2) / 0.6) ** 1.3);

export function createLostScene(state: SceneState, code = "404"): Scene {
  let count = 0;
  let xs = new Float32Array(0);
  let ys = new Float32Array(0);
  let kinds = new Int8Array(0); // -1 star, 0 digit peak, 1-2 foothills
  let alphas = new Float32Array(0);
  let snows = new Float32Array(0);
  let phases = new Float32Array(0);
  let font = "";
  let light = nepalLight(new Date());
  let lightCheckedAt = -Infinity;

  return {
    resize(width, height) {
      const GAP = gapFor(width);
      const cols = Math.ceil(width / GAP);
      const rows = Math.ceil(height / GAP);
      const mask = digitMask(code, width, height);
      const inDigit = (x: number, y: number) => {
        const index = (Math.round(y) * mask.width + Math.round(x)) * 4 + 3;
        return (mask.data[index] ?? 0) > 128;
      };
      const hills = [
        Float32Array.from({ length: cols }, (_, col) => hillRidge((col * GAP) / width, height, 17, 0.9, 0.16)),
        Float32Array.from({ length: cols }, (_, col) => hillRidge((col * GAP) / width, height, 41, 1.0, 0.12)),
      ];
      // Each digit gets a summit: a jagged peak rising from its top edge, so the code reads as a row of mountains.
      const colTop = Float32Array.from({ length: cols }, (_, col) => {
        for (let row = 0; row < rows; row++) if (inDigit((col + 0.5) * GAP, (row + 0.5) * GAP)) return (row + 0.5) * GAP;
        return Infinity;
      });
      const lift = new Float32Array(cols);
      for (let start = 0; start < cols; ) {
        if (!Number.isFinite(colTop[start])) {
          start++;
          continue;
        }
        let end = start;
        while (end + 1 < cols && Number.isFinite(colTop[end + 1])) end++;
        const centre = (start + end) / 2;
        const half = Math.max(1, (end - start) / 2);
        for (let col = start; col <= end; col++) {
          const t = 1 - Math.abs(col - centre) / half;
          const jag = 0.18 * (fbm(col * 0.45, start) - 0.5);
          lift[col] = height * 0.16 * Math.max(0, t ** 1.15 + jag * t);
        }
        start = end + 1;
      }
      const capacity = cols * rows;
      xs = new Float32Array(capacity);
      ys = new Float32Array(capacity);
      kinds = new Int8Array(capacity);
      alphas = new Float32Array(capacity);
      snows = new Float32Array(capacity);
      phases = new Float32Array(capacity);
      count = 0;
      const snowDepth = height * 0.2;
      for (let col = 0; col < cols; col++) {
        let runTop = -1; // y where the current vertical run of digit starts, for the snow cap
        for (let row = 0; row < rows; row++) {
          const x = (col + 0.5) * GAP;
          const y = (row + 0.5) * GAP;
          const digit = inDigit(x, y) || (y < colTop[col] && y >= colTop[col] - lift[col]);
          if (digit && runTop < 0) runTop = y;
          if (!digit) runTop = -1;
          let kind = -1;
          if (y >= hills[1][col]) kind = 2;
          else if (y >= hills[0][col]) kind = 1;
          else if (digit) kind = 0;
          if (kind === -1 && hash(col, row) < 0.982) continue; // the sky keeps only a sparse field of stars
          const index = count++;
          xs[index] = x;
          ys[index] = y;
          kinds[index] = kind;
          phases[index] = hash(row, col) * Math.PI * 2;
          if (kind === 0) {
            const depth = y - runTop;
            const snow = clamp(1 - depth / snowDepth);
            snows[index] = snow;
            alphas[index] = 0.14 + 0.22 * clamp(1 - depth / (height * 0.5)) + 0.38 * snow + (depth < GAP ? 0.2 : 0);
          } else if (kind > 0) {
            const ridge = hills[kind - 1][col];
            const depth = y - ridge;
            alphas[index] = (kind === 1 ? 0.07 : 0.05) + (kind === 1 ? 0.22 : 0.18) * clamp(1 - depth / (height * 0.15)) + (depth < GAP ? 0.18 : 0);
          }
        }
      }
      font = monoFont(10);
    },
    draw(context, width, height, seconds) {
      if (Math.abs(seconds - lightCheckedAt) > 1) {
        light = nepalLight(new Date());
        lightCheckedAt = seconds;
      }
      const { glow, night } = light;
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
        const kind = kinds[index];
        if (kind < 0) {
          // Stars are always faintly there on this page, and brighter at night in Nepal.
          const twinkle = 0.5 + 0.5 * Math.sin(seconds * 1.7 + phases[index]);
          add(base, (0.12 + 0.5 * night) * (0.35 + 0.65 * twinkle), x, y, 1.3);
          continue;
        }
        let alpha = alphas[index] * (1 - 0.12 * night);
        let size = kind === 0 ? 1.7 : kind === 1 ? 1.9 : 2.2;
        if (kind > 0) {
          const mist = fbm(x * 0.006 - seconds * 0.03, kind * 7 + y * 0.015);
          alpha *= 1 - clamp((mist - 0.5) * 3, 0, 0.75);
        }
        for (const tap of state.taps) {
          const age = seconds - tap.time;
          const band = Math.exp(-(((Math.abs(x - tap.x) - age * 320) / 40) ** 2)) * Math.exp(-age * 1.2);
          y -= band * (kind === 0 ? 3 : 5);
          alpha += band * 0.22;
        }
        if (pointer.active) {
          const reach = 1 - Math.hypot(x - pointer.x, y - pointer.y) / LAMP_RADIUS;
          if (reach > 0) {
            alpha += 0.55 * reach * reach;
            size *= 1 + 1.3 * reach * reach;
          }
        }
        add(base, clamp(alpha), x, y, size);
        if (kind === 0 && snows[index] > 0 && glow > 0.05) add(warm, glow * snows[index] * 0.9, x, y, size);
      }
      context.clearRect(0, 0, width, height);
      const paint = (paths: Path2D[], [r, g, b]: Rgb) =>
        paths.forEach((path, step) => {
          context.fillStyle = `rgba(${r},${g},${b},${(step + 0.5) / ALPHA_STEPS})`;
          context.fill(path);
        });
      paint(base, state.rgb);
      paint(warm, ALPENGLOW);

      const [r, g, b] = state.rgb;
      context.font = font;
      context.fillStyle = `rgba(${r},${g},${b},0.42)`;
      const narrow = width < 480;
      const hint = pointer.active ? (narrow ? "TAP FOR A GUST" : "CLICK FOR A GUST OF WIND") : narrow ? `ALT ${code} · OFF THE MAP` : `ALT ${code} M · OFF THE MAP`;
      context.fillText(hint, width - context.measureText(hint).width - 14, height - 14);
    },
  };
}

export function LostField({ code = "404" }: { code?: string }) {
  const ref = useParticleCanvas((state) => createLostScene(state, code));
  return <canvas ref={ref} className="lost-field" aria-hidden="true" />;
}
