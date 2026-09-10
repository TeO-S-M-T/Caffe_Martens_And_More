/**
 * Language keys used by the event records. Declared locally (rather than
 * imported from i18n) so the Express server can import this module without
 * pulling React into the server bundle.
 */
export type EventLang = "de" | "pl" | "en";

/**
 * Real, editable event data for the café calendar.
 *
 * This replaces the previous behaviour where "events" were invented on the fly
 * from Facebook posts and scattered across June 2026 by a hash function.
 * Everything the calendar shows now comes from this file.
 *
 * To publish a new month: append entries below. `date` is a plain ISO day
 * (no timezone), so it renders identically everywhere.
 *
 * NOTE: imgUrl values reuse stock photos already used elsewhere on the site.
 * Swap them for real photos of the actual dishes when you have them.
 */

export type CafeEventKind = "weekend-menu" | "concert" | "special";

export interface CafeEvent {
  id: string;
  /** ISO day, e.g. "2026-08-01" */
  date: string;
  kind: CafeEventKind;
  /** Main course price in EUR; omitted for events without a fixed price */
  priceEur?: number;
  imgUrl: string;
  facebookUrl: string;
  /** Headline shown on the calendar card */
  title: Record<EventLang, string>;
  /** Longer body text */
  description: Record<EventLang, string>;
  /** Optional starter served alongside (e.g. the Sunday chicken soup) */
  starter?: Record<EventLang, string>;
  /** Badge label */
  category: Record<EventLang, string>;
}

const FB_URL = "https://www.facebook.com/profile.php?id=61584459111985";

const IMG = {
  meat: "https://images.unsplash.com/photo-1626700051175-6518c4793f0f?q=80&w=600&auto=format&fit=crop",
  soup: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop",
  pasta: "https://images.unsplash.com/photo-1571115177098-24ec42095185?q=80&w=600&auto=format&fit=crop",
  poultry: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=600&auto=format&fit=crop"
};

const CAT_LUNCH: Record<EventLang, string> = {
  de: "Wochenend-Menü",
  pl: "Menu weekendowe",
  en: "Weekend Menu"
};

/** The chicken soup (rosół) served with every Sunday main course. */
const SUNDAY_SOUP: Record<EventLang, string> = {
  de: "Hausgemachte Hühnersuppe (Rosół)",
  pl: "Domowy rosół",
  en: "Homemade chicken soup (Rosół)"
};

export const CAFE_EVENTS: CafeEvent[] = [
  // ---------------------------------------------------------------- August 2026
  {
    id: "wm-2026-08-01",
    date: "2026-08-01",
    kind: "weekend-menu",
    priceEur: 12.9,
    imgUrl: IMG.pasta,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    title: {
      de: "Łazanki mit Weißkohl und Wurst",
      pl: "Łazanki z białą kapustą i kiełbasą",
      en: "Łazanki with white cabbage and sausage"
    },
    description: {
      de: "Hausgemachte Łazanki-Nudeln mit geschmortem Weißkohl und kräftiger Wurst — ein klassisches, herzhaftes Samstagsgericht.",
      pl: "Domowe łazanki z duszoną białą kapustą i aromatyczną kiełbasą — klasyka sobotniego obiadu.",
      en: "Homemade Łazanki noodles with braised white cabbage and hearty sausage — a classic, filling Saturday dish."
    }
  },
  {
    id: "wm-2026-08-02",
    date: "2026-08-02",
    kind: "weekend-menu",
    priceEur: 21.9,
    imgUrl: IMG.meat,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    starter: SUNDAY_SOUP,
    title: {
      de: "Rinderroulade mit Schlesischen Klößen",
      pl: "Rolada wołowa ze śląskimi kluskami",
      en: "Beef roulade with Silesian dumplings"
    },
    description: {
      de: "Zarte Rinderroulade mit Schlesischen Klößen und Roter Bete. Vorweg servieren wir unsere hausgemachte Hühnersuppe.",
      pl: "Delikatna rolada wołowa ze śląskimi kluskami i burakami. Na przystawkę domowy rosół.",
      en: "Tender beef roulade with Silesian dumplings and beetroot. Served after our homemade chicken soup."
    }
  },
  {
    id: "wm-2026-08-08",
    date: "2026-08-08",
    kind: "weekend-menu",
    priceEur: 6.9,
    imgUrl: IMG.soup,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    title: {
      de: "Erbsensuppe",
      pl: "Zupa grochowa",
      en: "Pea soup"
    },
    description: {
      de: "Deftige Erbsensuppe mit Würstchen und frischem Gemüse — wärmend, sättigend und hausgemacht.",
      pl: "Sycąca zupa grochowa z kiełbaskami i świeżymi warzywami — rozgrzewająca i domowa.",
      en: "Hearty pea soup with sausage and fresh vegetables — warming, filling and homemade."
    }
  },
  {
    id: "wm-2026-08-09",
    date: "2026-08-09",
    kind: "weekend-menu",
    priceEur: 16.9,
    imgUrl: IMG.meat,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    starter: SUNDAY_SOUP,
    title: {
      de: "Schweineschnitzel mit Erbsen & Möhren",
      pl: "Kotlet schabowy z groszkiem i marchewką",
      en: "Pork schnitzel with peas & carrots"
    },
    description: {
      de: "Goldbraunes Schweineschnitzel mit Erbsen & Möhren, Salzkartoffeln und frischem Salat. Vorweg unsere hausgemachte Hühnersuppe.",
      pl: "Złocisty kotlet schabowy z groszkiem i marchewką, ziemniakami i świeżą sałatką. Na przystawkę domowy rosół.",
      en: "Golden pork schnitzel with peas & carrots, boiled potatoes and fresh salad. Served after our homemade chicken soup."
    }
  },
  {
    id: "wm-2026-08-15",
    date: "2026-08-15",
    kind: "weekend-menu",
    priceEur: 12.9,
    imgUrl: IMG.pasta,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    title: {
      de: "Spaghetti Bolognese",
      pl: "Spaghetti Bolognese",
      en: "Spaghetti Bolognese"
    },
    description: {
      de: "Unsere Spaghetti Bolognese mit lange geschmorter Hackfleischsauce und frisch geriebenem Käse.",
      pl: "Nasze spaghetti bolognese z długo duszonym sosem mięsnym i świeżo startym serem.",
      en: "Our spaghetti bolognese with slow-simmered meat sauce and freshly grated cheese."
    }
  },
  {
    id: "wm-2026-08-16",
    date: "2026-08-16",
    kind: "weekend-menu",
    priceEur: 16.9,
    imgUrl: IMG.poultry,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    starter: SUNDAY_SOUP,
    title: {
      de: "Hähnchenbrust mit Kroketten",
      pl: "Pierś z kurczaka z krokietami",
      en: "Chicken breast with croquettes"
    },
    description: {
      de: "Gegrillte Hähnchenbrust mit knusprigen Kroketten und frischem Salat. Vorweg unsere hausgemachte Hühnersuppe.",
      pl: "Grillowana pierś z kurczaka z chrupiącymi krokietami i świeżą sałatką. Na przystawkę domowy rosół.",
      en: "Grilled chicken breast with crispy croquettes and fresh salad. Served after our homemade chicken soup."
    }
  },
  {
    id: "wm-2026-08-22",
    date: "2026-08-22",
    kind: "weekend-menu",
    priceEur: 6.9,
    imgUrl: IMG.soup,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    title: {
      de: "Kartoffelsuppe",
      pl: "Zupa ziemniaczana",
      en: "Potato soup"
    },
    description: {
      de: "Cremige Kartoffelsuppe nach Hausrezept, fein abgeschmeckt und mit frischen Kräutern serviert.",
      pl: "Kremowa zupa ziemniaczana według domowego przepisu, doprawiona i podana ze świeżymi ziołami.",
      en: "Creamy potato soup from our house recipe, finely seasoned and served with fresh herbs."
    }
  },
  {
    id: "wm-2026-08-23",
    date: "2026-08-23",
    kind: "weekend-menu",
    priceEur: 17.9,
    imgUrl: IMG.meat,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    starter: SUNDAY_SOUP,
    title: {
      de: "Schweinenacken mit Schlesischen Klößen",
      pl: "Karkówka ze śląskimi kluskami",
      en: "Pork neck with Silesian dumplings"
    },
    description: {
      de: "Saftiger Schweinenacken mit Schlesischen Klößen und Rotkohl. Vorweg unsere hausgemachte Hühnersuppe.",
      pl: "Soczysta karkówka ze śląskimi kluskami i czerwoną kapustą. Na przystawkę domowy rosół.",
      en: "Juicy pork neck with Silesian dumplings and red cabbage. Served after our homemade chicken soup."
    }
  },
  {
    id: "wm-2026-08-29",
    date: "2026-08-29",
    kind: "weekend-menu",
    priceEur: 14.9,
    imgUrl: IMG.meat,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    title: {
      de: "Rindergulasch mit Reis",
      pl: "Gulasz wołowy z ryżem",
      en: "Beef goulash with rice"
    },
    description: {
      de: "Langsam geschmortes Rindergulasch mit Reis — kräftig gewürzt und wunderbar zart.",
      pl: "Wolno duszony gulasz wołowy z ryżem — mocno przyprawiony i wyjątkowo delikatny.",
      en: "Slow-braised beef goulash with rice — richly spiced and beautifully tender."
    }
  },
  {
    id: "wm-2026-08-30",
    date: "2026-08-30",
    kind: "weekend-menu",
    priceEur: 18.9,
    imgUrl: IMG.meat,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    starter: SUNDAY_SOUP,
    title: {
      de: "Bauernschnitzel mit Bratkartoffeln",
      pl: "Kotlet po chłopsku z pieczonymi ziemniakami",
      en: "Farmer's schnitzel with fried potatoes"
    },
    description: {
      de: "Bauernschnitzel mit Speck, Spiegelei und knusprigen Bratkartoffeln. Vorweg unsere hausgemachte Hühnersuppe.",
      pl: "Kotlet po chłopsku z boczkiem, jajkiem sadzonym i chrupiącymi ziemniakami. Na przystawkę domowy rosół.",
      en: "Farmer's schnitzel with bacon, fried egg and crispy fried potatoes. Served after our homemade chicken soup."
    }
  },

  // ------------------------------------------------------------- September 2026
  // Przepisane 1:1 z plakatu „MITTAGESSEN IM SEPTEMBER / HAUSGEMACHT MIT LIEBE".
  // Ceny i skład dań pochodzą z plakatu — nic nie jest zmyślone. Każda niedziela
  // z rosołem, dokładnie tak, jak plakat pokazuje „Hühnersuppe +" przy każdym
  // niedzielnym daniu. Soboty i niedziele potwierdzone kalendarzem 2026.
  {
    id: "wm-2026-09-05",
    date: "2026-09-05",
    kind: "weekend-menu",
    priceEur: 15.0,
    imgUrl: IMG.pasta,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    title: {
      de: "Nudeln mit Hähnchen und Spinat",
      pl: "Makaron z kurczakiem i szpinakiem",
      en: "Pasta with chicken and spinach"
    },
    description: {
      de: "Penne in einer cremigen Sauce mit zartem Hähnchen und frischem Spinat.",
      pl: "Penne w kremowym sosie z delikatnym kurczakiem i świeżym szpinakiem.",
      en: "Penne in a creamy sauce with tender chicken and fresh spinach."
    }
  },
  {
    id: "wm-2026-09-06",
    date: "2026-09-06",
    kind: "weekend-menu",
    priceEur: 17.9,
    imgUrl: IMG.meat,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    starter: SUNDAY_SOUP,
    title: {
      de: "Pilzkotelett mit Kartoffeln und Salat",
      pl: "Kotlet z pieczarkami, ziemniaki i surówka",
      en: "Mushroom cutlet with potatoes and salad"
    },
    description: {
      de: "Pilzkotelett mit Kartoffeln und Salat. Vorweg servieren wir unsere hausgemachte Hühnersuppe.",
      pl: "Kotlet z pieczarkami z ziemniakami i surówką. Na przystawkę domowy rosół.",
      en: "Mushroom cutlet with potatoes and salad. Served after our homemade chicken soup."
    }
  },
  {
    id: "wm-2026-09-12",
    date: "2026-09-12",
    kind: "weekend-menu",
    priceEur: 7.5,
    imgUrl: IMG.soup,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    title: {
      de: "Zwiebelsuppe",
      pl: "Zupa cebulowa",
      en: "Onion soup"
    },
    description: {
      de: "Herzhafte französische Zwiebelsuppe mit überbackenem Käsebrot.",
      pl: "Sycąca francuska zupa cebulowa z grzanką zapiekaną serem.",
      en: "Hearty French onion soup with cheese-gratinated bread."
    }
  },
  {
    id: "wm-2026-09-13",
    date: "2026-09-13",
    kind: "weekend-menu",
    priceEur: 18.9,
    imgUrl: IMG.meat,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    starter: SUNDAY_SOUP,
    title: {
      de: "Nackenkotelett mit Kluski und angemachtem Weißkohl",
      pl: "Karkówka z kluskami i kapustą zasmażaną",
      en: "Pork neck cutlet with kluski and dressed white cabbage"
    },
    description: {
      de: "Nackenkotelett mit Kluski und angemachtem Weißkohl. Vorweg servieren wir unsere hausgemachte Hühnersuppe.",
      pl: "Karkówka z kluskami i białą kapustą zasmażaną. Na przystawkę domowy rosół.",
      en: "Pork neck cutlet with kluski and dressed white cabbage. Served after our homemade chicken soup."
    }
  },
  {
    id: "wm-2026-09-19",
    date: "2026-09-19",
    kind: "weekend-menu",
    priceEur: 11.9,
    imgUrl: IMG.soup,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    title: {
      de: "Bauerntopf",
      pl: "Garnek chłopski",
      en: "Farmer's pot"
    },
    description: {
      de: "Deftiger Eintopf mit Schweinefleisch, Gemüse, Kartoffeln und Kielbasa.",
      pl: "Treściwy jednogarnkowiec z wieprzowiną, warzywami, ziemniakami i kiełbasą.",
      en: "Hearty one-pot stew with pork, vegetables, potatoes and kielbasa."
    }
  },
  {
    id: "wm-2026-09-20",
    date: "2026-09-20",
    kind: "weekend-menu",
    priceEur: 22.5,
    imgUrl: IMG.meat,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    starter: SUNDAY_SOUP,
    title: {
      de: "Rouladen mit Kluski und Rotkohl",
      pl: "Rolady z kluskami i czerwoną kapustą",
      en: "Roulades with kluski and red cabbage"
    },
    description: {
      de: "Rouladen mit Kluski und Rotkohl. Vorweg servieren wir unsere hausgemachte Hühnersuppe.",
      pl: "Rolady z kluskami i czerwoną kapustą. Na przystawkę domowy rosół.",
      en: "Roulades with kluski and red cabbage. Served after our homemade chicken soup."
    }
  },
  {
    id: "wm-2026-09-26",
    date: "2026-09-26",
    kind: "weekend-menu",
    priceEur: 7.5,
    imgUrl: IMG.soup,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    title: {
      de: "Gurkensuppe",
      pl: "Zupa ogórkowa",
      en: "Cucumber soup"
    },
    description: {
      de: "Traditionelle polnische Gurkensuppe mit Kartoffeln, Karotten und Dill.",
      pl: "Tradycyjna zupa ogórkowa z ziemniakami, marchewką i koperkiem.",
      en: "Traditional Polish cucumber soup with potatoes, carrots and dill."
    }
  },
  {
    id: "wm-2026-09-27",
    date: "2026-09-27",
    kind: "weekend-menu",
    priceEur: 18.9,
    imgUrl: IMG.poultry,
    facebookUrl: FB_URL,
    category: CAT_LUNCH,
    starter: SUNDAY_SOUP,
    title: {
      de: "Devolay mit Kartoffeln und Salat",
      pl: "Dewolaj z ziemniakami i surówką",
      en: "Chicken Kiev with potatoes and salad"
    },
    description: {
      de: "Devolay mit Kartoffeln und Salat. Vorweg servieren wir unsere hausgemachte Hühnersuppe.",
      pl: "Dewolaj z ziemniakami i surówką. Na przystawkę domowy rosół.",
      en: "Chicken Kiev with potatoes and salad. Served after our homemade chicken soup."
    }
  }
];

/** Parse the ISO day into a local Date without timezone drift. */
export function eventDate(ev: CafeEvent): Date {
  const [y, m, d] = ev.date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Events from the given list falling in a year/month (month is 0-indexed). */
export function filterEventsForMonth(list: CafeEvent[], year: number, month: number): CafeEvent[] {
  return list
    .filter(ev => {
      const d = eventDate(ev);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Convenience wrapper over the bundled seed data. */
export function getEventsForMonth(year: number, month: number): CafeEvent[] {
  return filterEventsForMonth(CAFE_EVENTS, year, month);
}

/** Months (as "YYYY-M") that contain at least one event — used to hint navigation. */
export function getMonthsWithEvents(): string[] {
  return Array.from(
    new Set(
      CAFE_EVENTS.map(ev => {
        const d = eventDate(ev);
        return `${d.getFullYear()}-${d.getMonth()}`;
      })
    )
  ).sort();
}

export function formatPrice(priceEur: number | undefined, language: EventLang): string {
  if (priceEur === undefined) return "";
  const value = priceEur.toFixed(2).replace(".", ",");
  return language === "en" ? `€${priceEur.toFixed(2)}` : `${value} €`;
}
