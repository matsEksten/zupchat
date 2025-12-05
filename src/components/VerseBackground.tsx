import { useEffect, useState } from "react";

type Verse = "heroverse" | "spaceverse" | "exclusiveverse";

const BG_IMGS = ["bg-1.webp", "bg-2.webp", "bg-3.webp"];

interface VerseBackgroundProps {
  verse: Verse;
}

export const VerseBackground = ({ verse }: VerseBackgroundProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev < BG_IMGS.length - 1 ? prev + 1 : 0));
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {BG_IMGS.map((img, index) => {
        const isActive = index === currentIndex;

        return (
          <img
            key={img}
            src={`/backgrounds/${verse}/${img}`}
            alt=""
            className={`
              absolute inset-0 h-full w-full object-cover 
              transition-opacity duration-1500 ease-out
              ${
                isActive
                  ? "opacity-100 animate-[hero-zoom_30s_ease-in-out_forwards]"
                  : "opacity-0"
              }
            `}
          />
        );
      })}
    </div>
  );
};
