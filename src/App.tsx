import { useState, useEffect } from "react";
import { MenuCategory, MenuItem } from "./types";
import { Coffee, AlertCircle, Sun, Moon, Settings } from "lucide-react";
import { AnimatePresence } from "motion/react";
import Logo from "./components/Logo";
import Header from "./components/Header";
import CoChceszZone from "./components/CoChceszZone";
import MenuGrid from "./components/MenuGrid";
import CateringSection from "./components/CateringSection";
import FbGallery from "./components/FbGallery";
import ContactFooter from "./components/ContactFooter";
import AdminPanel from "./components/AdminPanel";
import { Language, TRANSLATIONS, LanguageContext } from "./i18n";

export default function App() {
  // Use German ('de') as default language
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("cafemartens_lang");
    if (saved === "de" || saved === "pl" || saved === "en") {
      return saved as Language;
    }
    return "de";
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("cafemartens_dark");
    if (saved === "true") return true;
    if (saved === "false") return false;
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("cafemartens_dark", String(darkMode));
  }, [darkMode]);

  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>(MenuCategory.SNIADANIA);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [logoError, setLogoError] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const t = TRANSLATIONS[language];

  // Load menu items from express backend /api/menu on mount & when language shifts
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/menu?lang=${language}`);
        if (!res.ok) {
          throw new Error("Failed to fetch menu");
        }
        const json = await res.json();
        if (json.success) {
          setMenuItems(json.data);
          setErrorMsg("");
        } else {
          throw new Error("Menu fetch rejected by backend.");
        }
      } catch (err: any) {
        console.error("Fetch menu failed, using client-side fallback list for language:", language, err);
        setErrorMsg(
          language === "de"
            ? "Serververbindung fehlgeschlagen. Offline-Modus aktiv."
            : language === "pl"
            ? "Błąd serwera. Uruchomiono tryb autonomiczny (Offline)."
            : "Server connection failed. Offline fallback mode active."
        );
        
        // Robust client-side fallback array matching language
        const fallbackMenuDe: MenuItem[] = [
          {
            id: "sn_fallback_1",
            name: "Frühstück 'Martens Special'",
            description: "Zwei frische pochierte Eier auf handwerklichem Landbrot mit Avocado, Schinken und Sprossen.",
            priceEur: 11.90,
            pricePln: 51.00,
            category: MenuCategory.SNIADANIA,
            tags: ["Empfohlen"],
            imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop"
          },
          {
            id: "ci_fallback_1",
            name: "Weißer Schoko-Himbeer-Käsekuchen",
            description: "Himmlisch cremiger gebackener Käsekuchen mit weißer Schokolade und Himbeeren auf Spekulatiusboden.",
            priceEur: 4.50,
            pricePln: 19.50,
            category: MenuCategory.CIASTKA,
            tags: ["Bestseller"],
            imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop"
          },
          {
            id: "ka_fallback_1",
            name: "Flat White Doppeleffekt",
            description: "Intensiver doppelter Espresso Ristretto mit wunderbar cremigem Mikromilchschaum.",
            priceEur: 4.10,
            pricePln: 18.00,
            category: MenuCategory.KAWY,
            tags: ["Double Shot"],
            imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=600&auto=format&fit=crop"
          }
        ];

        const fallbackMenuPl: MenuItem[] = [
          {
            id: "sn_fallback_1",
            name: "Śniadanie 'Martens Special'",
            description: "Dwa świeże jajka w koszulce ułożone na domowym chlebie rzemieślniczym z awokado, szynką, pomidorami i kiełkami.",
            priceEur: 11.90,
            pricePln: 51.00,
            category: MenuCategory.SNIADANIA,
            tags: ["Polecane"],
            imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop"
          },
          {
            id: "ci_fallback_1",
            name: "Sernik z Białą Czekoladą i Malinami",
            description: "Niezwykle kremowy baked cheesecake z białą czekoladą i malinami na korzennym spodzie z ciasteczek.",
            priceEur: 4.50,
            pricePln: 19.50,
            category: MenuCategory.CIASTKA,
            tags: ["Hicior"],
            imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop"
          },
          {
            id: "ka_fallback_1",
            name: "Flat White podwójne uderzenie",
            description: "Intensywne podwójne espresso ristretto wypełnione aksamitnie spienionym mlekiem.",
            priceEur: 4.10,
            pricePln: 18.00,
            category: MenuCategory.KAWY,
            tags: ["Mocna"],
            imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=600&auto=format&fit=crop"
          }
        ];

        const fallbackMenuEn: MenuItem[] = [
          {
            id: "sn_fallback_1",
            name: "Breakfast 'Martens Special'",
            description: "Two fresh poached eggs layered on artisan bread with avocado, regional ham, and fresh baby sprouts.",
            priceEur: 11.90,
            pricePln: 51.00,
            category: MenuCategory.SNIADANIA,
            tags: ["Recommended"],
            imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop"
          },
          {
            id: "ci_fallback_1",
            name: "White Chocolate & Raspberry Cheesecake",
            description: "Amazingly creamy baked cheesecake with hints of white chocolate, wild raspberries and spiced biscuits.",
            priceEur: 4.50,
            pricePln: 19.50,
            category: MenuCategory.CIASTKA,
            tags: ["Bestseller"],
            imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop"
          },
          {
            id: "ka_fallback_1",
            name: "Double Shot Flat White",
            description: "Strong, silky milk coffee styled with double ristretto dose and perfect microfoam.",
            priceEur: 4.10,
            pricePln: 18.00,
            category: MenuCategory.KAWY,
            tags: ["Strong"],
            imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=600&auto=format&fit=crop"
          }
        ];

        setMenuItems(
          language === "de"
            ? fallbackMenuDe
            : language === "pl"
            ? fallbackMenuPl
            : fallbackMenuEn
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [language, refreshTrigger]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className="min-h-screen bg-natural-bg text-natural-text font-sans selection:bg-natural-primary/20 selection:text-natural-primary scroll-smooth">
        
        {/* Dynamic Sticky Navigation Bar */}
        <nav className="sticky top-0 z-50 bg-natural-bg/90 backdrop-blur-md border-b border-natural-border/50 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Logo Brand */}
            <a href="#glowna" className="flex items-center gap-3 group">
              <Logo size="40" className="border border-natural-border/30 shadow-xs group-hover:scale-105 group-hover:shadow-sm transition-all duration-300" />
              <span className="font-serif text-lg font-bold tracking-tight text-natural-text">
                Café Martens <span className="text-natural-primary italic">&amp; More</span>
              </span>
            </a>

            {/* Quick Menu Links */}
            <div className="hidden md:flex items-center gap-7 text-xs font-mono tracking-wider uppercase font-semibold text-natural-muted">
              <a href="#glowna" className="hover:text-natural-primary transition-colors">{t.navHome}</a>
              <a href="#co-chcesz" className="hover:text-natural-primary transition-colors">{t.navZones}</a>
              <a href="#karta-menu" className="hover:text-natural-primary transition-colors">{t.navMenu}</a>
              <a href="#catering" className="hover:text-natural-primary transition-colors">{t.navCatering}</a>
              <a href="#galeria-fb" className="hover:text-natural-primary transition-colors">{t.navGallery}</a>
              <a href="#kontakt" className="hover:text-natural-primary transition-colors font-bold text-natural-primary">{t.navContact}</a>
            </div>

            {/* Language Switcher and Open Pill */}
            <div className="flex items-center gap-4">
              {/* Specialized Language Switching Slider */}
              <div className="flex items-center gap-1 bg-natural-light border border-natural-border/60 p-1 rounded-full shadow-xs shadow-black/[0.02]">
                {(["de", "pl", "en"] as const).map((langOption) => (
                  <button
                    key={langOption}
                    onClick={() => {
                      setLanguage(langOption);
                      localStorage.setItem("cafemartens_lang", langOption);
                    }}
                    className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer ${
                      language === langOption
                        ? "bg-natural-primary text-white font-bold shadow-xs"
                        : "text-natural-muted hover:text-natural-text"
                    }`}
                  >
                    {langOption}
                  </button>
                ))}
              </div>

              {/* Adaptive Light/Dark Mode Slider */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-9 h-9 rounded-full bg-natural-light border border-natural-border/60 text-natural-text flex items-center justify-center hover:bg-natural-light-hover hover:border-natural-border hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs shadow-black/[0.02] shrink-0"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                aria-label="Toggle light or dark theme"
              >
                {darkMode ? (
                  <Sun size={15} className="text-amber-500 fill-amber-500/10" />
                ) : (
                  <Moon size={15} className="text-natural-primary fill-natural-primary/10" />
                )}
              </button>

              {/* Admin Panel Toggle Button */}
              <button
                onClick={() => setAdminOpen(true)}
                className="w-9 h-9 rounded-full bg-natural-light border border-natural-border/60 text-natural-text flex items-center justify-center hover:bg-natural-light-hover hover:border-natural-border hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs shadow-black/[0.02] shrink-0"
                title="Admin Panel"
                aria-label="Open Admin Panel"
              >
                <Settings size={15} className="text-natural-primary" />
              </button>

              {/* Opening Status */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] uppercase font-mono tracking-wider text-natural-text/80">{t.navStatusOpen}</span>
              </div>
            </div>

          </div>
        </nav>

        {/* Main Single Page Sections */}
        <main>
          {/* SECTION 1: Welcome Header */}
          <Header />

          {/* SECTION 2: Category Selector "Co chcesz...?" */}
          <CoChceszZone
            onSelectCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
          />

          {/* Error notification banner if backend failed */}
          {errorMsg && (
            <div className="max-w-7xl mx-auto px-6 mb-8">
              <div className="p-4 bg-orange-100/30 border border-orange-100 rounded-3xl flex items-center gap-3 text-orange-850 text-xs">
                <AlertCircle size={14} className="text-orange-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* SECTION 3: Detailed Menu Grid showing filtered elements */}
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-12 h-12 border-4 border-natural-border border-t-natural-primary rounded-full animate-spin mx-auto mb-4" />
              <span className="text-natural-muted text-xs font-mono">{t.menuLoading}</span>
            </div>
          ) : (
            <MenuGrid
              items={menuItems}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          )}

          {/* SECTION 4: Business Catering offer */}
          <CateringSection />

          {/* SECTION 5: Synchronized Facebook Live Gallery */}
          <FbGallery refreshTrigger={refreshTrigger} />
        </main>

        {/* SECTION 6: Contact footer containing hours, map, reviews */}
        <ContactFooter />

        {/* Modal-style Admin Panel */}
        <AnimatePresence>
          {adminOpen && (
            <AdminPanel 
              onClose={() => setAdminOpen(false)} 
              onRefreshData={() => setRefreshTrigger(prev => prev + 1)} 
            />
          )}
        </AnimatePresence>

      </div>
    </LanguageContext.Provider>
  );
}
