import swedish from "@/assets/food-swedish.jpg";
import pizza from "@/assets/food-pizza.jpg";
import sushi from "@/assets/food-sushi.jpg";
import thai from "@/assets/food-thai.jpg";
import burger from "@/assets/food-burger.jpg";
import indian from "@/assets/food-indian.jpg";
import kebab from "@/assets/food-kebab.jpg";
import vegan from "@/assets/food-vegan.jpg";

import dishSill from "@/assets/dish-sill.jpg";
import dishToastSkagen from "@/assets/dish-toast-skagen.jpg";
import dishKottbullar from "@/assets/dish-kottbullar.jpg";
import dishStromming from "@/assets/dish-stromming.jpg";
import dishKanelbulle from "@/assets/dish-kanelbulle.jpg";
import dishBruschetta from "@/assets/dish-bruschetta.jpg";
import dishMargherita from "@/assets/dish-margherita.jpg";
import dishDiavola from "@/assets/dish-diavola.jpg";
import dishKebabpizza from "@/assets/dish-kebabpizza.jpg";
import dishTiramisu from "@/assets/dish-tiramisu.jpg";
import dishEdamame from "@/assets/dish-edamame.jpg";
import dishLaxnigiri from "@/assets/dish-laxnigiri.jpg";
import dishSpicyTuna from "@/assets/dish-spicy-tuna.jpg";
import dishVeganRoll from "@/assets/dish-vegan-roll.jpg";
import dishMochi from "@/assets/dish-mochi.jpg";
import dishVarrullar from "@/assets/dish-varrullar.jpg";
import dishGreenCurry from "@/assets/dish-green-curry.jpg";
import dishPadThai from "@/assets/dish-pad-thai.jpg";
import dishTofuPanang from "@/assets/dish-tofu-panang.jpg";
import dishMangoStickyRice from "@/assets/dish-mango-sticky-rice.jpg";
import dishLokringar from "@/assets/dish-lokringar.jpg";
import dishDoubleSmash from "@/assets/dish-double-smash.jpg";
import dishChiliBurger from "@/assets/dish-chili-burger.jpg";
import dishHalloumiBurger from "@/assets/dish-halloumi-burger.jpg";
import dishMjukglass from "@/assets/dish-mjukglass.jpg";
import dishSamosa from "@/assets/dish-samosa.jpg";
import dishButterChicken from "@/assets/dish-butter-chicken.jpg";
import dishLambVindaloo from "@/assets/dish-lamb-vindaloo.jpg";
import dishChanaMasala from "@/assets/dish-chana-masala.jpg";
import dishGulabJamun from "@/assets/dish-gulab-jamun.jpg";
import dishFalafel from "@/assets/dish-falafel.jpg";
import dishKebabtallrik from "@/assets/dish-kebabtallrik.jpg";
import dishAdanaKebab from "@/assets/dish-adana-kebab.jpg";
import dishRulle from "@/assets/dish-rulle.jpg";
import dishBaklava from "@/assets/dish-baklava.jpg";
import dishHummus from "@/assets/dish-hummus.jpg";
import dishBuddhaBowl from "@/assets/dish-buddha-bowl.jpg";
import dishHarissaBowl from "@/assets/dish-harissa-bowl.jpg";
import dishOumphWrap from "@/assets/dish-oumph-wrap.jpg";
import dishRawCake from "@/assets/dish-raw-cake.jpg";

export type Cuisine = "swedish" | "pizza" | "sushi" | "thai" | "burgers" | "indian" | "kebab" | "vegan";
export type Diet = "vegan" | "vegetarian" | "glutenFree" | "lactoseFree" | "halal";
export const CUISINES: Cuisine[] = ["swedish", "pizza", "sushi", "thai", "burgers", "indian", "kebab", "vegan"];
export const DIETS: Diet[] = ["vegan", "vegetarian", "glutenFree", "lactoseFree", "halal"];

export const CUISINE_IMG: Record<Cuisine, string> = { swedish, pizza, sushi, thai, burgers: burger, indian, kebab, vegan };

export type Area = { id: string; name: string; lat: number; lng: number };
export const AREAS: Area[] = [
  // Representative location pins, not delivery boundaries or exact home addresses.
  // https://www.openstreetmap.org/node/1599473536
  { id: "trosso", name: "Trossö (Centrum)", lat: 56.1621073, lng: 15.5866422 },
  // https://mapcarta.com/N1366604158 (OpenStreetMap neighbourhood node)
  { id: "bjorkholmen", name: "Björkholmen", lat: 56.16199, lng: 15.5725 },
  // Keep the stored ID for existing selections; correct the place to Lyckeby Slottsbacken.
  // https://www.lanstrafik.se/en/stop/lyckeby-slottsbacken/
  { id: "slottsbron", name: "Slottsbacken", lat: 56.19749, lng: 15.64905 },
  // Amiralen shopping centre, Verkövägen 5–9, Lyckeby:
  // https://exa.ai/library/place/bznd5txqqwd
  { id: "amiralen", name: "Amiralen", lat: 56.196339, lng: 15.642083 },
  // Hultvägen bus stop: https://www.lanstrafik.se/en/stop/hultvagen-karlskrona/
  { id: "hultvagen", name: "Hultvägen", lat: 56.19251, lng: 15.62707 },
  // https://wikimapia.org/country/Sweden/Blekinge/Karlskrona/
  { id: "salto", name: "Saltö", lat: 56.169523, lng: 15.5670153 },
  // Kungsmarksvägen 45: https://www.koordinater.se/kategorier/svenska-orter/ort.aspx?poiid=61504
  { id: "kungsmarken", name: "Kungsmarken", lat: 56.1961866, lng: 15.6208946 },
  // Långö beach: https://svenska-badplatser.se/badplatser/lango/
  { id: "langö", name: "Långö", lat: 56.181827, lng: 15.581658 },
  // https://www.lanstrafik.se/en/stop/gullberna/
  { id: "gullberna", name: "Gullberna", lat: 56.19329, lng: 15.63182 },
  // https://www.lanstrafik.se/en/stop/lyckeby-centrum/
  { id: "lyckeby", name: "Lyckeby", lat: 56.19869, lng: 15.65474 },
  // https://www.lanstrafik.se/en/stop/nattraby-centrum/
  { id: "nattraby", name: "Nättraby", lat: 56.19990, lng: 15.53649 },
  // https://sv.wikipedia.org/wiki/R%C3%B6deby
  { id: "rodeby", name: "Rödeby", lat: 56.26083, lng: 15.62139 },
  // https://www.lanstrafik.se/en/stop/jamjo-centrum/
  { id: "jamjo", name: "Jämjö", lat: 56.19197, lng: 15.83505 },
  // Hasslö, Horn church: https://www.lanstrafik.se/en/stop/horn-kyrkan/
  { id: "hasslo", name: "Hasslö", lat: 56.11843, lng: 15.48133 },
];

export type Dish = {
  id: string;
  name: string;
  desc: { en: string; sv: string };
  price: number;
  category: "starters" | "mains" | "desserts";
  spice: number;
  diets: Diet[];
  img: string;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: Cuisine;
  area: string;
  lat: number;
  lng: number;
  rating: number;
  price: 1 | 2 | 3;
  spice: number; // 0-4
  diets: Diet[];
  prep: number; // minutes
  tagline: { en: string; sv: string };
};

export const RESTAURANTS: Restaurant[] = [
  { id: "skargardskoket", name: "Skärgårdsköket", cuisine: "swedish", area: "Trossö", lat: 56.1608, lng: 15.5862, rating: 4.8, price: 3, spice: 0, diets: ["glutenFree", "lactoseFree"], prep: 20, tagline: { en: "Archipelago classics, Baltic herring & meatballs", sv: "Skärgårdsklassiker, sill och köttbullar" } },
  { id: "amiralen-husman", name: "Amiralens Husman", cuisine: "swedish", area: "Lyckeby", lat: 56.1975, lng: 15.648, rating: 4.5, price: 2, spice: 0, diets: ["lactoseFree"], prep: 15, tagline: { en: "Home-style Swedish lunch all day", sv: "Svensk husmanskost hela dagen" } },
  { id: "fortuna-pizza", name: "Fortuna Pizzeria", cuisine: "pizza", area: "Trossö", lat: 56.1625, lng: 15.5891, rating: 4.4, price: 1, spice: 1, diets: ["vegetarian", "halal"], prep: 14, tagline: { en: "Wood-fired pizza by Stortorget", sv: "Vedugnspizza vid Stortorget" } },
  { id: "napoli-nattraby", name: "Napoli Nättraby", cuisine: "pizza", area: "Nättraby", lat: 56.204, lng: 15.526, rating: 4.2, price: 1, spice: 1, diets: ["vegetarian", "glutenFree"], prep: 12, tagline: { en: "Sourdough pies, gluten-free bases", sv: "Surdegspizza, glutenfria bottnar" } },
  { id: "kaiseki-blekinge", name: "Umi Sushi", cuisine: "sushi", area: "Trossö", lat: 56.1617, lng: 15.5845, rating: 4.7, price: 3, spice: 1, diets: ["glutenFree", "lactoseFree"], prep: 22, tagline: { en: "Fresh nigiri with Baltic salmon", sv: "Färsk nigiri med östersjölax" } },
  { id: "sakura-gullberna", name: "Sakura Gullberna", cuisine: "sushi", area: "Gullberna", lat: 56.1815, lng: 15.6162, rating: 4.3, price: 2, spice: 1, diets: ["vegan", "lactoseFree"], prep: 18, tagline: { en: "Maki, poke and vegan rolls", sv: "Maki, poké och veganska rullar" } },
  { id: "baan-thai", name: "Baan Thai", cuisine: "thai", area: "Långö", lat: 56.156, lng: 15.597, rating: 4.6, price: 2, spice: 4, diets: ["glutenFree", "lactoseFree", "vegan"], prep: 16, tagline: { en: "Fiery curries and street noodles", sv: "Heta curryrätter och gatunudlar" } },
  { id: "sea-salt-burgers", name: "Sea Salt Burgers", cuisine: "burgers", area: "Trossö", lat: 56.1603, lng: 15.5901, rating: 4.5, price: 2, spice: 1, diets: ["vegetarian", "halal"], prep: 13, tagline: { en: "Smash burgers & sea-salt fries", sv: "Smashburgare och havssaltade pommes" } },
  { id: "rodeby-grill", name: "Rödeby Grill", cuisine: "burgers", area: "Rödeby", lat: 56.2608, lng: 15.6135, rating: 4.0, price: 1, spice: 0, diets: ["vegetarian"], prep: 11, tagline: { en: "Classic Swedish gatukök", sv: "Klassiskt svenskt gatukök" } },
  { id: "tandoor-house", name: "Tandoor House", cuisine: "indian", area: "Lyckeby", lat: 56.1992, lng: 15.6512, rating: 4.6, price: 2, spice: 3, diets: ["vegetarian", "halal", "glutenFree"], prep: 20, tagline: { en: "Clay-oven curries and naan", sv: "Lerugnscurry och naan" } },
  { id: "jamjo-kebab", name: "Jämjö Kebab & Grill", cuisine: "kebab", area: "Jämjö", lat: 56.19, lng: 15.84, rating: 4.1, price: 1, spice: 2, diets: ["halal"], prep: 10, tagline: { en: "Late-night kebab plates", sv: "Kebabtallrikar till sent" } },
  { id: "grona-bryggan", name: "Gröna Bryggan", cuisine: "vegan", area: "Trossö", lat: 56.1631, lng: 15.5878, rating: 4.7, price: 2, spice: 2, diets: ["vegan", "vegetarian", "glutenFree", "lactoseFree"], prep: 15, tagline: { en: "Plant bowls by the harbour", sv: "Växtbaserade bowls vid hamnen" } },
];

const MENUS: Record<Cuisine, Omit<Dish, "id">[]> = {
  swedish: [
    { name: "Sill tre sätt", desc: { en: "Three pickled herrings, rye bread", sv: "Tre sorters sill, rågbröd" }, price: 95, category: "starters", spice: 0, diets: ["lactoseFree"], img: dishSill },
    { name: "Toast Skagen", desc: { en: "Shrimp, dill, lemon on toast", sv: "Räkor, dill och citron på toast" }, price: 125, category: "starters", spice: 0, diets: [], img: dishToastSkagen },
    { name: "Köttbullar", desc: { en: "Meatballs, mash, lingonberries", sv: "Köttbullar, potatismos, lingon" }, price: 165, category: "mains", spice: 0, diets: [], img: dishKottbullar },
    { name: "Stekt strömming", desc: { en: "Fried Baltic herring, mash", sv: "Stekt strömming med mos" }, price: 155, category: "mains", spice: 0, diets: ["glutenFree"], img: dishStromming },
    { name: "Kanelbulle", desc: { en: "Cardamom-cinnamon bun", sv: "Kanelbulle med kardemumma" }, price: 39, category: "desserts", spice: 0, diets: ["vegetarian"], img: dishKanelbulle },
  ],
  pizza: [
    { name: "Bruschetta", desc: { en: "Tomato, basil, garlic", sv: "Tomat, basilika, vitlök" }, price: 69, category: "starters", spice: 0, diets: ["vegan"], img: dishBruschetta },
    { name: "Margherita", desc: { en: "San Marzano, mozzarella, basil", sv: "San Marzano, mozzarella, basilika" }, price: 109, category: "mains", spice: 0, diets: ["vegetarian"], img: dishMargherita },
    { name: "Diavola", desc: { en: "Spicy salami, chili oil", sv: "Stark salami, chiliolja" }, price: 129, category: "mains", spice: 3, diets: [], img: dishDiavola },
    { name: "Kebabpizza", desc: { en: "The Swedish favourite", sv: "Svensk favorit med kebabsås" }, price: 125, category: "mains", spice: 1, diets: ["halal"], img: dishKebabpizza },
    { name: "Tiramisu", desc: { en: "Mascarpone & espresso", sv: "Mascarpone och espresso" }, price: 65, category: "desserts", spice: 0, diets: ["vegetarian"], img: dishTiramisu },
  ],
  sushi: [
    { name: "Edamame", desc: { en: "Sea salt soy beans", sv: "Sojabönor med havssalt" }, price: 49, category: "starters", spice: 0, diets: ["vegan", "glutenFree"], img: dishEdamame },
    { name: "Laxnigiri 8 bitar", desc: { en: "8 salmon nigiri", sv: "8 bitar laxnigiri" }, price: 159, category: "mains", spice: 0, diets: ["lactoseFree"], img: dishLaxnigiri },
    { name: "Spicy tuna maki", desc: { en: "Tuna, sriracha mayo", sv: "Tonfisk, srirachamajo" }, price: 145, category: "mains", spice: 2, diets: ["lactoseFree"], img: dishSpicyTuna },
    { name: "Vegan roll", desc: { en: "Avocado, cucumber, mango", sv: "Avokado, gurka, mango" }, price: 129, category: "mains", spice: 0, diets: ["vegan"], img: dishVeganRoll },
    { name: "Mochi", desc: { en: "Matcha & mango mochi", sv: "Mochi med matcha och mango" }, price: 55, category: "desserts", spice: 0, diets: ["vegetarian"], img: dishMochi },
  ],
  thai: [
    { name: "Vårrullar", desc: { en: "Crispy vegetable spring rolls", sv: "Krispiga grönsaksvårrullar" }, price: 59, category: "starters", spice: 1, diets: ["vegan"], img: dishVarrullar },
    { name: "Green curry", desc: { en: "Chicken, Thai basil, coconut", sv: "Kyckling, thaibasilika, kokos" }, price: 145, category: "mains", spice: 3, diets: ["glutenFree", "lactoseFree"], img: dishGreenCurry },
    { name: "Pad thai", desc: { en: "Rice noodles, shrimp, peanuts", sv: "Risnudlar, räkor, jordnötter" }, price: 139, category: "mains", spice: 2, diets: ["lactoseFree"], img: dishPadThai },
    { name: "Tofu panang", desc: { en: "Red curry with tofu", sv: "Röd curry med tofu" }, price: 135, category: "mains", spice: 4, diets: ["vegan", "glutenFree"], img: dishTofuPanang },
    { name: "Mango sticky rice", desc: { en: "Coconut rice, ripe mango", sv: "Kokosris med mango" }, price: 65, category: "desserts", spice: 0, diets: ["vegan"], img: dishMangoStickyRice },
  ],
  burgers: [
    { name: "Lökringar", desc: { en: "Beer-battered onion rings", sv: "Ölpanerade lökringar" }, price: 49, category: "starters", spice: 0, diets: ["vegetarian"], img: dishLokringar },
    { name: "Double smash", desc: { en: "Two patties, cheddar, pickles", sv: "Två biffar, cheddar, pickles" }, price: 149, category: "mains", spice: 0, diets: [], img: dishDoubleSmash },
    { name: "Chili burger", desc: { en: "Jalapeño, chipotle mayo", sv: "Jalapeño, chipotlemajo" }, price: 155, category: "mains", spice: 3, diets: [], img: dishChiliBurger },
    { name: "Halloumi burger", desc: { en: "Grilled halloumi, aioli", sv: "Grillad halloumi, aioli" }, price: 139, category: "mains", spice: 0, diets: ["vegetarian"], img: dishHalloumiBurger },
    { name: "Mjukglass", desc: { en: "Soft-serve with sprinkles", sv: "Mjukglass med strössel" }, price: 35, category: "desserts", spice: 0, diets: ["vegetarian"], img: dishMjukglass },
  ],
  indian: [
    { name: "Samosa", desc: { en: "Potato & pea pastries", sv: "Samosa med potatis och ärtor" }, price: 59, category: "starters", spice: 1, diets: ["vegan"], img: dishSamosa },
    { name: "Butter chicken", desc: { en: "Creamy tomato curry", sv: "Krämig tomatcurry" }, price: 159, category: "mains", spice: 2, diets: ["halal", "glutenFree"], img: dishButterChicken },
    { name: "Lamb vindaloo", desc: { en: "Hot Goan lamb curry", sv: "Het lammcurry från Goa" }, price: 175, category: "mains", spice: 4, diets: ["halal", "lactoseFree"], img: dishLambVindaloo },
    { name: "Chana masala", desc: { en: "Chickpea curry", sv: "Kikärtscurry" }, price: 129, category: "mains", spice: 2, diets: ["vegan", "glutenFree"], img: dishChanaMasala },
    { name: "Gulab jamun", desc: { en: "Syrup-soaked dumplings", sv: "Söta bollar i sirap" }, price: 49, category: "desserts", spice: 0, diets: ["vegetarian"], img: dishGulabJamun },
  ],
  kebab: [
    { name: "Falafel 5 st", desc: { en: "Five falafel, tahini", sv: "Fem falafel, tahini" }, price: 55, category: "starters", spice: 1, diets: ["vegan"], img: dishFalafel },
    { name: "Kebabtallrik", desc: { en: "Kebab, fries, salad, sauce", sv: "Kebab, pommes, sallad, sås" }, price: 119, category: "mains", spice: 2, diets: ["halal"], img: dishKebabtallrik },
    { name: "Adana kebab", desc: { en: "Spiced grilled skewers", sv: "Kryddiga grillspett" }, price: 145, category: "mains", spice: 3, diets: ["halal", "lactoseFree"], img: dishAdanaKebab },
    { name: "Rulle", desc: { en: "Kebab wrapped in flatbread", sv: "Kebab i tunnbröd" }, price: 99, category: "mains", spice: 2, diets: ["halal"], img: dishRulle },
    { name: "Baklava", desc: { en: "Pistachio baklava", sv: "Baklava med pistage" }, price: 45, category: "desserts", spice: 0, diets: ["vegetarian"], img: dishBaklava },
  ],
  vegan: [
    { name: "Hummus", desc: { en: "Beetroot hummus, crisps", sv: "Rödbetshummus, chips" }, price: 69, category: "starters", spice: 0, diets: ["vegan", "glutenFree"], img: dishHummus },
    { name: "Buddha bowl", desc: { en: "Chickpeas, sweet potato, avocado", sv: "Kikärtor, sötpotatis, avokado" }, price: 139, category: "mains", spice: 1, diets: ["vegan", "glutenFree"], img: dishBuddhaBowl },
    { name: "Harissa bowl", desc: { en: "Spicy roast veg, quinoa", sv: "Kryddig rostad grönt, quinoa" }, price: 145, category: "mains", spice: 3, diets: ["vegan", "glutenFree"], img: dishHarissaBowl },
    { name: "Oumph wrap", desc: { en: "Plant protein, slaw", sv: "Växtprotein, coleslaw" }, price: 119, category: "mains", spice: 1, diets: ["vegan"], img: dishOumphWrap },
    { name: "Raw cake", desc: { en: "Date & cacao", sv: "Dadlar och kakao" }, price: 55, category: "desserts", spice: 0, diets: ["vegan", "glutenFree"], img: dishRawCake },
  ],
};

export function getMenu(r: Restaurant): Dish[] {
  return MENUS[r.cuisine].map((d, i) => ({ ...d, id: `${r.id}-${i}`, price: d.price + (r.price - 2) * 10 }));
}

export function getRestaurant(id: string) {
  return RESTAURANTS.find((r) => r.id === id);
}

// Look a favourited dish ID back up into its dish + restaurant.
export function findDish(id: string): { dish: Dish; restaurant: Restaurant } | null {
  for (const r of RESTAURANTS) {
    const d = getMenu(r).find((x) => x.id === id);
    if (d) return { dish: d, restaurant: r };
  }
  return null;
}
