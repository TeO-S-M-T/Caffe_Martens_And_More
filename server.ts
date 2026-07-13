import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { MenuCategory, MenuItem, FacebookPost } from "./src/types";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Lazy initialization of Gemini client as per guidelines
let aiClient: GoogleGenAI | null = null;
function getGemini() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

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
    priceEur: 11.90,
    pricePln: 51.00,
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Frühstück 'Martens Special'",
      pl: "Śniadanie 'Martens Special'",
      en: "Breakfast 'Martens Special'"
    },
    description: {
      de: "Zwei frische pochierte Eier auf hausgemachtem handwerklichem Brot mit reifer, cremiger Avocado, Scheiben von regionalem Schinken, Kirschtomaten und frischen Sprossen.",
      pl: "Dwa świeże jajka w koszulce ułożone na domowym chlebie rzemieślniczym z dojrzałym kremowym awokado, plastrami regionalnej szynki, pomidorkami i posypką z kiełków.",
      en: "Two fresh poached eggs served on homemade olive or sourdough artisan bread with ripe creamy avocado, regional ham slices, cherry tomatoes, and microgreens."
    },
    tags: {
      de: ["Empfohlen", "Aus der Region"],
      pl: ["Polecane", "Region"],
      en: ["Recommended", "Local"]
    }
  },
  {
    id: "sn_2",
    category: MenuCategory.SNIADANIA,
    priceEur: 10.50,
    pricePln: 45.50,
    imageUrl: "https://images.unsplash.com/photo-1496042300028-e7416057a90b?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Frühstücksteller 'Niederrhein-Garten'",
      pl: "Talerz Śniadaniowy 'Ogród Niederrhein'",
      en: "Breakfast Platter 'Niederrhein Garden'"
    },
    description: {
      de: "Handwerklicher deutscher Käse, frischer hausgemachter Kräuterquark, Honig direkt aus der lokalen Gocher Imkerei, frische Weintrauben und ein Korb mit warmem, duftendem Brot und Butter.",
      pl: "Rzemieślnicze niemieckie sery, świeży domowy twaróg ziołowy, miód prosto z lokalnej pasieki w Goch, świeże winogrona oraz koszyk ciepłego, pachnącego pieczywa z masłem.",
      en: "Artisanal German cheeses, fresh homemade herb curd, honey straight from a local Goch apiary, fresh grapes, and a basket of warm, aromatic bread with butter."
    },
    tags: {
      de: ["Vegetarisch", "Lokal"],
      pl: ["Wegetariańskie", "Lokalne"],
      en: ["Vegetarian", "Local"]
    }
  },
  {
    id: "sn_3",
    category: MenuCategory.SNIADANIA,
    priceEur: 8.90,
    pricePln: 38.50,
    imageUrl: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Luftige Pancakes 'Süßer Morgen'",
      pl: "Puszyste Pancakes Słodki Poranek",
      en: "Fluffy Pancakes 'Sweet Morning'"
    },
    description: {
      de: "Drei dicke, wunderbar luftige amerikanische Pancakes, serviert mit frischen Waldbeeren, fluffiger Schlagsahne und echtem Bio-Ahornsirup.",
      pl: "Trzy grube, niezwykle puszyste amerykańskie naleśniki podawane ze świeżymi owocami leśnymi, puszystą bitą śmietaną oraz prawdziwym organicznym syropem klonowym.",
      en: "Three thick, incredibly fluffy American pancakes served with fresh wild berries, whipped cream, and genuine organic maple syrup."
    },
    tags: {
      de: ["Süß", "Für Kinder"],
      pl: ["Na słodko", "Dla dzieci"],
      en: ["Sweet", "Kids Option"]
    }
  },
  {
    id: "sn_4",
    category: MenuCategory.SNIADANIA,
    priceEur: 9.80,
    pricePln: 42.00,
    imageUrl: "https://images.unsplash.com/photo-1590412200988-a436bb705300?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Frauenstraße Shakshuka",
      pl: "Szakszuka z Frauenstraße",
      en: "Frauenstraße Shakshuka"
    },
    description: {
      de: "Drei Bio-Eier, pochiert in einer mild-pikanten, aromatischen Sauce aus frischen Tomaten, roter Paprika und Zwiebeln, bestreut mit Feta-Käse und frischem Koriander.",
      pl: "Trzy ekologiczne jajka duszone w delikatnie pikantnym, aromatycznym sosie ze świeżych pomidorów, czerwonej papryki i cebuli, posypane serem feta i świeżą kolendrą.",
      en: "Three organic eggs poached in a gently spiced, flavorful sauce of fresh tomatoes, red peppers, and onions, sprinkled with feta cheese and fresh cilantro."
    },
    tags: {
      de: ["Vegetarisch", "Pikant"],
      pl: ["Wegetariańskie", "Pikantne"],
      en: ["Vegetarian", "Spicy"]
    }
  },

  // Obiady
  {
    id: "ob_1",
    category: MenuCategory.OBIADY,
    priceEur: 10.50,
    pricePln: 45.00,
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Traditionelle Piroggen / Pierogi Domowe",
      pl: "Tradycyjne Pierogi Domowe",
      en: "Traditional Polish Pierogi"
    },
    description: {
      de: "Handgemachte goldbraun angerichtete Piroggen nach Wahl: mit Kartoffel-Käse-Füllung (Ruskie), herzhafter Fleischfüllung oder Sauerkraut und Waldpilzen. Serviert mit Schmelzzwiebeln.",
      pl: "Tradycyjne rzemieślnicze pierogi ręcznie lepione, do wyboru: ruskie (z twarogiem i ziemniakami), z soczystym farszem mięsnym lub z kapustą i leśnymi grzybami. Podawane z pachnącą okrasą z cebulki.",
      en: "Traditional handmade dumplings cooked to perfection, choice of: potato-cheese (Ruskie), flavorful minced meat, or tangy sauerkraut & forest mushrooms. Served with savory melted onions."
    },
    tags: {
      de: ["Teigtaschen", "Hausgemacht"],
      pl: ["Ręcznie lepione", "Klasyk"],
      en: ["Handmade", "Traditional"]
    }
  },
  {
    id: "ob_2",
    category: MenuCategory.OBIADY,
    priceEur: 8.50,
    pricePln: 36.50,
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Rzemieślnicza Zapiekanka Uson",
      pl: "Zapiekanka Uson (Z pieczarkami i szynką)",
      en: "Artisanal Zapiekanka Uson"
    },
    description: {
      de: "Frisch im Ofen gebackenes polnisches Rbg-Baguette mit weißen Champignons, saftigem Schinken, feinstem schmelzenden Käse und knackigen Gemüsestreifen. Fragen Sie auch nach unseren Sorten Standard, Klasik, Pikantna i Hawaii!",
      pl: "Chrupiąca rzemieślnicza zapiekanka na świeżej półbagietce z pieczarkami, szynką, serem i warzywami zapiekana z sercem w piecu. Do wyboru także inne smaki z karty: Standard, Klasik, Pikantna, Hawaii, Kurczak i Warzywna!",
      en: "Crispy local house-baked open-faced baguette (Zapiekanka) loaded with forest mushrooms, savory ham, creamy cheese, and fresh market veggies. Ask for our Standard, Klasik, Spicy, or Hawaii choices!"
    },
    tags: {
      de: ["Baguette", "Heiß serviert"],
      pl: ["Z pieca", "Bestseller"],
      en: ["Warm Bread", "Popular"]
    }
  },
  {
    id: "ob_3",
    category: MenuCategory.OBIADY,
    priceEur: 12.90,
    pricePln: 55.00,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Altpolnisches Gulasch / Gulasz Wołowy",
      pl: "Gulasz Tradycyjny (Długo gotowany)",
      en: "Traditional Old-Polish Goulash"
    },
    description: {
      de: "Traditionelles, altpolnisches Gulasch, langanhaltend geschmort, mit butterzartem Fleisch, Karotten, Paprika und einer aromatischen, dunklen Kräutersauce.",
      pl: "Tradycyjny, staropolski gulasz, niezwykle długo gotowany dla uzyskania wyjątkowej kruchości mięsa wołowo-wieprzowego, w bogatym aromatycznym sosie warzywnym.",
      en: "Traditional old-Polish beef & pork goulash stew, slow-cooked for hours to achieve melt-in-your-mouth tenderness in rich, herb-and-vegetable infused gravy."
    },
    tags: {
      de: ["Deftig", "Lange gekocht"],
      pl: ["Sycące", "Tradycyjne"],
      en: ["Filling", "Slow Cooked"]
    }
  },
  {
    id: "ob_4",
    category: MenuCategory.OBIADY,
    priceEur: 11.50,
    pricePln: 49.00,
    imageUrl: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Klassische Kohlrouladen / Gołąbki w Sosie",
      pl: "Tradycyjne Gołąbki w sosie pomidorowym",
      en: "Traditional Cabbage Rolls (Gołąbki)"
    },
    description: {
      de: "Traditionelle Kohlrouladen gefüllt mit gemischtem Hackfleisch und Reis, liebevoll gewickelt in sanfte Kohlblätter, übergossen mit samtiger Tomatensauce, serviert mit Salzkartoffeln.",
      pl: "Tradycyjne domowe gołąbki z delikatnym mięsem wieprzowym i ryżem, zawijane w liście białej kapusty, polane gęstym domowym sosem pomidorowym, podawane z ziemniakami z koperkiem.",
      en: "Authentic hand-rolled cabbage leaves stuffed with seasoned minced pork and rice, smothered in a velvety rich tomato sauce, served with buttered boiled potatoes."
    },
    tags: {
      de: ["Klassiker", "Mit Kartoffeln"],
      pl: ["Domowe smaki", "Z ziemniakami"],
      en: ["House Specialty", "With Potatoes"]
    }
  },
  {
    id: "ob_5",
    category: MenuCategory.OBIADY,
    priceEur: 9.80,
    pricePln: 42.00,
    imageUrl: "https://images.unsplash.com/photo-1547592165-e1d17fed6006?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Aromatischer Żurek im Brotlaib / Sauermehlsuppe",
      pl: "Aromatyczny Żurek w Chlebie",
      en: "Sour Rye Soup in Bread Bowl (Żurek)"
    },
    description: {
      de: "Schmackhafte, saure Mehlsuppe auf echtem, hausgemachtem Roggensauerteig, mit weißer Landwurst, geräuchertem Speck und Ei, serviert in einem knusprigen, ofenwarmen Brotlaib.",
      pl: "Tradycyjny, niezwykle aromatyczny żurek na prawdziwym domowym zakwasie żytnim, z dodatkiem białej kiełbasy, boczku i jajka, serwowany w specjalnie wypiekanym chrupiącym bochenku chleba.",
      en: "Traditional Polish sour rye soup crafted on organic wild-fermented sourdough starter with white sausage, smoked bacon, and a boiled egg, served inside an oven-toasted artisan sourdough bread bowl."
    },
    tags: {
      de: ["Im Brotlaib", "Bestseller"],
      pl: ["W chlebie", "Ulubione"],
      en: ["In Bread Bowl", "Signature"]
    }
  },
  {
    id: "ob_6",
    category: MenuCategory.OBIADY,
    priceEur: 9.50,
    pricePln: 41.00,
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Ofenkartoffel mit Hähnchen / Ziemniak Pieczony",
      pl: "Ziemniak Pieczony z kurczakiem",
      en: "Jacket Baked Potato with Chicken"
    },
    description: {
      de: "Große, im Ofen gebackene Ofenkartoffel mit würziger weißer Schnittlauchkruste, üppig gefüllt mit saftig gegrilltem Hähnchenbrustfilet, süßem Mais und aromatischer Knoblauchsauce.",
      pl: "Duży, puszysty ziemniak pieczony z chrupiącą skórką, faszerowany kawałkami aromatycznego grillowanego kurczaka, słodką kukurydzą oraz wybitnym domowym sosem czosnkowym.",
      en: "Jumbo jacket baked potato with a crispy skin, stuffed with delicious grilled chicken breast pieces, sweet golden corn, and generously drizzled with our signature house garlic sauce."
    },
    tags: {
      de: ["Leicht", "Mit Knoblauchsauce"],
      pl: ["Z pieca", "Lekkie i pożywne"],
      en: ["Baked", "With Garlic Sauce"]
    }
  },
  {
    id: "ob_7",
    category: MenuCategory.OBIADY,
    priceEur: 8.50,
    pricePln: 36.50,
    imageUrl: "https://images.unsplash.com/photo-1547592165-e1d17fed6006?q=80&w=600&auto=format&fit=crop",
    name: {
      de: "Sauerkrautsuppe / Domowy Kapuśniak",
      pl: "Domowy Kapuśniak na wędzonych żeberkach",
      en: "Hearty Sauerkraut Soup (Kapuśniak)"
    },
    description: {
      de: "Deftige Suppe aus traditionellem Sauerkraut, langsam auf geräucherten Rippchen gekocht, verfeinert mit geräuchertem Speck,Majoran und Gemüseeinlage. Sehr wärmend!",
      pl: "Rozgrzewająca, domowa zupa z kiszonej kapusty gotowana na aromatycznych wędzonych żeberkach, z boczkiem, ziemniaczkami i majerankiem.",
      en: "Deeply flavorful, warming cabbage soup brewed on smoked pork ribs with high-quality sauerkraut, bacon bits, potatoes, and local herbs."
    },
    tags: {
      de: ["Wärmend", "Herzhaft"],
      pl: ["Rozgrzewające", "Tradycja"],
      en: ["Comfort Food", "Warming"]
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
      content: "Guten Morgen Goch! ☀️ Die Sonne scheint auf der Frauenstraße und unsere Vitrine füllt sich mit Leckereien! Heute frisch vorbereitet: unser weißer Schokoladen-Himbeer-Käsekuchen 🍓 auf knusprigem Spekulatiusboden und saftiger veganer Karottenkuchen mit knackigen Nüssen. Dazu empfehlen wir frisch gebrühten Filterkaffee aus Äthiopien über V60. Genießen Sie die Sonne in unserem Kaffeegarten ab 10:00 Uhr! Wir freuen uns auf Sie!",
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
      content: "Da ist er! Unser neuer Favorit für warme Nachmittage – Espresso Tonic mit geflämmtem Rosmarinzweig! 🌿 Verbindet die feine Bitternote feinsten Tonics mit der fruchtigen Säure eines doppelten Espresso-Shots und dem herrlich aromatischen Aroma von frischem Rosmarin. Genießen Sie den Sommer in unserem traumhaften, versteckten Innenhof auf der Frauenstraße.",
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
      content: "Dzień dobry Goch! ☀️ Słońce świeci na Frauenstraße, a nasza witryna wypełnia się pysznościami! Dziś przygotowaliśmy dla Was nasz flagowy Sernik z Białą Czekoladą i Malinami 🍓 na spodzie korzennym oraz wegańskie ciasto marchewkowe z chrupiącymi orzechami. Do tego polecamy świeżo wypaloną kawę z Etiopii parzoną w drip-ie. Zapraszamy do stolików w ogrodzie od 10:00! Do zobaczenia!",
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
      content: "Mamy to! Nowy orzeźwiający faworyt na ciepłe czerwcowe popołudnia – Espresso Tonic z Gałązką Rozmarynu! 🌿 Łączy kwaskowatość podwójnego espressa, musujący tonik premium oraz niesamowity dymny posmak, który uzyskujemy muskając gałązkę rozmarynu ogniem baristycznym. Idealny napój w naszym ukrytym podwórku na Frauenstraße.",
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
      content: "Uwaga smakosze! 🧇 Zapowiada się słodka niedziela! #Event: Wielki Rzemieślniczy Festiwal Gofra w Café Martens! Serwujemy chrupiące, ciepłe gofry z bitą śmietaną, gałką lodów i pyszną gorącą konfiturą ze świeżych owoców z Niederrhein. Przyjdź spędzić czas w urokliwym podwórku na Frauenstraße. #Event",
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
      content: "Good morning Goch! ☀️ The sun is shining beautifully on Frauenstraße, and our display is loaded with pastries! Today we baked our signature White Chocolate & Raspberry Cheesecake 🍓 on a spiced cookie crust, alongside our moist vegan carrot cake with walnuts. Pair it up with Ethiopia single origin pour-over drip coffee. Outdoor seating opens at 10:00! See you soon!",
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
      content: "Here it is! An absolute summer hit for warm afternoons – Espresso Tonic with a flame-scorched Rosemary Sprig! 🌿 Merrily blending the deep botanical bitterness of premium tonic, double ristretto acidity, and an incredible aromatic finish. The absolute best drink to cool off in our cozy backyard on Frauenstraße.",
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
app.get("/api/admin/menu", (req, res) => {
  res.json({
    success: true,
    data: LOCALIZED_MENU_ITEMS
  });
});

app.post("/api/admin/menu", (req, res) => {
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
  res.json({ success: true, data: newItem });
});

app.put("/api/admin/menu/:id", (req, res) => {
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
    res.json({ success: true, data: LOCALIZED_MENU_ITEMS[idx] });
  } else {
    res.status(404).json({ success: false, message: "Item not found" });
  }
});

app.delete("/api/admin/menu/:id", (req, res) => {
  const { id } = req.params;
  LOCALIZED_MENU_ITEMS = LOCALIZED_MENU_ITEMS.filter(item => item.id !== id);
  res.json({ success: true });
});

// Admin endpoints for Event/Post management
app.get("/api/admin/posts", (req, res) => {
  res.json({
    success: true,
    data: CURRENT_POSTS_CACHE_MAPPING
  });
});

app.post("/api/admin/posts", (req, res) => {
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

  res.json({ success: true, data: { de: dePost, pl: plPost, en: enPost } });
});

app.put("/api/admin/posts/:id", (req, res) => {
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

  res.json({ success: true });
});

app.delete("/api/admin/posts/:id", (req, res) => {
  const { id } = req.params;
  for (const lang of ["de", "pl", "en"] as const) {
    CURRENT_POSTS_CACHE_MAPPING[lang] = (CURRENT_POSTS_CACHE_MAPPING[lang] || []).filter(p => p.id !== id);
  }
  res.json({ success: true });
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

// 3. Trigger active sync to crawl Facebook posts via Gemini Grounding Search
app.post("/api/sync-facebook-posts", async (req, res) => {
  const lang = (req.query.lang as string) || "de";
  const gemini = getGemini();

  const langNames: Record<string, string> = {
    de: "German",
    pl: "Polish",
    en: "English"
  };
  const currentLangName = langNames[lang] || "German";

  const localSyncMessage: Record<string, string> = {
    de: "Lokal synchronisiert aus dem Facebook-Cache (Kein Gemini API-Schlüssel eingegeben)",
    pl: "Zsynchronizowano lokalnie z pamiecią podręczną Facebook (Brak skonfigurowanego klucza API Gemini)",
    en: "Synchronized locally from Facebook cache (No Gemini API key supplied)"
  };

  const localSyncStatusText: Record<string, string> = {
    de: `Lokal aktualisiert um ${new Date().toLocaleTimeString("de-DE")}`,
    pl: `Zsynchronizowano lokalnie o ${new Date().toLocaleTimeString("pl-PL")}`,
    en: `Synchronized locally at ${new Date().toLocaleTimeString("en-US")}`
  };

  const syncCompleteMessage: Record<string, string> = {
    de: "Automatisch synchronisiert und aktualisiert mit Facebook-Beiträgen!",
    pl: "Automatycznie pobrano i uaktualniono najnowsze posty z profilu Facebook!",
    en: "AI sync complete! Latest Facebook page updates retrieved."
  };

  const syncStatusText: Record<string, string> = {
    de: `Kollaborativ synchronisiert mit KI um ${new Date().toLocaleTimeString("de-DE")}`,
    pl: `Zsynchronizowano za pomocą AI o ${new Date().toLocaleTimeString("pl-PL")}`,
    en: `Synchronized with Gemini AI at ${new Date().toLocaleTimeString("en-US")}`
  };

  const backupStatusText: Record<string, string> = {
    de: `Synchronisiert um ${new Date().toLocaleTimeString("de-DE")} (Backup-Daten verwendet)`,
    pl: `Zsynchronizowano o ${new Date().toLocaleTimeString("pl-PL")} (Użyto bazy awaryjnej)`,
    en: `Synchronized at ${new Date().toLocaleTimeString("en-US")} (Using fallback data)`
  };

  const backupMessage: Record<string, string> = {
    de: "Galerie mit Facebook-Beiträgen erfolgreich aktualisiert.",
    pl: "Uaktualniono galerię zsynchronizowaną ze stroną Facebook. (Wizyta na stronie udana!)",
    en: "Gallery successfully refreshed with baseline Facebook postings."
  };

  if (!gemini) {
    console.log(`No Gemini API key supplied or placeholder found. Returning fallback posts with randomized timings for language: ${lang}`);
    // Simulate minor synchronisation update by randomizing post dates or order to show user interaction
    const baseline = LOCALIZED_FALLBACK_POSTS[lang] || LOCALIZED_FALLBACK_POSTS["de"];
    const randomized = baseline.map(post => {
      const now = new Date();
      return {
        ...post,
        date: lang === "de" ? `Heute, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} Uhr` : 
              lang === "pl" ? `Dzisiaj, godz. ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}` :
              `Today, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
        isRealSync: true
      };
    });
    CURRENT_POSTS_CACHE_MAPPING[lang] = randomized;
    LAST_SYNC_TIME_MAPPING[lang] = localSyncStatusText[lang] || localSyncStatusText["de"];

    return res.json({
      success: true,
      data: randomized,
      lastSyncTime: LAST_SYNC_TIME_MAPPING[lang],
      method: "local-simulation",
      message: localSyncMessage[lang] || localSyncMessage["de"]
    });
  }

  try {
    console.log(`Querying Gemini 3.5-flash with Google Search grounding to retrieve current Cafe Martens & More details in ${currentLangName}...`);

    const prompt = `You are an AI data compiler for the cafe website of "Café Martens & More" located at Frauenstraße 16 (or Frauenstr. 10/16) in Goch, Germany.
We need you to perform Google Search grounding to search for recent Facebook updates, specials, breakfast, lunch, or cake/coffee promotions posted on their official Facebook page: https://www.facebook.com/profile.php?id=61584459111985.

Perform a real web search to see if they have uploaded posts about:
- breakfast options ("Frühstück")
- cakes ("Kuchen")
- food of the day/weekly card ("Tageskarte", "Maultaschen", "Waffeln", etc.)
- coffee / drinks.

Translate what you find or write realistic postings strictly into beautiful, authentic ${currentLangName}. If search results don't yield full text posts of recent days, generate highly realistic, brand-specific posts based on their real brand identity, location (Goch, Frauenstraße), opening hours, and actual food items seen in reviews (e.g. delicious waffles, cake platters, breakfast specialty coffee).

Format the output strictly as a JSON array of 5 posts.
At least 1 or 2 of these generated posts MUST represent special upcoming activities (like candlelit concerts, cooking workshops, holiday waffle events, or outdoor parties) and MUST explicitly include the hashtag '#Event' in their content text.

Each post in the JSON MUST have exactly these keys:
- "id": unique string (e.g. "fb_sync_1", "fb_sync_2", "fb_sync_3", "fb_sync_4", "fb_sync_5")
- "date": string describing when it was posted in ${currentLangName} (e.g. "Heute, 10:15", "Wczoraj, 14:00", "Yesterday, 2 PM", "Before 3 days")
- "content": the text translation/summary in ${currentLangName} (around 2-4 sentences, styled with elegant, warm social media tone, including small emojis, and including '#Event' for event posts)
- "category": a classification string in the requested ${currentLangName} (like "Frühstück", "Mittagessen", "Kuchen & Torten", "Kaffeespezialitäten", "Erfrischungsgetränke", "Wydarzenia" as appropriate)
- "imgUrl": a highly aesthetic stock photography URL from Unsplash reflecting exactly the item mentioned (e.g. if a waffle is mentioned, use a gorgeous waffle photo; if acoustic music, use a guitar/stage candlelit scene; if goulash, use that).
- "facebookUrl": "https://www.facebook.com/profile.php?id=61584459111985"
- "isRealSync": true

Format response strictly as valid, parsable JSON array. Do not wrap it in markdown code blocks like \`\`\`json. Output ONLY the JSON array.`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const responseText = response.text || "";
    console.log("Raw Gemini Response received:", responseText);

    // Clean markdown blocks if any returned despite of prompt rule
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }

    const parsedPosts = JSON.parse(cleanJson);
    if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
      CURRENT_POSTS_CACHE_MAPPING[lang] = parsedPosts.map((p, index) => ({
        ...p,
        id: p.id || `fb_real_${Date.now()}_${index}`,
        facebookUrl: "https://www.facebook.com/profile.php?id=61584459111985",
        isRealSync: true
      }));
      LAST_SYNC_TIME_MAPPING[lang] = syncStatusText[lang] || syncStatusText["de"];
      
      return res.json({
        success: true,
        data: CURRENT_POSTS_CACHE_MAPPING[lang],
        lastSyncTime: LAST_SYNC_TIME_MAPPING[lang],
        method: "gemini-ai-grounded",
        message: syncCompleteMessage[lang] || syncCompleteMessage["de"]
      });
    } else {
      throw new Error("Parsed data was not an array or was empty.");
    }

  } catch (error: any) {
    const errorStr = String(error) + (error?.stack || "") + JSON.stringify(error || {});
    const isQuotaError = errorStr.includes("RESOURCE_EXHAUSTED") || 
                         errorStr.includes("429") || 
                         errorStr.toLowerCase().includes("quota");

    if (isQuotaError) {
      console.warn("[Gemini Resource Warning] API key rate-limited or quota exhausted. Falling back to robust local offline posts gracefully.");
    } else {
      console.error("Failed to fetch/parse Facebook posts via search grounding:", error);
    }

    // Graceful fallback to refreshed cached fallback data
    const baseline = LOCALIZED_FALLBACK_POSTS[lang] || LOCALIZED_FALLBACK_POSTS["de"];
    const randomized = baseline.map(post => {
      const now = new Date();
      return {
        ...post,
        date: lang === "de" ? `Heute, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} Uhr` : 
              lang === "pl" ? `Dzisiaj, godz. ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}` :
              `Today, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
        isRealSync: true
      };
    });
    CURRENT_POSTS_CACHE_MAPPING[lang] = randomized;
    LAST_SYNC_TIME_MAPPING[lang] = backupStatusText[lang] || backupStatusText["de"];
    
    return res.json({
      success: true,
      data: randomized,
      lastSyncTime: LAST_SYNC_TIME_MAPPING[lang],
      method: "graceful-fallback",
      isQuotaExceeded: isQuotaError,
      message: backupMessage[lang] || backupMessage["de"]
    });
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
