"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export type Rgb = [number, number, number];
type Pointer = { x: number; y: number; active: boolean };
/** `taps` collects pointer presses (time in seconds, same clock as `draw`); scenes prune what they no longer need. */
export type SceneState = { pointer: Pointer; rgb: Rgb; taps: { x: number; y: number; time: number }[] };
export type Scene = {
  resize: (width: number, height: number) => void;
  draw: (context: CanvasRenderingContext2D, width: number, height: number, seconds: number) => void;
};

const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function particleColor(element: Element): Rgb {
  const hex = (getComputedStyle(element).getPropertyValue("--particle").trim() || "#ffffff").replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((digit) => digit + digit).join("") : hex;
  const value = parseInt(full.slice(0, 6), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/** Runs a pointer-reactive canvas scene that pauses off-screen and follows the theme's particle colour. */
export function useParticleCanvas(createScene: (state: SceneState) => Scene) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    const state: SceneState = { pointer: { x: -9999, y: -9999, active: false }, rgb: particleColor(canvas), taps: [] };
    const scene = createScene(state);

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      scene.resize(width, height);
      scene.draw(context, width, height, 0);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(canvas);

    const recolor = () => {
      state.rgb = particleColor(canvas);
      if (prefersReducedMotion()) scene.draw(context, width, height, 0);
    };
    const themeObserver = new MutationObserver(recolor);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const scheme = matchMedia("(prefers-color-scheme: light)");
    scheme.addEventListener("change", recolor);

    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      state.pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
    };
    const leave = () => {
      state.pointer = { x: -9999, y: -9999, active: false };
    };
    const press = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      state.taps.push({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, time: performance.now() / 1000 });
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointerdown", press);

    const tick = (time: number) => {
      if (visible && !prefersReducedMotion()) scene.draw(context, width, height, time / 1000);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      themeObserver.disconnect();
      scheme.removeEventListener("change", recolor);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointerdown", press);
    };
    // The scene factory is fixed for the lifetime of the canvas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

const PARTICLE_COUNT = 900;
const gaussian = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

function createParticleStar(state: SceneState): Scene {
  let centerX = 0;
  let centerY = 0;
  let particles: { hx: number; hy: number; x: number; y: number; vx: number; vy: number; alpha: number; phase: number }[] = [];
  return {
    resize(width, height) {
      centerX = width / 2;
      centerY = height / 2;
      const reach = Math.min(width, height) * 0.48;
      const tilt = -0.12;
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        let px: number;
        let py: number;
        const pick = Math.random();
        if (pick < 0.45) {
          px = gaussian() * reach * 0.13;
          py = gaussian() * reach * 0.13;
        } else {
          const along = Math.pow(Math.random(), 2.2) * reach * (Math.random() < 0.5 ? -1 : 1);
          const across = gaussian() * (1.6 + (1 - Math.abs(along) / reach) * 2.2);
          if (pick < 0.75) {
            px = along;
            py = across;
          } else {
            px = across;
            py = along * 0.92;
          }
        }
        const hx = px * Math.cos(tilt) - py * Math.sin(tilt);
        const hy = px * Math.sin(tilt) + py * Math.cos(tilt);
        return { hx, hy, x: hx, y: hy, vx: 0, vy: 0, alpha: 0.25 + Math.random() * 0.75, phase: Math.random() * 6.28 };
      });
    },
    draw(context, width, height, seconds) {
      const [r, g, b] = state.rgb;
      context.clearRect(0, 0, width, height);
      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, 34);
      glow.addColorStop(0, `rgba(${r},${g},${b},0.35)`);
      glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
      context.fillStyle = glow;
      context.beginPath();
      context.arc(centerX, centerY, 34, 0, Math.PI * 2);
      context.fill();
      const pointer = state.pointer;
      const px = pointer.x - centerX;
      const py = pointer.y - centerY;
      for (const particle of particles) {
        if (pointer.active) {
          const dx = particle.x - px;
          const dy = particle.y - py;
          const squared = dx * dx + dy * dy;
          if (squared < 1600) {
            const force = (1 - squared / 1600) * 1.4;
            const distance = Math.sqrt(squared) || 1;
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
          }
        }
        particle.vx = (particle.vx + (particle.hx - particle.x) * 0.04) * 0.86;
        particle.vy = (particle.vy + (particle.hy - particle.y) * 0.04) * 0.86;
        particle.x += particle.vx;
        particle.y += particle.vy;
        const shimmer = 0.6 + 0.4 * Math.sin(seconds * 2 + particle.phase);
        context.fillStyle = `rgba(${r},${g},${b},${particle.alpha * shimmer})`;
        context.fillRect(centerX + particle.x, centerY + particle.y, 1.1, 1.1);
      }
    },
  };
}

export function ParticleStar({ size = 150 }: { size?: number }) {
  const ref = useParticleCanvas(createParticleStar);
  const style: CSSProperties = { width: size, height: size * 0.75 };
  return <canvas ref={ref} className="particle-star" style={style} aria-hidden="true" />;
}
