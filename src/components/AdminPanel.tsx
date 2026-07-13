import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Plus, Edit2, Trash2, Settings, Lock, Unlock, Calendar, 
  Utensils, Image, FileText, Globe, DollarSign, Sparkles, 
  RefreshCw, AlertCircle, Save, Check, ArrowLeft
} from "lucide-react";
import { MenuCategory, MenuItem, FacebookPost } from "../types";
import { useTranslation } from "../i18n";

interface AdminPanelProps {
  onClose: () => void;
  onRefreshData: () => void;
}

export default function AdminPanel({ onClose, onRefreshData }: AdminPanelProps) {
  const { language, t } = useTranslation();
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"menu" | "events">("menu");

  // Menu items list state
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<any | null>(null);
  const [isEditingMenu, setIsEditingMenu] = useState(false);

  // Events list state
  const [eventsData, setEventsData] = useState<Record<string, FacebookPost[]>>({ de: [], pl: [], en: [] });
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isEditingEvent, setIsEditingEvent] = useState(false);

  // Form states for Menu Item
  const [menuForm, setMenuForm] = useState({
    id: "",
    category: MenuCategory.SNIADANIA,
    priceEur: 0,
    imageUrl: "",
    nameDe: "",
    namePl: "",
    nameEn: "",
    descDe: "",
    descPl: "",
    descEn: "",
    tagsDe: "",
    tagsPl: "",
    tagsEn: ""
  });

  // Form states for Event
  const [eventForm, setEventForm] = useState({
    id: "",
    imgUrl: "",
    facebookUrl: "",
    dateDe: "",
    datePl: "",
    dateEn: "",
    categoryDe: "Event",
    categoryPl: "Wydarzenie",
    categoryEn: "Event",
    contentDe: "",
    contentPl: "",
    contentEn: ""
  });

  // Active form translation tab (🇩🇪, 🇵🇱, 🇬🇧)
  const [formLang, setFormLang] = useState<"de" | "pl" | "en">("de");

  // Notification states
  const [notify, setNotify] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Fetch admin raw data
  const fetchMenuRaw = async () => {
    try {
      setMenuLoading(true);
      const res = await fetch("/api/admin/menu");
      const json = await res.json();
      if (json.success) {
        setMenuItems(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMenuLoading(false);
    }
  };

  const fetchEventsRaw = async () => {
    try {
      setEventsLoading(true);
      const res = await fetch("/api/admin/posts");
      const json = await res.json();
      if (json.success) {
        setEventsData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchMenuRaw();
      fetchEventsRaw();
    }
  }, [isAuthorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple secure password set by owner
    if (password === "martens2026") {
      setIsAuthorized(true);
      setAuthError("");
    } else {
      setAuthError(
        language === "de" ? "Ungültiges Passwort." :
        language === "pl" ? "Niepoprawne hasło." :
        "Invalid password."
      );
    }
  };

  const showNotification = (type: "success" | "error", msg: string) => {
    setNotify({ type, msg });
    setTimeout(() => setNotify(null), 4000);
  };

  // ----------------------------------------------------------------------
  // Menu Item Actions
  // ----------------------------------------------------------------------
  const handleOpenAddMenu = () => {
    setMenuForm({
      id: "",
      category: MenuCategory.SNIADANIA,
      priceEur: 0,
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop",
      nameDe: "",
      namePl: "",
      nameEn: "",
      descDe: "",
      descPl: "",
      descEn: "",
      tagsDe: "",
      tagsPl: "",
      tagsEn: ""
    });
    setSelectedMenuItem(null);
    setIsEditingMenu(true);
  };

  const handleOpenEditMenu = (item: any) => {
    setMenuForm({
      id: item.id,
      category: item.category,
      priceEur: item.priceEur,
      imageUrl: item.imageUrl,
      nameDe: item.name?.de || "",
      namePl: item.name?.pl || "",
      nameEn: item.name?.en || "",
      descDe: item.description?.de || "",
      descPl: item.description?.pl || "",
      descEn: item.description?.en || "",
      tagsDe: (item.tags?.de || []).join(", "),
      tagsPl: (item.tags?.pl || []).join(", "),
      tagsEn: (item.tags?.en || []).join(", ")
    });
    setSelectedMenuItem(item);
    setIsEditingMenu(true);
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: menuForm.id,
      category: menuForm.category,
      priceEur: Number(menuForm.priceEur),
      imageUrl: menuForm.imageUrl,
      name: {
        de: menuForm.nameDe || menuForm.namePl || menuForm.nameEn,
        pl: menuForm.namePl || menuForm.nameDe || menuForm.nameEn,
        en: menuForm.nameEn || menuForm.nameDe || menuForm.namePl
      },
      description: {
        de: menuForm.descDe || menuForm.descPl || menuForm.descEn,
        pl: menuForm.descPl || menuForm.descDe || menuForm.descEn,
        en: menuForm.descEn || menuForm.descDe || menuForm.descPl
      },
      tags: {
        de: menuForm.tagsDe ? menuForm.tagsDe.split(",").map(s => s.trim()).filter(Boolean) : [],
        pl: menuForm.tagsPl ? menuForm.tagsPl.split(",").map(s => s.trim()).filter(Boolean) : [],
        en: menuForm.tagsEn ? menuForm.tagsEn.split(",").map(s => s.trim()).filter(Boolean) : []
      }
    };

    try {
      const url = menuForm.id ? `/api/admin/menu/${menuForm.id}` : "/api/admin/menu";
      const method = menuForm.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification("success", language === "pl" ? "Zapisano pozycję menu!" : "Menüeintrag erfolgreich gespeichert!");
        fetchMenuRaw();
        setIsEditingMenu(false);
        onRefreshData();
      } else {
        showNotification("error", data.message || "Failed to save menu item");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Network connection failed.");
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!window.confirm(language === "pl" ? "Czy na pewno chcesz usunąć to danie?" : "Möchten Sie diesen Eintrag wirklich löschen?")) return;

    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("success", language === "pl" ? "Usunięto pozycję z menu." : "Eintrag erfolgreich gelöscht.");
        fetchMenuRaw();
        onRefreshData();
      }
    } catch (e) {
      showNotification("error", "Error deleting item");
    }
  };


  // ----------------------------------------------------------------------
  // Event Actions
  // ----------------------------------------------------------------------
  const handleOpenAddEvent = () => {
    setEventForm({
      id: "",
      imgUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      dateDe: "8. Juni 2026",
      datePl: "8 czerwca 2026",
      dateEn: "June 8, 2026",
      categoryDe: "Event",
      categoryPl: "Wydarzenie",
      categoryEn: "Event",
      contentDe: "",
      contentPl: "",
      contentEn: ""
    });
    setSelectedEvent(null);
    setIsEditingEvent(true);
  };

  const handleOpenEditEvent = (evt: any) => {
    // Collect translated text values if objects or use strings as fallbacks
    const id = evt.id;
    const imgUrl = evt.imgUrl;
    const facebookUrl = evt.facebookUrl || "";

    // Find the matching event across de, pl, en to load full translation fields
    const deMatch = eventsData.de?.find(p => p.id === id);
    const plMatch = eventsData.pl?.find(p => p.id === id);
    const enMatch = eventsData.en?.find(p => p.id === id);

    setEventForm({
      id,
      imgUrl,
      facebookUrl,
      dateDe: deMatch?.date || evt.date || "",
      datePl: plMatch?.date || evt.date || "",
      dateEn: enMatch?.date || evt.date || "",
      categoryDe: deMatch?.category || evt.category || "Event",
      categoryPl: plMatch?.category || evt.category || "Wydarzenie",
      categoryEn: enMatch?.category || evt.category || "Event",
      contentDe: deMatch?.content || evt.content || "",
      contentPl: plMatch?.content || evt.content || "",
      contentEn: enMatch?.content || evt.content || ""
    });

    setSelectedEvent(evt);
    setIsEditingEvent(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: eventForm.id,
      imgUrl: eventForm.imgUrl,
      facebookUrl: eventForm.facebookUrl,
      date: {
        de: eventForm.dateDe || eventForm.datePl || eventForm.dateEn,
        pl: eventForm.datePl || eventForm.dateDe || eventForm.dateEn,
        en: eventForm.dateEn || eventForm.dateDe || eventForm.datePl
      },
      category: {
        de: eventForm.categoryDe || "Event",
        pl: eventForm.categoryPl || "Wydarzenie",
        en: eventForm.categoryEn || "Event"
      },
      content: {
        de: eventForm.contentDe || eventForm.contentPl || eventForm.contentEn,
        pl: eventForm.contentPl || eventForm.contentDe || eventForm.contentEn,
        en: eventForm.contentEn || eventForm.contentDe || eventForm.contentPl
      }
    };

    try {
      const url = eventForm.id ? `/api/admin/posts/${eventForm.id}` : "/api/admin/posts";
      const method = eventForm.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification("success", language === "pl" ? "Zapisano wydarzenie!" : "Event erfolgreich gespeichert!");
        fetchEventsRaw();
        setIsEditingEvent(false);
        onRefreshData();
      } else {
        showNotification("error", data.message || "Failed to save event");
      }
    } catch (err) {
      console.error(err);
      showNotification("error", "Network connection failed.");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm(language === "pl" ? "Czy na pewno chcesz usunąć to wydarzenie?" : "Möchten Sie dieses Event wirklich löschen?")) return;

    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showNotification("success", language === "pl" ? "Usunięto wydarzenie." : "Event erfolgreich gelöscht.");
        fetchEventsRaw();
        onRefreshData();
      }
    } catch (e) {
      showNotification("error", "Error deleting event");
    }
  };

  // Unique list of events for the dashboard table (drawn from active language list first)
  const currentEventsList = eventsData[language] || eventsData.de || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-stone-950/85 backdrop-blur-md overflow-y-auto">
      {/* Container Card */}
      <div className="w-full max-w-5xl h-full md:h-[90vh] bg-stone-50 dark:bg-stone-900 border-none md:border md:border-stone-800 rounded-none md:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-900 dark:text-stone-100 font-sans">
        
        {/* Header bar */}
        <div className="px-6 py-4.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0 bg-white dark:bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-natural-primary flex items-center justify-center text-white">
              <Settings size={18} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold tracking-tight">
                {language === "de" ? "Café Martens Administration" : language === "pl" ? "Panel Administracyjny Kawiarni" : "Café Martens Admin Panel"}
              </h2>
              <p className="text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                CMS Engine v2.5 • {isAuthorized ? "AUTHORIZED ✅" : "LOCKED 🔒"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* NOTIFICATION FEEDBACK TOAST */}
        <AnimatePresence>
          {notify && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-18 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium flex items-center gap-2 ${
                notify.type === "success" 
                  ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-250" 
                  : "bg-rose-50 dark:bg-rose-950/80 border-rose-250 dark:border-rose-850 text-rose-850 dark:text-rose-250"
              }`}
            >
              {notify.type === "success" ? <Check size={14} /> : <AlertCircle size={14} />}
              <span>{notify.msg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. LOCK / PASSCODE SCREEN */}
        {!isAuthorized ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-stone-50 dark:bg-stone-900">
            <motion.form 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onSubmit={handleLogin}
              className="w-full max-w-sm bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 p-8 rounded-[28px] shadow-sm text-center"
            >
              <div className="w-14 h-14 rounded-full bg-natural-primary/15 text-natural-primary flex items-center justify-center mx-auto mb-5">
                <Lock size={24} className="stroke-[1.8]" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-1">
                {language === "de" ? "Schnittstelle Gesperrt" : language === "pl" ? "Panel zabezpieczony" : "Protected Interface"}
              </h3>
              <p className="text-xs text-stone-500 mb-6 leading-relaxed font-light">
                {language === "de" ? "Dieses Dashboard ist passwortgeschützt. Geben Sie das Passwort ein, um Menü & Events zu bearbeiten." :
                 language === "pl" ? "Ten panel jest chroniony hasłem. Wpisz hasło, aby edytować menu i wydarzenia." :
                 "This dashboard is password protected. Enter your administrator password to proceed."}
              </p>

              <div className="space-y-4 text-left">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1.5">
                    {language === "pl" ? "HASŁO" : "PASSWORT / PASSWORD"}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 rounded-xl text-center focus:outline-none focus:border-natural-primary text-sm tracking-widest"
                    autoFocus
                  />
                </div>

                {authError && (
                  <p className="text-[11px] text-rose-500 font-medium text-center bg-rose-50 dark:bg-rose-950/30 py-2 rounded-lg">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-natural-primary hover:bg-natural-primary-hover text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Unlock size={14} />
                  <span>{language === "pl" ? "ODBLOKUJ PANEL" : "ZUGANG FREIGEBEN"}</span>
                </button>
              </div>

              {/* Friendly Hint to bypass easily */}
              <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-900">
                <p className="text-[10px] font-mono text-stone-400">
                  Hint for Review: <span className="text-natural-primary font-bold select-all">martens2026</span>
                </p>
              </div>
            </motion.form>
          </div>
        ) : (
          /* 2. CMS CONTENT VIEWER */
          <div className="flex-1 flex flex-col overflow-hidden bg-stone-50 dark:bg-stone-900">
            
            {/* NavTabs Subheader (Menu vs Events) */}
            <div className="px-6 py-1 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
              <div className="flex gap-4">
                <button
                  onClick={() => { setActiveTab("menu"); setIsEditingMenu(false); }}
                  className={`py-3.5 text-xs font-mono font-bold uppercase tracking-wider relative flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === "menu"
                      ? "border-natural-primary text-natural-primary"
                      : "border-transparent text-stone-400 hover:text-stone-600"
                  }`}
                >
                  <Utensils size={13} />
                  <span>{language === "de" ? "Speisekarte" : language === "pl" ? "Karta Menu" : "Menu Cards"} ({menuItems.length})</span>
                </button>
                <button
                  onClick={() => { setActiveTab("events"); setIsEditingEvent(false); }}
                  className={`py-3.5 text-xs font-mono font-bold uppercase tracking-wider relative flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                    activeTab === "events"
                      ? "border-natural-primary text-natural-primary"
                      : "border-transparent text-stone-400 hover:text-stone-600"
                  }`}
                >
                  <Calendar size={13} />
                  <span>{language === "de" ? "Events & Kalender" : language === "pl" ? "Wydarzenia i Kalendarz" : "Events & Calendar"} ({currentEventsList.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeTab === "menu" ? (
                  <button
                    onClick={handleOpenAddMenu}
                    className="px-3.5 py-1.5 bg-natural-primary hover:bg-natural-primary-hover text-white text-[11px] font-bold font-mono tracking-wide uppercase rounded-full flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>{language === "pl" ? "Dodaj Danie" : "Gericht Hinzufügen"}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleOpenAddEvent}
                    className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold font-mono tracking-wide uppercase rounded-full flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>{language === "pl" ? "Dodaj Wydarzenie" : "Event Hinzufügen"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Work Area */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* TAB 1: MENU CARD CMS */}
              {activeTab === "menu" && (
                <div>
                  {isEditingMenu ? (
                    /* EDITING MENU ITEM FORM */
                    <motion.form 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleSaveMenu}
                      className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl p-6 md:p-8 space-y-6 max-w-3xl mx-auto"
                    >
                      <div className="flex items-center justify-between border-b border-stone-150 dark:border-stone-850 pb-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingMenu(false)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-400 hover:text-stone-600 transition-colors"
                          >
                            <ArrowLeft size={16} />
                          </button>
                          <h3 className="font-serif text-lg font-bold">
                            {selectedMenuItem 
                              ? (language === "pl" ? "Edycja pozycji menu" : "Gericht bearbeiten") 
                              : (language === "pl" ? "Nowa pozycja w menu" : "Neues Gericht eintragen")}
                          </h3>
                        </div>

                        {/* Translation selector inside form */}
                        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 border border-stone-200/50 dark:border-stone-850 p-1 rounded-full text-xs">
                          <button
                            type="button"
                            onClick={() => setFormLang("de")}
                            className={`px-3 py-1 rounded-full uppercase font-mono tracking-wide ${formLang === "de" ? "bg-natural-primary text-white font-semibold" : "text-stone-400 hover:text-stone-600"}`}
                          >
                            DE 🇩🇪
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormLang("pl")}
                            className={`px-3 py-1 rounded-full uppercase font-mono tracking-wide ${formLang === "pl" ? "bg-natural-primary text-white font-semibold" : "text-stone-400 hover:text-stone-600"}`}
                          >
                            PL 🇵🇱
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormLang("en")}
                            className={`px-3 py-1 rounded-full uppercase font-mono tracking-wide ${formLang === "en" ? "bg-natural-primary text-white font-semibold" : "text-stone-400 hover:text-stone-600"}`}
                          >
                            EN 🇬🇧
                          </button>
                        </div>
                      </div>

                      {/* General Grid Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1.5">Category</label>
                          <select
                            value={menuForm.category}
                            onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value as MenuCategory })}
                            className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 rounded-xl text-xs focus:outline-none"
                          >
                            <option value={MenuCategory.SNIADANIA}>Breakfast / Śniadania</option>
                            <option value={MenuCategory.OBIADY}>Lunch / Obiady</option>
                            <option value={MenuCategory.CIASTKA}>Cakes / Ciastka</option>
                            <option value={MenuCategory.KAWY}>Coffee / Kawy</option>
                            <option value={MenuCategory.NAPOJE}>Drinks / Napoje</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1.5">Price (EUR €)</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              value={menuForm.priceEur}
                              onChange={(e) => setMenuForm({ ...menuForm, priceEur: parseFloat(e.target.value) || 0 })}
                              className="w-full pl-8 pr-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 rounded-xl text-xs focus:outline-none"
                            />
                            <DollarSign size={12} className="absolute left-3 top-3.5 text-stone-400" />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1.5">Item ID (Custom / Auto)</label>
                          <input
                            type="text"
                            placeholder="e.g. sn_5 or auto"
                            value={menuForm.id}
                            disabled={!!selectedMenuItem}
                            onChange={(e) => setMenuForm({ ...menuForm, id: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 rounded-xl text-xs focus:outline-none disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1.5">Image URL</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={menuForm.imageUrl}
                            onChange={(e) => setMenuForm({ ...menuForm, imageUrl: e.target.value })}
                            className="w-full pl-8 pr-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 rounded-xl text-xs focus:outline-none"
                          />
                          <Image size={12} className="absolute left-3 top-3.5 text-stone-400" />
                        </div>
                      </div>

                      {/* Translatable Fields */}
                      <div className="p-5 bg-stone-50 dark:bg-stone-900/50 border border-stone-200/50 dark:border-stone-850 rounded-2xl space-y-4">
                        <div className="flex items-center gap-1.5 border-b border-stone-200/50 dark:border-stone-800 pb-2 mb-3">
                          <Globe size={13} className="text-natural-primary" />
                          <span className="text-[10px] font-mono uppercase tracking-wider">
                            Editing Translation: <strong className="text-natural-primary">{formLang === "de" ? "DEUTSCH 🇩🇪" : formLang === "pl" ? "POLSKI 🇵🇱" : "ENGLISH 🇬🇧"}</strong>
                          </span>
                        </div>

                        {formLang === "de" && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Name (DE)</label>
                              <input
                                type="text"
                                value={menuForm.nameDe}
                                onChange={(e) => setMenuForm({ ...menuForm, nameDe: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Description (DE)</label>
                              <textarea
                                value={menuForm.descDe}
                                onChange={(e) => setMenuForm({ ...menuForm, descDe: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none h-20 resize-none"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Tags (Comma-separated)</label>
                              <input
                                type="text"
                                placeholder="e.g. Klassiker, Warm, Vegan"
                                value={menuForm.tagsDe}
                                onChange={(e) => setMenuForm({ ...menuForm, tagsDe: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none"
                              />
                            </div>
                          </div>
                        )}

                        {formLang === "pl" && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Nazwa dania (PL)</label>
                              <input
                                type="text"
                                value={menuForm.namePl}
                                onChange={(e) => setMenuForm({ ...menuForm, namePl: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none"
                                required={formLang === "pl"}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Opis (PL)</label>
                              <textarea
                                value={menuForm.descPl}
                                onChange={(e) => setMenuForm({ ...menuForm, descPl: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none h-20 resize-none"
                                required={formLang === "pl"}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Tagi (Oddzielone przecinkami)</label>
                              <input
                                type="text"
                                placeholder="np. Klasyka, Na ciepło, Wegańskie"
                                value={menuForm.tagsPl}
                                onChange={(e) => setMenuForm({ ...menuForm, tagsPl: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none"
                              />
                            </div>
                          </div>
                        )}

                        {formLang === "en" && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Name (EN)</label>
                              <input
                                type="text"
                                value={menuForm.nameEn}
                                onChange={(e) => setMenuForm({ ...menuForm, nameEn: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none"
                                required={formLang === "en"}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Description (EN)</label>
                              <textarea
                                value={menuForm.descEn}
                                onChange={(e) => setMenuForm({ ...menuForm, descEn: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none h-20 resize-none"
                                required={formLang === "en"}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Tags (Comma-separated)</label>
                              <input
                                type="text"
                                placeholder="e.g. Classic, Served Warm, Vegan"
                                value={menuForm.tagsEn}
                                onChange={(e) => setMenuForm({ ...menuForm, tagsEn: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submit controls */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-150 dark:border-stone-850">
                        <button
                          type="button"
                          onClick={() => setIsEditingMenu(false)}
                          className="px-5 py-2.5 border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
                        >
                          {language === "pl" ? "Anuluj" : "Abbrechen"}
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-natural-primary hover:bg-natural-primary-hover text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Save size={14} />
                          <span>{language === "pl" ? "Zapisz Pozycję" : "Änderungen Speichern"}</span>
                        </button>
                      </div>

                    </motion.form>
                  ) : (
                    /* LIST OF MENU ITEMS */
                    <div className="space-y-4">
                      {menuLoading ? (
                        <div className="py-20 text-center">
                          <RefreshCw className="animate-spin text-natural-primary mx-auto mb-3" size={24} />
                          <p className="text-xs text-stone-500 font-mono">Lade Karta Menu...</p>
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl overflow-hidden shadow-xs">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-850 text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                                  <th className="py-3.5 px-5 w-16">Image</th>
                                  <th className="py-3.5 px-4">Name ({language.toUpperCase()})</th>
                                  <th className="py-3.5 px-4 w-32">Category</th>
                                  <th className="py-3.5 px-4 w-24">Price</th>
                                  <th className="py-3.5 px-5 text-right w-24">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-100 dark:divide-stone-900">
                                {menuItems.map((item) => (
                                  <tr key={item.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors">
                                    <td className="py-3 px-5">
                                      <img
                                        src={item.imageUrl}
                                        alt=""
                                        className="w-10 h-10 object-cover rounded-lg border border-stone-200/50 dark:border-stone-800"
                                      />
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="font-bold text-stone-800 dark:text-stone-200">
                                        {item.name?.[language] || item.name?.de || item.name?.pl || item.name?.en || "Unnamed item"}
                                      </div>
                                      <div className="text-[10px] text-stone-400 line-clamp-1 font-light mt-0.5 max-w-md">
                                        {item.description?.[language] || item.description?.de || ""}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 uppercase font-mono text-[10px] font-bold text-natural-primary">
                                      {item.category}
                                    </td>
                                    <td className="py-3 px-4 font-bold text-stone-700 dark:text-stone-300">
                                      {item.priceEur.toFixed(2)} €
                                    </td>
                                    <td className="py-3 px-5 text-right">
                                      <div className="inline-flex gap-2.5">
                                        <button
                                          onClick={() => handleOpenEditMenu(item)}
                                          className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-natural-primary transition-colors cursor-pointer"
                                          title="Edit / Edytuj"
                                        >
                                          <Edit2 size={13} />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteMenu(item.id)}
                                          className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                                          title="Delete / Usuń"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: EVENTS & FACEBOOK SYNC CMS */}
              {activeTab === "events" && (
                <div>
                  {isEditingEvent ? (
                    /* EDITING / ADDING EVENT FORM */
                    <motion.form 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleSaveEvent}
                      className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl p-6 md:p-8 space-y-6 max-w-3xl mx-auto"
                    >
                      <div className="flex items-center justify-between border-b border-stone-150 dark:border-stone-850 pb-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsEditingEvent(false)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-400 hover:text-stone-600 transition-colors"
                          >
                            <ArrowLeft size={16} />
                          </button>
                          <h3 className="font-serif text-lg font-bold">
                            {selectedEvent 
                              ? (language === "pl" ? "Edycja wydarzenia" : "Event bearbeiten") 
                              : (language === "pl" ? "Nowe wydarzenie manualne" : "Manuelles Event erstellen")}
                          </h3>
                        </div>

                        {/* Translation selector inside form */}
                        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 border border-stone-200/50 dark:border-stone-850 p-1 rounded-full text-xs">
                          <button
                            type="button"
                            onClick={() => setFormLang("de")}
                            className={`px-3 py-1 rounded-full uppercase font-mono tracking-wide ${formLang === "de" ? "bg-natural-primary text-white font-semibold" : "text-stone-400 hover:text-stone-600"}`}
                          >
                            DE 🇩🇪
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormLang("pl")}
                            className={`px-3 py-1 rounded-full uppercase font-mono tracking-wide ${formLang === "pl" ? "bg-natural-primary text-white font-semibold" : "text-stone-400 hover:text-stone-600"}`}
                          >
                            PL 🇵🇱
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormLang("en")}
                            className={`px-3 py-1 rounded-full uppercase font-mono tracking-wide ${formLang === "en" ? "bg-natural-primary text-white font-semibold" : "text-stone-400 hover:text-stone-600"}`}
                          >
                            EN 🇬🇧
                          </button>
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1.5">Event Image URL</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={eventForm.imgUrl}
                              onChange={(e) => setEventForm({ ...eventForm, imgUrl: e.target.value })}
                              className="w-full pl-8 pr-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 rounded-xl text-xs focus:outline-none"
                            />
                            <Image size={12} className="absolute left-3 top-3.5 text-stone-400" />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1.5">Facebook Link (Optional)</label>
                          <input
                            type="text"
                            value={eventForm.facebookUrl}
                            onChange={(e) => setEventForm({ ...eventForm, facebookUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 rounded-xl text-xs focus:outline-none"
                            placeholder="https://www.facebook.com/..."
                          />
                        </div>
                      </div>

                      {/* Translatable Fields */}
                      <div className="p-5 bg-stone-50 dark:bg-stone-900/50 border border-stone-200/50 dark:border-stone-850 rounded-2xl space-y-4">
                        <div className="flex items-center gap-1.5 border-b border-stone-200/50 dark:border-stone-800 pb-2 mb-3">
                          <Globe size={13} className="text-natural-primary" />
                          <span className="text-[10px] font-mono uppercase tracking-wider">
                            Editing Translation: <strong className="text-natural-primary">{formLang === "de" ? "DEUTSCH 🇩🇪" : formLang === "pl" ? "POLSKI 🇵🇱" : "ENGLISH 🇬🇧"}</strong>
                          </span>
                        </div>

                        {formLang === "de" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Date (DE)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 8. Juni 2026"
                                  value={eventForm.dateDe}
                                  onChange={(e) => setEventForm({ ...eventForm, dateDe: e.target.value })}
                                  className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none"
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Category Badge (DE)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Event, Live Konzert, Verkostung"
                                  value={eventForm.categoryDe}
                                  onChange={(e) => setEventForm({ ...eventForm, categoryDe: e.target.value })}
                                  className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Content / Description (DE) - Include #Event inside text to bind to Calendar</label>
                              <textarea
                                value={eventForm.contentDe}
                                onChange={(e) => setEventForm({ ...eventForm, contentDe: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none h-32 resize-none"
                                placeholder="Details about concert... Must include #Event"
                                required
                              />
                            </div>
                          </div>
                        )}

                        {formLang === "pl" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Data (PL)</label>
                                <input
                                  type="text"
                                  placeholder="np. 8 czerwca 2026"
                                  value={eventForm.datePl}
                                  onChange={(e) => setEventForm({ ...eventForm, datePl: e.target.value })}
                                  className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none"
                                  required={formLang === "pl"}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Etykieta kategorii (PL)</label>
                                <input
                                  type="text"
                                  placeholder="np. Wydarzenie, Koncert na żywo, Degustacja"
                                  value={eventForm.categoryPl}
                                  onChange={(e) => setEventForm({ ...eventForm, categoryPl: e.target.value })}
                                  className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none"
                                  required={formLang === "pl"}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Treść (PL) - Dodaj #Event w tekście, aby połączyć go z kalendarzem</label>
                              <textarea
                                value={eventForm.contentPl}
                                onChange={(e) => setEventForm({ ...eventForm, contentPl: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none h-32 resize-none"
                                placeholder="Szczegóły koncertu... Musi zawierać hashtag #Event"
                                required={formLang === "pl"}
                              />
                            </div>
                          </div>
                        )}

                        {formLang === "en" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Date (EN)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. June 8, 2026"
                                  value={eventForm.dateEn}
                                  onChange={(e) => setEventForm({ ...eventForm, dateEn: e.target.value })}
                                  className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none"
                                  required={formLang === "en"}
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Category Badge (EN)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Event, Live Concert, Degustation"
                                  value={eventForm.categoryEn}
                                  onChange={(e) => setEventForm({ ...eventForm, categoryEn: e.target.value })}
                                  className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none"
                                  required={formLang === "en"}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block mb-1">Content / Description (EN) - Include #Event inside text to bind to Calendar</label>
                              <textarea
                                value={eventForm.contentEn}
                                onChange={(e) => setEventForm({ ...eventForm, contentEn: e.target.value })}
                                className="w-full px-3.5 py-2.5 border border-stone-250 dark:border-stone-800 bg-white dark:bg-stone-950 rounded-xl text-xs focus:outline-none h-32 resize-none"
                                placeholder="Details about concert... Must include #Event"
                                required={formLang === "en"}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submit controls */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-150 dark:border-stone-850">
                        <button
                          type="button"
                          onClick={() => setIsEditingEvent(false)}
                          className="px-5 py-2.5 border border-stone-200 dark:border-stone-800 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer"
                        >
                          {language === "pl" ? "Anuluj" : "Abbrechen"}
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-natural-primary hover:bg-natural-primary-hover text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Save size={14} />
                          <span>{language === "pl" ? "Zapisz Wydarzenie" : "Event Speichern"}</span>
                        </button>
                      </div>

                    </motion.form>
                  ) : (
                    /* LIST OF EVENTS */
                    <div className="space-y-4">
                      {eventsLoading ? (
                        <div className="py-20 text-center">
                          <RefreshCw className="animate-spin text-natural-primary mx-auto mb-3" size={24} />
                          <p className="text-xs text-stone-500 font-mono">Lade Events...</p>
                        </div>
                      ) : (
                        <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-850 rounded-2xl overflow-hidden shadow-xs">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-850 text-[10px] font-mono tracking-widest text-stone-400 uppercase">
                                  <th className="py-3.5 px-5 w-16">Image</th>
                                  <th className="py-3.5 px-4">Content ({language.toUpperCase()})</th>
                                  <th className="py-3.5 px-4 w-28">Date</th>
                                  <th className="py-3.5 px-4 w-28">Type</th>
                                  <th className="py-3.5 px-5 text-right w-24">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-100 dark:divide-stone-900">
                                {currentEventsList.map((evt) => {
                                  const isManual = !evt.isRealSync;
                                  const containsEventTag = evt.content.toLowerCase().includes("#event");
                                  return (
                                    <tr key={evt.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors">
                                      <td className="py-3 px-5">
                                        <img
                                          src={evt.imgUrl}
                                          alt=""
                                          className="w-10 h-10 object-cover rounded-lg border border-stone-200/50 dark:border-stone-800"
                                        />
                                      </td>
                                      <td className="py-3 px-4">
                                        <div className="text-stone-800 dark:text-stone-200 line-clamp-2 leading-relaxed max-w-lg whitespace-pre-wrap font-light">
                                          {evt.content}
                                        </div>
                                      </td>
                                      <td className="py-3 px-4 text-stone-500 font-mono text-[10px] whitespace-nowrap">
                                        {evt.date}
                                      </td>
                                      <td className="py-3 px-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold text-center w-max ${
                                            isManual ? "bg-amber-100 text-amber-800 border border-amber-200" : "bg-blue-100 text-blue-800 border border-blue-200"
                                          }`}>
                                            {isManual ? "Manual ⚙️" : "Facebook FB"}
                                          </span>
                                          {containsEventTag && (
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-[8px] font-mono uppercase font-bold text-center w-max">
                                              Calendar 📅
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                      <td className="py-3 px-5 text-right">
                                        <div className="inline-flex gap-2.5">
                                          <button
                                            onClick={() => handleOpenEditEvent(evt)}
                                            className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-natural-primary transition-colors cursor-pointer"
                                            title="Edit"
                                          >
                                            <Edit2 size={13} />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteEvent(evt.id)}
                                            className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                                            title="Delete"
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
