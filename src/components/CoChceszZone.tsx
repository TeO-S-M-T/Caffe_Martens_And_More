import { motion } from "motion/react";
import { MenuCategory } from "../types";
import { Utensils, CakeSlice, Coffee, Milk, Layers } from "lucide-react";
import { useTranslation } from "../i18n";

interface CoChceszZoneProps {
  onSelectCategory: (category: MenuCategory) => void;
  selectedCategory: MenuCategory;
}

export default function CoChceszZone({ onSelectCategory, selectedCategory }: CoChceszZoneProps) {
  const { t } = useTranslation();

  const zones = [
    {
      category: MenuCategory.SNIADANIA,
      title: t.breakfastTitle,
      subtitle: t.breakfastSubtitle,
      desc: t.breakfastDesc,
      icon: Layers,
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=500&auto=format&fit=crop",
      badge: t.breakfastBadge
    },
    {
      category: MenuCategory.OBIADY,
      title: t.lunchTitle,
      subtitle: t.lunchSubtitle,
      desc: t.lunchDesc,
      icon: Utensils,
      imageUrl: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?q=80&w=500&auto=format&fit=crop",
      badge: t.lunchBadge
    },
    {
      category: MenuCategory.CIASTKA,
      title: t.cakesTitle,
      subtitle: t.cakesSubtitle,
      desc: t.cakesDesc,
      icon: CakeSlice,
      imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500&auto=format&fit=crop",
      badge: t.cakesBadge
    },
    {
      category: MenuCategory.KAWY,
      title: t.coffeeTitle,
      subtitle: t.coffeeSubtitle,
      desc: t.coffeeDesc,
      icon: Coffee,
      imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=500&auto=format&fit=crop",
      badge: t.coffeeBadge
    },
    {
      category: MenuCategory.NAPOJE,
      title: t.drinksTitle,
      subtitle: t.drinksSubtitle,
      desc: t.drinksDesc,
      icon: Milk,
      imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=500&auto=format&fit=crop",
      badge: t.drinksBadge
    }
  ];

  const handleZoneClick = (category: MenuCategory) => {
    onSelectCategory(category);
    // Smooth scroll to the menu section
    const menuSection = document.getElementById("karta-menu");
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto" id="co-chcesz">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-natural-muted font-mono text-xs tracking-widest uppercase block mb-1">{t.zoneLabel}</span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-natural-text mt-2 tracking-tight">
          {t.zoneHeading}
        </h2>
        <div className="w-16 h-0.5 bg-natural-primary mx-auto mt-4 rounded-full" />
        <p className="text-natural-muted/90 mt-4 font-light text-sm">
          {t.zoneDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {zones.map((zone) => {
          const isSelected = selectedCategory === zone.category;
          const IconComponent = zone.icon;

          return (
            <motion.div
              key={zone.category}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => handleZoneClick(zone.category)}
              className={`group cursor-pointer relative h-[360px] rounded-3xl overflow-hidden flex flex-col justify-end p-6 border transition-all ${
                isSelected
                  ? "border-natural-primary bg-natural-light/30 shadow-md shadow-natural-primary/5"
                  : "border-natural-card-border bg-white dark:bg-natural-light shadow-xs"
              }`}
            >
              {/* Image Background */}
              <div className="absolute inset-0 z-0">
                <img
                  src={zone.imageUrl}
                  alt={zone.title}
                  className="w-full h-full object-cover object-center transition-transform duration-750 group-hover:scale-105 filter brightness-[0.5] group-hover:brightness-[0.4] saturate-75"
                />
                {/* Visual Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/50 to-transparent" />
              </div>

              {/* Tag / Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono uppercase tracking-wider ${
                  isSelected
                    ? "bg-natural-primary text-white font-bold"
                    : "bg-stone-900/80 text-stone-200 border border-stone-800"
                }`}>
                  {zone.badge}
                </span>
              </div>

              {/* Content overlay */}
              <div className="relative z-10 flex flex-col w-full text-stone-100">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border transition-colors ${
                  isSelected
                    ? "bg-natural-primary border-natural-primary text-white"
                    : "bg-white/10 border-white/25 text-stone-100 group-hover:bg-natural-primary group-hover:border-natural-primary group-hover:text-white"
                }`}>
                  <IconComponent size={16} />
                </div>

                <span className="text-xs text-stone-400 font-light italic mb-0.5">{zone.subtitle}</span>
                <h3 className="font-serif text-xl font-bold group-hover:text-natural-border transition-colors mb-2">
                  {zone.title}
                </h3>
                <p className="text-stone-300 text-xs font-light leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-[80px] transition-all duration-500 overflow-hidden">
                  {zone.desc}
                </p>

                <div className="mt-3 text-natural-border text-xs font-mono font-medium flex items-center gap-1 opacity-100 md:opacity-75 group-hover:opacity-100 transition-opacity">
                  <span>{t.zoneViewMenu}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">➔</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
