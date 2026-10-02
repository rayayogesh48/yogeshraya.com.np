"use client";

import { useEffect, useState } from "react";
import { ClockIcon } from "@/components/ui/icons";

export function LocalTime({ timeZone, place }: { timeZone: string; place: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone }).format(new Date());
    setTime(format());
    const interval = setInterval(() => setTime(format()), 15000);
    return () => clearInterval(interval);
  }, [timeZone]);
  return (
    <span className="foot-time">
      <ClockIcon size={13} />
      {time ? ` It's ${time} in ${place}` : ` Local time in ${place}`}
    </span>
  );
}
