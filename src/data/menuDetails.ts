export interface LocalizedDetails {
  ingredients: string[];
  allergens: string[];
  baristaTip: string;
}

export interface MenuItemDetails {
  de: LocalizedDetails;
  pl: LocalizedDetails;
  en: LocalizedDetails;
  badges: string[];
}

export const MENU_DETAILS_DATA: Record<string, MenuItemDetails> = {
  sn_1: {
    de: {
      ingredients: ["Zwei pochierte Bio-Eier", "Hausgemachtes Landbrot", "Reife Avocado", "Feiner regionaler Schinken", "Kirschtomaten", "Frische Rote-Bete-Sprossen", "Bio-Olivenöl", "Meersalz, Pfeffer"],
      allergens: ["Gluten (Weizenteig, Roggenmehl)", "Eier (Hühnereier)"],
      baristaTip: "Kann auf Wunsch gerne auch vegetarisch (ohne Schinken) oder komplett glutenfrei auf Salatbett serviert werden. Passt wunderbar zu unserem Cappuccino!"
    },
    pl: {
      ingredients: ["Dwa ekologiczne jaja w koszulce", "Domowy chleb rzemieślniczy", "Dojrzałe awokado", "Szynka regionalna z Niederrhein", "Pomidorki koktajlowe", "Świeże kiełki buraka", "Oliwa z oliwek", "Sól morska, pieprz"],
      allergens: ["Gluten (pszenica, żyto)", "Jaja (kurze)"],
      baristaTip: "Na życzenie przygotujemy wersję wegetariańską (bez szynki) lub bezglutenową na bazie chrupiących sałat. Spróbuj z naszym Flat White!"
    },
    en: {
      ingredients: ["Two organic poached eggs", "Artisanal country bread", "Ripe avocado", "Premium regional ham", "Cherry tomatoes", "Fresh beetroot sprouts", "Organic olive oil", "Sea salt, black pepper"],
      allergens: ["Gluten (wheat, rye bread)", "Eggs"],
      baristaTip: "Can be customized as vegetarian (no ham) or gluten-free served over a fresh bed of lettuce. Best enjoyed with our velvety Cappuccino!"
    },
    badges: ["gluten", "eggs"]
  },
  sn_2: {
    de: {
      ingredients: ["Auswahl deutscher Weich- und Schnittkäse", "Feiner Kräuterquark", "Regionaler Bio-Frühlingshonig", "Frische Weintrauben", "Ofenwarme Brötchen & Landbrot", "Frische deutsche Markenbutter"],
      allergens: ["Milch und Milchprodukte (Laktose)", "Gluten (Weizen, Gerste, Roggen)"],
      baristaTip: "Der Honig wird wöchentlich frisch von der Gocher Imkerei geliefert. Ein echter Vorgeschmack auf den Niederrhein!"
    },
    pl: {
      ingredients: ["Wybór niemieckich serów rzemieślniczych", "Domowy twarożek ziołowy", "Miód wielokwiatowy z pasieki w Goch", "Świeże winogrona", "Ciepłe bułeczki i chleb", "Masło ekstra"],
      allergens: ["Mleko i produkty pochodne (laktaza, laktoza)", "Gluten (pieczywo mieszane)"],
      baristaTip: "Nasz miód pochodzi z certyfikowanej lokalnej pasieki w Goch. Najlepsza lokalna słodycz na dobry początek dnia!"
    },
    en: {
      ingredients: ["Selection of artisanal German cheeses", "Homemade savory herb curd", "Local organic honey from Goch apiary", "Fresh table grapes", "Warm basket of rolls & sourdough bread", "Fresh cream butter"],
      allergens: ["Milk and milk products (Lactose)", "Gluten (wheat, barley, rye)"],
      baristaTip: "The honey is delivered weekly by our friendly local beekeeper in Goch. A true taste of the Lower Rhine region!"
    },
    badges: ["lactose", "gluten"]
  },
  sn_3: {
    de: {
      ingredients: ["Dicke amerikanische Pancakes", "Frische reife Waldbeeren (Heidelbeeren, Himbeeren)", "Hausgeschlagene süße Sahne", "Echter kanadischer Bio-Ahornsirup", "Ein Hauch Puderzucker"],
      allergens: ["Gluten (Weizenmehl)", "Eier", "Milch und Milchprodukte (Laktose)"],
      baristaTip: "Absoluter Liebling unserer kleinsten Gäste. Auf Wunsch servieren wir den Ahornsirup gerne separat!"
    },
    pl: {
      ingredients: ["Puszyste amerykańskie naleśniki", "Świeże owoce leśne (borówki, maliny)", "Świeża bita śmietana 30%", "Prawdziwy kanadyjski syrop klonowy (klasa A)", "Cukier puder"],
      allergens: ["Gluten (mąka pszenna typ 500)", "Jaja kurze", "Mleko i śmietanka (laktaza)"],
      baristaTip: "Ulubiony wybór najmłodszych gości. Na życzenie podamy syrop klonowy w osobnym dzbanuszku."
    },
    en: {
      ingredients: ["Thick fluffy American pancakes", "Fresh wild berries (blueberries, raspberries)", "Freshly whipped sweet cream", "Genuine Canadian organic maple syrup", "Powdered sugar dusting"],
      allergens: ["Gluten (wheat flour)", "Eggs", "Milk and dairy (Lactose)"],
      baristaTip: "The absolute favorite among our youngest visitors. We can serve the syrup on the side upon request."
    },
    badges: ["gluten", "eggs", "lactose"]
  },
  sn_4: {
    de: {
      ingredients: ["Drei Bio-Eier", "Sanft gekochte Tomatensauce", "Rote & gelbe Paprika", "Gewürfelte Zwiebeln", "Aromatischer Feta-Käse", "Frischer Koriander & Kreuzkümmel", "Knoblauch, Olivenöl", "Warmes Baguette"],
      allergens: ["Gluten (Baguettebeilage)", "Eier", "Milch und Milchprodukte (Feta-Käse)"],
      baristaTip: "Wird kochend heiß in der gusseisernen Pfanne serviert. Perfekt, um das knusprige Brot direkt in die Sauce zu tunken!"
    },
    pl: {
      ingredients: ["Trzy ekologiczne jajka", "Siekane pomidory z sosem", "Dojrzała czerwona i żółta papryka", "Słodka cebula dymka", "Grecki ser feta (owczo-kozi)", "Świeża kolendra, kumin", "Czosnek, oliwa", "Chrupiąca bagietka"],
      allergens: ["Gluten (bagietka pszenna)", "Jaja", "Mleko (grecki ser feta)"],
      baristaTip: "Danie podajemy bezpośrednio w gorącej, żeliwnej patelni. Idealna do maczania pieczywa w aksamitnym żółtku!"
    },
    en: {
      ingredients: ["Three fresh organic eggs", "Slow-cooked vine tomato reduction", "Sweet red & yellow bell peppers", "Diced red onions", "Creamy Greek feta cheese", "Fresh cilantro, cumin & coriander", "Garlic, olive oil", "Warm baguette slices"],
      allergens: ["Gluten (wheat baguette)", "Eggs", "Milk (feta cheese)"],
      baristaTip: "Served boiling hot directly in a cast-iron skillet. Ideal for dipping the crispy baguette into the rich, saucy yolks!"
    },
    badges: ["gluten", "eggs", "lactose"]
  },
  ob_1: {
    de: {
      ingredients: ["Feiner hausgemachter Nudelteig", "Nach Wahl: Cremige Quark-Kartoffel-Füllung / Saftiges Hackfleisch / Sauerkraut & Waldpilze", "Geschmolzene Butter & goldbraune Zwiebeln", "Wahlweise frischer Sauerrahm"],
      allergens: ["Gluten (Weizenmehl)", "Milch (in der Quark-Kartoffel-Füllung & Butter)", "Eier (im Teig vorhanden)"],
      baristaTip: "Diese traditionellen polnischen Teigtaschen werden täglich von Hand frisch für Sie geknetet und gefüllt!"
    },
    pl: {
      ingredients: ["Delikatne, cienkie ciasto makaronowe", "Receptura do wyboru: serowo-ziemniaczana (ruskie) / soczyste mięso wieprzowe / duszona kapusta kiszona z leśnymi grzybami", "Złocista okrasa z cebulki na maśle", "Opcjonalnie gęsta śmietana 18%"],
      allergens: ["Gluten (mąka pszenna)", "Mleko (twaróg w ruskich, masło)", "Jaja (zawarte w elastycznym cieście)"],
      baristaTip: "Nasze pierogi lepimy ręcznie według starego rodzinnego przepisu właściciela. To unikalny polski akcent przy rynku w Goch!"
    },
    en: {
      ingredients: ["Delicate handmade pasta dough", "Choice of filling: Creamy curd & potato / Rich minced pork loin / Sour-savory sauerkraut & forest mushrooms", "Melted butter & caramelized golden onions", "Optional side of fresh sour cream"],
      allergens: ["Gluten (wheat flour)", "Milk (present in potato-curd filling & butter)", "Eggs (integral to the dough)"],
      baristaTip: "These legendary dumplings are rolled and pinched by hand daily. A true home-cooked Polish masterpiece in Goch!"
    },
    badges: ["gluten", "lactose", "eggs"]
  },
  ob_2: {
    de: {
      ingredients: ["Halbes handwerkliches Landbaguette", "Frische weiße Champignons (gedünstet)", "Saftiger regionaler Schinken", "Gouda-Käse (geschmolzen)", "Frischer Schnittlauch", "Sauce nach Wahl (Ketchup / Knoblauchsauce)"],
      allergens: ["Gluten (Weizenbaguette)", "Milch und Laktose (Gouda-Käse, Knoblauchsauce)"],
      baristaTip: "Ein polnisches Streetfood-Kultgericht in handwerklicher Qualität! Knusprig gebacken im Steinofen."
    },
    pl: {
      ingredients: ["Świeża, chrupiąca półbagietka rzemieślnicza", "Świeże pieczarki duszone na maśle", "Soczysta szynka wieprzowa", "Ser Gouda dojrzewający", "Drobny świeży szczypiorek", "Firmowy sos do wyboru (ketchup rzemieślniczy / sos czosnkowy)"],
      allergens: ["Gluten (pieczywo pszenne)", "Mleko (masło, ser gouda, baza sosu czosnkowego)"],
      baristaTip: "Kultowy polski fast food w wersji Premium! Pieczona krótko w bardzo wysokiej temperaturze dla idealnej chrupkości."
    },
    en: {
      ingredients: ["Half-length artisan baguette", "Fresh white button mushrooms (sautéed)", "Savory regional ham", "Melted local Dutch Gouda cheese", "Fresh chopped chives", "Drizzle of house sauce (fine ketchup or double-garlic sauce)"],
      allergens: ["Gluten (wheat baguette)", "Milk & Lactose (Gouda, butter, garlic sauce base)"],
      baristaTip: "An iconic Polish classic made with local organic ingredients. Baked to perfection in our high-heat stone oven!"
    },
    badges: ["gluten", "lactose"]
  },
  ob_3: {
    de: {
      ingredients: ["Ausgewähltes Rind- und Schweinefleisch", "Frische Karotten & Zwiebeln", "Rote Paprika", "Waldpilzaroma", "Frische Petersilie", "Karpaten-Majoran & Piment", "Hausgemachte Gemüsebrühe"],
      allergens: ["Sellerie (in der kräftigen Gemüsebrühe)", "Gluten (durch traditionelle Mehlschwitze zum Binden)"],
      baristaTip: "Dieses Gulasch köchelt über 6 Stunden, bis das Fleisch beim Berühren mit der Gabel zerfällt. Ein Traum!"
    },
    pl: {
      ingredients: ["Krojona wołowina i wieprzowina", "Marchewka, pietruszka, cebula", "Czerwona papryka słodka", "Grzyby leśne suszone", "Natka pietruszki", "Majeranek karpacki, ziele angielskie"],
      allergens: ["Seler (wywar warzywny)", "Gluten (delikatne zagęszczenie mąką)"],
      baristaTip: "Gulasz gotujemy powoli przez ponad 6 godzin. Mięso jest tak delikatne, że rozpływa się w ustach!"
    },
    en: {
      ingredients: ["Selected tender beef & pork cuts", "Fresh carrots & yellow onions", "Red bell peppers", "Dried forest mushrooms for aroma", "Fresh flat parsley", "Carpathian marjoram & allspice", "Rich slow-cooked vegetable broth"],
      allergens: ["Celery (present in the rich stock)", "Gluten (used in traditional flour roux translation)"],
      baristaTip: "This authentic polish stew is simmered for over 6 hours until the meat is incredibly tender and succulent. Absolute comfort food!"
    },
    badges: ["gluten", "celery"]
  },
  ob_4: {
    de: {
      ingredients: ["Blätter von frischem Weißkohl", "Gewürztes Schweinehackfleisch", "Weißer Langkornreis", "Aromatische crushed San Marzano Tomaten", "Gemüsebrühe", "Kartoffelpüree oder Salzkartoffeln mit Dill"],
      allergens: ["Sellerie (in der Kochbrühe)", "Milch (Kohlenhydratbeilage enthält Butter/Milch)"],
      baristaTip: "Gołąbki bedeuten übersetzt 'Täubchen'. Ein feines und leicht bekömmliches polnisches Nationalgericht."
    },
    pl: {
      ingredients: ["Liście sparzonej kapusty białej", "Mielona łopatka wieprzowa", "Ryż biały długoziarnisty", "Przecier ze słodkich pomidorów", "Wywar warzywno-mięsny", "Ziemniaki gotowane posypane młodym koperkiem"],
      allergens: ["Seler (wywar basowy do kapusty)", "Mleko (masło dodawane do tłuczonych ziemniaków)"],
      baristaTip: "Prawdziwy smak polskiego, niedzielnego obiadu. Delikatne, pożywne i polane gęstym sosem pomidorowym z koperkiem."
    },
    en: {
      ingredients: ["Softened white cabbage leaves", "Seasoned minced pork loin", "White long-grain rice", "Crushed Italian vine tomatoes", "Fresh vegetable & meat bone broth", "Boiled potatoes dusted with fresh aromatic dill"],
      allergens: ["Celery (contained in the cooking broth)", "Milk (present as butter in mashed/buttered potato side)"],
      baristaTip: "Translated literally as 'little pigeons', cabbage rolls are a deeply beloved Polish comfort dish. Very satisfying and light!"
    },
    badges: ["celery", "lactose"]
  },
  ob_5: {
    de: {
      ingredients: ["Zersetzter Roggensauerteig-Ansatz", "Weiße schlesische Wurst", "Geräucherter Speck", "Hartgekochte Bio-Eier", "Majoran & Knoblauch", "Frischer Sauerrahm", "Aushöhltes rundes Weizenbrot"],
      allergens: ["Gluten (Roggen-Sauerteig, Weizenbrotlaib)", "Milch (Sauerrahm)", "Eier", "Senf (in der weißen Wurst vorhanden)"],
      baristaTip: "Der knusprige Brotlaib ist vollständig essbar! Am besten die Innenwand mit dem Suppenlöffel abschaben."
    },
    pl: {
      ingredients: ["Naturalny, dziki zakwas żytni", "Biała kiełbasa parzona", "Boczek wędzony dymem olchowym", "Gotowane jajko na twardo", "Majeranek, czosnek, liść laurowy", "Śmietanka kwaśna 18%", "Chrupiący chlebek czarkowy"],
      allergens: ["Gluten (zakwas żytni, chleb pszenny)", "Mleko (zabielenie śmietaną)", "Jaja", "Gorczyca (przyprawy w białej kiełbasie)"],
      baristaTip: "Bochenek chleba jest upieczony na chrupko i nadaje się w 100% do zjedzenia! Wyskrobuj łyżką boki nasiąknięte żurkiem."
    },
    en: {
      ingredients: ["Organic wild-fermented rye sourdough starter", "White pork sausage link", "Applewood smoked bacon", "Hard-boiled organic egg", "Aromatic marjoram, garlic & bay leaf", "Fresh sour cream splash", "Crispy hollowed artisan bread bowl"],
      allergens: ["Gluten (rye starter, wheat bread bowl)", "Milk (sour cream creaminess)", "Eggs", "Mustard (present in sausage recipe herbs)"],
      baristaTip: "The toasted bread bowl is completely edible! Scrape the sourdough inner crust soaked in hot sour soup for an authentic bite."
    },
    badges: ["gluten", "lactose", "eggs", "mustard"]
  },
  ob_6: {
    de: {
      ingredients: ["Große Ofenkartoffel (mehlig kochend)", "Gegrillte Hähnchenbruststücke", "Goldgelber süßer Mais", "Schnittlauch-Kräuterquark", "Rapsöl, Salz, hauseigene Knoblauchgewürze", "Frische Kräuter"],
      allergens: ["Milch und Laktose (Schnittlauchquark)", "Sulfite (im Maiskonservat)"],
      baristaTip: "Für eine vegetarische Version fragen Sie gerne nach unserer köstlichen Variante mit gegrilltem Schafskäse!"
    },
    pl: {
      ingredients: ["Wielki ziemniak pieczony z folii", "Grillowany filet z piersi kurczaka", "Kukurydza złocista", "Twaróg ze świeżym szczypiorkiem", "Olej rzepakowy tłoczony", "Zioła, mieszanka przypraw czosnkowych"],
      allergens: ["Mleko (serek twarogowy ze szczypiorkiem)"],
      baristaTip: "Wolisz opcję bez mięsa? Zamów wersję z pieczonym greckim fetą wegetariańską. Równie sycąca!"
    },
    en: {
      ingredients: ["Jumbo baking potato", "Grilled tender chicken breast strips", "Sweet golden sweetcorn kernels", "Herb and green chive curd cheese", "Canola oil, sea salt, garlic spices", "Fresh garden herbs"],
      allergens: ["Milk & Lactose (chive cream cheese curd)"],
      baristaTip: "We can easily prepare this as a vegetarian option by swapping grilled chicken for spiced baked feta cheese!"
    },
    badges: ["lactose"]
  },
  ob_7: {
    de: {
      ingredients: ["Traditionell fermentiertes Sauerkraut", "Geräucherte Schweinerippchen", "Rauchspeck-Stücke", "Zwiebeln, Karotten", "Kartoffelwürfel", "Getrockneter Majoran, Lorbeerblatt, Pfefferkörner"],
      allergens: ["Sellerie (Kochgemüsebasis)"],
      baristaTip: "Kapuśniak ist herrlich sauer und extrem reich an Vitamin C. Ideal für kalte oder regnerische Tage!"
    },
    pl: {
      ingredients: ["Kapusta kiszona tradycyjna", "Wędzone żeberka wieprzowe", "Boczek wędzony surowy", "Cebula, marchewka", "Kostki ugotowanych ziemniaków", "Majeranek roztarty, liść laurowy, ziele angielskie"],
      allergens: ["Seler (warzywny wywar bazowy)"],
      baristaTip: "Nasz kapuśniak jest wspaniale kwaśny, głęboki w smaku i bogaty w witaminę C. Genialny na rozgrzanie po spacerze!"
    },
    en: {
      ingredients: ["Slow-fermented sour cabbage (sauerkraut)", "Smoked pork ribs", "Smoked bacon chunks", "Onions, sweet carrots", "Diced field potatoes", "Rubbed marjoram, bay leaf, whole black pepper"],
      allergens: ["Celery (present in the vegetable root base)"],
      baristaTip: "Our sauerkraut soup is healthfully sour, savory, and loaded with Vitamin C. The perfect warming comfort soup on a breezy day!"
    },
    badges: ["celery"]
  },
  ci_1: {
    de: {
      ingredients: ["Doppelrahm-Frischkäse", "Weiße belgische Premium-Schokolade", "Gefrorene & frische Himbeeren", "Spekulatius-Gewürzplätzchen", "Butter, Zucker, Vanilleschote", "Gelatine"],
      allergens: ["Gluten (Spekulatiusboden - Weizenteig)", "Milch und Laktose (Frischkäse, weiße Schokolade, Butter)", "Sojalecithin (in weißer Schokolade vorhanden)"],
      baristaTip: "Unser berühmtester Kuchen! Passt phänomenal zur fruchtigen Säure unseres Espresso Tonic oder Drip V60."
    },
    pl: {
      ingredients: ["Twaróg kremowy podwójnie tłusty", "Biała belgijska czekolada Callebaut", "Świeże i mrożone maliny", "Ciasteczka korzenne Spekulatius", "Masło, cukier, prawdziwa wanilia Bourbon", "Żelatyna spożywcza"],
      allergens: ["Gluten (spód z ciasteczek pszennych)", "Mleko (twaróg, masło, biała czekolada)", "Lecytyna sojowa (emulgator w czekoladzie)"],
      baristaTip: "Nasz absolutny hit cukierniczy! Idealnie kontrastuje z owocową kwasowością alternatywnej kawy parzonej przez drip V60."
    },
    en: {
      ingredients: ["Double cream cream-cheese", "Belgian white chocolate couverture", "Tart wild raspberries (ripe & jam reduction)", "Traditional spiced Speculoos cookies", "Butter, sugar, genuine Bourbon vanilla bean", "Gelatine"],
      allergens: ["Gluten (Speculoos cookie crust - wheat)", "Milk & Lactose (cream cheese, white chocolate, butter)", "Soy lecithin (emulsifier standard in white chocolate)"],
      baristaTip: "Our absolute bestseller and signature dessert! Creates a mesmerizing pairing with the clean, bright notes of our V60 pour-over."
    },
    badges: ["gluten", "lactose", "soy"]
  },
  ci_2: {
    de: {
      ingredients: ["Säuerliche Boskoop-Äpfel", "Hauchdünner handgezogener Strudelteig", "Rosinen eingeweicht", "Ceylon-Zimt, gebräunte Mandelsplitter", "Butter", "Warme hausgemachte Vanillesauce (Zucker, Milch, Vanilleschote, Eigelb)"],
      allergens: ["Gluten (Strudelteig - Weizen)", "Milch (Butter im Teig, Milch in der Vanillesauce)", "Nüsse (Mandelstücke im Inneren)", "Eier (Eigelb in der Vanillesauce)"],
      baristaTip: "Wird ofenwarm direkt mit heißer Vanillesauce serviert. Der Duft nach Zimt in der Kaffeestube ist unschlagbar!"
    },
    pl: {
      ingredients: ["Kwaśne jabłka odmiany Boskoop", "Cieniutkie, ręcznie rozciągane ciasto strudlowe", "Rodzynki", "Cynamon cejloński, prażone płatki migdałów", "Masło klarowane", "Ciepły sos waniliowy (mleko, żółtka jaj, prawdziwa wanilia)"],
      allergens: ["Gluten (mąka pszenna)", "Mleko (masło, mleko w sosie waniliowym)", "Orzechy (płatki migdałów w nadzieniu)", "Jaja (żółtka w sosie)"],
      baristaTip: "Strudel podajemy na ciepło prosto z pieca, skąpany w gęstym sosie waniliowym. Aromat cynamonu niesie się po całej kawiarni!"
    },
    en: {
      ingredients: ["Tangy tart Boskoop apples", "Paper-thin stretched strudel pastry", "Plump sweet raisins", "Ceylon cinnamon, toasted almond slices", "Clarified butter", "Warm homemade vanilla custard sauce (milk, sugar, vanilla bean, egg yolks)"],
      allergens: ["Gluten (wheat pastry flour)", "Milk (butter in dough, milk in the custard)", "Nuts (almond slivers inside)", "Eggs (yolks used in custard)"],
      baristaTip: "Served oven-warm, bathed in our luxurious hot vanilla custard. The comforting autumn aroma of cinnamon is simply incredible!"
    },
    badges: ["gluten", "lactose", "nuts", "eggs"]
  },
  ci_3: {
    de: {
      ingredients: ["Dunkler Kakaobiskuit", "Edelbitter-Schokolade (Schokoraspeln & Teig)", "Sauerkirschen in eigenem Saft", "Echtes polnisches Kirschwasser (Wiśniówka)", "Frische Weidemann-Konditorsahne", "Vanille"],
      allergens: ["Gluten (Weizenmehl)", "Milch (Schlagsahne, Schokolade)", "Eier (Biskuitteig)", "Sojalecithin (in Bitterschokolade)"],
      baristaTip: "Enthält Alkohol (Kirschwasser). Wenn Sie eine alkoholfreie Tortenvariante bevorzugen, sprechen Sie uns bitte einfach an!"
    },
    pl: {
      ingredients: ["Ciemny biszkopt kakaowy", "Gorzka belgijska czekolada", "Kandyzowane kwaśne wiśnie", "Tradycyjna polska Wiśniówka (likier)", "Świeża śmietanka cukiernicza bita 36%", "Wanilia madagaskarska"],
      allergens: ["Gluten (mąka pszenna)", "Mleko (śmietanka, czekolada)", "Jaja (puszysty biszkopt)", "Lecytyna sojowa"],
      baristaTip: "Tort zawiera alkohol (prawdziwą wiśniówkę). Jeśli szukasz wersji bezalkoholowej dla dzieci, zapytaj o ciasto owocowe dnia."
    },
    en: {
      ingredients: ["Dark cocoa sponge cake layers", "Bitter dark chocolate shards & mousse", "Tart red sour cherries", "Traditional Polish cherry liqueur (Wiśniówka)", "Fresh double whipped pastry cream", "Madagascar vanilla"],
      allergens: ["Gluten (wheat sponge cake flour)", "Milk (whipping cream, dark chocolate)", "Eggs (sponge cake base)", "Soy lecithin"],
      baristaTip: "This torte contains alcohol (real cherry Wiśniówka). For alcohol-free cake options perfect for kids, feel free to ask our staff!"
    },
    badges: ["gluten", "lactose", "eggs", "soy"]
  },
  ci_4: {
    de: {
      ingredients: ["Fein geriebene süße Karotten", "Weizenmehl, Backpulver", "Walnusskerne (gehackt)", "Sultaninen", "Sonnenblumenöl, Rohrzucker", "Veganes Frosting (Frischkäse-Alternative, Puderzucker, Kokosfett, Orangenschale)"],
      allergens: ["Gluten (Mehl)", "Nüsse (Walnusskerne)"],
      baristaTip: "Unser Karottenkuchen ist zu 100% vegan und laktosefrei gebacken. Unglaublich saftig und aromatisch!"
    },
    pl: {
      ingredients: ["Słodka marchew starta na tarce", "Mąka pszenna, proszek do pieczenia", "Orzechy włoskie krojone", "Rodzynki sułtańskie", "Olej słonecznikowy tłoczony na zimno, cukier trzcinowy", "Wegański krem (serek roślinny, tłuszcz kokosowy, cukier puder, otarta skórka pomarańczy)"],
      allergens: ["Gluten (mąka pszenna w cieście)", "Orzechy (orzechy włoskie)"],
      baristaTip: "Nasze ciasto marchewkowe jest w 100% wegańskie i wolne od laktozy. Niezwykle wilgotne, puszyste i zdrowe!"
    },
    en: {
      ingredients: ["Finely grated sweet organically grown organic carrots", "Wheat pastry flour, baking powder", "Toasted chopped walnuts", "Golden sweet raisins", "Sunflower seed oil, raw brown sugar", "Plant-based frosting (vegan cream cheese alternative, powdered sugar, coconut oil, fresh orange zest)"],
      allergens: ["Gluten (wheat baking flour)", "Nuts (english walnuts)"],
      baristaTip: "This delicious cake is 100% vegan-friendly and inherently dairy-free. Incredibly moist, well-spiced, and aromatic!"
    },
    badges: ["gluten", "nuts", "vegan"]
  },
  ci_5: {
    de: {
      ingredients: ["Dinkelmehl-Waffelteig nach Hausrezept", "Eier, Milch", "Warme Sauerkirschen", "Eine Kugel cremiges Bourbon-Vanilleeis", "Frische Schlagsahne", "Puderzucker"],
      allergens: ["Gluten (Dinkelmehl)", "Milch (Sahne, Waffelteig, Eis)", "Eier"],
      baristaTip: "Der absolute Renner am Nachmittag! Ideal zu einem unserer frisch zubereiteten Drip-Kaffees."
    },
    pl: {
      ingredients: ["Domowe ciasto gofrowe na bazie mąki orkiszowej", "Świeże jaja kurze", "Ciepła konfitura z drylowanych wiśni", "Gałka rzemieślniczych lodów waniliowych", "Prawdziwa bita śmietana", "Cukier puder"],
      allergens: ["Gluten (mąka orkiszowa)", "Mleko (śmietana, ciasto, lody)", "Jaja kurze"],
      baristaTip: "Absolutny bestseller w porze podwieczorku! Doskonale pasuje do filiżanki naszej kawy przelewowej V60."
    },
    en: {
      ingredients: ["Homemade spelt waffle batter", "Fresh organic eggs, whole milk", "Warm tart sour cherries", "A scoop of premium bourbon vanilla ice cream", "Freshly whipped cream", "Powdered sugar dusting"],
      allergens: ["Gluten (spelt flour)", "Milk (cream, waffle batter, ice cream)", "Eggs"],
      baristaTip: "A customer favorite in the afternoon! Pairs beautifully with our specialty V60 filter coffee."
    },
    badges: ["gluten", "lactose", "eggs"]
  },
  ka_1: {
    de: {
      ingredients: ["Double Shot Espresso (100% Arabica Specialty, Äthiopien/Brasilien)", "Frische gedämpfte Vollmilch (3.8% Fett)", "Mikromilchschaum", "Kakaopulver-Duster"],
      allergens: ["Milch und Laktose (Kuhmilch)"],
      baristaTip: "Auf Wunsch bereiten wir Ihr Cappuccino sehr gerne mit glutenfreiem Barista-Haferdrink oder Sojadrink zu!"
    },
    pl: {
      ingredients: ["Podwójne espresso (ziarna 100% Arabica Specialty)", "Ciepłe, spienione mleko krowie 3.2%", "Jedwabista pianka mikro pęcherzykowa", "Posypka z naturalnego kakao"],
      allergens: ["Mleko i laktaza (mleko krowie świeże)"],
      baristaTip: "Na życzenie przygotujemy Twoje cappuccino na bazie owsianego napoju bezglutenowego Oatly Barista!"
    },
    en: {
      ingredients: ["Double shot espresso (14g ground 100% Arabica Specialty blend)", "Warm steamed cow's milk (3.5% fat)", "Velvety microfoam", "Organic cocoa dusting"],
      allergens: ["Milk & Lactose (cow's milk)"],
      baristaTip: "We are happy to swap fresh milk for gluten-free barista-grade oat milk or high-protein soy milk upon request!"
    },
    badges: ["lactose"]
  },
  ka_2: {
    de: {
      ingredients: ["Zwei Ristretto-Shots (konzentrierterer, süßerer Espresso Extrakt)", "Dünner Mikromilchschaum", "Gedämpfte Frischmilch"],
      allergens: ["Milch und Laktose (Kuhmilch)"],
      baristaTip: "Ristretto schmeckt viel süßer und hat weniger Bitterkeit als klassischer Espresso. Ideal für Kaffeeliebhaber!"
    },
    pl: {
      ingredients: ["Dwa shoty Ristretto (krótka ekstrakcja, maksimum słodyczy i aromatu ziaren)", "Bardzo cienka warstwa aksamitnej pianki", "Spienione mleko rzemieślnicze"],
      allergens: ["Mleko (krowie)"],
      baristaTip: "Swoje Flat White możesz wypić również w wersji bezkofeinowej lub na bazie napoju owsianego dla wegan."
    },
    en: {
      ingredients: ["Two Ristretto shots (shorter, sweeter, and more concentrated espresso draw)", "Micro-steamed milk", "Super thin silky microfoam"],
      allergens: ["Milk & Lactose"],
      baristaTip: "The shorter extraction of Ristretto limits bitterness while locking in natural sweetness. A sophisticated coffee!"
    },
    badges: ["lactose"]
  },
  ka_3: {
    de: {
      ingredients: ["Frisch gemahlene Single-Origin-Bohnen (z.B. Äthiopien Yirgacheffe, gewaschen)", "Über Heißwasser gefiltert", "Sauerstoffgebleichtes Papierfilter-Extrakt"],
      allergens: [],
      baristaTip: "Schmeckt fast wie Tee! Reich an floralen, zitrusartigen Aromen. Lassen Sie den Kaffee 2 Minuten abkühlen – die Fruchtigkeit wird explodieren!"
    },
    pl: {
      ingredients: ["Świeżo mielona kawa jednorodna Single Origin (np. Etiopia Yirgacheffe)", "Woda przefiltrowana o temperaturze 92°C", "Papierowy mikrofiltr"],
      allergens: [],
      baristaTip: "Idealnie przejrzysty napar o herbacianej konsystencji i uderzających nutach kwiatów i cytrusów. Daj mu chwilę ostygnąć dla pełni smaku!"
    },
    en: {
      ingredients: ["Freshly ground Single Origin specialty coffee beans (e.g., Ethiopia honey-processed)", "Purified water heated to exactly 92.5°C", "Oxygen-bleached paper filter extraction"],
      allergens: [],
      baristaTip: "Incredibly light, clean, and tea-like in body. Let the cup cool for two minutes – the deep fruity notes will blossom beautifully!"
    },
    badges: []
  },
  ka_4: {
    de: {
      ingredients: ["Ein Shot Espresso Arabica", "Hausgemachter Lavendelblütensirup (Zucker, Wasser, getrocknete Bio-Lavendelblüten)", "Sanft geschäumte, heiße Milch"],
      allergens: ["Milch und Laktose (Kuhmilch)"],
      baristaTip: "Wir verwenden ausschließlich echten französischen Esslavendel aus kontrolliertem Anbau. Beruhigend und lecker zugleich!"
    },
    pl: {
      ingredients: ["Pojedynczy shot intensywnego espresso", "Syrop lawendowy domowej roboty (cukier trzcinowy, suszone pąki lawendy jadalnej)", "Mleko rzemieślnicze spienione trójwarstwowo"],
      allergens: ["Mleko (mleko krowie laktoserowe)"],
      baristaTip: "Do syropu używamy wyłącznie najlepszej jadalnej lawendy lekarskiej. Cudownie uspokajający i relaksujący napój!"
    },
    en: {
      ingredients: ["Single rich espresso shot", "Homemade lavender syrup (water, cane sugar, organic French culinary lavender buds)", "Three-layer steamed hot milk"],
      allergens: ["Milk & Lactose (standard milk)"],
      baristaTip: "We only use certified edible French lavender flowers. Perfect for a calming afternoon break or a relaxing chat."
    },
    badges: ["lactose"]
  },
  na_1: {
    de: {
      ingredients: ["Frisch gepresster Zitronensaft (2 ganze Zitronen)", "Rohrzuckersirup", "Zweige aus unserem Kaffeegarten", "Eiswürfel & gekühltes spritziges Sodawasser"],
      allergens: [],
      baristaTip: "Wird ohne künstliche Aromen oder Säfte zubereitet. Pure, erfrischende Natur an sonnigen Tagen!"
    },
    pl: {
      ingredients: ["Sok świeżo wyciskany z cytryn (około 2 sztuk)", "Nierafinowany syrop z trzciny cukrowej", "Liście mięty pieprzowej", "Zgniatany lód wodny, woda gazowana nasycona dymkiem bąbelkowym"],
      allergens: [],
      baristaTip: "Prawdziwa domowa lemoniada bazowana na naturalnych sokach bez grama ulepszaczy. Maksymalna rześkość i chłód!"
    },
    en: {
      ingredients: ["Freshly hand-squeezed yellow lemon juice", "Organic raw cane sugar simple syrup", "Garden-fresh mint sprigs", "Crushed pure ice & dynamic sparkling soda water"],
      allergens: [],
      baristaTip: "Absolutely free of artificial colors, flavorings, or syrups. Natural citrus power to quench your summer thirst!"
    },
    badges: []
  },
  na_2: {
    de: {
      ingredients: ["Double Shot Espresso Arabica", "Premium Botanical Tonic Water", "Frischer Rosmarinzweig (am Tisch geflämmt)", "Zitronenscheibe, große Eiswürfel"],
      allergens: ["Chinin (im Tonic Water enthalten)"],
      baristaTip: "Das Rosmarinaroma wird durch kurzes Anflämmen des Zweigs aktiviert. Atmen Sie den Duft ein, bevor Sie den ersten Schluck nehmen!"
    },
    pl: {
      ingredients: ["Podwójne espresso ze świeżej Arabiki", "Tonik Premium z ekstraktem botanicznym", "Świeża gałązka rozmarynu (opalana)", "Plasterek cytryny, grube kostki lodu"],
      allergens: ["Chinina (składnik toniku)"],
      baristaTip: "Zanim się napijesz, poczuj zapach opalonego nad ogniem rozmarynu, który pobudza zmysły. Genialne połączenie goryczki ze słodyczą."
    },
    en: {
      ingredients: ["Double shot freshly pulled Arabica espresso", "Premium botanically-brewed tonic water", "Fresh garden rosemary sprig (lightly torched at the bar)", "Lemon wheel, jumbo ice cubes"],
      allergens: ["Quinine (naturally present in quality tonic water)"],
      baristaTip: "We toast the rosemary sprig to activate its aromatic oils. Take a deep breath of the woodsy aroma before taking your first sip!"
    },
    badges: []
  },
  na_3: {
    de: {
      ingredients: ["Premium loser schwarzer Tee (Ceylon)", "Pfirsich-Fruchtextrakt-Sirup", "Frische Blätter der Zitronenmelisse", "Eiswürfel, Orangenscheibe"],
      allergens: [],
      baristaTip: "Die Zitronenmelisse pflücken wir täglich frisch direkt aus unserem schattigen Kaffeegarten hinter dem Café am Markt."
    },
    pl: {
      ingredients: ["Napar z czarnej liściastej herbaty Ceylon", "Naturalny gęsty syrop brzoskwiniowy", "Świeże liście melisy lekarskiej", "Lód w kostkach, plasterek pomarańczy"],
      allergens: [],
      baristaTip: "Melisę zbieramy codziennie rano prosto z donic w naszym cichym kawiarnianym patio. Dodaje rewelacyjnego cytrusowego aromatu!"
    },
    en: {
      ingredients: ["Premium loose leaf Ceylon black tea extraction", "Natural peach fruit concentrate reduction syrup", "Fresh lemon balm (Melissa) leaves", "Jumbo clear ice cubes, fresh orange wedge"],
      allergens: [],
      baristaTip: "We pick the fresh lemon balm daily straight from our shaded courtyard garden. It adds an incredible herbal refreshing finish!"
    },
    badges: []
  }
};
