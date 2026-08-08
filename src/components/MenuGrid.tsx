import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MenuItem, MenuCategory } from "../types";
import { Search, ToggleLeft, ToggleRight, Sparkles, AlertCircle, Info } from "lucide-react";
import { useTranslation } from "../i18n";
import MenuItemModal from "./MenuItemModal";

interface MenuGridProps {
  items: MenuItem[];
  selectedCategory: MenuCategory;
  onSelectCategory: (category: MenuCategory) => void;
}

export default function MenuGrid({ items, selectedCategory, onSelectCategory }: MenuGridProps) {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [vegetarianOnly, setVegetarianOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Dynamic translated tabs
  const tabs = [
    { value: MenuCategory.SNIADANIA, label: t.breakfastTitle },
    { value: MenuCategory.OBIADY, label: t.lunchTitle },
    { value: MenuCategory.CIASTKA, label: t.cakesTitle },
    { value: MenuCategory.KAWY, label: t.coffeeTitle },
    { value: MenuCategory.NAPOJE, label: t.drinksTitle }
  ];

  // Filters logic supporting multiple translated tags
  const filteredItems = items.filter((item) => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Match vegetarian / vegan / sweet tags across DE, PL, EN
    const matchesVegetarian = vegetarianOnly 
      ? item.tags.some(tag => {
          const lower = tag.toLowerCase();
          return (
            lower.includes("wegetarian") ||
            lower.includes("wegań") ||
            lower.includes("słodko") ||
            lower.includes("vegetarisch") ||
            lower.includes("vegan") ||
            lower.includes("süß") ||
            lower.includes("vegetarian") ||
            lower.includes("sweet")
          );
        })
      : true;

    return matchesCategory && matchesSearch && matchesVegetarian;
  });

  return (
    <div className="bg-natural-light/60 border-y border-natural-border py-24" id="karta-menu">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title and Controls header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-natural-primary font-mono text-xs tracking-wider uppercase block mb-1">{t.menuLabel}</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-natural-text mt-1">{t.menuHeading}</h2>
            <p className="text-natural-muted text-sm mt-2 max-w-sm font-light">
              {t.menuDesc}
            </p>
          </div>

          {/* Quick Filters Group */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder={t.menuSearchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-natural-light border border-natural-border rounded-full text-sm text-natural-text placeholder-natural-muted/60 focus:outline-none focus:border-natural-primary transition-colors"
              />
              <Search size={16} className="absolute left-3.5 top-3.5 text-natural-muted" />
            </div>

            {/* Veggie Toggle Switch */}
            <button
              onClick={() => setVegetarianOnly(!vegetarianOnly)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-natural-light border border-natural-border rounded-full text-xs text-natural-text hover:border-natural-primary transition-colors cursor-pointer"
            >
              {vegetarianOnly ? (
                <ToggleRight size={22} className="text-natural-primary" />
              ) : (
                <ToggleLeft size={22} className="text-natural-muted" />
              )}
              <span>{t.menuVeggieOnly}</span>
            </button>
          </div>
        </div>

        {/* Category Tabs System */}
        <div className="flex overflow-x-auto gap-2 pb-6 mb-10 border-b border-natural-border/60 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = tab.value === selectedCategory;
            return (
              <button
                key={tab.value}
                onClick={() => onSelectCategory(tab.value)}
                className={`px-6 py-3 rounded-full text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-natural-primary text-white shadow-md shadow-natural-primary/10"
                    : "bg-white dark:bg-natural-light text-natural-muted hover:bg-natural-light hover:text-natural-text border border-natural-border"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Menu Items Grid */}
        <AnimatePresence mode="wait">
          {filteredItems.length > 0 ? (
            <motion.div
              key={selectedCategory + vegetarianOnly + searchQuery}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  onClick={() => setSelectedItem(item)}
                  className="bg-white dark:bg-natural-light rounded-3xl overflow-hidden border border-natural-card-border shadow-xs flex flex-col hover:bg-natural-light-hover hover:border-natural-border hover:shadow-md hover:scale-[1.01] transition-all duration-300 group cursor-pointer"
                >
                  {/* Item Image */}
                  <div className="relative h-48 overflow-hidden bg-natural-light">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Dark overlay & hover info badge display */}
                    <div className="absolute inset-0 bg-stone-900/45 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-[#fdfcf7] text-natural-text text-[10px] font-mono font-bold tracking-wider uppercase rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <Info size={12} className="text-natural-primary" />
                        <span>{language === "pl" ? "Składniki & Alergeny" : language === "de" ? "Zutaten & Allergene" : "Ingredients & Allergens"}</span>
                      </span>
                    </div>

                    {/* Tags row */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wider uppercase bg-natural-primary/95 text-[#fdfcf7] font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-natural-text group-hover:text-natural-primary transition-colors mb-1.5 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-natural-muted text-xs leading-relaxed font-light line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Price section with Euro display */}
                    <div className="mt-5 pt-3 border-t border-natural-border/40 flex items-center justify-between">
                      <div>
                        <span className="font-serif text-natural-primary text-lg font-bold">
                          {language === "en" ? item.priceEur.toFixed(2) : item.priceEur.toFixed(2).replace(".", ",")} €
                        </span>
                      </div>

                      {/* Sparkle micro accent */}
                      {item.tags.some(t => {
                        const low = t.toLowerCase();
                        return low.includes("poleca") || low.includes("unikat") || low.includes("empfohl") || low.includes("bestsell") || low.includes("recom");
                      }) ? (
                        <span className="p-1.5 rounded-lg bg-natural-primary/10 text-natural-primary">
                          <Sparkles size={14} />
                        </span>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center max-w-md mx-auto flex flex-col items-center"
            >
              <div className="p-4 rounded-full bg-natural-light text-natural-muted mb-4">
                <AlertCircle size={28} />
              </div>
              <h4 className="font-serif text-lg font-semibold text-natural-text">{t.menuNoItemsHeading}</h4>
              <p className="text-natural-muted text-sm mt-1">
                {t.menuNoItemsDesc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
