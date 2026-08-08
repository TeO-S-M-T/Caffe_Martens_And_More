import {
  Briefcase, Phone, Mail, MapPin, Check, Sandwich, Utensils, Croissant,
  CakeSlice, CupSoda, Truck, HeartHandshake, Sparkles, Users
} from "lucide-react";
import { useTranslation } from "../i18n";

interface Package {
  icon: typeof Sandwich;
  title: string;
  tagline: string;
  items: string[];
  minimum: string;
  note: string;
}

interface CateringCopy {
  badge: string;
  heading: string;
  tagline: string;
  intro: string;
  idealForLabel: string;
  idealFor: string[];
  highlight: string;
  packages: Package[];
  serviceHeading: string;
  service: { title: string; desc: string }[];
  stepsHeading: string;
  steps: string[];
  worthItHeading: string;
  worthIt: string[];
  deliveryHeading: string;
  deliveryDesc: string;
  ctaHeading: string;
  ctaDesc: string;
  ctaButton: string;
}

export default function CateringSection() {
  const { language } = useTranslation();

  const copy: Record<string, CateringCopy> = {
    de: {
      badge: "Business Catering",
      heading: "Business Catering",
      tagline: "Frisch. Hausgemacht. Pünktlich geliefert.",
      intro: "Business Catering für Unternehmen in Goch & Umgebung. Jedes Angebot stellen wir individuell für Ihren Anlass zusammen.",
      idealForLabel: "Ideal für",
      idealFor: ["Firmen", "Meetings", "Schulungen", "Geburtstage", "Kanzleien", "Praxen", "Büros"],
      highlight: "Frühstücksplatten ab 8 Personen",
      packages: [
        {
          icon: Sandwich,
          title: "Frühstücksplatten",
          tagline: "Vielfalt, die begeistert.",
          items: ["Belegte Brötchen", "Käsevariationen", "Schinken & Salami", "Ei-Variationen", "Frisches Gemüse", "Aufstriche", "Dekorativ angerichtet"],
          minimum: "Ab 8 Personen",
          note: "Individuelle Angebote für Firmen, Meetings und Veranstaltungen."
        },
        {
          icon: Utensils,
          title: "Canapés & Fingerfood",
          tagline: "Kleine Häppchen, großer Eindruck.",
          items: ["Verschiedene Beläge", "Kreativ & liebevoll dekoriert", "Perfekt für Empfang & Meetings", "Vegetarische Optionen"],
          minimum: "Ab 20 Stück",
          note: "Wir stellen die perfekte Auswahl für Ihren Anlass zusammen."
        },
        {
          icon: Croissant,
          title: "Premium Frühstück",
          tagline: "Rundum sorglos genießen.",
          items: ["Frühstücksplatten", "Brötchen & Croissants", "Käse- & Wurstauswahl", "Frisches Obst", "Marmeladen, Honig & Aufstriche", "Kaffee, Tee & Säfte"],
          minimum: "Ab 10 Personen",
          note: "Perfekt für einen gelungenen Start in den Tag."
        },
        {
          icon: CakeSlice,
          title: "Süße Platten",
          tagline: "Für die süßen Momente.",
          items: ["Mini Kuchen & Torten", "Croissants & Plundergebäck", "Obstplatten der Saison", "Süße Teilchen & Muffins"],
          minimum: "Ab 10 Personen",
          note: "Süßes für jeden Anlass — liebevoll angerichtet."
        },
        {
          icon: CupSoda,
          title: "Getränke",
          tagline: "Die perfekte Ergänzung.",
          items: ["Kaffee (Filterkaffee oder Thermoskanne)", "Teeauswahl", "Säfte (Orange, Apfel, Multivitamin)", "Mineralwasser (still & sprudel)", "Auf Wunsch auch Softdrinks"],
          minimum: "Nach Bedarf",
          note: "Wir liefern gekühlt und pünktlich zu Ihrem Event."
        }
      ],
      serviceHeading: "Unser Service für Sie",
      service: [
        { title: "Individuell", desc: "Jedes Angebot wird individuell nach Ihren Wünschen zusammengestellt." },
        { title: "Frisch & hausgemacht", desc: "Wir verwenden frische Zutaten und bereiten alles mit Liebe zu." },
        { title: "Pünktliche Lieferung", desc: "Zuverlässig und pünktlich an Ihren Wunschort." },
        { title: "Flexibel", desc: "Ob kleines Meeting oder großes Event — wir sind für Sie da." }
      ],
      stepsHeading: "So einfach geht's",
      steps: ["Anrufen oder E-Mail schreiben", "Wünsche & Anzahl durchgeben", "Angebot erhalten & entspannt genießen"],
      worthItHeading: "Ab wie viel Personen lohnt es sich?",
      worthIt: [
        "ab 8 Personen — ideal für kleinere Anlässe",
        "ab 10 Personen — besonders beliebt und effizient",
        "ab 15 Personen — optimal für größere Events und noch mehr Auswahl"
      ],
      deliveryHeading: "Lieferung",
      deliveryDesc: "Zuverlässig, pünktlich und auf Wunsch auch mit Auf- & Abbau.",
      ctaHeading: "Wir erstellen Ihnen gerne ein individuelles Angebot",
      ctaDesc: "Sprechen Sie uns an — wir beraten Sie gerne.",
      ctaButton: "Jetzt anfragen"
    },
    pl: {
      badge: "Catering dla firm",
      heading: "Catering dla Firm",
      tagline: "Świeżo. Domowo. Dostarczone na czas.",
      intro: "Catering biznesowy dla firm w Goch i okolicach. Każdą ofertę układamy indywidualnie pod Twoje wydarzenie.",
      idealForLabel: "Idealne dla",
      idealFor: ["Firm", "Spotkań", "Szkoleń", "Urodzin", "Kancelarii", "Gabinetów", "Biur"],
      highlight: "Półmiski śniadaniowe od 8 osób",
      packages: [
        {
          icon: Sandwich,
          title: "Półmiski śniadaniowe",
          tagline: "Różnorodność, która zachwyca.",
          items: ["Bułki z nadzieniem", "Wybór serów", "Szynka i salami", "Warianty z jajkiem", "Świeże warzywa", "Pasty i smarowidła", "Dekoracyjnie podane"],
          minimum: "Od 8 osób",
          note: "Indywidualne oferty dla firm, spotkań i wydarzeń."
        },
        {
          icon: Utensils,
          title: "Canapés i finger food",
          tagline: "Małe kęsy, wielkie wrażenie.",
          items: ["Różnorodne dodatki", "Kreatywnie i starannie dekorowane", "Idealne na recepcje i spotkania", "Opcje wegetariańskie"],
          minimum: "Od 20 sztuk",
          note: "Skomponujemy idealny zestaw na Twoją okazję."
        },
        {
          icon: Croissant,
          title: "Śniadanie Premium",
          tagline: "Wszystko bez trosk.",
          items: ["Półmiski śniadaniowe", "Bułki i croissanty", "Wybór serów i wędlin", "Świeże owoce", "Dżemy, miód i pasty", "Kawa, herbata i soki"],
          minimum: "Od 10 osób",
          note: "Idealne na udany początek dnia."
        },
        {
          icon: CakeSlice,
          title: "Półmiski słodkie",
          tagline: "Na słodkie chwile.",
          items: ["Mini ciasta i torty", "Croissanty i ciasto francuskie", "Sezonowe półmiski owocowe", "Słodkie drobiazgi i muffiny"],
          minimum: "Od 10 osób",
          note: "Słodkości na każdą okazję — pięknie podane."
        },
        {
          icon: CupSoda,
          title: "Napoje",
          tagline: "Idealne uzupełnienie.",
          items: ["Kawa (przelewowa lub w termosie)", "Wybór herbat", "Soki (pomarańcza, jabłko, multiwitamina)", "Woda mineralna (gazowana i niegazowana)", "Na życzenie także napoje gazowane"],
          minimum: "Według potrzeb",
          note: "Dostarczamy schłodzone i punktualnie na Twoje wydarzenie."
        }
      ],
      serviceHeading: "Nasz serwis dla Ciebie",
      service: [
        { title: "Indywidualnie", desc: "Każdą ofertę układamy według Twoich życzeń." },
        { title: "Świeżo i domowo", desc: "Używamy świeżych składników i przygotowujemy wszystko z sercem." },
        { title: "Punktualna dostawa", desc: "Niezawodnie i na czas pod wskazany adres." },
        { title: "Elastycznie", desc: "Małe spotkanie czy duże wydarzenie — jesteśmy do dyspozycji." }
      ],
      stepsHeading: "To takie proste",
      steps: ["Zadzwoń lub napisz e-mail", "Podaj życzenia i liczbę osób", "Otrzymaj ofertę i spokojnie się delektuj"],
      worthItHeading: "Od ilu osób to się opłaca?",
      worthIt: [
        "od 8 osób — idealne na mniejsze okazje",
        "od 10 osób — szczególnie popularne i efektywne",
        "od 15 osób — optymalne przy większych wydarzeniach i jeszcze większym wyborze"
      ],
      deliveryHeading: "Dostawa",
      deliveryDesc: "Niezawodnie, punktualnie, a na życzenie także z rozstawieniem i sprzątaniem.",
      ctaHeading: "Chętnie przygotujemy indywidualną ofertę",
      ctaDesc: "Odezwij się — doradzimy z przyjemnością.",
      ctaButton: "Zapytaj o ofertę"
    },
    en: {
      badge: "Business Catering",
      heading: "Business Catering",
      tagline: "Fresh. Homemade. Delivered on time.",
      intro: "Business catering for companies in Goch and the surrounding area. Every offer is put together individually for your occasion.",
      idealForLabel: "Ideal for",
      idealFor: ["Companies", "Meetings", "Trainings", "Birthdays", "Law firms", "Practices", "Offices"],
      highlight: "Breakfast platters from 8 people",
      packages: [
        {
          icon: Sandwich,
          title: "Breakfast Platters",
          tagline: "Variety that delights.",
          items: ["Filled bread rolls", "Cheese selection", "Ham & salami", "Egg variations", "Fresh vegetables", "Spreads", "Beautifully arranged"],
          minimum: "From 8 people",
          note: "Individual offers for companies, meetings and events."
        },
        {
          icon: Utensils,
          title: "Canapés & Finger Food",
          tagline: "Small bites, big impression.",
          items: ["Various toppings", "Creatively and carefully decorated", "Perfect for receptions & meetings", "Vegetarian options"],
          minimum: "From 20 pieces",
          note: "We put together the perfect selection for your occasion."
        },
        {
          icon: Croissant,
          title: "Premium Breakfast",
          tagline: "Enjoy without a worry.",
          items: ["Breakfast platters", "Rolls & croissants", "Cheese & cold cut selection", "Fresh fruit", "Jams, honey & spreads", "Coffee, tea & juices"],
          minimum: "From 10 people",
          note: "Perfect for a great start to the day."
        },
        {
          icon: CakeSlice,
          title: "Sweet Platters",
          tagline: "For the sweet moments.",
          items: ["Mini cakes & tortes", "Croissants & pastries", "Seasonal fruit platters", "Sweet treats & muffins"],
          minimum: "From 10 people",
          note: "Something sweet for every occasion — lovingly arranged."
        },
        {
          icon: CupSoda,
          title: "Drinks",
          tagline: "The perfect addition.",
          items: ["Coffee (filter or thermos jug)", "Tea selection", "Juices (orange, apple, multivitamin)", "Mineral water (still & sparkling)", "Soft drinks on request"],
          minimum: "As needed",
          note: "We deliver chilled and punctually to your event."
        }
      ],
      serviceHeading: "Our service for you",
      service: [
        { title: "Individual", desc: "Every offer is composed individually according to your wishes." },
        { title: "Fresh & homemade", desc: "We use fresh ingredients and prepare everything with love." },
        { title: "Punctual delivery", desc: "Reliably and on time to your chosen location." },
        { title: "Flexible", desc: "Whether a small meeting or a large event — we are here for you." }
      ],
      stepsHeading: "It's this easy",
      steps: ["Call or send an e-mail", "Tell us your wishes and the number of guests", "Receive your offer and simply enjoy"],
      worthItHeading: "From how many people is it worth it?",
      worthIt: [
        "from 8 people — ideal for smaller occasions",
        "from 10 people — especially popular and efficient",
        "from 15 people — optimal for larger events and even more choice"
      ],
      deliveryHeading: "Delivery",
      deliveryDesc: "Reliable, punctual and, on request, including setup and clearing away.",
      ctaHeading: "We'd be glad to prepare an individual offer",
      ctaDesc: "Get in touch — we're happy to advise you.",
      ctaButton: "Request an offer"
    }
  };

  const c = copy[language] || copy.de;

  return (
    <section className="max-w-7xl mx-auto px-6 py-24" id="catering">
      {/* Heading */}
      <div className="text-center mb-14">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-natural-light border border-natural-border/60 rounded-full text-natural-primary text-xs font-semibold font-mono uppercase tracking-wide mb-4">
          <Briefcase size={12} />
          <span>{c.badge}</span>
        </span>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-natural-text">
          {c.heading}
        </h2>
        <p className="font-serif italic text-natural-primary text-lg mt-3">
          {c.tagline}
        </p>
        <p className="text-natural-muted text-sm mt-4 max-w-2xl mx-auto font-light leading-relaxed">
          {c.intro}
        </p>
      </div>

      {/* Ideal for + highlight */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-[32px] bg-natural-light border border-natural-border/60 mb-10">
        <div className="flex-1">
          <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-natural-muted mb-3">
            {c.idealForLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {c.idealFor.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-full bg-natural-bg border border-natural-border/50 text-natural-text text-xs font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0 px-5 py-3 rounded-2xl bg-natural-primary text-[#fdfcf7] text-xs font-mono font-bold tracking-wide flex items-center gap-2 shadow-xs">
          <Users size={14} />
          <span>{c.highlight}</span>
        </div>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {c.packages.map((pkg, idx) => {
          const Icon = pkg.icon;
          return (
            <div
              key={pkg.title}
              className="bg-natural-bg border border-natural-card-border rounded-[32px] p-7 flex flex-col shadow-xs hover:border-natural-primary/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-natural-light border border-natural-border/60 flex items-center justify-center text-natural-primary shrink-0">
                  <Icon size={20} className="stroke-[1.4]" />
                </div>
                <span className="text-[10px] font-mono font-bold text-natural-muted/60 tabular-nums">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-natural-text leading-tight">
                {pkg.title}
              </h3>
              <p className="font-serif italic text-natural-primary/90 text-sm mt-1 mb-5">
                {pkg.tagline}
              </p>

              <ul className="space-y-2 mb-6 flex-1">
                {pkg.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-natural-text font-light">
                    <Check size={13} className="text-natural-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-natural-border/40 space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/25 border border-amber-100 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wide">
                  {pkg.minimum}
                </span>
                <p className="text-[11px] text-natural-muted font-light leading-relaxed">
                  {pkg.note}
                </p>
              </div>
            </div>
          );
        })}

        {/* Service card fills the last grid cell */}
        <div className="bg-natural-primary text-[#fdfcf7] rounded-[32px] p-7 flex flex-col shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <HeartHandshake size={20} className="stroke-[1.4]" />
            <h3 className="font-serif text-xl font-bold">{c.serviceHeading}</h3>
          </div>

          <div className="space-y-4 flex-1">
            {c.service.map((s) => (
              <div key={s.title}>
                <p className="text-xs font-mono font-bold uppercase tracking-wide text-[#fdfcf7]/95">
                  {s.title}
                </p>
                <p className="text-[11px] font-light text-[#fdfcf7]/75 leading-relaxed mt-0.5">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-5 mt-5 border-t border-[#fdfcf7]/20">
            <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#fdfcf7]/70 mb-3">
              {c.stepsHeading}
            </p>
            <ol className="space-y-2">
              {c.steps.map((step, i) => (
                <li key={step} className="flex items-start gap-2.5 text-[11px] font-light text-[#fdfcf7]/90">
                  <span className="w-4 h-4 rounded-full bg-[#fdfcf7]/20 flex items-center justify-center text-[9px] font-mono font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Group sizes + delivery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-natural-light border border-natural-border/60 rounded-[32px] p-7">
          <div className="flex items-center gap-2 text-natural-primary mb-4">
            <Users size={18} className="stroke-[1.5]" />
            <h4 className="font-serif text-lg font-bold text-natural-text">{c.worthItHeading}</h4>
          </div>
          <ul className="space-y-2.5">
            {c.worthIt.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-natural-text font-light">
                <Check size={13} className="text-natural-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-natural-light border border-natural-border/60 rounded-[32px] p-7">
          <div className="flex items-center gap-2 text-natural-primary mb-4">
            <Truck size={18} className="stroke-[1.5]" />
            <h4 className="font-serif text-lg font-bold text-natural-text">{c.deliveryHeading}</h4>
          </div>
          <p className="text-xs text-natural-text font-light leading-relaxed">
            {c.deliveryDesc}
          </p>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="rounded-[32px] bg-natural-bg border border-natural-card-border p-8 sm:p-10 text-center shadow-xs">
        <Sparkles size={20} className="text-natural-primary mx-auto mb-3" />
        <h4 className="font-serif text-2xl font-bold text-natural-text">
          {c.ctaHeading}
        </h4>
        <p className="text-natural-muted text-sm font-light mt-2 mb-7">
          {c.ctaDesc}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7">
          <a
            href="tel:+4928234191522"
            className="w-full sm:w-auto px-6 py-3 bg-natural-primary hover:bg-natural-primary-hover text-[#fdfcf7] rounded-2xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Phone size={14} />
            <span>02823 4191522</span>
          </a>
          <a
            href="mailto:cafemartensinfo@gmail.com?subject=Catering-Anfrage"
            className="w-full sm:w-auto px-6 py-3 bg-natural-light hover:bg-natural-light-hover border border-natural-border/60 text-natural-text rounded-2xl text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Mail size={14} />
            <span>cafemartensinfo@gmail.com</span>
          </a>
        </div>

        <p className="text-[11px] font-mono text-natural-muted flex items-center justify-center gap-1.5">
          <MapPin size={12} className="text-natural-primary" />
          <span>Café Martens &amp; More — Markt 12, 47574 Goch</span>
        </p>
      </div>
    </section>
  );
}
