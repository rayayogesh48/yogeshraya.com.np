"use client";

import { useEffect, useState } from "react";

export type LocalStatus = { time: string; label: string; tone: "on" | "soft" | "off" };

/** What I'm likely doing at this hour in my time zone, so visitors know when to expect a reply. */
function statusAt(hour: number): Pick<LocalStatus, "label" | "tone"> {
  if (hour >= 9 && hour < 18) return { label: "At the desk", tone: "on" };
  if (hour >= 7 && hour < 9) return { label: "Morning coffee", tone: "soft" };
  if (hour >= 18 && hour < 22) return { label: "Winding down", tone: "soft" };
  return { label: "Asleep, replies in the morning", tone: "off" };
}

/** The current time in `timeZone` and a status for that hour; null until mounted, so the server and client agree. */
export function useLocalStatus(timeZone: string) {
  const [now, setNow] = useState<LocalStatus | null>(null);
  useEffect(() => {
    const read = () => {
      const date = new Date();
      const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone }).format(date);
      const hour = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone }).format(date));
      setNow({ time, ...statusAt(hour) });
    };
    read();
    const interval = setInterval(read, 15000);
    return () => clearInterval(interval);
  }, [timeZone]);
  return now;
}
