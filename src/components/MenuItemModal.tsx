import React from "react";
import { motion } from "motion/react";
import { X, Sparkles, AlertTriangle, Check, Leaf, Info, Coffee, HelpCircle } from "lucide-react";
import { MenuItem, MenuCategory } from "../types";
import { MENU_DETAILS_DATA, MenuItemDetails, LocalizedDetails } from "../data/menuDetails";
import { useTranslation } from "../i18n";

interface MenuItemModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  const { language, t } = useTranslation();

  const getCategoryLabel = (cat: MenuCategory) => {
    switch (cat) {
      case MenuCategory.SNIADANIA: return t.breakfastTitle || "Frühstück";
      case MenuCategory.OBIADY: return t.lunchTitle || "Obiady";
      case MenuCategory.CIASTKA: return t.cakesTitle || "Kuchen";
      case MenuCategory.KAWY: return t.coffeeTitle || "Kaffee";
      case MenuCategory.NAPOJE: return t.drinksTitle || "Erfrischungsgetränke";
      default: return cat;
    }
  };

  // Helper translations for modal UI
  const uiTranslations: Record<string, Record<string, string>> = {
    de: {
      ingredients: "Zutaten & Zubereitung",
      allergens: "Allergene & Warnhinweise",
      baristaTip: "Tipp aus der Küche & Barista-Empfehlung",
      close: "Schließen",
      estimatedPln: "Ungefährer Wert in PLN",
      categoryLabel: "Kategorie",
      naturalTag: "100% Frisch zubereitet",
      veganTag: "Vegan",
      veggieTag: "Vegetarisch",
      customOrder: "Sonderwünsche? Sprechen Sie unser freundliches Service-Personal an!",
      noAllergens: "Keine meldepflichtigen Allergene deklariert."
    },
    pl: {
      ingredients: "Składniki i Przygotowanie",
      allergens: "Alergeny i Ostrzeżenia",
      baristaTip: "Wskazówka od Baristy i Kuchni",
      close: "Schließen / Zamknij",
      estimatedPln: "Szacunkowa wartość w PLN",
      categoryLabel: "Kategoria",
      naturalTag: "W 100% świeże",
      veganTag: "Wegańskie",
      veggieTag: "Wegetariańskie",
      customOrder: "Alergie lub modyfikacje zamówienia? Zapytaj naszą uśmiechniętą obsługę przy barze!",
      noAllergens: "Brak deklarowanych alergenów."
    },
    en: {
      ingredients: "Ingredients & Preparation",
      allergens: "Allergens & Warnings",
      baristaTip: "Barista & Kitchen Recommendation",
      close: "Close",
      estimatedPln: "Estimated value in PLN",
      categoryLabel: "Category",
      naturalTag: "100% Prepared fresh",
      veganTag: "Vegan",
      veggieTag: "Vegetarian",
      customOrder: "Special requests or food allergies? Feel free to ask our friendly staff at the bar!",
      noAllergens: "No declarable allergens detected."
    }
  };

  const localUI = uiTranslations[language] || uiTranslations.de;

  // Smart matching of details based on id prefix or search terms (allowing full fallback for newly synced items)
  const getDetails = (): MenuItemDetails => {
    // 1. Check exact match or fallback prefix match
    const baseId = item.id.replace("_fallback", "");
    if (MENU_DETAILS_DATA[baseId]) {
      return MENU_DETAILS_DATA[baseId];
    }

    // 2. Generate a smart dynamic fallback if not found in data
    const isCoffee = item.category === MenuCategory.KAWY || item.name.toLowerCase().includes("kaffee") || item.name.toLowerCase().includes("kawa") || item.name.toLowerCase().includes("coffee");
    const isCake = item.category === MenuCategory.CIASTKA || item.name.toLowerCase().includes("kuchen") || item.name.toLowerCase().includes("ciast") || item.name.toLowerCase().includes("torte") || item.name.toLowerCase().includes("cake") || item.name.toLowerCase().includes("strudel");
    const isBreakfast = item.category === MenuCategory.SNIADANIA || item.name.toLowerCase().includes("früh") || item.name.toLowerCase().includes("śnia") || item.name.toLowerCase().includes("breakfast") || item.name.toLowerCase().includes("egg") || item.name.toLowerCase().includes("pancak");
    const isDrink = item.category === MenuCategory.NAPOJE || item.name.toLowerCase().includes("limo") || item.name.toLowerCase().includes("tonic") || item.name.toLowerCase().includes("tee") || item.name.toLowerCase().includes("drink");

    // Dynamic builders
    if (isCoffee) {
      return {
        de: {
          ingredients: ["Handverlesener Specialty Arabica-Kaffee (100% Bohnen)", "Frisch gefiltertes, weiches Wasser", "Wahlweise frische Vollmilch oder veganer Bio-Haferdrink"],
          allergens: ["Laktose (nur bei Zubereitung mit regulärer Kuhmilch)"],
          baristaTip: "Gerne bereiten wir jede Kaffeespezialität auch koffeinfrei oder mit extra cremigem Mandel- oder Haferdrink für Sie zu!"
        },
        pl: {
          ingredients: ["Selekcjonowana rzemieślnicza Arabica 100%", "Świeżo filtrowana woda", "Mleko krowie lub opcjonalny napój roślinny"],
          allergens: ["Laktoza (wyłącznie w wersji z tradycyjnym mlekiem krowim)"],
          baristaTip: "Wszystkie nasze kawy możemy zaparzyć bez kofeiny, a także z ultra kremowym napojem owsianym!"
        },
        en: {
          ingredients: ["Select Specialty 100% Arabica beans", "Freshly purified water", "Choice of fresh dairy milk or plant-based barista oat milk"],
          allergens: ["Lactose (only when prepared with dairy milk)"],
          baristaTip: "Our barista can easily prepare this decaf or using smooth, gluten-free organic oat or soy milk!"
        },
        badges: ["lactose"]
      };
    }

    if (isCake) {
      return {
        de: {
          ingredients: ["Hausgemachter handwerklicher Teig", "Zucker", "Hühnereier aus kontrollierter Haltung", "Frische Butter & feine Sahne", "Saisonale Zutaten (Früchte, Schokolade, Nüsse)"],
          allergens: ["Gluten (Weizenmehl)", "Eier", "Milch und Laktose (Schlagsahne, Butter)"],
          baristaTip: "Täglich frisch von unserer Konditorin mit viel Liebe in unserer kleinen Kaffeeküche für Sie gebacken!"
        },
        pl: {
          ingredients: ["Domowe rzemieślnicze ciasto", "Cukier drobny", "Ekologiczne jaja", "Świeże masło wiejskie", "Sezonowe dodatki (owoce leśne, czekolada rzemieślnicza)"],
          allergens: ["Gluten (mąka pszenna)", "Jaja", "Mleko i masło (laktoza)"],
          baristaTip: "Wypiekane codziennie rano z sercem przez naszą cukierniczkę. Zapytaj obsługę o dzisiejsze ciasto bezglutenowe!"
        },
        en: {
          ingredients: ["Homemade artisanal pastry dough", "Sugar", "Free-range organic eggs", "Fresh local cream butter", "Seasonal infusions (berries, Belgian chocolate, walnuts)"],
          allergens: ["Gluten (wheat baking flour)", "Eggs", "Milk & Dairy (Lactose)"],
          baristaTip: "Baked from scratch daily with love and fresh regional ingredients in our boutique kitchen."
        },
        badges: ["gluten", "eggs", "lactose"]
      };
    }

    if (isBreakfast) {
      return {
        de: {
          ingredients: ["Frische Bio-Eier", "Begleitendes knuspriges Bäckerbrot", "Frische Kräuter & feines Salatbett", "Regionale Spezialitäten nach Wahl"],
          allergens: ["Gluten (Brotbeilage)", "Eier"],
          baristaTip: "Der ideale Start in Ihren Wohlfühltag! Perfekt abgerundet mit einem erfrischenden Filterkaffee."
        },
        pl: {
          ingredients: ["Świeże jaja ekologiczne", "Chrupiące pieczywo od lokalnego piekarza", "Zioła, pomidorki i bukiet sałat", "Regionalne dodatki"],
          allergens: ["Gluten (pieczywo)", "Jaja kurze"],
          baristaTip: "Wyśmienite, pożywne i zdrowe śniadanie dające energię na cały poranek. Poproś o dodatkowe masło rzemieślnicze!"
        },
        en: {
          ingredients: ["Farm-fresh organic eggs", "Crispy local bakery bread slice", "Fresh herbs & side salad garnish", "Curated regional toppings of your choice"],
          allergens: ["Gluten (wheat bread)", "Eggs"],
          baristaTip: "The ultimate hearty start to your day. Pairs exquisitely with a single-origin drip pour-over!"
        },
        badges: ["gluten", "eggs"]
      };
    }

    // General fallback for lunches, stews, wraps or miscellaneous
    return {
      de: {
        ingredients: ["Sorgfältig ausgewählte regionale Zutaten", "Hausgemachte Gewürze und frische Kräuter", "Frische Beilagen von lokalen Erzeugern"],
        allergens: ["Gluten (Weizenderivate)", "Milch (wenn Käse oder Schmand enthalten)"],
        baristaTip: "Frisch zubereitet im Herzen von Goch. Falls Sie Unverträglichkeiten haben, zögern Sie nicht uns zu kontaktieren!"
      },
      pl: {
        ingredients: ["Starannie dobrane lokalne składniki regionalne", "Kompozycja świeżych ziół oraz warzyw", "Dopasowane rzemieślnicze sosy"],
        allergens: ["Gluten (pochodne mąki pszennej)", "Mleko i laktoza (jeśli danie zawiera ser lub śmietanę)"],
        baristaTip: "Przygotowywane na bieżąco z dbałością o każdy detal. Masz pytania o skład? Obsługa chętnie rozwieje wszelkie wątpliwości!"
      },
      en: {
        ingredients: ["Carefully handpicked fresh local ingredients", "Blend of seasonal garden herbs & spices", "Artisanal garnish and homemade sauces"],
        allergens: ["Gluten (wheat derivatives)", "Milk/Lactose (if containing cheese, butter or cream)"],
        baristaTip: "Cooked to order with love. Please let us know if you have severe allergies or food intolerances before eating."
      },
      badges: ["gluten"]
    };
  };

  const details = getDetails();
  const activeDetails = details[language] || details.de;

  // Render tag icon indicators beautifully
  const allergenBadgesMap: Record<string, Record<string, string>> = {
    de: {
      gluten: "Weizengluten",
      eggs: "Hühnerei",
      lactose: "Kuhmilch-Laktose",
      soy: "Sojalecithin",
      nuts: "Mandeln / Schalenfrüchte",
      celery: "Sellerieknolle",
      mustard: "Senfsamen"
    },
    pl: {
      gluten: "Gluten pszenny",
      eggs: "Jaja kurze",
      lactose: "Laktoza / mleko",
      soy: "Lecytyna sojowa",
      nuts: "Orzechy i migdały",
      celery: "Seler",
      mustard: "Gorczyca / musztarda"
    },
    en: {
      gluten: "Wheat Gluten",
      eggs: "Poultry Eggs",
      lactose: "Milk Lactose",
      soy: "Soy Lecithin",
      nuts: "Tree Nuts & Almonds",
      celery: "Celery stock",
      mustard: "Mustard grains"
    }
  };

  const hasTags = item.tags && item.tags.length > 0;
  const isVeggie = item.tags.some(t => {
    const l = t.toLowerCase();
    return l.includes("wegetar") || l.includes("vegetar") || l.includes("veggie");
  });
  const isVegan = item.tags.some(t => {
    const l = t.toLowerCase();
    return l.includes("wegań") || l.includes("vegan");
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="menu-item-modal-overlay">
      {/* Dynamic Animated Dark Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-md cursor-pointer"
      />

      {/* Centered Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 15 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative w-full max-w-3xl bg-natural-bg rounded-[36px] overflow-hidden shadow-2xl border border-natural-card-border max-h-[92vh] flex flex-col z-10"
        id={`menu-modal-container-${item.id}`}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 no-scrollbar">
          
          {/* Header Image Header Banner */}
          <div className="relative h-64 md:h-80 bg-stone-100 shrink-0">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {/* Visual gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
            
            {/* Title and Badge layout */}
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase bg-amber-700 text-[#fdfcf7] shadow-xs">
                  {getCategoryLabel(item.category).toUpperCase()}
                </span>
                {isVegan ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase bg-emerald-700 text-white flex items-center gap-1 shadow-xs">
                    <Leaf size={10} />
                    <span>{localUI.veganTag}</span>
                  </span>
                ) : isVeggie ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase bg-green-700/90 text-white flex items-center gap-1 shadow-xs">
                    <Leaf size={10} />
                    <span>{localUI.veggieTag}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase bg-[#aa936d] text-white flex items-center gap-1 shadow-xs">
                    <Sparkles size={10} />
                    <span>{localUI.naturalTag}</span>
                  </span>
                )}
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#fdfcf7] leading-tight tracking-tight drop-shadow-md">
                {item.name}
              </h2>
            </div>
          </div>

          {/* Details Content Container */}
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Primary description & pricing section */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-6 border-b border-natural-border/60">
              <div className="flex-1">
                <p className="text-natural-text text-sm leading-relaxed font-light whitespace-pre-wrap">
                  {item.description}
                </p>
                {hasTags && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {item.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full text-[9px] font-mono font-medium tracking-wide bg-natural-light border border-natural-border/70 text-natural-muted">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Premium pricing cards */}
              <div className="w-full md:w-auto shrink-0 bg-natural-light/80 border border-natural-card-border rounded-2xl p-4 flex items-center justify-center text-center md:-mt-2 shadow-xs min-w-[130px]">
                <div className="w-full">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#aa936d] font-bold block mb-1">PRICE</span>
                  <span className="font-serif text-3xl font-bold text-natural-primary block leading-none">
                    {item.priceEur.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>

            {/* Grid for Ingredients and Allergens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* LEFT BLOCK: Ingredients list */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-natural-text flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#aa936d] rounded-full inline-block" />
                  <span>{localUI.ingredients}</span>
                </h3>
                <div className="bg-white dark:bg-natural-light/50 border border-natural-border/60 rounded-2xl p-5 space-y-2.5 shadow-2xs h-full">
                  {activeDetails.ingredients.map((ingredient, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-natural-text font-light leading-snug">
                      <div className="w-1.5 h-1.5 rounded-full bg-natural-primary/50 shrink-0 mt-2" />
                      <span>{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT BLOCK: Allergens list */}
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#b45309] flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#b45309] rounded-full inline-block" />
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle size={17} className="text-[#b45309]" />
                    <span>{localUI.allergens}</span>
                  </span>
                </h3>
                <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-5 flex flex-col justify-between shadow-2xs h-full">
                  <div className="space-y-3">
                    {activeDetails.allergens.length > 0 ? (
                      activeDetails.allergens.map((allergen, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-amber-950 font-medium leading-relaxed">
                          <Check size={13} className="text-amber-800 shrink-0 mt-1" />
                          <span>{allergen}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-natural-muted italic">
                        {localUI.noAllergens}
                      </p>
                    )}
                  </div>

                  {/* Allergen graphical bullet tag pills */}
                  {details.badges && details.badges.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-amber-200/40">
                      <div className="flex flex-wrap gap-1.5">
                        {details.badges.map((b) => {
                          const val = (allergenBadgesMap[language] || allergenBadgesMap.de)[b] || b;
                          return (
                            <span key={b} className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200/50">
                              {val}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Special Tipp Box */}
            <div className="bg-[#aa936d]/10 border border-[#aa936d]/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-natural-light flex items-center justify-center text-natural-primary shrink-0 shadow-2xs border border-natural-border/50">
                <Coffee size={18} className="stroke-[1.6]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-sm font-bold text-natural-text">
                  {localUI.baristaTip}
                </h4>
                <p className="text-natural-muted text-xs leading-relaxed font-light">
                  {activeDetails.baristaTip}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-natural-light-hover/60 border-t border-natural-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <p className="text-[10px] font-mono text-center sm:text-left text-natural-muted font-light flex items-center justify-center sm:justify-start gap-1">
            <Info size={11} className="text-natural-primary shrink-0" />
            <span>{localUI.customOrder}</span>
          </p>
          
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-natural-text hover:bg-natural-text-hover text-[#fdfcf7] rounded-xl text-xs font-mono font-semibold text-center transition-all cursor-pointer shadow-xs"
          >
            {localUI.close}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
