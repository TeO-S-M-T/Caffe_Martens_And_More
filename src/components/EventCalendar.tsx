import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, ExternalLink, Clock, Sparkles } from "lucide-react";
import { FacebookPost } from "../types";
import { useTranslation } from "../i18n";

interface EventCalendarProps {
  posts: FacebookPost[];
}

interface CalendarEvent {
  id: string;
  title: string;
  content: string;
  originalDayStr: string;
  imgUrl: string;
  facebookUrl: string;
  category: string;
  mappedDay: number;
  mappedMonth: number; // 0-indexed (e.g. 5 is June)
  mappedYear: number;
}

export default function EventCalendar({ posts }: EventCalendarProps) {
  const { language } = useTranslation();

  // Selected calendar month/year. Default to June 2026 to align with the current workspace context
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 5, 8));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (5 = June)

  // Selected date on the calendar grid
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Localized Month names
  const monthNames: Record<string, string[]> = {
    de: [
      "Januar", "Februar", "März", "April", "Mai", "Juni",
      "Juli", "August", "September", "Oktober", "November", "Dezember"
    ],
    pl: [
      "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
      "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
    ],
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
  };

  // Localized week days (starting Monday)
  const weekDays: Record<string, string[]> = {
    de: ["MO", "DI", "MI", "DO", "FR", "SA", "SO"],
    pl: ["PN", "WT", "ŚR", "CZ", "PT", "SB", "ND"],
    en: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
  };

  // Localized dictionary for UI elements in calendar
  const dict: Record<string, any> = {
    de: {
      title: "Veranstaltungskalender",
      subtitle: "Planen Sie Ihren Besuch im Café Martens, Goch",
      desc: "Entdecken Sie unsere anstehenden Events, Konzerte, Festivale und Angebote direkt aus unseren Facebook-Updates.",
      weeklyEventLabel: "Highlights diesen Monat",
      allEventsTab: "Alle Aktionen",
      eventTime: "Uhrzeit",
      seeOnFb: "Auf Facebook ansehen",
      noEventSelected: "Keine Veranstaltung ausgewählt",
      clickPrompt: "Klicken Sie auf ein hervorgehobenes Datum mit einem Aktivitätspunkt, um Details anzuzeigen.",
      noEventsThisDay: "Keine geplante Aktivität an diesem Tag.",
      backToToday: "Heute (Juni 2026)",
      location: "Kaffeegarten, Frauenstraße 16",
      featured: "Besonderes Highlight",
      joinUs: "Kommen Sie vorbei!"
    },
    pl: {
      title: "Interaktywny Kalendarz Wydarzeń",
      subtitle: "Zaplanuj swoją wizytę w Café Martens w Goch",
      desc: "Przeglądaj nadchodzące koncerty, festiwale gofrów i promocje wyciągnięte na żywo z profilu na Facebooku.",
      weeklyEventLabel: "Najważniejsze wydarzenia",
      allEventsTab: "Wszystkie akcje",
      eventTime: "Godzina",
      seeOnFb: "Zobacz na Facebooku",
      noEventSelected: "Brak wybranego wydarzenia",
      clickPrompt: "Kliknij na dowolny dzień z bursztynową kropką, aby wyświetlić szczegóły i opis wydarzenia.",
      noEventsThisDay: "Brak zaplanowanych wydarzeń w tym dniu.",
      backToToday: "Dzisiaj (Czerwiec 2026)",
      location: "Ogród kawiarni, Frauenstraße 16",
      featured: "Polecane Wydarzenie",
      joinUs: "Dołącz do nas!"
    },
    en: {
      title: "Interactive Event Calendar",
      subtitle: "Plan your visit to Café Martens in Goch",
      desc: "Discover upcoming acoustic concerts, waffle festivals, and special promotions extracted from our Facebook page.",
      weeklyEventLabel: "Highlights this month",
      allEventsTab: "All Actions",
      eventTime: "Time",
      seeOnFb: "View on Facebook",
      noEventSelected: "No event selected",
      clickPrompt: "Click on any day with an amber highlight dot to preview event details and descriptions.",
      noEventsThisDay: "No events scheduled for this day.",
      backToToday: "Today (June 2026)",
      location: "Cafe Garden, Frauenstraße 16",
      featured: "Featured Night",
      joinUs: "Join the fun!"
    }
  };

  const currentDict = dict[language] || dict.de;

  // Dynamically map Facebook posts that are events to positions in our calendar
  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    // Filter posts for active events
    const eventPosts = posts.filter(post => {
      const text = post.content.toLowerCase();
      const isEventCat = post.category.toLowerCase().includes("event") || 
                         post.category.toLowerCase().includes("wydarzeni") || 
                         post.category.toLowerCase().includes("aktion") ||
                         post.category.toLowerCase().includes("promoc");
      return text.includes("#event") || isEventCat || post.id.includes("event");
    });

    return eventPosts.map((post) => {
      const text = post.content.toLowerCase();
      // Safe default dates in June 2026 to ensure awesome matches out-of-the-box
      let day = 12; // Default to Friday June 12
      let eventMonth = 5; // June is 5 (0-indexed)
      let eventYear = 2026;

      // Smart parsing of Friday vs Sunday
      if (text.includes("freitag") || text.includes("piątek") || text.includes("friday")) {
        day = 12; // Friday, June 12, 2026
      } else if (text.includes("sonntag") || text.includes("niedziela") || text.includes("sunday")) {
        day = 14; // Sunday, June 14, 2026
      } else {
        // Deterministically distribute any other/newly synced events across the month to create a beautiful calendar
        // Hash the ID so it remains persistent
        let hash = 0;
        for (let i = 0; i < post.id.length; i++) {
          hash = post.id.charCodeAt(i) + ((hash << 5) - hash);
        }
        day = Math.abs(hash % 20) + 5; // Day between 5 and 25
      }

      // Title Generation
      let title = "";
      if (language === "de") {
        title = post.content.includes("Konzert") ? "Akustischer Konzertabend 🕯️" : "Hausgemachtes Waffelfestival 🧇";
      } else if (language === "pl") {
        title = post.content.includes("muzyczny") || post.content.includes("koncert") ? "Wieczór Muzyczny przy Świecach 🕯️" : "Rzemieślniczy Festiwal Gofra 🧇";
      } else {
        title = post.content.includes("Acoustic") || post.content.includes("music") ? "Candlelit Acoustic Night 🕯️" : "Artisanal Waffle Festival 🧇";
      }

      // If the post is synced via API, extract some first words
      if (post.isRealSync) {
        const cleanContent = post.content.replace(/✨|#Event|#event/g, "").trim();
        const words = cleanContent.split(" ");
        title = words.slice(0, 4).join(" ") + " ...";
      }

      return {
        id: post.id,
        title,
        content: post.content,
        originalDayStr: post.date,
        imgUrl: post.imgUrl,
        facebookUrl: post.facebookUrl,
        category: post.category,
        mappedDay: day,
        mappedMonth: eventMonth,
        mappedYear: eventYear
      };
    });
  }, [posts, language]);

  // Handle month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const resetToToday = () => {
    setCurrentDate(new Date(2026, 5, 8));
    setSelectedDay(null);
  };

  // Calendar calculations
  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const startOffset = useMemo(() => {
    // Renders European Monday-first calendar
    const rawDay = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday ...
    return rawDay === 0 ? 6 : rawDay - 1;
  }, [year, month]);

  // Find events matching the viewed month/year
  const eventsInCurrentMonth = useMemo(() => {
    return calendarEvents.filter(e => e.mappedMonth === month && e.mappedYear === year);
  }, [calendarEvents, month, year]);

  // Find if a specific calendar day has events
  const getEventsForDay = (dayNum: number) => {
    return eventsInCurrentMonth.filter(e => e.mappedDay === dayNum);
  };

  // Selected event object
  const activeEvent = useMemo(() => {
    if (selectedDay === null) return null;
    const dayEvents = getEventsForDay(selectedDay);
    return dayEvents.length > 0 ? dayEvents[0] : null;
  }, [selectedDay, eventsInCurrentMonth]);

  // Select an event directly from list
  const selectEventFromList = (event: CalendarEvent) => {
    setCurrentDate(new Date(event.mappedYear, event.mappedMonth, 1));
    setSelectedDay(event.mappedDay);
    // Smooth scroll to details on mobile bounds
    const widget = document.getElementById("calendar-widget-core");
    if (widget) {
      widget.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="mt-20 border-t border-natural-border/60 pt-20" id="kalendarz-wydarzen">
      <div className="text-center mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/20 border border-amber-150 dark:border-amber-900/40 rounded-full text-amber-800 dark:text-amber-300 text-xs font-semibold font-mono uppercase tracking-wide mb-3">
          <CalendarIcon size={12} className="animate-pulse text-amber-700" />
          <span>{currentDict.title}</span>
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-natural-text">
          {currentDict.subtitle}
        </h2>
        <p className="text-natural-muted text-sm mt-3 max-w-2xl mx-auto font-light">
          {currentDict.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="calendar-widget-core">
        
        {/* LEFT COLUMN: INTERACTIVE MONTH GRID (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-natural-bg/60 border border-natural-card-border rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            {/* Calendar Month Selector Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-natural-border/50">
              <div className="text-left">
                <h3 className="font-serif text-2xl font-bold text-natural-text">
                  {(monthNames[language] || monthNames.de)[month]} <span className="text-natural-primary/80 font-light font-sans">{year}</span>
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {(month !== 5 || year !== 2026) && (
                  <button 
                    onClick={resetToToday} 
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-natural-light hover:bg-neutral-200 dark:hover:bg-natural-light-hover text-natural-text rounded-full text-[10px] font-mono font-medium tracking-wide transition-all cursor-pointer mr-2 border border-neutral-200 dark:border-natural-border/30"
                  >
                    {currentDict.backToToday}
                  </button>
                )}
                <button
                  onClick={prevMonth}
                  className="w-10 h-10 rounded-full border border-natural-border/70 text-natural-text hover:bg-natural-light-hover hover:border-natural-primary/60 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextMonth}
                  className="w-10 h-10 rounded-full border border-natural-border/70 text-natural-text hover:bg-natural-light-hover hover:border-natural-primary/60 flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Days of Week Row Header */}
            <div className="grid grid-cols-7 gap-1.5 text-center mb-4">
              {(weekDays[language] || weekDays.de).map((dayName, idx) => (
                <div key={idx} className="text-[10px] font-mono tracking-wider font-bold text-natural-muted/80">
                  {dayName}
                </div>
              ))}
            </div>

            {/* Monthly Grid Blocks */}
            <div className="grid grid-cols-7 gap-2">
              {/* Offset days from previous month */}
              {Array.from({ length: startOffset }).map((_, idx) => (
                <div key={`offset-${idx}`} className="aspect-square bg-transparent rounded-2xl" />
              ))}

              {/* Real Month Days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const matches = getEventsForDay(dayNum);
                const hasEvents = matches.length > 0;
                const isSelected = selectedDay === dayNum;
                const isToday = year === 2026 && month === 5 && dayNum === 8;

                return (
                  <button
                    key={`day-${dayNum}`}
                    id={`cal-day-${dayNum}`}
                    onClick={() => setSelectedDay(dayNum)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-between p-2 relative cursor-pointer group transition-all duration-300 ${
                      isSelected
                        ? "bg-natural-primary text-white shadow-md shadow-natural-primary/10 border border-natural-primary scale-102"
                        : hasEvents
                        ? "bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-950 dark:text-amber-200 border border-amber-100 dark:border-amber-900/40 font-bold"
                        : "bg-natural-light/40 hover:bg-natural-light text-natural-text border border-natural-border/40"
                    }`}
                  >
                    {/* Today indicator border */}
                    {isToday && !isSelected && (
                      <div className="absolute inset-0.5 rounded-[14px] border-2 border-natural-primary/45 border-dashed" />
                    )}

                    <div className="self-start text-[11px] font-mono font-bold">
                      {dayNum}
                    </div>

                    {/* Glowing dot for scheduled activity */}
                    {hasEvents && (
                      <div className="mt-auto self-center">
                        <span className={`w-2 h-2 rounded-full block animate-pulse ${
                          isSelected ? "bg-white" : "bg-amber-600"
                        }`} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-natural-border/50 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-natural-muted">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-50 border border-amber-100 block" />
                <span>{language === "pl" ? "Dzień z wydarzeniem" : language === "de" ? "Tag mit Event" : "Day with Event"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md border-2 border-natural-primary/45 border-dashed block" />
                <span>{language === "pl" ? "Dzisiaj" : language === "de" ? "Heute" : "Today"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RICH DETAIL PREVIEW CARD OR SELECTOR (lg:col-span-5) */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {activeEvent ? (
              <motion.div
                key={activeEvent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-natural-light border border-natural-border/70 rounded-[32px] overflow-hidden flex flex-col justify-between h-full shadow-sm"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img 
                      src={activeEvent.imgUrl} 
                      alt={activeEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent flex items-end p-6">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-medium tracking-wide bg-amber-700 text-[#fdfcf7] uppercase shadow-xs mb-2 inline-block">
                          {activeEvent.category}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-white leading-tight">
                          {activeEvent.title}
                        </h4>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-amber-600 text-white text-[8px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                      {currentDict.featured}
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Event Metadata (When, Where) */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b border-natural-border/40 pb-5">
                      <div className="flex items-start gap-2 text-natural-text">
                        <Clock size={14} className="text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-natural-muted text-[10px] uppercase font-bold tracking-wider">{language === "de" ? "Datum & Zeit" : language === "pl" ? "Termin" : "Date & Time"}</p>
                          <p className="font-medium font-sans mt-0.5">{activeEvent.originalDayStr}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-natural-text">
                        <MapPin size={14} className="text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-natural-muted text-[10px] uppercase font-bold tracking-wider">{language === "de" ? "Ort" : language === "pl" ? "Miejsce" : "Location"}</p>
                          <p className="font-medium font-sans mt-0.5">{currentDict.location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Main post description body text */}
                    <div className="space-y-1">
                      <p className="text-natural-text text-xs leading-relaxed font-light whitespace-pre-wrap">
                        {activeEvent.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Event Actions panel block */}
                <div className="p-6 bg-natural-light-hover/40 border-t border-natural-border/40 flex flex-col gap-3">
                  <a
                    href={activeEvent.facebookUrl}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="w-full py-3 bg-natural-primary hover:bg-natural-primary-hover text-[#fdfcf7] rounded-2xl text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>{currentDict.seeOnFb}</span>
                    <ExternalLink size={12} />
                  </a>
                  <p className="text-[10px] font-mono text-center text-natural-muted/80 font-light flex items-center justify-center gap-1">
                    <Sparkles size={11} className="text-amber-600" />
                    <span>{currentDict.joinUs}</span>
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="bg-natural-light/20 border border-natural-border/50 rounded-[32px] p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-natural-light border border-natural-border/70 flex items-center justify-center text-natural-primary/65 mb-4 shadow-xs">
                  <CalendarIcon size={24} className="stroke-[1.3]" />
                </div>
                
                {selectedDay === null ? (
                  <>
                    <h4 className="font-serif text-lg font-bold text-natural-text mb-2">
                      {currentDict.noEventSelected}
                    </h4>
                    <p className="text-natural-muted text-xs leading-relaxed font-light max-w-xs">
                      {currentDict.clickPrompt}
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="font-serif text-lg font-bold text-natural-text mb-2">
                      {language === "de" ? `Tag ${selectedDay}. ${(monthNames[language] || monthNames.de)[month]}` : language === "pl" ? `${selectedDay} Dzień Miesiąca` : `Day ${selectedDay}`}
                    </h4>
                    <p className="text-natural-muted text-xs leading-relaxed font-light max-w-xs">
                      {currentDict.noEventsThisDay}
                    </p>
                  </>
                )}

                {/* Helpful shortcut picker list when not selected */}
                {eventsInCurrentMonth.length > 0 && (
                  <div className="mt-8 w-full">
                    <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#aa936d] border-b border-natural-border/30 pb-2 mb-3 text-left">
                      {currentDict.weeklyEventLabel} ({eventsInCurrentMonth.length})
                    </p>
                    <div className="space-y-2 text-left">
                      {eventsInCurrentMonth.map((e) => (
                        <button
                          key={e.id}
                          onClick={() => selectEventFromList(e)}
                          className="w-full p-2.5 bg-natural-bg dark:bg-natural-light hover:bg-amber-50/50 dark:hover:bg-amber-950/20 hover:border-amber-400 text-left rounded-xl border border-natural-border/50 transition-all flex items-center justify-between text-xs text-natural-text cursor-pointer"
                        >
                          <div className="truncate pr-2">
                            <span className="font-mono text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md mr-1.5 shrink-0">
                              {e.mappedDay}.{e.mappedMonth + 1}
                            </span>
                            <span className="font-medium font-serif">{e.title}</span>
                          </div>
                          <ChevronRight size={12} className="text-natural-primary shrink-0 opacity-85" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
