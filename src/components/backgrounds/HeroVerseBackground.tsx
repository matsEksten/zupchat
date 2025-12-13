import { useEffect, useState } from "react";

type HeroTime = "morning" | "day" | "night";

function getHeroTime(date = new Date()): HeroTime {
  const h = date.getHours();

  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "day";
  return "night";
}

const HERO_BG: Record<HeroTime, string> = {
  morning: "/backgrounds/heroverse/bg-morning.webp",
  day: "/backgrounds/heroverse/bg-day.webp",
  night: "/backgrounds/heroverse/bg-night.webp",
};

export function HeroVerseBackground() {
  const [heroTime, setHeroTime] = useState<HeroTime>(() => getHeroTime());

  useEffect(() => {
    const id = setInterval(() => setHeroTime(getHeroTime()), 60000);
    return () => clearInterval(id);
  }, []);

  const src = HERO_BG[heroTime];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover hero-zoom"
      />

      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
