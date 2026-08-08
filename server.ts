import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { MenuCategory, MenuItem, FacebookPost } from "./src/types";
import { CAFE_EVENTS, CafeEvent } from "./src/data/events";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// ----------------------------------------------------------------------
// Localized Static Menu Database (supporting DE, PL, EN)
// ----------------------------------------------------------------------
interface LocalizedMenuItem {
  id: string;
  category: MenuCategory;
  priceEur: number;
  pricePln: number;
  imageUrl: string;
  name: Record<string, string>;
  description: Record<string, string>;
  tags: Record<string, string[]>;
}

let LOCALIZED_MENU_ITEMS: LocalizedMenuItem[] = [
  // Śniadania
  {
    id: "sn_1",
    category: MenuCategory.SNIADANIA,
    priceEur: 6.00,
    pricePln: 25.80,
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Kleines Frühstück",
      pl: "Małe Śniadanie",
      en: "Small Breakfast"
    },
    description: {
      de: "1 Brötchen, frisch für Sie belegt von unserem Team, dazu 1 Kaffee, Cappuccino oder Tee. Rührei oder Spiegelei jederzeit für nur 2,50 € extra.",
      pl: "1 bułka świeżo przygotowana przez nasz zespół oraz 1 kawa, cappuccino lub herbata. Jajecznica lub jajko sadzone w każdej chwili za dopłatą 2,50 €.",
      en: "1 freshly filled bread roll prepared by our team, plus 1 coffee, cappuccino or tea. Scrambled or fried egg any time for just €2.50 extra."
    },
    tags: {
      de: ["Frühstück", "Täglich"],
      pl: ["Śniadanie", "Codziennie"],
      en: ["Breakfast", "Daily"]
    }
  },
  {
    id: "sn_2",
    category: MenuCategory.SNIADANIA,
    priceEur: 10.50,
    pricePln: 45.15,
    imageUrl: "https://images.unsplash.com/photo-1496042300028-e7416057a90b?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Frühstück PLUS",
      pl: "Śniadanie PLUS",
      en: "Breakfast PLUS"
    },
    description: {
      de: "2 Brötchen, frisch für Sie belegt, dazu 1 Kaffee, Cappuccino oder Tee. Perfekt für den größeren Hunger — unser Tipp! Rührei oder Spiegelei für 2,50 € extra.",
      pl: "2 bułki świeżo przygotowane dla Ciebie oraz 1 kawa, cappuccino lub herbata. Idealne przy większym głodzie — nasza rekomendacja! Jajecznica lub jajko sadzone za 2,50 €.",
      en: "2 freshly filled bread rolls plus 1 coffee, cappuccino or tea. Perfect for a bigger appetite — our tip! Scrambled or fried egg for €2.50 extra."
    },
    tags: {
      de: ["Unser Tipp", "Frühstück"],
      pl: ["Polecane", "Śniadanie"],
      en: ["Our Tip", "Breakfast"]
    }
  },
  {
    id: "sn_3",
    category: MenuCategory.SNIADANIA,
    priceEur: 15.00,
    pricePln: 64.50,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Frühstücksbuffet (Montag – Freitag)",
      pl: "Bufet Śniadaniowy (poniedziałek – piątek)",
      en: "Breakfast Buffet (Monday – Friday)"
    },
    description: {
      de: "Große Auswahl an Brötchen und Brot, Aufschnitt, Käse, Marmeladen, frisches Gemüse, Joghurt, Müsli sowie Kaffee, Tee und Säfte. So viel Sie möchten — genießen Sie nach Herzenslust!",
      pl: "Duży wybór bułek i chleba, wędliny, sery, dżemy, świeże warzywa, jogurt, musli oraz kawa, herbata i soki. Tyle, ile chcesz — do woli!",
      en: "A large selection of rolls and bread, cold cuts, cheese, jams, fresh vegetables, yoghurt, muesli plus coffee, tea and juices. As much as you like!"
    },
    tags: {
      de: ["Buffet", "Mo – Fr"],
      pl: ["Bufet", "Pn – Pt"],
      en: ["Buffet", "Mon – Fri"]
    }
  },
  {
    id: "sn_4",
    category: MenuCategory.SNIADANIA,
    priceEur: 18.90,
    pricePln: 81.30,
    imageUrl: "https://images.unsplash.com/photo-1590412200988-a436bb705300?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Frühstücksbuffet (Samstag, Sonntag & Feiertage)",
      pl: "Bufet Śniadaniowy (sobota, niedziela i święta)",
      en: "Breakfast Buffet (Saturday, Sunday & holidays)"
    },
    description: {
      de: "Alles aus unserem Frühstücksbuffet und dazu: frisch zubereitetes Spiegelei oder Rührei, Bacon nach Wunsch sowie Kaffee, Tee und Säfte inklusive. Alles in diesem Preis — keine Zusatzkosten!",
      pl: "Wszystko z naszego bufetu śniadaniowego, a do tego: świeżo przygotowane jajko sadzone lub jajecznica, bekon według życzenia oraz kawa, herbata i soki w cenie. Wszystko w tej cenie — bez dopłat!",
      en: "Everything from our breakfast buffet plus: freshly prepared fried or scrambled eggs, bacon on request, and coffee, tea and juices included. All in this price — no extra costs!"
    },
    tags: {
      de: ["Buffet", "Wochenende"],
      pl: ["Bufet", "Weekend"],
      en: ["Buffet", "Weekend"]
    }
  },

  // Obiady
  {
    id: "ob_1",
    category: MenuCategory.OBIADY,
    priceEur: 12.90,
    pricePln: 55.50,
    imageUrl: "https://images.unsplash.com/photo-1571115177098-24ec42095185?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Łazanki mit Weißkohl und Wurst",
      pl: "Łazanki z białą kapustą i kiełbasą",
      en: "Łazanki with white cabbage and sausage"
    },
    description: {
      de: "Hausgemachte Łazanki-Nudeln mit geschmortem Weißkohl und kräftiger Wurst. Am Samstag, 01.08. auf unserer Wochenendkarte.",
      pl: "Domowe łazanki z duszoną białą kapustą i aromatyczną kiełbasą. W sobotę 01.08 w karcie weekendowej.",
      en: "Homemade Łazanki noodles with braised white cabbage and hearty sausage. On the weekend card Saturday 01.08."
    },
    tags: {
      de: ["Wochenend-Menü", "Sa 01.08."],
      pl: ["Menu weekendowe", "Sb 01.08"],
      en: ["Weekend Menu", "Sat 01.08"]
    }
  },
  {
    id: "ob_2",
    category: MenuCategory.OBIADY,
    priceEur: 21.90,
    pricePln: 94.20,
    imageUrl: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Rinderroulade mit Schlesischen Klößen",
      pl: "Rolada wołowa ze śląskimi kluskami",
      en: "Beef roulade with Silesian dumplings"
    },
    description: {
      de: "Zarte Rinderroulade mit Schlesischen Klößen und Roter Bete. Inklusive hausgemachter Hühnersuppe (Rosół) vorweg. Sonntag, 02.08.",
      pl: "Delikatna rolada wołowa ze śląskimi kluskami i burakami. W cenie domowy rosół na przystawkę. Niedziela 02.08.",
      en: "Tender beef roulade with Silesian dumplings and beetroot. Homemade chicken soup (Rosół) included. Sunday 02.08."
    },
    tags: {
      de: ["Mit Rosół", "So 02.08."],
      pl: ["Z rosołem", "Nd 02.08"],
      en: ["With Rosół", "Sun 02.08"]
    }
  },
  {
    id: "ob_3",
    category: MenuCategory.OBIADY,
    priceEur: 6.90,
    pricePln: 29.70,
    imageUrl: "https://images.unsplash.com/photo-1547592165-e1d17fed6006?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Erbsensuppe",
      pl: "Zupa grochowa",
      en: "Pea soup"
    },
    description: {
      de: "Deftige Erbsensuppe mit Würstchen und frischem Gemüse — wärmend, sättigend und hausgemacht. Samstag, 08.08.",
      pl: "Sycąca zupa grochowa z kiełbaskami i świeżymi warzywami — rozgrzewająca i domowa. Sobota 08.08.",
      en: "Hearty pea soup with sausage and fresh vegetables — warming, filling and homemade. Saturday 08.08."
    },
    tags: {
      de: ["Suppe", "Sa 08.08."],
      pl: ["Zupa", "Sb 08.08"],
      en: ["Soup", "Sat 08.08"]
    }
  },
  {
    id: "ob_4",
    category: MenuCategory.OBIADY,
    priceEur: 16.90,
    pricePln: 72.70,
    imageUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793f0f?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Schweineschnitzel mit Erbsen & Möhren",
      pl: "Kotlet schabowy z groszkiem i marchewką",
      en: "Pork schnitzel with peas & carrots"
    },
    description: {
      de: "Goldbraunes Schweineschnitzel mit Erbsen & Möhren, Salzkartoffeln und frischem Salat. Inklusive hausgemachter Hühnersuppe. Sonntag, 09.08.",
      pl: "Złocisty kotlet schabowy z groszkiem i marchewką, ziemniakami i świeżą sałatką. W cenie domowy rosół. Niedziela 09.08.",
      en: "Golden pork schnitzel with peas & carrots, boiled potatoes and fresh salad. Chicken soup included. Sunday 09.08."
    },
    tags: {
      de: ["Mit Rosół", "So 09.08."],
      pl: ["Z rosołem", "Nd 09.08"],
      en: ["With Rosół", "Sun 09.08"]
    }
  },
  {
    id: "ob_5",
    category: MenuCategory.OBIADY,
    priceEur: 12.90,
    pricePln: 55.50,
    imageUrl: "https://images.unsplash.com/photo-1571115177098-24ec42095185?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Spaghetti Bolognese",
      pl: "Spaghetti Bolognese",
      en: "Spaghetti Bolognese"
    },
    description: {
      de: "Unsere Spaghetti Bolognese mit lange geschmorter Hackfleischsauce und frisch geriebenem Käse. Samstag, 15.08.",
      pl: "Nasze spaghetti bolognese z długo duszonym sosem mięsnym i świeżo startym serem. Sobota 15.08.",
      en: "Our spaghetti bolognese with slow-simmered meat sauce and freshly grated cheese. Saturday 15.08."
    },
    tags: {
      de: ["Wochenend-Menü", "Sa 15.08."],
      pl: ["Menu weekendowe", "Sb 15.08"],
      en: ["Weekend Menu", "Sat 15.08"]
    }
  },
  {
    id: "ob_6",
    category: MenuCategory.OBIADY,
    priceEur: 16.90,
    pricePln: 72.70,
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Hähnchenbrust mit Kroketten",
      pl: "Pierś z kurczaka z krokietami",
      en: "Chicken breast with croquettes"
    },
    description: {
      de: "Gegrillte Hähnchenbrust mit knusprigen Kroketten und frischem Salat. Inklusive hausgemachter Hühnersuppe. Sonntag, 16.08.",
      pl: "Grillowana pierś z kurczaka z chrupiącymi krokietami i świeżą sałatką. W cenie domowy rosół. Niedziela 16.08.",
      en: "Grilled chicken breast with crispy croquettes and fresh salad. Chicken soup included. Sunday 16.08."
    },
    tags: {
      de: ["Mit Rosół", "So 16.08."],
      pl: ["Z rosołem", "Nd 16.08"],
      en: ["With Rosół", "Sun 16.08"]
    }
  },
  {
    id: "ob_7",
    category: MenuCategory.OBIADY,
    priceEur: 6.90,
    pricePln: 29.70,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Kartoffelsuppe",
      pl: "Zupa ziemniaczana",
      en: "Potato soup"
    },
    description: {
      de: "Cremige Kartoffelsuppe nach Hausrezept, fein abgeschmeckt und mit frischen Kräutern serviert. Samstag, 22.08.",
      pl: "Kremowa zupa ziemniaczana według domowego przepisu, doprawiona i podana ze świeżymi ziołami. Sobota 22.08.",
      en: "Creamy potato soup from our house recipe, finely seasoned and served with fresh herbs. Saturday 22.08."
    },
    tags: {
      de: ["Suppe", "Sa 22.08."],
      pl: ["Zupa", "Sb 22.08"],
      en: ["Soup", "Sat 22.08"]
    }
  },
  {
    id: "ob_8",
    category: MenuCategory.OBIADY,
    priceEur: 17.90,
    pricePln: 77.00,
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Schweinenacken mit Schlesischen Klößen",
      pl: "Karkówka ze śląskimi kluskami",
      en: "Pork neck with Silesian dumplings"
    },
    description: {
      de: "Saftiger Schweinenacken mit Schlesischen Klößen und Rotkohl. Inklusive hausgemachter Hühnersuppe. Sonntag, 23.08.",
      pl: "Soczysta karkówka ze śląskimi kluskami i czerwoną kapustą. W cenie domowy rosół. Niedziela 23.08.",
      en: "Juicy pork neck with Silesian dumplings and red cabbage. Chicken soup included. Sunday 23.08."
    },
    tags: {
      de: ["Mit Rosół", "So 23.08."],
      pl: ["Z rosołem", "Nd 23.08"],
      en: ["With Rosół", "Sun 23.08"]
    }
  },
  {
    id: "ob_9",
    category: MenuCategory.OBIADY,
    priceEur: 14.90,
    pricePln: 64.10,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Rindergulasch mit Reis",
      pl: "Gulasz wołowy z ryżem",
      en: "Beef goulash with rice"
    },
    description: {
      de: "Langsam geschmortes Rindergulasch mit Reis — kräftig gewürzt und wunderbar zart. Samstag, 29.08.",
      pl: "Wolno duszony gulasz wołowy z ryżem — mocno przyprawiony i wyjątkowo delikatny. Sobota 29.08.",
      en: "Slow-braised beef goulash with rice — richly spiced and beautifully tender. Saturday 29.08."
    },
    tags: {
      de: ["Wochenend-Menü", "Sa 29.08."],
      pl: ["Menu weekendowe", "Sb 29.08"],
      en: ["Weekend Menu", "Sat 29.08"]
    }
  },
  {
    id: "ob_10",
    category: MenuCategory.OBIADY,
    priceEur: 18.90,
    pricePln: 81.30,
    imageUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793f0f?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Bauernschnitzel mit Bratkartoffeln",
      pl: "Kotlet po chłopsku z pieczonymi ziemniakami",
      en: "Farmer's schnitzel with fried potatoes"
    },
    description: {
      de: "Bauernschnitzel mit Speck, Spiegelei und knusprigen Bratkartoffeln. Inklusive hausgemachter Hühnersuppe. Sonntag, 30.08.",
      pl: "Kotlet po chłopsku z boczkiem, jajkiem sadzonym i chrupiącymi ziemniakami. W cenie domowy rosół. Niedziela 30.08.",
      en: "Farmer's schnitzel with bacon, fried egg and crispy fried potatoes. Chicken soup included. Sunday 30.08."
    },
    tags: {
      de: ["Mit Rosół", "So 30.08."],
      pl: ["Z rosołem", "Nd 30.08"],
      en: ["With Rosół", "Sun 30.08"]
    }
  },

  // Ciastka
  {
    id: "ci_1",
    category: MenuCategory.CIASTKA,
    priceEur: 4.50,
    pricePln: 19.50,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Weißer Schoko-Himbeer-Käsekuchen",
      pl: "Sernik z Białą Czekoladą i Malinami",
      en: "White Chocolate & Raspberry Cheesecake"
    },
    description: {
      de: "Unser absoluter Bestseller! Wunderbar cremiger, gebackener Käsekuchen mit einer feinen Note von weißer Schokolade und fruchtigen Himbeeren auf einem Spekulatiusboden.",
      pl: "Nasz absolutny hit! Niezwykle kremowy, pieczony sernik z delikatną nutą białej czekolady, połączony z kwaśnymi malinami na spodzie z ciasteczek korzennych.",
      en: "Our absolute hit! Incredibly creamy, baked cheesecake with a delicate hint of white chocolate, combined with tart raspberries on a spiced cookie crust."
    },
    tags: {
      de: ["Unikat", "Himbeere"],
      pl: ["Unikat", "Maliny"],
      en: ["Unique", "Raspberry"]
    }
  },
  {
    id: "ci_2",
    category: MenuCategory.CIASTKA,
    priceEur: 4.80,
    pricePln: 21.00,
    imageUrl: "https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Duftender warmer Apfelstrudel",
      pl: "Pachnący Domowy Strudel Jabłkowy",
      en: "Fragrant Homemade Apple Strudel"
    },
    description: {
      de: "Ein Klassiker der traditionellen deutschen Küche: Knuspriger Teig reich gefüllt with süßen Zimtäpfeln und Rosinen. Warm serviert mit hausgemachter Vanillesauce.",
      pl: "Klasyka tradycyjnej kuchni niemieckiej: kruche ciasto obficie napełnione słodkimi jabłkami z cynamonem i rodzynkami. Podawany na ciepło z custardem waniliowym.",
      en: "A classic of traditional German baking: thin, crispy pastry generously filled with sweet spiced apples, cinnamon, and raisins. Served warm with vanilla custard."
    },
    tags: {
      de: ["Warm", "Klassiker"],
      pl: ["Na ciepło", "Klasyka"],
      en: ["Served Warm", "Classic"]
    }
  },
  {
    id: "ci_3",
    category: MenuCategory.CIASTKA,
    priceEur: 5.20,
    pricePln: 22.50,
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Gocher Schoko-Kirsch-Torte",
      pl: "Tort Czekoladowo-Wiśniowy Goch",
      en: "Goch Chocolate Cherry Torte"
    },
    description: {
      de: "Saftiger Schokoladenbiskuit getränkt mit feinem Kirschwasser, gefüllt mit fruchtigen Sauerkirschen und frischer Konditorsahne.",
      pl: "Warstwy wilgotnego biszkoptu czekoladowego nasączone tradycyjnym likierem wiśniowym, przełożone gęstą frużeliną z ciemnych czereśni i świeżą śmietaną rzemieślniczą.",
      en: "Layers of moist chocolate sponge soaked with cherry liqueur, filled with rich dark cherry compote and fresh farm cream."
    },
    tags: {
      de: ["Premium", "Schokolade"],
      pl: ["Premium", "Czekolada"],
      en: ["Premium", "Chocolate"]
    }
  },
  {
    id: "ci_4",
    category: MenuCategory.CIASTKA,
    priceEur: 4.20,
    pricePln: 18.00,
    imageUrl: "https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Saftiger Karottenkuchen",
      pl: "Puszyste Ciasto Marchewkowe",
      en: "Fluffy Carrot Cake"
    },
    description: {
      de: "Gewürzter Karottenkuchen mit knackigen Walnüssen und Sultaninen, getoppt mit cremigem Frischkäse-Frosting und einem Hauch Orangenschale.",
      pl: "Korzenne ciasto marchewkowe z chrupiącymi orzechami włoskimi i rodzynkami sułtańskimi, wykończone puszystym, aksamitnym kremem z nutą skórki otartej z pomarańczy.",
      en: "Spiced carrot cake packed with crunchy walnuts and sweet raisins, finished with smooth, velvety frosting laced with orange zest."
    },
    tags: {
      de: ["Vegan", "Nüsse"],
      pl: ["Wegańskie", "Orzechy"],
      en: ["Vegan", "Walnuts"]
    }
  },
  {
    id: "ci_5",
    category: MenuCategory.CIASTKA,
    priceEur: 4.90,
    pricePln: 21.00,
    imageUrl: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Frische Waffeln 'Klassiker'",
      pl: "Rzemieślnicze Gofry z Wiśniami",
      en: "Artisanal Waffles with Cherries"
    },
    description: {
      de: "Frisch gebackene Herzwaffeln, serviert mit heißen Sauerkirschen, einer Kugel cremigem Vanilleeis und frischer Schlagsahne.",
      pl: "Chrupiące, świeżo wypiekane gofry podawane z gorącą frużeliną wiśniową, gałką lodów waniliowych i puszystą bitą śmietaną.",
      en: "Freshly baked warm waffles served with hot sour cherries, a scoop of vanilla ice cream, and whipped cream."
    },
    tags: {
      de: ["Heiß serviert", "Bestseller"],
      pl: ["Na gorąco", "Hit"],
      en: ["Warm", "Bestseller"]
    }
  },

  // Kawy
  {
    id: "ka_1",
    category: MenuCategory.KAWY,
    priceEur: 3.60,
    pricePln: 15.50,
    imageUrl: "https://images.unsplash.com/photo-1571115177098-24ec42095185?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Samtiges Cappuccino",
      pl: "Aksamitne Cappuccino",
      en: "Smooth Cappuccino"
    },
    description: {
      de: "Aromatischer Espresso aus frisch gemahlenen 100% Arabica-Bohnen, mit cremig aufgeschäumter handwerklicher Milch und einer feinen Kakaonote.",
      pl: "Aromatyczne espresso przygotowane ze świeżo mielonych ziaren Arabiki 100%, z aksamitnie spienionym, ciepłym mlekiem rzemieślniczym i nutą kakao.",
      en: "Aromatic espresso roasted from fresh 100% Arabica beans, topped with micro-foamed farm-fresh milk and a dusting of cocoa."
    },
    tags: {
      de: ["Klassiker"],
      pl: ["Klasyk"],
      en: ["Classic"]
    }
  },
  {
    id: "ka_2",
    category: MenuCategory.KAWY,
    priceEur: 4.10,
    pricePln: 18.00,
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Flat White Doppelter Genuss",
      pl: "Flat White podwójne uderzenie",
      en: "Double Shot Flat White"
    },
    description: {
      de: "Intensiver, perfekt ausbalancierter Kaffeegenuss zubereitet aus zwei Ristretto-Shots und samtiger, warmer Milch mit feinstem Mikroschaum.",
      pl: "Perfekcyjnie zbalansowana, intensywna kawa stworzona na bazie podwójnego ristretto i gładkiego, gorącego mleka z minimalną ilością pianki mikropęcherzykowej.",
      en: "Perfectly balanced, intense coffee crafted on a double ristretto base and smooth hot micro-foamed milk."
    },
    tags: {
      de: ["Double Shot"],
      pl: ["Double Shot"],
      en: ["Double Shot"]
    }
  },
  {
    id: "ka_3",
    category: MenuCategory.KAWY,
    priceEur: 4.50,
    pricePln: 19.50,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Filterkaffee V60 / Drip",
      pl: "Kawa przelewowa V60 / Drip",
      en: "Drip Coffee V60"
    },
    description: {
      de: "Alternative Brühmethode. Entfaltet helle, fruchtige und teearomatische Geschmacksnoten unserer Single Origin Bohnen (fragen Sie nach unserer aktuellen Sorte).",
      pl: "Metoda alternatywna parzenia kawy. Wydobywa lekkie, owocowe i herbaciane nuty z naszych ziaren Single Origin (zapytaj baristę o aktualny region).",
      en: "Alternative pour-over brewing method. Brings out delicate, fruity, and tea-like notes from our Single Origin beans (ask barista for current region)."
    },
    tags: {
      de: ["Alternative", "Specialty"],
      pl: ["Alternatywa", "Specialty"],
      en: ["Alternative", "Specialty"]
    }
  },
  {
    id: "ka_4",
    category: MenuCategory.KAWY,
    priceEur: 4.80,
    pricePln: 21.00,
    imageUrl: "https://images.unsplash.com/photo-1593443320739-77f74939d0da?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Lavendel-Latte Macchiato",
      pl: "Lawendowe Latte Macchiato",
      en: "Lavender Latte Macchiato"
    },
    description: {
      de: "Dreischichtiger Milchkaffee, verfeinert mit unserem hausgemachten Biosirup aus französischen Lavendelblüten. Ein zart-süßes, entspannendes Aroma.",
      pl: "Trójwarstwowa kawa mleczna podawana z domowej roboty organicznym syropem z suszonych kwiatów lawendy francuskiej. Delikatnie słodki i odprężający aromat.",
      en: "Three-layered milk coffee infusing homemade organic syrup made of dried French lavender blossoms. Delightfully sweet and relaxing."
    },
    tags: {
      de: ["Saisonal", "Botanisch"],
      pl: ["Sezonowa", "Botaniczna"],
      en: ["Seasonal", "Botanical"]
    }
  },

  // Napoje
  {
    id: "na_1",
    category: MenuCategory.NAPOJE,
    priceEur: 4.50,
    pricePln: 19.50,
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Hausgemachte Zitronen-Minz-Limonade",
      pl: "Domowa Lemoniada Cytryna-Mięta",
      en: "Homemade Lemon Mint Lemonade"
    },
    description: {
      de: "Erfrischender, handgepresster Saft reifer Zitronen, Rohrzuckersirup, frische Minzzweige, Crushed Ice und prickelndes Mineralwasser.",
      pl: "Orzeźwiający, własnoręcznie wyciskany sok z dojrzałych cytryn, syrop z trzciny cukrowej, gałązki świeżej mięty, kruszony lód i bąbelki wody gazowanej.",
      en: "Refreshing, freshly squeezed ripe lemon juice, cane sugar syrup, sprigs of garden mint, crushed ice, and sparkling mineral water."
    },
    tags: {
      de: ["Kalt", "Bestseller"],
      pl: ["Zimne", "Bestseller"],
      en: ["Cold", "Bestseller"]
    }
  },
  {
    id: "na_2",
    category: MenuCategory.NAPOJE,
    priceEur: 5.20,
    pricePln: 22.50,
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Espresso Tonic mit Rosmarin",
      pl: "Espresso Tonic z Rozmarynem",
      en: "Rosemary Espresso Tonic"
    },
    description: {
      de: "Eine geniale Sommerkombination: Herbe Noten von Premium-Tonic gepaart mit der spritzigen Säure eines doppelten Espresso-Shots und einem geflämmten frischen Rosmarinzweig.",
      pl: "Genialne letnie połączenie: gorzkawe nuty klasycznego tonicu premium, podwójny shot ożywczej kwasowości espresso oraz opalana świeża gałązka rozmarynu.",
      en: "Brilliant summer pairing: bittersweet premium tonic notes, double espresso acidity, and a flame-kissed sprig of fresh garden rosemary."
    },
    tags: {
      de: ["Exotisch", "Erfrischend"],
      pl: ["Egzotyczne", "Orzeźwienie"],
      en: ["Exotic", "Refreshing"]
    }
  },
  {
    id: "na_3",
    category: MenuCategory.NAPOJE,
    priceEur: 4.30,
    pricePln: 18.50,
    imageUrl: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Pfirsich-Melisse-Eistee",
      pl: "Mrożona Herbata Brzoskwinia-Melisa",
      en: "Peach Melissa Iced Tea"
    },
    description: {
      de: "Kalt extrahierter Schwarztee kombiniert mit feinem Pfirsichsirup und beruhigenden Melissenblättern aus unserem Kaffeegarten.",
      pl: "Czarna herbata parzona na zimno, połączona z czystym syropem brzoskwiniowym i liśćmi kojącej melisy lekarskiej z naszego przykawiarnianego ogródka.",
      en: "Cold brewed loose leaf black tea, sweetened with organic peach syrup and calming lemon balm from our garden."
    },
    tags: {
      de: ["Kalt", "Kräuter"],
      pl: ["Zimne", "Ziołowe"],
      en: ["Cold", "Herbal"]
    }
  }
];

function getLocalizedMenu(lang: string): MenuItem[] {
  const l = (lang === "pl" || lang === "en") ? lang : "de"; // default is 'de'
  return LOCALIZED_MENU_ITEMS.map(item => ({
    id: item.id,
    category: item.category,
    priceEur: item.priceEur,
    pricePln: item.pricePln,
    imageUrl: item.imageUrl,
    name: item.name[l] || item.name["de"],
    description: item.description[l] || item.description["de"],
    tags: item.tags[l] || item.tags["de"]
  }));
}

// ----------------------------------------------------------------------
// Localized Facebook Fallbacks
// ----------------------------------------------------------------------
const LOCALIZED_FALLBACK_POSTS: Record<string, FacebookPost[]> = {
  de: [
    {
      id: "fb_f1",
      date: "Heute, 09:30",
      content: "Guten Morgen Goch! ☀️ Die Sonne scheint am Markt und unsere Vitrine füllt sich mit Leckereien! Heute frisch vorbereitet: unser weißer Schokoladen-Himbeer-Käsekuchen 🍓 auf knusprigem Spekulatiusboden und saftiger veganer Karottenkuchen mit knackigen Nüssen. Dazu empfehlen wir frisch gebrühten Filterkaffee aus Äthiopien über V60. Genießen Sie die Sonne in unserem Kaffeegarten ab 10:00 Uhr! Wir freuen uns auf Sie!",
      category: "Kuchen & Torten",
      imgUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_f2",
      date: "Gestern, 12:15",
      content: "Suchen Sie eine Idee für eine schnelle, leckere Mittagspause? 🌯 Diese Woche auf unserer Empfehlungskarte: knuspriger 'Caesar Chicken' Wrap mit gegrillter Hähnchenbrust, knackigem Römersalat und feinem Parmesan-Dressing! Für Vegetarier servieren wir eine herzerwärmende Ziegenkäse-Spinat-Tarte mit frischem Babyspinat. Heiß und knusprig serviert!",
      category: "Mittagessen",
      imgUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793f0f?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_f3",
      date: "Vor 3 Tagen",
      content: "Das Frühstück ist die wichtigste Mahlzeit des Tages, besonders am Wochenende! 🍳 Probieren Sie unser Frühstück 'Martens Special' - mit perfekt pochiertem Ei, reifer Avocado auf dickem, handwerklichem Landbrot und feinen Kirschtomaten aus der Region Niederrhein. Auch leicht erhältlich als Frühstücksteller 'Garten'. Kaffee servieren wir ab 9:00 Uhr morgens!",
      category: "Frühstück",
      imgUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_f4",
      date: "Vor 5 Tagen",
      content: "Da ist er! Unser neuer Favorit für warme Nachmittage – Espresso Tonic mit geflämmtem Rosmarinzweig! 🌿 Verbindet die feine Bitternote feinsten Tonics mit der fruchtigen Säure eines doppelten Espresso-Shots und dem herrlich aromatischen Aroma von frischem Rosmarin. Genießen Sie den Sommer in unserem traumhaften, versteckten Innenhof am Markt.",
      category: "Erfrischungsgetränke",
      imgUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_event_de1",
      date: "Heuer am Freitag, 19:00",
      content: "✨ Grosse Neuigkeiten! #Event: Konzertabend im Kaffeegarten! Am kommenden Freitag ab 19:00 Uhr veranstalten wir ein exklusives akustisches Live-Konzert bei flackerndem Kerzenschein. Genießen Sie kühle hausgemachte Cocktails, unsere Spezialitätenteller und polnische Köstlichkeiten wie frische warme Pierogi. Eintritt frei! #Event",
      category: "Events & Konzerte",
      imgUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_event_de2",
      date: "Diesen Sonntag, 11:00",
      content: "Waffelliebhaber aufgepasst! 🧇 Ein süßer Sonntag steht bevor. #Event: Grosses rzemieślnicze Waffelfestival bei Café Martens & More! Diesen Sonntag servieren wir unbegrenztes Angebot an frischen Herzwaffeln mit heißen Sauerkirschen, Schlagsahne und Vanilleeis. Bringt eure Liebsten mit! #Event",
      category: "Aktionen",
      imgUrl: "https://images.unsplash.com/photo-1562967914-1f1981bb2bb6?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    }
  ],
  pl: [
    {
      id: "fb_f1",
      date: "Dziś, 09:30",
      content: "Dzień dobry Goch! ☀️ Słońce świeci przy rynku w Goch, a nasza witryna wypełnia się pysznościami! Dziś przygotowaliśmy dla Was nasz flagowy Sernik z Białą Czekoladą i Malinami 🍓 na spodzie korzennym oraz wegańskie ciasto marchewkowe z chrupiącymi orzechami. Do tego polecamy świeżo wypaloną kawę z Etiopii parzoną w drip-ie. Zapraszamy do stolików w ogrodzie od 10:00! Do zobaczenia!",
      category: "Ciastka",
      imgUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_f2",
      date: "Wczoraj, 12:15",
      content: "Szukasz pomysłu na szybki, pyszny obiad w przerwie w pracy? 🌯 W tym tygodniu na bocznej tablicy króluje nasz chrupiący Wrap Cezar z soczystym grillowanym kurczakiem, rzymską sałatą i wyrazistym sosem parmezanowym! Mamy też wegetariańską tartę z kozim serem i świeżym szpinakiem. Podajemy od ręki, super chrupiące i zdrowe!",
      category: "Obiady",
      imgUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793f0f?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_f3",
      date: "3 dni temu",
      content: "Śniadanie to najważniejszy posiłek dnia, zwłaszcza w wolny weekend! 🍳 Wypróbuj nasze Śniadanie 'Martens Special' - z idealnie rozpływającym się jajkiem w koszulce, dojrzałym awokado na grubym pajdu rzemieślniczego chleba oraz bukietem ekologicznych pomidorków z Niederrhein. Dostępne również w wersji lżejszej jako Talerz Śniadaniowy Ogród. Kawę serwujemy już od 9:00 rano!",
      category: "Śniadania",
      imgUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_f4",
      date: "5 dni temu",
      content: "Mamy to! Nowy orzeźwiający faworyt na ciepłe czerwcowe popołudnia – Espresso Tonic z Gałązką Rozmarynu! 🌿 Łączy kwaskowatość podwójnego espressa, musujący tonik premium oraz niesamowity dymny posmak, który uzyskujemy muskając gałązkę rozmarynu ogniem baristycznym. Idealny napój w naszym ukrytym podwórku przy rynku w Goch.",
      category: "Napoje",
      imgUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_event_pl1",
      date: "Najbliższy Piątek, 19:00",
      content: "✨ Wspaniałe wieści! #Event: Kameralny wieczór muzyczny w naszym ogrodzie! W najbliższy piątek zapraszamy na klimatyczny koncert live przy blasku świec. Czeka na Was autorskie menu koktajlowe, pyszne przekąski i nasze świeżo ulepione tradycyjne pierogi domowe. Wstęp bezpłatny! Zarezerwuj stolik już teraz. #Event",
      category: "Wydarzenia & Koncerty",
      imgUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_event_pl2",
      date: "Niedziela, 11:00",
      content: "Uwaga smakosze! 🧇 Zapowiada się słodka niedziela! #Event: Wielki Rzemieślniczy Festiwal Gofra w Café Martens! Serwujemy chrupiące, ciepłe gofry z bitą śmietaną, gałką lodów i pyszną gorącą konfiturą ze świeżych owoców z Niederrhein. Przyjdź spędzić czas w urokliwym podwórku przy rynku w Goch. #Event",
      category: "Promocje",
      imgUrl: "https://images.unsplash.com/photo-1562967914-1f1981bb2bb6?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    }
  ],
  en: [
    {
      id: "fb_f1",
      date: "Today, 09:30",
      content: "Good morning Goch! ☀️ The sun is shining beautifully on the market square, and our display is loaded with pastries! Today we baked our signature White Chocolate & Raspberry Cheesecake 🍓 on a spiced cookie crust, alongside our moist vegan carrot cake with walnuts. Pair it up with Ethiopia single origin pour-over drip coffee. Outdoor seating opens at 10:00! See you soon!",
      category: "Cakes & Sweets",
      imgUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_f2",
      date: "Yesterday, 12:15",
      content: "Looking for a fast, appetizing lunch during your workday break? 🌯 This week, our crispy Chicken Caesar Wrap is the star of the board, loaded with grilled breast, crisp romaine, and bold parmesan dressing! We also serve a gorgeous, hot goat cheese and baby spinach tart. Fresh, warm, and highly nutritious!",
      category: "Lunch",
      imgUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793f0f?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_f3",
      date: "3 days ago",
      content: "Breakfast is the ultimate start of any day, especially on weekends! 🍳 Treat yourself to our 'Martens Special' - featuring a soft poached egg, ripe avocado spread on a thick slice of artisanal hand-baked bread, and fresh organic cherry tomatoes. A lighter 'Niederrhein Garden' platter is also available. Brewing starts at 9:00 AM!",
      category: "Breakfast",
      imgUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_f4",
      date: "5 days ago",
      content: "Here it is! An absolute summer hit for warm afternoons – Espresso Tonic with a flame-scorched Rosemary Sprig! 🌿 Merrily blending the deep botanical bitterness of premium tonic, double ristretto acidity, and an incredible aromatic finish. The absolute best drink to cool off in our cozy backyard on the market square.",
      category: "Drinks",
      imgUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_event_en1",
      date: "This Friday, 19:00",
      content: "✨ Big news! #Event: Candlelit Acoustic Night in our cozy garden! Join us this Friday at 7:00 PM for a beautiful live acoustic music performance. Enjoy hand-shaken summer cocktails, delicious regional snacks, and our freshly boiled Polish pierogi. Free entrance! #Event",
      category: "Events & Music",
      imgUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    },
    {
      id: "fb_event_en2",
      date: "Sunday, 11:00",
      content: "Calling all foodies! 🧇 A sweet Sunday is ahead. #Event: Waffle Festival at Café Martens & More! This Sunday, we are cooking golden, fluffy house-made waffles topped with warm sour cherries, sweet whipped cream, and vanilla bean gelato. Bring your loved ones for a relaxing day outside! #Event",
      category: "Promotions",
      imgUrl: "https://images.unsplash.com/photo-1562967914-1f1981bb2bb6?q=80&w=600&auto=format&fit=crop",
      facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
      isRealSync: false,
    }
  ]
};

// Current cached posts cache per language
let CURRENT_POSTS_CACHE_MAPPING: Record<string, FacebookPost[]> = {
  de: [...LOCALIZED_FALLBACK_POSTS.de],
  pl: [...LOCALIZED_FALLBACK_POSTS.pl],
  en: [...LOCALIZED_FALLBACK_POSTS.en]
};

let LAST_SYNC_TIME_MAPPING: Record<string, string> = {
  de: "Zuletzt automatisch synchronisiert beim Start",
  pl: "Zsynchronizowano automatycznie przy starcie",
  en: "Automatically synchronized on startup"
};

// ----------------------------------------------------------------------
// Calendar events store (seeded from src/data/events.ts)
// ----------------------------------------------------------------------
let CALENDAR_EVENTS: CafeEvent[] = CAFE_EVENTS.map(ev => ({ ...ev }));

// ----------------------------------------------------------------------
// Persistence
//
// Everything the admin panel edits lived only in memory before, so every
// restart silently threw the owner's changes away. We now mirror the three
// mutable collections to a JSON file and reload them on boot.
//
// NOTE: on Cloud Run the container filesystem is ephemeral and not shared
// between instances — edits survive a restart of the same instance but not a
// new revision or a scale-out. For durable multi-instance storage this needs
// a bucket or a database.
// ----------------------------------------------------------------------
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

function saveStore() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const payload = {
      savedAt: new Date().toISOString(),
      menu: LOCALIZED_MENU_ITEMS,
      posts: CURRENT_POSTS_CACHE_MAPPING,
      events: CALENDAR_EVENTS
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(payload, null, 2), "utf-8");
  } catch (err: any) {
    console.error("[Store] Could not persist changes:", err?.message || err);
  }
}

function loadStore() {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      console.log("[Store] No saved store found — using built-in content.");
      return;
    }
    const raw = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
    if (Array.isArray(raw?.menu) && raw.menu.length > 0) {
      LOCALIZED_MENU_ITEMS = raw.menu;
    }
    if (raw?.posts && typeof raw.posts === "object") {
      CURRENT_POSTS_CACHE_MAPPING = { ...CURRENT_POSTS_CACHE_MAPPING, ...raw.posts };
    }
    if (Array.isArray(raw?.events)) {
      CALENDAR_EVENTS = raw.events;
    }
    console.log(`[Store] Restored saved content from ${STORE_PATH} (saved ${raw?.savedAt || "unknown"}).`);
  } catch (err: any) {
    console.error("[Store] Could not read saved store, falling back to built-in content:", err?.message || err);
  }
}

loadStore();

// ----------------------------------------------------------------------
// Admin authentication
//
// The password used to live in the client bundle and was printed on the login
// screen, while the /api/admin/* routes accepted anything at all — the lock was
// decoration. Authentication now happens here: the password never reaches the
// browser, and every write requires a bearer token issued by /api/admin/login.
// ----------------------------------------------------------------------
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

/** token -> expiry timestamp */
const adminSessions = new Map<string, number>();

function issueToken(): string {
  const token = crypto.randomBytes(32).toString("hex");
  adminSessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const expiry = adminSessions.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    adminSessions.delete(token);
    return false;
  }
  return true;
}

/** Comparison that does not leak the answer through timing. */
function passwordMatches(candidate: string): boolean {
  const a = Buffer.from(String(candidate));
  const b = Buffer.from(ADMIN_PASSWORD);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({
      success: false,
      code: "not_configured",
      message: "Admin access is disabled: ADMIN_PASSWORD is not set on the server."
    });
  }
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!isValidToken(token)) {
    return res.status(401).json({
      success: false,
      code: "unauthorized",
      message: "Not signed in, or the session has expired."
    });
  }
  next();
}

// Simple per-IP throttle so the password cannot be brute forced quickly.
const loginAttempts = new Map<string, { count: number; first: number }>();
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

app.post("/api/admin/login", (req, res) => {
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({
      success: false,
      code: "not_configured",
      message: "Admin access is disabled: ADMIN_PASSWORD is not set on the server."
    });
  }

  const ip = req.ip || "unknown";
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (record && now - record.first < ATTEMPT_WINDOW_MS && record.count >= MAX_ATTEMPTS) {
    return res.status(429).json({
      success: false,
      code: "rate_limited",
      message: "Too many attempts. Please wait a few minutes and try again."
    });
  }

  const { password } = req.body || {};
  if (typeof password === "string" && passwordMatches(password)) {
    loginAttempts.delete(ip);
    return res.json({ success: true, token: issueToken(), expiresInMs: SESSION_TTL_MS });
  }

  if (!record || now - record.first >= ATTEMPT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, first: now });
  } else {
    record.count += 1;
  }

  return res.status(401).json({ success: false, code: "invalid_password" });
});

app.post("/api/admin/logout", (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  adminSessions.delete(token);
  res.json({ success: true });
});

/** Lets the panel show a useful message before anyone types a password. */
app.get("/api/admin/status", (req, res) => {
  res.json({ success: true, configured: Boolean(ADMIN_PASSWORD) });
});

// ----------------------------------------------------------------------
// API Routes
// ----------------------------------------------------------------------

// 1. Get entire menu based on selected language
app.get("/api/menu", (req, res) => {
  const lang = (req.query.lang as string) || "de";
  const items = getLocalizedMenu(lang);
  res.json({
    success: true,
    data: items
  });
});

// Admin endpoints for Menu Items management
app.get("/api/admin/menu", requireAdmin, (req, res) => {
  res.json({
    success: true,
    data: LOCALIZED_MENU_ITEMS
  });
});

app.post("/api/admin/menu", requireAdmin, (req, res) => {
  const { id, category, priceEur, imageUrl, name, description, tags } = req.body;
  const newItem = {
    id: id || `item_${Date.now()}`,
    category: category || "sniadania",
    priceEur: Number(priceEur) || 0,
    pricePln: (Number(priceEur) || 0) * 4.3,
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop",
    name: name || { de: "", pl: "", en: "" },
    description: description || { de: "", pl: "", en: "" },
    tags: tags || { de: [], pl: [], en: [] }
  };
  
  LOCALIZED_MENU_ITEMS.push(newItem);
  saveStore();
  res.json({ success: true, data: newItem });
});

app.put("/api/admin/menu/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { category, priceEur, imageUrl, name, description, tags } = req.body;
  const idx = LOCALIZED_MENU_ITEMS.findIndex(item => item.id === id);
  
  if (idx !== -1) {
    LOCALIZED_MENU_ITEMS[idx] = {
      ...LOCALIZED_MENU_ITEMS[idx],
      category: category || LOCALIZED_MENU_ITEMS[idx].category,
      priceEur: priceEur !== undefined ? Number(priceEur) : LOCALIZED_MENU_ITEMS[idx].priceEur,
      pricePln: priceEur !== undefined ? Number(priceEur) * 4.3 : LOCALIZED_MENU_ITEMS[idx].pricePln,
      imageUrl: imageUrl || LOCALIZED_MENU_ITEMS[idx].imageUrl,
      name: name || LOCALIZED_MENU_ITEMS[idx].name,
      description: description || LOCALIZED_MENU_ITEMS[idx].description,
      tags: tags || LOCALIZED_MENU_ITEMS[idx].tags
    };
    saveStore();
    res.json({ success: true, data: LOCALIZED_MENU_ITEMS[idx] });
  } else {
    res.status(404).json({ success: false, message: "Item not found" });
  }
});

app.delete("/api/admin/menu/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  LOCALIZED_MENU_ITEMS = LOCALIZED_MENU_ITEMS.filter(item => item.id !== id);
  saveStore();
  res.json({ success: true });
});

// Admin endpoints for Event/Post management
app.get("/api/admin/posts", requireAdmin, (req, res) => {
  res.json({
    success: true,
    data: CURRENT_POSTS_CACHE_MAPPING
  });
});

app.post("/api/admin/posts", requireAdmin, (req, res) => {
  const { id, date, content, category, imgUrl, facebookUrl } = req.body;
  const newPostId = id || `post_${Date.now()}`;
  
  const deContent = content?.de || content || "";
  const plContent = content?.pl || content || "";
  const enContent = content?.en || content || "";

  const deCategory = category?.de || category || "Event";
  const plCategory = category?.pl || category || "Wydarzenie";
  const enCategory = category?.en || category || "Event";

  const deDate = date?.de || date || "Heute";
  const plDate = date?.pl || date || "Dzisiaj";
  const enDate = date?.en || date || "Today";

  const dePost: FacebookPost = {
    id: newPostId,
    date: deDate,
    content: deContent,
    category: deCategory,
    imgUrl: imgUrl || "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=600&auto=format&fit=crop",
    facebookUrl: facebookUrl || "https://www.facebook.com/profile.php?id=61584459111985",
    isRealSync: false
  };

  const plPost: FacebookPost = {
    ...dePost,
    date: plDate,
    content: plContent,
    category: plCategory
  };

  const enPost: FacebookPost = {
    ...dePost,
    date: enDate,
    content: enContent,
    category: enCategory
  };

  CURRENT_POSTS_CACHE_MAPPING.de.unshift(dePost);
  CURRENT_POSTS_CACHE_MAPPING.pl.unshift(plPost);
  CURRENT_POSTS_CACHE_MAPPING.en.unshift(enPost);

  saveStore();
  res.json({ success: true, data: { de: dePost, pl: plPost, en: enPost } });
});

app.put("/api/admin/posts/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const { date, content, category, imgUrl, facebookUrl } = req.body;

  for (const lang of ["de", "pl", "en"] as const) {
    const list = CURRENT_POSTS_CACHE_MAPPING[lang] || [];
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      const existing = list[idx];
      const langContent = typeof content === "object" ? content[lang] : content;
      const langCategory = typeof category === "object" ? category[lang] : category;
      const langDate = typeof date === "object" ? date[lang] : date;

      list[idx] = {
        ...existing,
        date: langDate !== undefined ? langDate : existing.date,
        content: langContent !== undefined ? langContent : existing.content,
        category: langCategory !== undefined ? langCategory : existing.category,
        imgUrl: imgUrl !== undefined ? imgUrl : existing.imgUrl,
        facebookUrl: facebookUrl !== undefined ? facebookUrl : existing.facebookUrl
      };
    }
  }

  saveStore();
  res.json({ success: true });
});

app.delete("/api/admin/posts/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  for (const lang of ["de", "pl", "en"] as const) {
    CURRENT_POSTS_CACHE_MAPPING[lang] = (CURRENT_POSTS_CACHE_MAPPING[lang] || []).filter(p => p.id !== id);
  }
  saveStore();
  res.json({ success: true });
});

// ----------------------------------------------------------------------
// Calendar events — public read, admin write
// ----------------------------------------------------------------------

/** Normalises a submitted event so a partial form never corrupts the store. */
function normalizeEvent(body: any, existing?: CafeEvent): CafeEvent {
  const trio = (value: any, fallback: Record<string, string> | undefined, dflt = "") => ({
    de: value?.de ?? fallback?.de ?? dflt,
    pl: value?.pl ?? fallback?.pl ?? dflt,
    en: value?.en ?? fallback?.en ?? dflt
  });

  const priceRaw = body.priceEur;
  const hasPrice = priceRaw !== undefined && priceRaw !== null && priceRaw !== "";

  const event: CafeEvent = {
    id: body.id || existing?.id || `ev_${Date.now()}`,
    date: body.date || existing?.date || new Date().toISOString().slice(0, 10),
    kind: body.kind || existing?.kind || "weekend-menu",
    imgUrl: body.imgUrl || existing?.imgUrl || "",
    facebookUrl: body.facebookUrl || existing?.facebookUrl || "https://www.facebook.com/profile.php?id=61584459111985",
    title: trio(body.title, existing?.title),
    description: trio(body.description, existing?.description),
    category: trio(body.category, existing?.category, "Wochenend-Menü")
  };

  if (hasPrice) {
    event.priceEur = Number(priceRaw);
  } else if (existing?.priceEur !== undefined && body.priceEur === undefined) {
    event.priceEur = existing.priceEur;
  }

  // An empty starter in any language means "no starter for this event".
  const starter = body.starter !== undefined ? body.starter : existing?.starter;
  if (starter && (starter.de || starter.pl || starter.en)) {
    event.starter = trio(starter, existing?.starter);
  }

  return event;
}

/** Public: the calendar reads from here. */
app.get("/api/events", (req, res) => {
  const sorted = [...CALENDAR_EVENTS].sort((a, b) => a.date.localeCompare(b.date));
  res.json({ success: true, data: sorted });
});

app.get("/api/admin/events", requireAdmin, (req, res) => {
  const sorted = [...CALENDAR_EVENTS].sort((a, b) => a.date.localeCompare(b.date));
  res.json({ success: true, data: sorted });
});

app.post("/api/admin/events", requireAdmin, (req, res) => {
  const event = normalizeEvent(req.body);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
    return res.status(400).json({ success: false, message: "Date must be in YYYY-MM-DD format." });
  }
  CALENDAR_EVENTS.push(event);
  saveStore();
  res.json({ success: true, data: event });
});

app.put("/api/admin/events/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const idx = CALENDAR_EVENTS.findIndex(ev => ev.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }
  const updated = normalizeEvent({ ...req.body, id }, CALENDAR_EVENTS[idx]);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(updated.date)) {
    return res.status(400).json({ success: false, message: "Date must be in YYYY-MM-DD format." });
  }
  CALENDAR_EVENTS[idx] = updated;
  saveStore();
  res.json({ success: true, data: updated });
});

app.delete("/api/admin/events/:id", requireAdmin, (req, res) => {
  const { id } = req.params;
  const before = CALENDAR_EVENTS.length;
  CALENDAR_EVENTS = CALENDAR_EVENTS.filter(ev => ev.id !== id);
  if (CALENDAR_EVENTS.length === before) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }
  saveStore();
  res.json({ success: true });
});

/** Restores the built-in August menu if the owner clears things by accident. */
app.post("/api/admin/events/reset", requireAdmin, (req, res) => {
  CALENDAR_EVENTS = CAFE_EVENTS.map(ev => ({ ...ev }));
  saveStore();
  res.json({ success: true, data: CALENDAR_EVENTS });
});

// 2. Get current cached FB posts based on selected language
app.get("/api/fb-posts", (req, res) => {
  const lang = (req.query.lang as string) || "de";
  const posts = CURRENT_POSTS_CACHE_MAPPING[lang] || CURRENT_POSTS_CACHE_MAPPING["de"];
  const syncTime = LAST_SYNC_TIME_MAPPING[lang] || LAST_SYNC_TIME_MAPPING["de"];
  res.json({
    success: true,
    data: posts,
    lastSyncTime: syncTime
  });
});

// ----------------------------------------------------------------------
// 3. Sync posts from the café's Facebook Page.
//
// Real data requires a Facebook Page Access Token. Set FB_PAGE_ID and
// FB_PAGE_ACCESS_TOKEN in the environment and this endpoint reads the actual
// page feed through the Graph API.
//
// Without a token we serve the local demo posts and label them honestly
// (isRealSync: false). We never present invented content as a real Facebook
// update — the previous implementation asked Gemini to make posts up, which is
// why the gallery never showed genuine news or events.
// ----------------------------------------------------------------------

const FB_PAGE_ID = process.env.FB_PAGE_ID || "61584459111985";
const FB_PAGE_URL = `https://www.facebook.com/profile.php?id=${FB_PAGE_ID}`;
const FB_GRAPH_VERSION = "v21.0";

interface GraphPost {
  id: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
  full_picture?: string;
}

/**
 * Reads the page feed. Returns null when no access token is configured,
 * so the caller can distinguish "not set up" from "set up but empty".
 */
async function fetchFacebookPage(limit = 8): Promise<GraphPost[] | null> {
  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  if (!token || token === "MY_FB_PAGE_ACCESS_TOKEN") {
    return null;
  }

  const fields = "id,message,created_time,permalink_url,full_picture";
  const url =
    `https://graph.facebook.com/${FB_GRAPH_VERSION}/${encodeURIComponent(FB_PAGE_ID)}/posts` +
    `?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`;

  const resp = await fetch(url);
  const json: any = await resp.json().catch(() => ({}));

  if (!resp.ok || json?.error) {
    const detail = json?.error?.message || `HTTP ${resp.status}`;
    throw new Error(`Facebook Graph API rejected the request: ${detail}`);
  }

  return Array.isArray(json?.data) ? (json.data as GraphPost[]) : [];
}

/** Very small heuristic so posts still land in a readable category chip. */
function categorizePost(text: string, lang: string): string {
  const t = text.toLowerCase();
  const pick = (de: string, pl: string, en: string) =>
    lang === "pl" ? pl : lang === "en" ? en : de;

  if (/#event|konzert|koncert|concert|live|festival|festiwal/.test(t)) {
    return pick("Events & Konzerte", "Wydarzenia i koncerty", "Events & Concerts");
  }
  if (/frühstück|fruhstuck|śniadan|sniadan|breakfast|buffet|bufet/.test(t)) {
    return pick("Frühstück", "Śniadania", "Breakfast");
  }
  if (/kuchen|torte|ciast|sernik|cake|cheesecake/.test(t)) {
    return pick("Kuchen & Torten", "Ciastka", "Cakes & Sweets");
  }
  if (/kaffee|kawa|coffee|espresso|cappuccino/.test(t)) {
    return pick("Kaffeespezialitäten", "Kawy", "Coffee");
  }
  if (/menü|menu|mittag|obiad|schnitzel|suppe|zupa|lunch|catering/.test(t)) {
    return pick("Speisekarte", "Menu", "Menu");
  }
  return pick("Neuigkeiten", "Aktualności", "Updates");
}

function formatPostDate(iso: string | undefined, lang: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const locale = lang === "pl" ? "pl-PL" : lang === "en" ? "en-GB" : "de-DE";
  return d.toLocaleString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop";

app.post("/api/sync-facebook-posts", async (req, res) => {
  const lang = (req.query.lang as string) || "de";
  const timeOf = (l: string) =>
    new Date().toLocaleTimeString(l === "pl" ? "pl-PL" : l === "en" ? "en-US" : "de-DE");

  const notConfiguredMessage: Record<string, string> = {
    de: "Facebook ist noch nicht verbunden. Hinterlegen Sie FB_PAGE_ACCESS_TOKEN, damit echte Beiträge geladen werden — bis dahin sehen Sie Beispielinhalte.",
    pl: "Facebook nie jest jeszcze podłączony. Ustaw FB_PAGE_ACCESS_TOKEN, aby wczytywać prawdziwe posty — na razie widzisz treści przykładowe.",
    en: "Facebook is not connected yet. Set FB_PAGE_ACCESS_TOKEN to load genuine posts — until then you are seeing sample content."
  };

  const notConfiguredStatus: Record<string, string> = {
    de: `Beispieldaten geladen um ${timeOf("de")} (Facebook nicht verbunden)`,
    pl: `Załadowano dane przykładowe o ${timeOf("pl")} (Facebook niepodłączony)`,
    en: `Sample data loaded at ${timeOf("en")} (Facebook not connected)`
  };

  const successMessage: Record<string, string> = {
    de: "Aktuelle Beiträge direkt von unserer Facebook-Seite geladen.",
    pl: "Pobrano aktualne posty bezpośrednio z naszej strony na Facebooku.",
    en: "Latest posts loaded straight from our Facebook page."
  };

  const successStatus: Record<string, string> = {
    de: `Mit Facebook synchronisiert um ${timeOf("de")}`,
    pl: `Zsynchronizowano z Facebookiem o ${timeOf("pl")}`,
    en: `Synchronized with Facebook at ${timeOf("en")}`
  };

  const emptyMessage: Record<string, string> = {
    de: "Verbindung erfolgreich — die Facebook-Seite enthält derzeit keine Textbeiträge.",
    pl: "Połączenie udane — strona na Facebooku nie zawiera obecnie postów tekstowych.",
    en: "Connection succeeded — the Facebook page currently has no text posts."
  };

  const errorMessage: Record<string, string> = {
    de: "Facebook konnte nicht erreicht werden. Es werden zwischengespeicherte Beispielinhalte angezeigt.",
    pl: "Nie udało się połączyć z Facebookiem. Wyświetlane są zapisane treści przykładowe.",
    en: "Facebook could not be reached. Showing cached sample content instead."
  };

  const errorStatus: Record<string, string> = {
    de: `Synchronisierung fehlgeschlagen um ${timeOf("de")}`,
    pl: `Synchronizacja nie powiodła się o ${timeOf("pl")}`,
    en: `Synchronization failed at ${timeOf("en")}`
  };

  /** Demo posts, clearly marked as not being a real sync. */
  const serveDemo = (
    status: string,
    message: string,
    method: string,
    extra: Record<string, unknown> = {}
  ) => {
    const baseline = LOCALIZED_FALLBACK_POSTS[lang] || LOCALIZED_FALLBACK_POSTS["de"];
    const demo = baseline.map(post => ({ ...post, isRealSync: false }));
    CURRENT_POSTS_CACHE_MAPPING[lang] = demo;
    LAST_SYNC_TIME_MAPPING[lang] = status;
    return res.json({
      success: true,
      data: demo,
      lastSyncTime: status,
      method,
      isDemoContent: true,
      message,
      ...extra
    });
  };

  try {
    const graphPosts = await fetchFacebookPage();

    // No token configured — say so plainly instead of inventing posts.
    if (graphPosts === null) {
      console.log("[Facebook] No FB_PAGE_ACCESS_TOKEN configured; serving demo content.");
      return serveDemo(
        notConfiguredStatus[lang] || notConfiguredStatus["de"],
        notConfiguredMessage[lang] || notConfiguredMessage["de"],
        "not-configured",
        { configured: false }
      );
    }

    const mapped: FacebookPost[] = graphPosts
      .filter(p => p.message && p.message.trim().length > 0)
      .map(p => ({
        id: p.id,
        date: formatPostDate(p.created_time, lang),
        content: p.message!.trim(),
        category: categorizePost(p.message!, lang),
        imgUrl: p.full_picture || FALLBACK_IMG,
        facebookUrl: p.permalink_url || FB_PAGE_URL,
        isRealSync: true
      }));

    if (mapped.length === 0) {
      console.log("[Facebook] Page reachable but returned no text posts.");
      return serveDemo(
        successStatus[lang] || successStatus["de"],
        emptyMessage[lang] || emptyMessage["de"],
        "facebook-graph-empty",
        { configured: true }
      );
    }

    CURRENT_POSTS_CACHE_MAPPING[lang] = mapped;
    LAST_SYNC_TIME_MAPPING[lang] = successStatus[lang] || successStatus["de"];

    console.log(`[Facebook] Synced ${mapped.length} real posts for language: ${lang}`);

    return res.json({
      success: true,
      data: mapped,
      lastSyncTime: LAST_SYNC_TIME_MAPPING[lang],
      method: "facebook-graph",
      configured: true,
      message: successMessage[lang] || successMessage["de"]
    });

  } catch (error: any) {
    console.error("[Facebook] Sync failed:", error?.message || error);
    return serveDemo(
      errorStatus[lang] || errorStatus["de"],
      errorMessage[lang] || errorMessage["de"],
      "sync-error",
      { configured: true, error: String(error?.message || error) }
    );
  }
});

// ----------------------------------------------------------------------
// Vite Middleware Setup for Full-Stack Hot Reloading & Production Serve
// ----------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Café Martens & More server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
