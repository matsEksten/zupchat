import { useEffect, useState } from "react";

type ExclusiveTime = "morning" | "day" | "night";

function getExclusiveTime(date = new Date()): ExclusiveTime {
  const h = date.getHours();

  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "day";
  return "night";
}

const EXCLUSIVE_BG: Record<ExclusiveTime, string> = {
  morning: "/backgrounds/exclusiveverse/exclusive-bg-morning.webp",
  day: "/backgrounds/exclusiveverse/exclusive-bg-day.webp",
  night: "/backgrounds/exclusiveverse/exclusive-bg-night.webp",
};

export function ExclusiveVerseBackground() {
  const [exclusiveTime, setExclusiveTime] = useState<ExclusiveTime>(() =>
    getExclusiveTime()
  );

  useEffect(() => {
    const id = setInterval(() => setExclusiveTime(getExclusiveTime()), 60000);
    return () => clearInterval(id);
  }, []);

  const src = EXCLUSIVE_BG[exclusiveTime];

  return (
    <div className="fixed inset-0 overflow-hidden">
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover exclusive-zoom"
      />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
