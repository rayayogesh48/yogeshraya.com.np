"use client";

import { useParticleCanvas, type Scene, type SceneState } from "./particle-canvas.client";

/**
 * A drifting contour map of an imaginary Himalayan range. The cursor raises the terrain beneath it and
 * reads out coordinates and elevation across Nepal's bounding box; a click sends a ripple and drops a pin.
 */

const CELL = 6;
const LEVEL_STEP = 0.055;
const MAJOR_EVERY = 5;
const RIPPLE_SECONDS = 2.4;
const PIN_SECONDS = 4;
const NEPAL = { west: 80.06, east: 88.2, north: 30.45, south: 26.35 };
const KATHMANDU = { lat: 27.7172, lon: 85.324 };
const SUMMIT_METRES = 8849;

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

const toLon = (x: number, width: number) => NEPAL.west + (x / width) * (NEPAL.east - NEPAL.west);
const toLat = (y: number, height: number) => NEPAL.north - (y / height) * (NEPAL.north - NEPAL.south);
const toMetres = (value: number) => Math.round(Math.min(SUMMIT_METRES, Math.max(60, value * 6200)));
const formatMetres = (metres: number) => `${metres.toLocaleString("en-US")} m`;

function monoFont(size: number) {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains").trim();
  return `500 ${size}px ${family || "ui-monospace"}, ui-monospace, monospace`;
}

export function createTopoScene(state: SceneState): Scene {
  let cols = 0;
  let rows = 0;
  let heights = new Float32Array(0);
  let font = "";
  let smallFont = "";

  /** `disturbed` adds the cursor peak and click ripples; readouts use the undisturbed ground. */
  function terrain(x: number, y: number, width: number, height: number, seconds: number, disturbed = true) {
    const u = x / width;
    const v = y / height;
    // A ridge line that wanders across the upper half, like the main Himalayan range.
    const ridgeCentre = 0.38 + 0.1 * Math.sin(u * 5.2 + 0.6) + 0.05 * Math.sin(u * 13.1);
    const ridge = Math.exp(-((v - ridgeCentre) ** 2) / 0.035) * 0.55;
    let value = fbm(x * 0.0085 + seconds * 0.018, y * 0.011 - seconds * 0.006) * 0.9 + ridge * (0.6 + 0.4 * noise(x * 0.02, 3.7));
    if (!disturbed) return value;
    const pointer = state.pointer;
    if (pointer.active) {
      const distance = (x - pointer.x) ** 2 + (y - pointer.y) ** 2;
      value += 0.3 * Math.exp(-distance / 4900);
    }
    for (const tap of state.taps) {
      const age = seconds - tap.time;
      if (age < 0 || age > RIPPLE_SECONDS) continue;
      const distance = Math.hypot(x - tap.x, y - tap.y);
      if (distance > age * 280) continue;
      value += 0.11 * Math.sin(distance * 0.075 - age * 9) * Math.exp(-age * 1.3) * Math.exp(-distance / 240);
    }
    return value;
  }

  function sample(width: number, height: number, seconds: number) {
    for (let row = 0; row <= rows; row++) {
      for (let col = 0; col <= cols; col++) {
        heights[row * (cols + 1) + col] = terrain(col * CELL, row * CELL, width, height, seconds);
      }
    }
  }

  /** Marching squares: appends each contour segment to the major or minor path. */
  function trace(context: CanvasRenderingContext2D, major: boolean) {
    const stride = cols + 1;
    context.beginPath();
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const a = heights[row * stride + col];
        const b = heights[row * stride + col + 1];
        const c = heights[(row + 1) * stride + col + 1];
        const d = heights[(row + 1) * stride + col];
        const low = Math.min(a, b, c, d);
        const high = Math.max(a, b, c, d);
        const x = col * CELL;
        const y = row * CELL;
        for (let level = Math.ceil(low / LEVEL_STEP); level * LEVEL_STEP <= high; level++) {
          if ((level % MAJOR_EVERY === 0) !== major) continue;
          const iso = level * LEVEL_STEP;
          const points: number[] = [];
          const edge = (h1: number, h2: number, x1: number, y1: number, x2: number, y2: number) => {
            if ((h1 < iso) === (h2 < iso)) return;
            const t = (iso - h1) / (h2 - h1);
            points.push(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
          };
          edge(a, b, x, y, x + CELL, y);
          edge(b, c, x + CELL, y, x + CELL, y + CELL);
          edge(c, d, x + CELL, y + CELL, x, y + CELL);
          edge(d, a, x, y + CELL, x, y);
          for (let index = 0; index + 3 < points.length; index += 4) {
            context.moveTo(points[index], points[index + 1]);
            context.lineTo(points[index + 2], points[index + 3]);
          }
        }
      }
    }
  }

  function label(context: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, alpha: number) {
    const [r, g, b] = state.rgb;
    context.font = font;
    const textWidth = context.measureText(text).width;
    const left = x + 14 + textWidth > width - 8 ? x - 14 - textWidth : x + 14;
    context.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    context.fillText(text, left, y + 4);
  }

  return {
    resize(width, height) {
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      heights = new Float32Array((cols + 1) * (rows + 1));
      font = monoFont(11);
      smallFont = monoFont(10);
    },
    draw(context, width, height, seconds) {
      const [r, g, b] = state.rgb;
      state.taps = state.taps.filter((tap) => seconds - tap.time < PIN_SECONDS);
      sample(width, height, seconds);
      context.clearRect(0, 0, width, height);

      context.lineJoin = "round";
      trace(context, false);
      context.strokeStyle = `rgba(${r},${g},${b},0.14)`;
      context.lineWidth = 0.7;
      context.stroke();
      trace(context, true);
      context.strokeStyle = `rgba(${r},${g},${b},0.42)`;
      context.lineWidth = 1;
      context.stroke();

      // Home marker: Kathmandu, with a slow pulse.
      const homeX = ((KATHMANDU.lon - NEPAL.west) / (NEPAL.east - NEPAL.west)) * width;
      const homeY = ((NEPAL.north - KATHMANDU.lat) / (NEPAL.north - NEPAL.south)) * height;
      const pulse = (seconds * 0.6) % 1;
      context.strokeStyle = `rgba(${r},${g},${b},${0.5 * (1 - pulse)})`;
      context.lineWidth = 1;
      context.beginPath();
      context.arc(homeX, homeY, 4 + pulse * 14, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = `rgba(${r},${g},${b},0.9)`;
      context.beginPath();
      context.arc(homeX, homeY, 2.5, 0, Math.PI * 2);
      context.fill();
      context.font = smallFont;
      context.fillStyle = `rgba(${r},${g},${b},0.55)`;
      context.fillText("KATHMANDU", homeX + 8, homeY + 3.5);

      // Survey pins left by clicks.
      for (const tap of state.taps) {
        const age = seconds - tap.time;
        const fade = age < PIN_SECONDS - 1 ? 1 : PIN_SECONDS - age;
        context.strokeStyle = `rgba(${r},${g},${b},${0.8 * fade})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(tap.x, tap.y);
        context.lineTo(tap.x, tap.y - 16);
        context.stroke();
        context.fillStyle = `rgba(${r},${g},${b},${0.9 * fade})`;
        context.beginPath();
        context.arc(tap.x, tap.y - 18, 3, 0, Math.PI * 2);
        context.fill();
        label(context, formatMetres(toMetres(terrain(tap.x, tap.y, width, height, seconds, false))), tap.x, tap.y - 18, width, 0.75 * fade);
      }

      const pointer = state.pointer;
      if (pointer.active) {
        context.strokeStyle = `rgba(${r},${g},${b},0.7)`;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(pointer.x, pointer.y, 6, 0, Math.PI * 2);
        context.moveTo(pointer.x - 12, pointer.y);
        context.lineTo(pointer.x - 8, pointer.y);
        context.moveTo(pointer.x + 8, pointer.y);
        context.lineTo(pointer.x + 12, pointer.y);
        context.moveTo(pointer.x, pointer.y - 12);
        context.lineTo(pointer.x, pointer.y - 8);
        context.moveTo(pointer.x, pointer.y + 8);
        context.lineTo(pointer.x, pointer.y + 12);
        context.stroke();
        const lat = toLat(pointer.y, height).toFixed(2);
        const lon = toLon(pointer.x, width).toFixed(2);
        const metres = formatMetres(toMetres(terrain(pointer.x, pointer.y, width, height, seconds, false)));
        label(context, `${lat}°N ${lon}°E · ${metres}`, pointer.x, pointer.y, width, 0.85);
      } else {
        context.font = smallFont;
        context.fillStyle = `rgba(${r},${g},${b},0.4)`;
        const hint = "MOVE TO SURVEY · CLICK TO PING";
        context.fillText(hint, width - context.measureText(hint).width - 14, height - 14);
      }
    },
  };
}

export function TopoField() {
  const ref = useParticleCanvas(createTopoScene);
  return <canvas ref={ref} className="topo-field" aria-hidden="true" />;
}
