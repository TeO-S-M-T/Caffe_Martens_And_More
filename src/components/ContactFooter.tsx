import { Mail, Phone, MapPin, Clock, Star, Heart, Facebook } from "lucide-react";
import Logo from "./Logo";
import { CafeReview } from "../types";
import { useTranslation } from "../i18n";
import NewsletterSubscription from "./NewsletterSubscription";

export default function ContactFooter() {
  const { language, t } = useTranslation();

  // Localized reviews matching selected language
  const reviewsByLang: Record<string, CafeReview[]> = {
    de: [
      {
        author: "Anna Kowalska",
        rating: 5,
        text: "Unglaublich gemütlicher Kaffeegarten im versteckten Innenhof! Der beste weiße Schokoladen-Himbeer-Käsekuchen unter der Sonne, und der frisch gebrühte Filterkaffee aus Kenia schmeckt wunderbar fruchtig. Wir kommen auf jeden Fall wieder bei unserem nächsten Besuch in Goch!",
        date: "Vor einer Woche",
        source: "Google"
      },
      {
        author: "Mikołaj Z.",
        rating: 5,
        text: "Ein echtes Juwel auf der Frauenstraße. Das Frühstück 'Martens Special' mit pochiertem Ei und Avocado ist absolute Spitzenklasse. Sehr freundliches und lächelndes Personal, die Atmosphäre lädt zum Entspannen ein.",
        date: "Vor 2 Wochen",
        source: "Facebook"
      },
      {
        author: "Sabina Schneider",
        rating: 5,
        text: "Ein wundervoller Ort mit Seele! Hausgemachte Kuchen, die mit Herz zubereitet werden (das schmeckt man bei jedem Bissen des warmen Apfelstrudels). Mir gefällt die Ausgewogenheit der Karte sehr. Der Espresso Tonic erfrischt perfekt!",
        date: "Vor einem Monat",
        source: "Facebook"
      }
    ],
    pl: [
      {
        author: "Anna Kowalska",
        rating: 5,
        text: "Niesamowicie przytulny ogródek schowany w podwórzu! Najlepszy sernik z białą czekoladą pod słońcem, a kawa przelewowa Drip z Kenii smakuje wybitnie owocowo. Na pewno wrócimy przy kolejnej wizycie w Goch!",
        date: "Tydzień temu",
        source: "Google"
      },
      {
        author: "Mikołaj Z.",
        rating: 5,
        text: "Prawdziwa perełka na Frauenstraße. Śniadanie 'Martens Special' z jajkiem w koszulce i awokado to mistrzostwo świata. Bardzo miła i uśmiechnięta obsługa, a atmosfera pozwala całkowicie się zrelaksować.",
        date: "2 tygodnie temu",
        source: "Facebook"
      },
      {
        author: "Sabina Schneider",
        rating: 5,
        text: "Cudowne miejsce z duszą! Domowe ciasta przyrządzane z sercem (czuć to w każdym kawałku domowej szarlotki na ciepło). Bardzo podoba mi się, że menu jest tak zbalansowane. Espresso tonic orzeźwia idealnie!",
        date: "Miesiąc temu",
        source: "Facebook"
      }
    ],
    en: [
      {
        author: "Anna Kowalska",
        rating: 5,
        text: "Incredibly cozy garden tucked away in the backyard! Hands down the best white chocolate raspberry cheesecake under the sun, and the Kenia drip filter coffee tastes remarkably fruity. We will surely return during our next visit to Goch!",
        date: "A week ago",
        source: "Google"
      },
      {
        author: "Mikołaj Z.",
        rating: 5,
        text: "A true hidden gem on Frauenstraße. The 'Martens Special' breakfast with poached egg and avocado is absolutely out of this world. Very nice and friendly staff, and the atmosphere lets you completely relax.",
        date: "2 weeks ago",
        source: "Facebook"
      },
      {
        author: "Sabina Schneider",
        rating: 5,
        text: "Lovely spot with a soul! Homemade cakes crafted with heart (you can taste it in every single bite of the warm apple strudel). I love how well-balanced the menu is. The espresso tonic is exceptionally refreshing!",
        date: "A month ago",
        source: "Facebook"
      }
    ]
  };

  const currentReviews = reviewsByLang[language] || reviewsByLang["de"];

  // Localized days of the week
  const weekdaysDe = [
    { days: "Montag", hours: "09:00 - 17:00", isClosed: false },
    { days: "Dienstag", hours: "Geschlossen", isClosed: true },
    { days: "Mittwoch", hours: "Geschlossen", isClosed: true },
    { days: "Donnerstag", hours: "09:00 - 17:00", isClosed: false },
    { days: "Freitag", hours: "09:00 - 17:00", isClosed: false },
    { days: "Samstag", hours: "09:00 - 17:00", isClosed: false },
    { days: "Sonntag", hours: "09:00 - 17:00", isClosed: false }
  ];

  const weekdaysPl = [
    { days: "Poniedziałek", hours: "09:00 - 17:00", isClosed: false },
    { days: "Wtorek", hours: "Zamknięte", isClosed: true },
    { days: "Środa", hours: "Zamknięte", isClosed: true },
    { days: "Czwartek", hours: "09:00 - 17:00", isClosed: false },
    { days: "Piątek", hours: "09:00 - 17:00", isClosed: false },
    { days: "Sobota", hours: "09:00 - 17:00", isClosed: false },
    { days: "Niedziela", hours: "09:00 - 17:00", isClosed: false }
  ];

  const weekdaysEn = [
    { days: "Monday", hours: "09:00 AM - 05:00 PM", isClosed: false },
    { days: "Tuesday", hours: "Closed", isClosed: true },
    { days: "Wednesday", hours: "Closed", isClosed: true },
    { days: "Thursday", hours: "09:00 AM - 05:00 PM", isClosed: false },
    { days: "Friday", hours: "09:00 AM - 05:00 PM", isClosed: false },
    { days: "Saturday", hours: "09:00 AM - 05:00 PM", isClosed: false },
    { days: "Sunday", hours: "09:00 AM - 05:00 PM", isClosed: false }
  ];

  const currentSchedule = language === "de" ? weekdaysDe : language === "pl" ? weekdaysPl : weekdaysEn;

  return (
    <footer className="bg-[#41412e] text-[#ecece0]" id="kontakt">
      <div className="max-w-7xl mx-auto px-6 py-24">
        
        {/* Reviews Section inside Footer */}
        <div className="border-b border-[#55553e]/60 pb-20 mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[#e2e2d5] font-mono text-xs tracking-wider uppercase">{t.reviewsLabel}</span>
            <h3 className="font-serif text-3xl font-bold text-[#fdfcf7] mt-2">{t.reviewsHeading}</h3>
            <div className="w-12 h-0.5 bg-[#e2e2d5] mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {currentReviews.map((rev, idx) => (
              <div key={idx} className="bg-[#383827]/85 border border-[#51513a] p-6 rounded-3xl flex flex-col justify-between">
                <div>
                  {/* Stars Row */}
                  <div className="flex items-center gap-1 text-[#e2e2d5] mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-[#ecece0] text-xs font-light leading-relaxed italic">
                    "{rev.text}"
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#51513a]/50">
                  <div className="text-left">
                    <h5 className="text-xs font-bold text-[#fdfcf7]">{rev.author}</h5>
                    <span className="text-[10px] text-[#c3c3b0] font-mono">{rev.date}</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono ${
                    rev.source === "Facebook" ? "bg-blue-950 text-blue-300 border border-blue-900" : "bg-[#553b1b] text-[#fdfcf7] border border-[#7a582c]"
                  }`}>
                    {rev.source === "Facebook" ? <Facebook size={9} /> : null}
                    <span>{rev.source} {t.opinionSource}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription Component */}
        <div className="mb-20">
          <NewsletterSubscription />
        </div>

        {/* Info Grid (Address, Hours, Map) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Cafe Info & Contacts column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full border border-[#51513a] shrink-0 overflow-hidden shadow-sm">
                  <Logo size="100%" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#fdfcf7]">{t.footerTitle}</h3>
                </div>
              </div>
              <p className="text-[#ecece0]/80 text-xs font-light leading-relaxed">
                {t.footerDesc}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-[#383827] text-[#e2e2d5] rounded-xl mt-0.5 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#fdfcf7] uppercase tracking-wide">{t.addressHeader}</h5>
                  <p className="text-[#ecece0]/80 text-xs mt-1">
                    Frauenstraße 16<br />
                    47574 Goch, {language === "pl" ? "Niemcy" : "Germany"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-[#383827] text-[#e2e2d5] rounded-xl mt-0.5 shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#fdfcf7] uppercase tracking-wide">{t.phoneHeader}</h5>
                  <p className="text-[#ecece0]/80 text-xs mt-1">
                    +49 2823 9276495
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-[#383827] text-[#e2e2d5] rounded-xl mt-0.5 shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#fdfcf7] uppercase tracking-wide">{t.emailHeader}</h5>
                  <p className="text-[#ecece0]/80 text-xs mt-1">
                    kontakt@caffe-martens.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours column */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-3xl bg-[#383827] border border-[#51513a]">
              <div className="flex items-center gap-2 text-[#e2e2d5] mb-4">
                <Clock size={18} />
                <h4 className="font-serif text-lg font-bold text-[#fdfcf7]">{t.hoursHeader}</h4>
              </div>
              <p className="text-[#ecece0]/70 text-xs font-light leading-relaxed mb-6">
                {t.hoursDesc}
              </p>

              <div className="space-y-3.5">
                {currentSchedule.map((sched, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-[#55553e]/40">
                    <span className="text-[#ecece0] font-medium">{sched.days}</span>
                    <span className={`font-mono ${sched.isClosed ? "text-[#c3c3b0]/60 italic" : "text-[#fdfcf7] font-semibold"}`}>
                      {sched.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive stylized Map column */}
          <div className="lg:col-span-4">
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold text-[#fdfcf7]">{t.whereToFindHeader}</h4>
              
              {/* High-quality styled map layout illustration */}
              <div className="relative h-64 rounded-3xl overflow-hidden border border-[#51513a] bg-[#313123] flex flex-col justify-end p-5 group">
                {/* Visual grid illustration behind to look like a map */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ecece0_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-12 shrink-0">
                  <div className="relative">
                    {/* Ripple pulse point */}
                    <span className="absolute -inset-2.5 bg-[#e2e2d5] opacity-35 rounded-full animate-ping" />
                    <div className="relative w-8 h-8 rounded-full bg-[#41412e] border-2 border-[#e2e2d5] flex items-center justify-center text-[#e2e2d5]">
                      <Heart size={14} fill="currentColor" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-8 left-6 text-left">
                  <span className="text-[10px] text-[#c3c3b0] font-mono block">Goch City Center</span>
                  <span className="text-xs text-[#ecece0] font-medium font-serif">Frauenstraße</span>
                </div>

                <div className="absolute bottom-16 right-6 text-right">
                  <span className="text-xs text-[#ecece0] font-medium font-serif">Susannastraße</span>
                </div>

                {/* Map details container badge overlay */}
                <div className="relative z-10 bg-[#383827]/95 border border-[#51513a] p-3 rounded-2xl text-left">
                  <span className="text-[10px] font-mono text-[#e2e2d5] uppercase font-bold block mb-0.5">{t.directionsHeader}</span>
                  <p className="text-[11px] text-[#ecece0] font-light">
                    {t.directionsDesc}
                  </p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Cafe+Martens+More+Frauenstr+Goch+Germany"
                target="_blank"
                className="w-full py-3 bg-[#383827] hover:bg-[#51513a] border border-[#51513a] rounded-2xl text-xs font-mono tracking-wide text-[#ecece0] hover:text-[#fdfcf7] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{t.openGoogleMaps}</span>
                <span>➔</span>
              </a>
            </div>
          </div>

        </div>

        {/* Back-link to bottom details credit line */}
        <div className="mt-20 pt-8 border-t border-[#51513a]/65 flex flex-col sm:flex-row items-center justify-between text-xs text-[#c3c3b0] gap-4">
          <p>© {new Date().getFullYear()} {t.copyright}</p>
          <div className="flex items-center gap-4">
            <a href="#glowna" className="hover:text-white">{t.navHome}</a>
            <span>•</span>
            <a href="#co-chcesz" className="hover:text-white">{t.navZones}</a>
            <span>•</span>
            <a href="#karta-menu" className="hover:text-white">{t.navMenu}</a>
            <span>•</span>
            <a href="#galeria-fb" className="hover:text-white">{t.navGallery}</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
