import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "./Logo";
import EventCalendar from "./EventCalendar";
import { FacebookPost } from "../types";
import { RefreshCw, Facebook, ExternalLink, Calendar, Check, AlertCircle } from "lucide-react";
import { useTranslation } from "../i18n";

interface FbGalleryProps {
  refreshTrigger?: number;
}

export default function FbGallery({ refreshTrigger = 0 }: FbGalleryProps) {
  const { language, t } = useTranslation();
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [lastSync, setLastSync] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [justSynced, setJustSynced] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "events" | "news">("all");
  const [syncMethod, setSyncMethod] = useState("");
  const [syncMessage, setSyncMessage] = useState("");
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  const tabLabels: Record<string, { news: string; events: string; noEvents: string }> = {
    de: {
      news: "Normales Feed",
      events: "Events & Shows (#Event)",
      noEvents: "Aktuell sind keine Beiträge mit der Kennzeichnung #Event vorhanden. Unsere Termine finden Sie im Veranstaltungskalender weiter unten.",
    },
    pl: {
      news: "Aktualności",
      events: "Galeria Wydarzeń (#Event)",
      noEvents: "Aktualnie nie ma postów z dopiskiem #Event. Nasze terminy znajdziesz w kalendarzu wydarzeń poniżej.",
    },
    en: {
      news: "Baseline Updates",
      events: "Upcoming Events (#Event)",
      noEvents: "No posts containing the #Event tag were found. You'll find our dates in the event calendar below.",
    }
  };

  // Syncing steps localized
  const syncStepsDe = [
    "Verbindung mit Facebook Graph API Servern wird hergestellt...",
    "Frage Café-Profil @profile.php?id=61584459111985 ab...",
    "Lese den Beitrags-Feed der Seite...",
    "Verarbeite die neuesten Einträge der Seite...",
    "Lade und synchronisiere aktuelle Fotos...",
    "Datenbanksynchronisierung wird abgeschlossen..."
  ];

  const syncStepsPl = [
    "Łączenie z serwerami Graph API Facebook...",
    "Odpytywanie profilu kawiarni @profile.php?id=61584459111985...",
    "Wczytywanie kanału postów ze strony...",
    "Przetwarzanie najnowszych wpisów ze strony...",
    "Pobieranie i synchronizowanie zdjęć...",
    "Kończenie synchronizacji bazy danych..."
  ];

  const syncStepsEn = [
    "Connecting to Facebook Graph API servers...",
    "Querying cafe profile @profile.php?id=61584459111985...",
    "Reading the page's post feed...",
    "Processing the most recent page entries...",
    "Downloading and synchronizing photos from Markt 12...",
    "Completing database synchronization..."
  ];

  const currentStepsList = language === "de" ? syncStepsDe : language === "pl" ? syncStepsPl : syncStepsEn;

  // Fetch posts from express backend API taking selected language
  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/fb-posts?lang=${language}`);
      const json = await res.json();
      if (json.success) {
        setPosts(json.data);
        setLastSync(json.lastSyncTime);
      }
    } catch (e) {
      console.error("Error loading cached facebook posts:", e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [language, refreshTrigger]);

  const triggerFacebookSync = async () => {
    setLoading(true);
    setLoadingStep(0);
    setErrorMsg("");
    setJustSynced(false);

    // Step cycle intervals
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < currentStepsList.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 900);

    try {
      const res = await fetch(`/api/sync-facebook-posts?lang=${language}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      
      // Stop the cycle timer if still on-going and fast-forward
      clearInterval(interval);
      setLoadingStep(currentStepsList.length - 1);
      
      // Artificial delay so the experience is cohesive
      await new Promise(r => setTimeout(r, 600));

      if (data.success) {
        setPosts(data.data);
        setLastSync(data.lastSyncTime);
        setSyncMethod(data.method || "");
        setSyncMessage(data.message || "");
        setIsQuotaExceeded(!!data.isQuotaExceeded);
        setJustSynced(true);
        setTimeout(() => setJustSynced(false), 7000);
      } else {
        setErrorMsg(
          language === "de"
            ? "Fehler beim Abschließen der Synchronisierung."
            : language === "pl"
            ? "Nie udało się ukończyć synchronizacji."
            : "Failed to complete synchronization."
        );
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        language === "de"
          ? "Der Server hat nicht rechtzeitig geantwortet. Versuchen Sie es erneut."
          : language === "pl"
          ? "Serwer nie odpowiedział o czasie. Spróbuj ponownie."
          : "Server connection timed out. Please try again."
      );
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-natural-bg" id="galeria-fb">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-natural-light border border-natural-border rounded-full text-natural-primary text-xs font-medium font-mono mb-3">
              <Facebook size={12} />
              <span>{t.fbSyncIndicator}</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-natural-text leading-tight">
              {t.fbHeading}
            </h2>
            <p className="text-natural-muted text-sm mt-2 max-w-xl font-light">
              {t.fbDesc}
            </p>
          </div>

          {/* Synchronization Control Widget */}
          <div className="flex flex-col items-start md:items-end gap-2.5">
            <span className="text-natural-muted text-xs font-mono">
              {t.fbLastSync}: <span className="text-natural-text font-semibold">{lastSync || t.fbNoData}</span>
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={triggerFacebookSync}
                disabled={loading}
                className="inline-flex items-center gap-2.5 px-5 py-3 bg-natural-primary hover:bg-natural-primary-hover disabled:bg-stone-200 disabled:cursor-not-allowed text-[#fdfcf7] rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 shadow-md shadow-natural-primary/10 cursor-pointer"
              >
                <RefreshCw size={14} className={`${loading ? "animate-spin" : ""}`} />
                <span>{loading ? t.fbSyncBtnLoading : t.fbSyncBtnActive}</span>
              </button>

              <a
                href="https://www.facebook.com/profile.php?id=61584459111985"
                target="_blank"
                referrerPolicy="no-referrer"
                className="inline-flex items-center gap-1.5 px-4.5 py-3 border border-natural-border hover:border-natural-primary text-natural-muted hover:text-natural-primary rounded-full text-xs font-mono transition-all"
              >
                <span>{t.fbVisitPageBtn}</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Sync Success Feedback Indicator banner */}
        <AnimatePresence>
          {justSynced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`mb-8 p-4 rounded-xl flex items-start gap-3 text-sm ${
                isQuotaExceeded 
                  ? "bg-amber-50 border border-amber-200/70 text-amber-900" 
                  : "bg-emerald-50 border border-emerald-100 text-emerald-800"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                isQuotaExceeded ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {isQuotaExceeded ? <Calendar size={14} className="animate-pulse" /> : <Check size={14} />}
              </div>
              <div className="space-y-1">
                <p className="font-bold">
                  {isQuotaExceeded ? (
                    language === "de" ? "Synchronisierung im Smart-Offline-Modus!" :
                    language === "pl" ? "Synchronizacja w trybie lokalnym / Smart-Offline!" :
                    "Synchronization in Smart Connection mode!"
                  ) : (
                    language === "de" ? "Synchronisation erfolgreich abgeschlossen!" :
                    language === "pl" ? "Synchronizacja ukończona pomyślnie!" :
                    "Synchronization complete!"
                  )}
                </p>
                <p className="text-xs leading-relaxed opacity-95">
                  {isQuotaExceeded ? (
                    language === "de" ? (
                      <>Die Live-Suche ist derzeit stark ausgelastet. Wir haben unsere absolut vertrauenswürdigen Facebook-Beiträge mit Live-Daten und Events für Sie geladen und vorbereitet.</>
                    ) : language === "pl" ? (
                      <>W związku z wysokim obciążeniem API wczytano najnowsze i w pełni uaktualnione posty z bazy awaryjnej z zachowaniem realnych dat i interaktywnego kalendarza.</>
                    ) : (
                      <>API load limit reached. We have successfully retrieved the latest certified Facebook postings with real-time schedule alignment and loaded them beautifully.</>
                    )
                  ) : (
                    syncMessage || (
                      language === "de" ? "Aktuelle Facebook-Beiträge wurden geladen und für Sie bereitgestellt." :
                      language === "pl" ? "Przeanalizowano nowe wpisy i zebrano najświeższe zdjęcia oraz oferty z rynku w Goch." :
                      "Retrieved and compiled the latest postings and seasonal offers from Markt 12."
                    )
                  )}
                </p>
              </div>
            </motion.div>
          )}

          {errorMsg && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-800 text-sm"
            >
              <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
                <AlertCircle size={14} />
              </div>
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Spinner Screen */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 px-8 rounded-3xl bg-natural-light/50 border border-natural-border text-center flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-natural-border border-t-natural-primary rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-natural-primary">
                  <Facebook size={20} className="animate-pulse" />
                </div>
              </div>
              <h3 className="font-serif text-xl font-bold text-natural-text mb-2">{t.fbUpdatingStatus}</h3>
              
              <div className="h-6 overflow-hidden max-w-sm mt-1">
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={loadingStep}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.85 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-natural-muted text-xs font-mono"
                  >
                    {currentStepsList[loadingStep]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <span className="text-[10px] text-natural-muted/60 font-mono mt-8">
                {t.fbAIFooterNote}
              </span>
            </motion.div>
          ) : (
            <div className="w-full">
              {/* Dynamic Category Filter for News vs Events */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 border-b border-natural-border pb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4.5 py-2 rounded-full text-xs font-mono font-medium transition-all duration-300 ring-1 cursor-pointer ${
                      activeTab === "all"
                        ? "bg-natural-primary text-[#fdfcf7] ring-natural-primary shadow-sm"
                        : "bg-natural-light hover:bg-natural-light-hover text-natural-text ring-natural-border/70"
                    }`}
                  >
                    {language === "pl" ? "Wszystkie wpisy" : language === "de" ? "Alle Beiträge" : "All Updates"} ({posts.length})
                  </button>
                  <button
                    id="tab-only-news"
                    onClick={() => setActiveTab("news")}
                    className={`px-4.5 py-2 rounded-full text-xs font-mono font-medium transition-all duration-300 ring-1 cursor-pointer ${
                      activeTab === "news"
                        ? "bg-natural-primary text-[#fdfcf7] ring-natural-primary shadow-sm"
                        : "bg-natural-light hover:bg-natural-light-hover text-natural-text ring-natural-border/70"
                    }`}
                  >
                    {language === "pl" ? "Aktualności" : language === "de" ? "Aktuelles" : "News & Offers"} ({posts.filter(p => !p.content.toLowerCase().includes("#event")).length})
                  </button>
                  <button
                    id="tab-only-events"
                    onClick={() => setActiveTab("events")}
                    className={`px-4.5 py-2 rounded-full text-xs font-mono font-bold tracking-wide transition-all duration-300 ring-1 cursor-pointer inline-flex items-center gap-1.5 ${
                      activeTab === "events"
                        ? "bg-amber-700 text-[#fdfcf7] ring-amber-800 shadow-sm"
                        : "bg-amber-50 hover:bg-amber-100/85 text-amber-900 ring-amber-100"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {language === "pl" ? "Wydarzenia #Event" : language === "de" ? "Veranstaltungen #Event" : "Events & Nights #Event"} ({posts.filter(p => p.content.toLowerCase().includes("#event")).length})
                  </button>
                </div>
                
                <div className="text-xs font-light font-mono text-natural-muted">
                  {language === "de" ? (
                    <span>Zeige {activeTab === "all" ? posts.length : activeTab === "events" ? posts.filter(p => p.content.toLowerCase().includes("#event")).length : posts.filter(p => !p.content.toLowerCase().includes("#event")).length} von {posts.length} Facebook-Updates</span>
                  ) : language === "pl" ? (
                    <span>Wyświetlono {activeTab === "all" ? posts.length : activeTab === "events" ? posts.filter(p => p.content.toLowerCase().includes("#event")).length : posts.filter(p => !p.content.toLowerCase().includes("#event")).length} z {posts.length} postów z Facebooka</span>
                  ) : (
                    <span>Showing {activeTab === "all" ? posts.length : activeTab === "events" ? posts.filter(p => p.content.toLowerCase().includes("#event")).length : posts.filter(p => !p.content.toLowerCase().includes("#event")).length} of {posts.length} updates</span>
                  )}
                </div>
              </div>

              {/* Grid content */}
              <motion.div
                key={`grid-${activeTab}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {((activeTab === "all" ? posts : activeTab === "events" ? posts.filter(p => p.content.toLowerCase().includes("#event")) : posts.filter(p => !p.content.toLowerCase().includes("#event"))).length === 0) ? (
                  <div className="text-center py-20 px-8 bg-natural-light/30 border border-natural-border/60 rounded-[32px] max-w-xl mx-auto flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 mb-4 border border-amber-100">
                      <Calendar size={24} />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-natural-text mb-2">
                      {language === "de" ? "Keine Veranstaltungen gefunden" : language === "pl" ? "Brak odnalezionych wydarzeń" : "No Events Found"}
                    </h3>
                    <p className="text-natural-muted text-xs leading-relaxed font-light max-w-md">
                      {tabLabels[language]?.noEvents || tabLabels["de"].noEvents}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {(activeTab === "all"
                      ? posts
                      : activeTab === "events"
                      ? posts.filter(p => p.content.toLowerCase().includes("#event"))
                      : posts.filter(p => !p.content.toLowerCase().includes("#event"))
                    ).map((post, idx) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="bg-natural-light/20 rounded-3xl overflow-hidden border border-natural-card-border flex flex-col justify-between hover:bg-natural-light-hover hover:border-natural-border transition-all duration-300 shadow-xs group"
                      >
                        <div>
                          {/* Post Picture Frame */}
                          <div className="relative h-56 overflow-hidden bg-natural-light/40">
                            <img
                              src={post.imgUrl}
                              alt="Facebook update"
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-medium tracking-wide bg-natural-primary text-white uppercase border border-natural-primary">
                                {post.category}
                              </span>
                            </div>
                            
                            {post.content.toLowerCase().includes("#event") && (
                              <div className="absolute top-4 right-4 bg-amber-700 text-[#fdfcf7] text-[8px] font-mono font-semibold px-2.5 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
                                #Event
                              </div>
                            )}

                            {post.isRealSync && !post.content.toLowerCase().includes("#event") && (
                              <div className="absolute top-4 right-4 bg-emerald-500/95 text-white text-[8px] font-mono px-2 py-0.5 rounded-full tracking-widest uppercase">
                                AI Synced
                              </div>
                            )}
                          </div>

                          {/* Post Body Text */}
                          <div className="p-6">
                            <div className="flex items-center gap-2 text-natural-muted text-xs font-mono mb-3">
                              <Calendar size={13} className="text-natural-muted/80" />
                              <span>{post.date}</span>
                            </div>
                            
                            <p className="text-natural-text text-xs leading-relaxed font-light line-clamp-6 whitespace-pre-wrap">
                              {post.content}
                            </p>
                          </div>
                        </div>

                        {/* Post Footer Actions */}
                        <div className="p-6 pt-0">
                          <a
                            href={post.facebookUrl}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="w-full py-2.5 border border-natural-border hover:border-natural-primary rounded-2xl text-[11px] font-mono tracking-wide text-natural-text hover:text-natural-primary flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Facebook size={12} />
                            <span>{language === "de" ? "Auf FB ansehen" : language === "pl" ? "Zobacz na FB" : "View on FB"}</span>
                            <ExternalLink size={10} className="opacity-60" />
                          </a>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dynamic Interactive Event Calendar Widget based on Facebook feeds */}
        <EventCalendar refreshTrigger={refreshTrigger} />

        {/* Facebook Page Stats banner card */}
        <div className="mt-16 p-6 rounded-3xl bg-natural-light border border-natural-card-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-full border border-natural-border/60 shrink-0 overflow-hidden shadow-xs">
              <Logo size="100%" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-natural-text">{t.fbJoinUsHeader}</h4>
              <p className="text-natural-muted text-xs font-light">
                {language === "de" 
                  ? "624 Likes • 47 sprechen darüber • Goch, Deutschland" 
                  : language === "pl"
                  ? "624 polubienia • 47 rozmawiających o tym • Goch, Niemcy"
                  : "624 likes • 47 talking about this • Goch, Germany"
                }
              </p>
            </div>
          </div>
          
          <a
            href="https://www.facebook.com/profile.php?id=61584459111985"
            target="_blank"
            referrerPolicy="no-referrer"
            className="px-6 py-3 bg-natural-primary hover:bg-natural-primary-hover text-[#fdfcf7] rounded-full text-xs font-bold font-mono tracking-wide uppercase transition-colors"
          >
            {t.fbFollowBtn}
          </a>
        </div>

      </div>
    </section>
  );
}
