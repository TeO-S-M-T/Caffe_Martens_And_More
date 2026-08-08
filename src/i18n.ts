import { createContext, useContext } from "react";

export type Language = "de" | "pl" | "en";

export interface StaticTranslations {
  // Brand Header Navigation / App Navbar
  navHome: string;
  navZones: string;
  navMenu: string;
  navGallery: string;
  navCatering: string;
  navContact: string;
  navStatusOpen: string;

  // Header / Hero Section
  heroAddress: string;
  heroTagline: string;
  featureSpecialtyTitle: string;
  featureSpecialtyDesc: string;
  featureBakedTitle: string;
  featureBakedDesc: string;
  featureLocalTitle: string;
  featureLocalDesc: string;
  featureGardenTitle: string;
  featureGardenDesc: string;

  // CoChceszZone / Selector Section
  zoneLabel: string;
  zoneHeading: string;
  zoneDesc: string;
  zoneViewMenu: string;
  
  // Zone details
  breakfastTitle: string;
  breakfastSubtitle: string;
  breakfastDesc: string;
  breakfastBadge: string;
  
  lunchTitle: string;
  lunchSubtitle: string;
  lunchDesc: string;
  lunchBadge: string;
  
  cakesTitle: string;
  cakesSubtitle: string;
  cakesDesc: string;
  cakesBadge: string;
  
  coffeeTitle: string;
  coffeeSubtitle: string;
  coffeeDesc: string;
  coffeeBadge: string;
  
  drinksTitle: string;
  drinksSubtitle: string;
  drinksDesc: string;
  drinksBadge: string;

  // MenuGrid Section
  menuLabel: string;
  menuHeading: string;
  menuDesc: string;
  menuSearchPlaceholder: string;
  menuVeggieOnly: string;
  menuNoItemsHeading: string;
  menuNoItemsDesc: string;
  menuLoading: string;

  // FbGallery Section
  fbSyncIndicator: string;
  fbHeading: string;
  fbDesc: string;
  fbLastSync: string;
  fbNoData: string;
  fbSyncBtnActive: string;
  fbSyncBtnLoading: string;
  fbVisitPageBtn: string;
  fbUpdatingStatus: string;
  fbAIFooterNote: string;
  fbJoinUsHeader: string;
  fbFollowBtn: string;

  // ContactFooter Section
  reviewsLabel: string;
  reviewsHeading: string;
  footerTitle: string;
  footerDesc: string;
  addressHeader: string;
  phoneHeader: string;
  emailHeader: string;
  hoursHeader: string;
  hoursDesc: string;
  whereToFindHeader: string;
  directionsHeader: string;
  directionsDesc: string;
  openGoogleMaps: string;
  copyright: string;
  opinionSource: string;
}

export const TRANSLATIONS: Record<Language, StaticTranslations> = {
  de: {
    navHome: "Startseite",
    navZones: "Bereiche",
    navMenu: "Speisekarte",
    navGallery: "Facebook-Galerie",
    navCatering: "Catering",
    navContact: "Kontakt",
    navStatusOpen: "Goch, DE Geöffnet",
    heroAddress: "Goch • Markt 12, Deutschland",
    heroTagline: "Entdecken Sie unsere gemütliche Ecke direkt am Markt in Goch. Mit Liebe hausgebackene Kuchen, aromatisches Frühstück, feine Mittagsgerichte und erstklassiger Specialty Coffee warten auf Sie.",
    featureSpecialtyTitle: "Specialty Coffee",
    featureSpecialtyDesc: "100% handwerklicher Arabica, klassisch und alternativ für Sie zubereitet.",
    featureBakedTitle: "Mit Liebe gebacken",
    featureBakedDesc: "Hausgemachte Käsekuchen, Tartes und frische Strudel, täglich frisch vor Ort zubereitet.",
    featureLocalTitle: "Lokale Produkte",
    featureLocalDesc: "Frische Zutaten von ausgewählten Erzeugern aus der Region Niederrhein.",
    featureGardenTitle: "Ruhiger Kaffeegarten",
    featureGardenDesc: "Eine kurze Auszeit vom Alltag in unserem charmanten, ruhigen Innenhof.",
    zoneLabel: "Mit einem Lächeln bestellen",
    zoneHeading: "Was möchten Sie heute essen oder trinken?",
    zoneDesc: "Wählen Sie einen unserer Genießer-Bereiche, um sofort die passende handwerkliche Auswahl und unsere Tagesspezialitäten zu entdecken!",
    zoneViewMenu: "Speisekarte ansehen",
    
    breakfastTitle: "Frühstück",
    breakfastSubtitle: "Für einen perfekten Start in den Tag",
    breakfastDesc: "Köstliche Eiergerichte, luftige Pancakes, regionaler Käse und ofenfrisches Brot.",
    breakfastBadge: "Bis 12:00 Uhr",
    
    lunchTitle: "Mittagessen",
    lunchSubtitle: "Eine nahrhafte Dosis Energie",
    lunchDesc: "Knusprige Wraps, frisch gebackene vegetarische Quiches und feine Cremesuppen.",
    lunchBadge: "Ab 12:00 Uhr",
    
    cakesTitle: "Kuchen & Torten",
    cakesSubtitle: "Süße Momente zum Genießen",
    cakesDesc: "Unsere legendären hausgemachten weißen Schokoladen-Himbeer-Käsekuchen, Strudel und Torten.",
    cakesBadge: "Tagesgebäck",
    
    coffeeTitle: "Kaffeespezialitäten",
    coffeeSubtitle: "Aroma, das verzaubert",
    coffeeDesc: "Klassischer Cappuccino, intensiver Flat White und Filterkaffee über V60 frisch gebrüht.",
    coffeeBadge: "100% Arabica",
    
    drinksTitle: "Erfrischungsgetränke",
    drinksSubtitle: "Kühle Erfrischung im Alltag",
    drinksDesc: "Aufregender Espresso Tonic mit Rosmarin, frisch gepresste Säfte und hausgemachte Limonaden.",
    drinksBadge: "Mit Eiswürfeln",

    menuLabel: "Erlesene Handwerkskunst",
    menuHeading: "Die Café Martens Karte",
    menuDesc: "Unsere Speisen und Getränke bereiten wir täglich frisch aus regionalen Zutaten für Sie zu.",
    menuSearchPlaceholder: "In der Karte suchen...",
    menuVeggieOnly: "Nur vegetarisch",
    menuNoItemsHeading: "Nichts gefunden",
    menuNoItemsDesc: "Keine Spezialitäten gefunden, die Ihren Kriterien entsprechen. Suchen Sie nach etwas anderem oder deaktivieren Sie den Vegetarier-Filter.",
    menuLoading: "Lade handwerkliche Speisekarte...",

    fbSyncIndicator: "Facebook Live Synchronisator",
    fbHeading: "Aktuelles & Live-Galerie",
    fbDesc: "Unsere Galerie wird automatisch mit der offiziellen Facebook-Seite unseres Cafés synchronisiert. Entdecken Sie aktuelle Empfehlungen und Beiträge aus erster Hand!",
    fbLastSync: "Letzte Aktualisierung",
    fbNoData: "Keine Daten...",
    fbSyncBtnActive: "Mit Facebook synchronisieren",
    fbSyncBtnLoading: "Suche läuft...",
    fbVisitPageBtn: "FB besuchen",
    fbUpdatingStatus: "Automatische Aktualisierung läuft...",
    fbAIFooterNote: "Die Beiträge werden direkt von unserer offiziellen Facebook-Seite geladen.",
    fbJoinUsHeader: "Café Martens & More auf Facebook",
    fbFollowBtn: "Folgen Sie uns!",

    reviewsLabel: "Das sagen unsere Gäste",
    reviewsHeading: "Stimmen & Bewertungen",
    footerTitle: "Café Martens & More",
    footerDesc: "Eine gemütliche Kaffeeecke am Markt 12 im Herzen des charmanten Goch. Besuchen Sie uns für eine aromatische Auszeit im Alltag.",
    addressHeader: "Adresse",
    phoneHeader: "Kontakt",
    emailHeader: "E-Mail schreiben",
    hoursHeader: "Öffnungszeiten",
    hoursDesc: "Möchten Sie uns für ein leckeres Frühstück oder zum gemütlichen Nachmittagskaffee besuchen? Wir freuen uns auf Sie!",
    whereToFindHeader: "Wo Sie uns finden",
    directionsHeader: "Wegbeschreibung",
    directionsDesc: "Sie finden uns direkt am Marktplatz von Goch, gegenüber dem Rathaus in der Fußgängerzone. Städtische Parkplätze liegen nur wenige Schritte entfernt.",
    openGoogleMaps: "In Google Maps öffnen",
    copyright: "Café Martens & More, Goch. Kaffeekunst im Herzen von Goch.",
    opinionSource: "Bewertung"
  },
  pl: {
    navHome: "Główna",
    navZones: "Strefy",
    navMenu: "Karta Menu",
    navGallery: "Facebook Galeria",
    navCatering: "Catering",
    navContact: "Kontakt",
    navStatusOpen: "Goch, DE Otwarte",
    heroAddress: "Goch • Markt 12, Niemcy",
    heroTagline: "Odkryj przytulny zakątek przy samym rynku (Markt 12) w Goch, gdzie z miłości wypiekamy domowe ciasta, serwujemy aromatyczne śniadania, lekkie obiady i parzymy najwyższej jakości kawę specialty.",
    featureSpecialtyTitle: "Kawa Specialty",
    featureSpecialtyDesc: "100% rzemieślnicza Arabica, parzona klasycznie oraz alternatywnie.",
    featureBakedTitle: "Wypieki z Miłością",
    featureBakedDesc: "Domowe serniki, tarty i świeże strudle przygotowywane codziennie na miejscu.",
    featureLocalTitle: "Lokalne Produkty",
    featureLocalDesc: "Składniki od sprawdzonych rolników z malowniczego regionu Niederrhein.",
    featureGardenTitle: "Cichy Ogródek",
    featureGardenDesc: "Chwilowa ucieczka od zgiełku miasta w naszym urokliwym, cichym podwórzu.",
    zoneLabel: "Złóż zamówienie uśmiechem",
    zoneHeading: "Co chcesz dzisiaj zjeść lub wypić?",
    zoneDesc: "Wybierz jedną z naszych stref, aby natychmiast zobaczyć dopasowane rzemieślnicze menu i specjały dnia!",
    zoneViewMenu: "Zobacz menu",

    breakfastTitle: "Śniadania",
    breakfastSubtitle: "Na idealny początek poranka",
    breakfastDesc: "Wykwintne jajka, puszyste pancakes, lokalne sery i domowe pieczywo.",
    breakfastBadge: "Do 12:00",
    
    lunchTitle: "Obiady",
    lunchSubtitle: "Pożywna dawka energii",
    lunchDesc: "Chrupiące wrapy, świeże maślane tarty warzywne oraz domowe zupy krem.",
    lunchBadge: "Od 12:00",
    
    cakesTitle: "Ciastka",
    cakesSubtitle: "Słodka chwila zapomnienia",
    cakesDesc: "Nasze flagowe domowe serniki z białą czekoladą, strudle i świeże torty.",
    cakesBadge: "Wypieki dnia",
    
    coffeeTitle: "Kawy",
    coffeeSubtitle: "Aromat, który uzależnia",
    coffeeDesc: "Klasyczne Cappuccino, podwójne Flat White i alternatywne parzenie drip/V60.",
    coffeeBadge: "100% Arabica",
    
    drinksTitle: "Napoje",
    drinksSubtitle: "Przełamanie miejskiego pragnienia",
    drinksDesc: "Ekscytujące Espresso Tonic z rozmarynem, soki ze świeżych cytrusów i lemoniady.",
    drinksBadge: "Kostki lodu",

    menuLabel: "Menu Rzemieślnicze",
    menuHeading: "Karta Café Martens",
    menuDesc: "Nasze potrawy przygotowujemy codziennie ze świeżych i regionalnych składników.",
    menuSearchPlaceholder: "Szukaj w menu...",
    menuVeggieOnly: "Tylko wegetariańskie",
    menuNoItemsHeading: "Nie znaleziono pozycji",
    menuNoItemsDesc: "Brak pasujących specjałów spełniających podane kryteria. Spróbuj zmienić frazę kluczową lub wyłączyć filtrowanie wegetariańskie.",
    menuLoading: "Pobieranie karty rzemieślniczej...",

    fbSyncIndicator: "Facebook Live Synchronizer",
    fbHeading: "Aktualności & Galeria na Żywo",
    fbDesc: "Nasza galeria jest automatycznie połączona i synchronizowana z oficjalnym profilem Facebook kawiarni. Poniżej znajdziesz aktualne polecenia i relacje!",
    fbLastSync: "Ostatnia aktualizacja",
    fbNoData: "Brak danych...",
    fbSyncBtnActive: "Synchronizuj z Facebookiem",
    fbSyncBtnLoading: "Wyszukiwanie...",
    fbVisitPageBtn: "Odwiedź FB",
    fbUpdatingStatus: "Automatyczna aktualizacja...",
    fbAIFooterNote: "Posty pobieramy bezpośrednio z naszej oficjalnej strony na Facebooku.",
    fbJoinUsHeader: "Café Martens & More na Facebooku",
    fbFollowBtn: "Dołącz do nas i obserwuj!",

    reviewsLabel: "Opinie naszych gości",
    reviewsHeading: "Co o nas mówią?",
    footerTitle: "Café Martens & More",
    footerDesc: "Niezwykle przytulny zakątek przy rynku (Markt 12), w samym sercu urokliwego miasteczka Goch. Zapraszamy po chwilę aromatycznej ucieczki każdego dnia.",
    addressHeader: "Adres Kawiarni",
    phoneHeader: "Zadzwoń do nas",
    emailHeader: "Napisz e-mail",
    hoursHeader: "Godziny Otwarcia",
    hoursDesc: "Chcesz nas odwiedzić na wyśmienite śniadanie lub popołudniową kawę z ciastkiem? Czekamy na Ciebie!",
    whereToFindHeader: "Gdzie nas znaleźć?",
    directionsHeader: "Wskazówki Dojazdu",
    directionsDesc: "Znajdziesz nas bezpośrednio przy rynku w Goch, naprzeciwko ratusza, w strefie deptaka. Parkingi miejskie są kilka kroków dalej.",
    openGoogleMaps: "Otwórz w Mapach Google",
    copyright: "Café Martens & More, Goch. Kawiarniana pasja w sercu Goch.",
    opinionSource: "Opinia"
  },
  en: {
    navHome: "Home",
    navZones: "Zones",
    navMenu: "Menu Card",
    navGallery: "Facebook Gallery",
    navCatering: "Catering",
    navContact: "Contact",
    navStatusOpen: "Goch, DE Open",
    heroAddress: "Goch • Markt 12, Germany",
    heroTagline: "Discover our cozy corner right on the market square (Markt 12) in Goch, where we bake homemade cakes with love, serve aromatic breakfasts, light lunches, and brew premium-grade specialty coffee.",
    featureSpecialtyTitle: "Specialty Coffee",
    featureSpecialtyDesc: "100% artisanal Arabica, brewed in both classical and alternative filter methods.",
    featureBakedTitle: "Baked with Love",
    featureBakedDesc: "Homemade cheesecakes, tarts, and fresh strudels prepared on-site every single day.",
    featureLocalTitle: "Local Products",
    featureLocalDesc: "Ingredients sourced from trusted, verified farmers in the scenic Niederrhein region.",
    featureGardenTitle: "Quiet Garden",
    featureGardenDesc: "A brief, peaceful escape from the city rush in our charming backyard.",
    zoneLabel: "Order with a smile",
    zoneHeading: "What would you like to eat or drink today?",
    zoneDesc: "Select one of our specialized zones to instantly display the curated artisanal menu and today's specials!",
    zoneViewMenu: "View Menu",

    breakfastTitle: "Breakfast",
    breakfastSubtitle: "For a perfect morning start",
    breakfastDesc: "Delicious eggs, fluffy pancakes, local cheeses, and warm bakery bread.",
    breakfastBadge: "Until 12:00",
    
    lunchTitle: "Lunch",
    lunchSubtitle: "A hearty dose of energy",
    lunchDesc: "Crispy wraps, fresh savory tarts, and comforting vegetable cream soups.",
    lunchBadge: "From 12:00",
    
    cakesTitle: "Cakes & Sweets",
    cakesSubtitle: "A moment of sweet indulgence",
    cakesDesc: "Our famous homemade white chocolate raspberry cheesecakes, strudels, and fresh tortes.",
    cakesBadge: "Bakes of the day",
    
    coffeeTitle: "Coffee",
    coffeeSubtitle: "Aroma that captures the soul",
    coffeeDesc: "Classic Cappuccino, double-shot Flat White, and specialized V60/drip filter brews.",
    coffeeBadge: "100% Arabica",
    
    drinksTitle: "Drinks",
    drinksSubtitle: "Quench your urban thirst",
    drinksDesc: "Exciting Espresso Tonic with matching roasted rosemary, fresh juices, and daily lemonades.",
    drinksBadge: "Ice cubes",

    menuLabel: "Artisanal Selection",
    menuHeading: "Café Martens Menu",
    menuDesc: "We prepare our food daily from fresh, handpicked local and regional ingredients.",
    menuSearchPlaceholder: "Search the menu...",
    menuVeggieOnly: "Vegetarian only",
    menuNoItemsHeading: "No entries found",
    menuNoItemsDesc: "No artisanal specialties matched your search criteria. Try changing keys or toggling vegetarian selection off.",
    menuLoading: "Retrieving artisanal menu...",

    fbSyncIndicator: "Facebook Live Synchronizer",
    fbHeading: "News & Live Gallery",
    fbDesc: "Our photo gallery links directly and auto-syncs with the cafe's official Facebook profile. Discover real-time specials below!",
    fbLastSync: "Last update",
    fbNoData: "No data...",
    fbSyncBtnActive: "Sync with Facebook",
    fbSyncBtnLoading: "Searching...",
    fbVisitPageBtn: "Visit FB",
    fbUpdatingStatus: "Automatic synchronization in progress...",
    fbAIFooterNote: "Posts are loaded directly from our official Facebook page.",
    fbJoinUsHeader: "Café Martens & More on Facebook",
    fbFollowBtn: "Find us & follow!",

    reviewsLabel: "Our guests say",
    reviewsHeading: "Guest Reviews",
    footerTitle: "Café Martens & More",
    footerDesc: "A remarkably cozy cafe hideaway at Markt 12 in the heart of charming Goch. Stop by for an aromatic moment today.",
    addressHeader: "Cafe Address",
    phoneHeader: "Call Us",
    emailHeader: "Send E-mail",
    hoursHeader: "Opening Hours",
    hoursDesc: "Planning to drop by for a delightful breakfast or weekend coffee and cake? We can't wait to host you!",
    whereToFindHeader: "Where to find us",
    directionsHeader: "Directions",
    directionsDesc: "You'll find us right on Goch's market square, opposite the town hall in the pedestrian zone. Public parking is just a few steps away.",
    openGoogleMaps: "Open in Google Maps",
    copyright: "Café Martens & More, Goch. Coffee passion in the heart of Goch.",
    opinionSource: "Review"
  }
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: StaticTranslations;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
