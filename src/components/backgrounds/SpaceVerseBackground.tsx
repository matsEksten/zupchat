import { useState } from "react";

const SPACEVERSE_BACKGROUNDS = ["1", "2", "3"];

const getRandomImgNum = () => {
  return SPACEVERSE_BACKGROUNDS[
    Math.floor(Math.random() * SPACEVERSE_BACKGROUNDS.length)
  ];
};

export function SpaceVerseBackground() {
  const [imgNum] = useState(() => getRandomImgNum());

  return (
    <div className="fixed inset-0 overflow-hidden">
      <img
        src={`/backgrounds/spaceverse/spaceverse-bg-${imgNum}.webp`}
        alt=""
        className="absolute inset-0 h-full w-full object-cover space-zoom"
      />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
