import { useState } from "react";
import { motion } from "motion/react";
import { Coffee, MapPin, Sparkles, Award } from "lucide-react";
import Logo from "./Logo";
import { useTranslation } from "../i18n";

export default function Header() {
  const { t } = useTranslation();
  const [logoError, setLogoError] = useState(false);

  const features = [
    {
      icon: Coffee,
      title: t.featureSpecialtyTitle,
      desc: t.featureSpecialtyDesc
    },
    {
      icon: Sparkles,
      title: t.featureBakedTitle,
      desc: t.featureBakedDesc
    },
    {
      icon: Award,
      title: t.featureLocalTitle,
      desc: t.featureLocalDesc
    },
    {
      icon: MapPin,
      title: t.featureGardenTitle,
      desc: t.featureGardenDesc
    }
  ];

  return (
    <header className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-stone-950 text-stone-100" id="glowna">
      {/* Immersive blur-overlay background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=1600&auto=format&fit=crop"
          alt="Cozy Cafe Interior background"
          className="w-full h-full object-cover object-center opacity-40 scale-105 filter brightness-[0.7] saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center flex flex-col items-center">
        {/* Animated Brand Logo Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="relative mb-6 group cursor-pointer"
        >
          {/* External glowing boundary */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-natural-primary/30 to-natural-primary-hover/20 rounded-full blur-md opacity-80 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-stone-800 overflow-hidden shadow-2xl flex items-center justify-center bg-[#fdfcf7]">
            <Logo size="100%" className="transition-transform duration-500 group-hover:scale-105" />
          </div>
        </motion.div>

        {/* Aesthetic regional tag */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-stone-800/80 bg-stone-950/85 text-stone-300 text-xs tracking-wider uppercase font-medium mb-8"
        >
          <MapPin size={13} className="text-natural-muted" />
          <span>{t.heroAddress}</span>
        </motion.div>

        {/* Title & Brand heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-5xl md:text-7xl font-bold text-[#fdfcf7] tracking-tight mb-6 leading-[1.1]"
        >
          Café Martens <span className="italic text-natural-muted font-normal">&amp; More</span>
        </motion.h1>

        {/* Catchy tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-stone-300 text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-10"
        >
          {t.heroTagline}
        </motion.p>

        {/* Highlight features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl mt-4 text-left"
        >
          {features.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-stone-850/60 bg-stone-900/60 backdrop-blur-md">
              <div className="p-2 w-9 h-9 rounded-lg bg-natural-primary/35 flex items-center justify-center text-natural-border mb-3">
                <item.icon size={18} />
              </div>
              <h3 className="font-serif text-[#fdfcf7] font-semibold mb-1 text-sm">{item.title}</h3>
              <p className="text-stone-300 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Aesthetic wave-divider effect matching Natural background */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-natural-bg clip-path-wave" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }} />
    </header>
  );
}
