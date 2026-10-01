import { useEffect, useState } from "react";
import { Coffee, UtensilsCrossed } from "lucide-react";

/**
 * Image with a graceful fallback.
 *
 * - `/name.mp4` plays as a muted looping clip (animated photo): `/name.webm` first, then the MP4,
 *   with `/name.webp` as poster and fallback; `/name.gif` that is missing falls back to `/name.webp`.
 * - Any other broken image (e.g. a dead stock-photo link) shows a calm branded
 *   placeholder instead of the browser's broken-image icon and alt text.
 */
export default function SafeImage({ src, alt, className = "", coffee = false }: { src: string; alt: string; className?: string; coffee?: boolean }) {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => { setCurrent(src); setFailed(false); }, [src]);

  if (failed || !current) {
    const Icon = coffee ? Coffee : UtensilsCrossed;
    return (
      <div role="img" aria-label={alt} className={`${className} flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-amber-50 via-stone-100 to-stone-200 text-natural-primary`}>
        <Icon size={36} strokeWidth={1.4} />
        <span className="px-4 text-center font-serif text-sm leading-snug text-stone-600 line-clamp-2">{alt}</span>
      </div>
    );
  }

  // Krótki zapętlony film (np. animowana kawa): lżejszy niż GIF, bez dźwięku; klatka .webp jako plakat i zapas.
  if (/\.mp4$/i.test(current)) {
    return (
      <video
        poster={current.replace(/\.mp4$/i, ".webp")}
        aria-label={alt}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        {/* WebM (VP9) jest lżejszy i działa bez kodeków własnościowych; MP4 (H.264) dla reszty, np. starszego Safari. */}
        <source src={current.replace(/\.mp4$/i, ".webm")} type="video/webm" />
        <source src={current} type="video/mp4" onError={() => setCurrent(current.replace(/\.mp4$/i, ".webp"))} />
      </video>
    );
  }

  return (
    <img
      src={current}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (/\.gif$/i.test(current)) setCurrent(current.replace(/\.gif$/i, ".webp"));
        else setFailed(true);
      }}
    />
  );
}
