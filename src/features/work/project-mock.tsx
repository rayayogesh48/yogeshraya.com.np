import { useId, type CSSProperties } from "react";

/** Decorative screens for projects without uploaded images. They carry no data, only the project's name and tags. */
export type MockKind = "landing" | "dashboard" | "table";

export type MockTheme = {
  frame: string;
  surface: string;
  ink: string;
  sub: string;
  accent: string;
  accent2: string;
  line: string;
};

export const mockThemes: MockTheme[] = [
  { frame: "linear-gradient(150deg,#0e3b46 0%,#0f5f6b 50%,#2aa3a3 100%)", surface: "#f7fbfb", ink: "#0d2a30", sub: "#5b7a80", accent: "#0f8b8d", accent2: "#f97316", line: "#e1eeee" },
  { frame: "linear-gradient(160deg,#ffd6c9 0%,#f9c6e0 45%,#d9d4ff 100%)", surface: "#ffffff", ink: "#14141f", sub: "#6b6b80", accent: "#4f46e5", accent2: "#ec4899", line: "#ececf3" },
  { frame: "linear-gradient(180deg,#5b4cf0 0%,#3b2fc9 100%)", surface: "#ffffff", ink: "#151526", sub: "#6d6d85", accent: "#5b4cf0", accent2: "#f59e0b", line: "#ebebf5" },
  { frame: "radial-gradient(120% 90% at 50% 0%,#1d6b3a 0%,#0a2414 55%,#050c08 100%)", surface: "#07120b", ink: "#e9f7ee", sub: "#86a892", accent: "#22c55e", accent2: "#a3e635", line: "#173322" },
];

export const mockSlides: MockKind[] = ["dashboard", "landing", "table"];

function Bar({ width, height = 1.1, opacity = 1, color = "var(--m-sub)" }: { width: string; height?: number; opacity?: number; color?: string }) {
  return <span className="m-bar" style={{ width, height: `${height}cqw`, opacity, background: color, borderRadius: 99 }} />;
}

function Logo({ name }: { name: string }) {
  return (
    <span className="m-logo">
      <span className="m-logo-mark" />
      {name}
    </span>
  );
}

function Landing({ name, tags }: { name: string; tags: string[] }) {
  return (
    <div className="m-window">
      <div className="m-nav">
        <Logo name={name} />
        <span className="m-links">
          <Bar width="6cqw" opacity={0.5} />
          <Bar width="7cqw" opacity={0.5} />
          <Bar width="5cqw" opacity={0.5} />
        </span>
        <span className="m-btn">Open</span>
      </div>
      <div className="m-hero">
        <div className="m-pills">
          {tags.slice(0, 2).map((tag) => (
            <span key={tag} className="m-pill">
              <i />
              {tag}
            </span>
          ))}
        </div>
        <div className="m-h1">{name}</div>
        <div className="m-sub">
          <Bar width="44cqw" opacity={0.45} />
          <Bar width="34cqw" opacity={0.45} />
        </div>
      </div>
      <div className="m-peek">
        <div className="m-peek-bar">
          <i />
          <i />
          <i />
        </div>
        <div className="m-peek-body">
          <div className="m-side">
            {[0, 1, 2, 3].map((index) => (
              <Bar key={index} width="9cqw" opacity={index === 1 ? 0.9 : 0.35} />
            ))}
          </div>
          <div className="m-peek-main">
            {[0, 1, 2].map((index) => (
              <div className="m-row" key={index}>
                <span className="m-avatar" style={{ background: ["var(--m-accent)", "var(--m-accent2)", "var(--m-sub)"][index] }} />
                <Bar width={`${18 - index * 3}cqw`} opacity={0.6} />
                <Bar width="8cqw" opacity={0.3} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chart() {
  const gradient = `m${useId().replace(/:/g, "")}`;
  const values = [22, 30, 26, 38, 34, 48, 44, 58, 52, 66, 61, 74];
  const line = values.map((value, index) => `${(index / (values.length - 1)) * 100},${80 - value}`).join(" L");
  return (
    <svg viewBox="0 0 100 80" preserveAspectRatio="none" className="m-chart" aria-hidden="true">
      <defs>
        <linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--m-accent)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--m-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[20, 40, 60].map((y) => (
        <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="var(--m-line)" strokeWidth="0.4" />
      ))}
      <path d={`M${line} L100,80 L0,80 Z`} fill={`url(#${gradient})`} />
      <path d={`M${line}`} fill="none" stroke="var(--m-accent)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Dashboard({ name }: { name: string }) {
  return (
    <div className="m-window">
      <div className="m-dash">
        <div className="m-dash-side">
          <span className="m-logo">
            <span className="m-logo-mark" />
          </span>
          {[0, 1, 2, 3, 4].map((index) => (
            <span key={index} className={`m-ico ${index === 1 ? "on" : ""}`} />
          ))}
        </div>
        <div className="m-dash-main">
          <div className="m-dash-head">
            <span className="m-title">{name}</span>
            <Bar width="12cqw" height={2} opacity={0.25} />
          </div>
          <div className="m-kpis">
            {[0, 1, 2].map((index) => (
              <div className="m-kpi" key={index}>
                <Bar width="8cqw" opacity={0.5} />
                <Bar width="13cqw" height={2} color="var(--m-ink)" opacity={0.85} />
                <Bar width="5cqw" color={index === 2 ? "var(--m-accent2)" : "var(--m-accent)"} />
              </div>
            ))}
          </div>
          <div className="m-panel">
            <Chart />
          </div>
        </div>
      </div>
    </div>
  );
}

function Table({ name }: { name: string }) {
  return (
    <div className="m-window">
      <div className="m-nav">
        <Logo name={name} />
        <Bar width="14cqw" height={2} opacity={0.25} />
      </div>
      <div className="m-table">
        {[0, 1, 2, 3, 4].map((row) => (
          <div className="m-tr" key={row}>
            <span className="m-cell">
              <span className="m-avatar" style={{ background: ["var(--m-accent)", "var(--m-accent2)", "var(--m-sub)"][row % 3] }} />
              <Bar width={`${16 - (row % 3) * 3}cqw`} opacity={0.7} color="var(--m-ink)" />
            </span>
            <span className="m-status" data-tone={row % 3 === 1 ? "warm" : undefined} />
            <Bar width="9cqw" opacity={0.5} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectMock({ kind, theme, name, tags }: { kind: MockKind; theme: MockTheme; name: string; tags: string[] }) {
  const style = {
    "--m-frame": theme.frame,
    "--m-surface": theme.surface,
    "--m-ink": theme.ink,
    "--m-sub": theme.sub,
    "--m-accent": theme.accent,
    "--m-accent2": theme.accent2,
    "--m-line": theme.line,
  } as CSSProperties;
  return (
    <div className="m-stage" style={style} aria-hidden="true">
      {kind === "landing" && <Landing name={name} tags={tags} />}
      {kind === "dashboard" && <Dashboard name={name} />}
      {kind === "table" && <Table name={name} />}
    </div>
  );
}
