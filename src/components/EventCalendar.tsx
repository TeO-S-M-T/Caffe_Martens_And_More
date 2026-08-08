import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, ExternalLink, Clock, Sparkles, Soup } from "lucide-react";
import { useTranslation } from "../i18n";
import { CafeEvent, eventDate, getEventsForMonth, formatPrice } from "../data/events";

/** Local "today" — no longer pinned to a hardcoded date. */
const today = new Date();

export default function EventCalendar() {
  const { language } = useTranslation();

  // Calendar starts on the real current month.
  const [currentDate, setCurrentDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const isViewingCurrentMonth = year === today.getFullYear() && month === today.getMonth();

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

  const currentMonthLabel = `${(monthNames[language] || monthNames.de)[today.getMonth()]} ${today.getFullYear()}`;

  // Localized dictionary for UI elements in calendar
  const dict: Record<string, any> = {
    de: {
      title: "Veranstaltungskalender",
      subtitle: "Planen Sie Ihren Besuch im Café Martens, Goch",
      desc: "Unser Wochenend-Menü und alle besonderen Aktionen auf einen Blick — jedes hervorgehobene Datum zeigt Gericht und Preis.",
      weeklyEventLabel: "Diesen Monat bei uns",
      seeOnFb: "Auf Facebook ansehen",
      noEventSelected: "Kein Termin ausgewählt",
      clickPrompt: "Klicken Sie auf ein hervorgehobenes Datum, um Gericht, Beilagen und Preis anzuzeigen.",
      noEventsThisDay: "An diesem Tag steht nichts Besonderes auf der Karte.",
      noEventsThisMonth: "Für diesen Monat ist noch nichts veröffentlicht.",
      backToToday: `Heute (${currentMonthLabel})`,
      location: "Café Martens & More, Markt 12",
      starterLabel: "Vorspeise inklusive",
      reserve: "Reservierungen: 02823 4191522"
    },
    pl: {
      title: "Kalendarz Wydarzeń",
      subtitle: "Zaplanuj swoją wizytę w Café Martens w Goch",
      desc: "Nasze menu weekendowe i wszystkie akcje specjalne w jednym miejscu — każda podświetlona data pokazuje danie i cenę.",
      weeklyEventLabel: "W tym miesiącu u nas",
      seeOnFb: "Zobacz na Facebooku",
      noEventSelected: "Nie wybrano terminu",
      clickPrompt: "Kliknij podświetloną datę, aby zobaczyć danie, dodatki i cenę.",
      noEventsThisDay: "Tego dnia nie ma nic specjalnego w karcie.",
      noEventsThisMonth: "Na ten miesiąc nic jeszcze nie opublikowano.",
      backToToday: `Dzisiaj (${currentMonthLabel})`,
      location: "Café Martens & More, Markt 12",
      starterLabel: "Przystawka w cenie",
      reserve: "Rezerwacje: 02823 4191522"
    },
    en: {
      title: "Event Calendar",
      subtitle: "Plan your visit to Café Martens in Goch",
      desc: "Our weekend menu and every special in one place — each highlighted date shows the dish and its price.",
      weeklyEventLabel: "This month with us",
      seeOnFb: "View on Facebook",
      noEventSelected: "No date selected",
      clickPrompt: "Click a highlighted date to see the dish, its sides and the price.",
      noEventsThisDay: "Nothing special on the card for this day.",
      noEventsThisMonth: "Nothing published for this month yet.",
      backToToday: `Today (${currentMonthLabel})`,
      location: "Café Martens & More, Markt 12",
      starterLabel: "Starter included",
      reserve: "Reservations: 02823 4191522"
    }
  };

  const currentDict = dict[language] || dict.de;

  // Real events for the month currently in view
  const eventsInCurrentMonth = useMemo(() => getEventsForMonth(year, month), [year, month]);

  const getEventsForDay = (dayNum: number) =>
    eventsInCurrentMonth.filter(ev => eventDate(ev).getDate() === dayNum);

  const activeEvent = useMemo<CafeEvent | null>(() => {
    if (selectedDay === null) return null;
    const dayEvents = getEventsForDay(selectedDay);
    return dayEvents.length > 0 ? dayEvents[0] : null;
  }, [selectedDay, eventsInCurrentMonth]);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const resetToToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(null);
  };

  // Calendar geometry
  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);

  const startOffset = useMemo(() => {
    // European Monday-first calendar
    const rawDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    return rawDay === 0 ? 6 : rawDay - 1;
  }, [year, month]);

  const selectEventFromList = (event: CafeEvent) => {
    const d = eventDate(event);
    setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
    setSelectedDay(d.getDate());
    const widget = document.getElementById("calendar-widget-core");
    if (widget) {
      widget.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const formatEventDate = (ev: CafeEvent) => {
    const d = eventDate(ev);
    const locale = language === "de" ? "de-DE" : language === "pl" ? "pl-PL" : "en-GB";
    return d.toLocaleDateString(locale, { weekday: "long", day: "2-digit", month: "long" });
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

        {/* LEFT COLUMN: INTERACTIVE MONTH GRID */}
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
                {!isViewingCurrentMonth && (
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
                  aria-label="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={nextMonth}
                  className="w-10 h-10 rounded-full border border-natural-border/70 text-natural-text hover:bg-natural-light-hover hover:border-natural-primary/60 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Next month"
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
              {Array.from({ length: startOffset }).map((_, idx) => (
                <div key={`offset-${idx}`} className="aspect-square bg-transparent rounded-2xl" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const matches = getEventsForDay(dayNum);
                const hasEvents = matches.length > 0;
                const isSelected = selectedDay === dayNum;
                const isToday =
                  year === today.getFullYear() &&
                  month === today.getMonth() &&
                  dayNum === today.getDate();

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
                    {isToday && !isSelected && (
                      <div className="absolute inset-0.5 rounded-[14px] border-2 border-natural-primary/45 border-dashed" />
                    )}

                    <div className="self-start text-[11px] font-mono font-bold">
                      {dayNum}
                    </div>

                    {/* Price hint on days that have something on the card */}
                    {hasEvents && (
                      <div className="mt-auto self-center flex flex-col items-center gap-1">
                        <span className={`hidden sm:block text-[8px] font-mono font-bold leading-none ${
                          isSelected ? "text-white/90" : "text-amber-700 dark:text-amber-300"
                        }`}>
                          {formatPrice(matches[0].priceEur, language)}
                        </span>
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
                <span>{language === "pl" ? "Dzień z daniem" : language === "de" ? "Tag mit Gericht" : "Day with a dish"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md border-2 border-natural-primary/45 border-dashed block" />
                <span>{language === "pl" ? "Dzisiaj" : language === "de" ? "Heute" : "Today"}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DETAIL PREVIEW CARD OR SELECTOR */}
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
                      alt={activeEvent.title[language]}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent flex items-end p-6">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-medium tracking-wide bg-amber-700 text-[#fdfcf7] uppercase shadow-xs mb-2 inline-block">
                          {activeEvent.category[language]}
                        </span>
                        <h4 className="font-serif text-lg font-bold text-white leading-tight">
                          {activeEvent.title[language]}
                        </h4>
                      </div>
                    </div>
                    {activeEvent.priceEur !== undefined && (
                      <div className="absolute top-4 right-4 bg-amber-600 text-white text-xs font-mono font-bold tracking-wide px-3 py-1 rounded-full shadow-sm">
                        {formatPrice(activeEvent.priceEur, language)}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Event Metadata (When, Where) */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono border-b border-natural-border/40 pb-5">
                      <div className="flex items-start gap-2 text-natural-text">
                        <Clock size={14} className="text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-natural-muted text-[10px] uppercase font-bold tracking-wider">{language === "de" ? "Datum" : language === "pl" ? "Termin" : "Date"}</p>
                          <p className="font-medium font-sans mt-0.5 capitalize">{formatEventDate(activeEvent)}</p>
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

                    {/* Starter included (Sunday chicken soup) */}
                    {activeEvent.starter && (
                      <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40">
                        <Soup size={15} className="text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-800 dark:text-amber-300">
                            {currentDict.starterLabel}
                          </p>
                          <p className="text-natural-text text-xs mt-0.5 font-medium">
                            {activeEvent.starter[language]}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div className="space-y-1">
                      <p className="text-natural-text text-xs leading-relaxed font-light whitespace-pre-wrap">
                        {activeEvent.description[language]}
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
                    <span>{currentDict.reserve}</span>
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
                      {eventsInCurrentMonth.length > 0 ? currentDict.noEventSelected : currentDict.noEventsThisMonth}
                    </h4>
                    <p className="text-natural-muted text-xs leading-relaxed font-light max-w-xs">
                      {eventsInCurrentMonth.length > 0 ? currentDict.clickPrompt : ""}
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="font-serif text-lg font-bold text-natural-text mb-2">
                      {selectedDay}. {(monthNames[language] || monthNames.de)[month]}
                    </h4>
                    <p className="text-natural-muted text-xs leading-relaxed font-light max-w-xs">
                      {currentDict.noEventsThisDay}
                    </p>
                  </>
                )}

                {/* Shortcut picker list for the month */}
                {eventsInCurrentMonth.length > 0 && (
                  <div className="mt-8 w-full">
                    <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#aa936d] border-b border-natural-border/30 pb-2 mb-3 text-left">
                      {currentDict.weeklyEventLabel} ({eventsInCurrentMonth.length})
                    </p>
                    <div className="space-y-2 text-left max-h-80 overflow-y-auto pr-1">
                      {eventsInCurrentMonth.map((e) => {
                        const d = eventDate(e);
                        return (
                          <button
                            key={e.id}
                            onClick={() => selectEventFromList(e)}
                            className="w-full p-2.5 bg-natural-bg dark:bg-natural-light hover:bg-amber-50/50 dark:hover:bg-amber-950/20 hover:border-amber-400 text-left rounded-xl border border-natural-border/50 transition-all flex items-center justify-between gap-2 text-xs text-natural-text cursor-pointer"
                          >
                            <div className="truncate pr-1 flex-1">
                              <span className="font-mono text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md mr-1.5 shrink-0">
                                {d.getDate()}.{d.getMonth() + 1}
                              </span>
                              <span className="font-medium font-serif">{e.title[language]}</span>
                            </div>
                            <span className="font-mono text-[10px] font-bold text-natural-primary shrink-0">
                              {formatPrice(e.priceEur, language)}
                            </span>
                          </button>
                        );
                      })}
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
