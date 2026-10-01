import { useEffect, useState } from "react";
import { Coffee, UtensilsCrossed } from "lucide-react";

/**
 * Image with a graceful fallback.
 *
 * - `/name.gif` that is missing falls back to `/name.webp` (drop an animated GIF into
 *   `public/` under the same name and it is used automatically).
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
