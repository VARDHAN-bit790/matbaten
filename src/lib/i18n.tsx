import { createContext, useContext, useEffect, useState, type ReactNode, type Context } from "react";

export type Lang = "en" | "sv";

const en = {
  nav_restaurants: "Restaurants", nav_quiz: "Taste quiz", nav_about: "About", nav_cart: "Cart",
  hero_kicker: "Karlskrona · Blekinge",
  hero_title: "Food from Karlskrona, to your door.",
  hero_sub: "Find nearby kitchens that match your taste — with an honest delivery time to your home.",
  deliver_to: "Deliver to", find_food: "Find food", take_quiz: "Take the taste quiz",
  for_you: "Picked for your taste", for_you_sub: "Ranked by match and how fast it reaches you",
  see_all: "See all restaurants", match: "match", min: "min", km: "km",
  how_title: "How it works",
  how1: "Tell us your taste", how1d: "Cuisines, diet, spice and budget in a 1-minute quiz.",
  how2: "See what's near", how2d: "Real distance from each kitchen to your area in Karlskrona.",
  how3: "Know when it arrives", how3d: "Prep + courier time, shown before you order.",
  filters: "Filters", cuisine: "Cuisine", diet: "Diet", max_spice: "Max spice", max_price: "Max price",
  sort: "Sort by", sort_match: "Best match", sort_fast: "Fastest", sort_rating: "Rating",
  results: "restaurants", no_results: "No restaurants match these filters.", reset: "Reset filters",
  starters: "Starters", mains: "Mains", desserts: "Desserts", add: "Add", added: "Added to cart",
  eta: "Estimated delivery", prep: "Prep", travel: "Courier", handoff: "Handoff",
  cart_empty: "Your cart is empty.", browse: "Browse restaurants", subtotal: "Subtotal", delivery_fee: "Delivery",
  total: "Total", address: "Street address", name: "Name", phone: "Phone", payment: "Payment",
  card: "Card", place_order: "Place order", checkout: "Checkout", order_from: "Order from",
  demo_note: "Demo — no real payment is taken.", confirmed: "Order confirmed!", arriving_in: "Arriving in about",
  st_received: "Received", st_cooking: "Cooking", st_onway: "On the way", st_delivered: "Delivered",
  new_order: "Order something else", quiz_title: "What do you feel like?", step: "Step",
  q_cuisine: "Which cuisines do you love?", q_diet: "Any dietary needs?", q_spice: "How spicy?",
  q_price: "Your budget?", q_area: "Where should we deliver?", next: "Next", back: "Back", finish: "Show my matches",
  spice0: "Mild", spice4: "Fire", price1: "Budget", price2: "Mid", price3: "Treat",
  about_title: "Made for Karlskrona", about_body: "A demo food delivery service for the islands and neighbourhoods of Karlskrona and Blekinge — from Trossö to Jämjö. We rank kitchens by how well they fit your taste and how quickly a courier can reach you.",
  about_note: "All restaurants on this site are fictional examples.",
  swedish: "Swedish", pizza: "Pizza", sushi: "Sushi", thai: "Thai", burgers: "Burgers", indian: "Indian", kebab: "Kebab",
  vegan: "Vegan", vegetarian: "Vegetarian", glutenFree: "Gluten-free", lactoseFree: "Lactose-free", halal: "Halal",
  footer: "Food delivery demo for Karlskrona, Blekinge.",
  nav_signin: "Sign in", nav_orders: "Orders", nav_account: "My account", sign_out: "Sign out",
  auth_title: "Welcome to Matbåten", auth_sub: "Sign in to save your addresses and keep your order history.",
  sign_in: "Sign in", sign_up: "Create account", email: "Email", password: "Password",
  forgot: "Forgot your password?", send_reset: "Send reset link",
  check_email: "Check your email — we sent you a link.", no_account: "New here?", have_account: "Already have an account?",
  continue_google: "Continue with Google", continue_lovable: "Continue with Lovable", or_email: "or with email",
  reset_title: "Set a new password", new_password: "New password", update_password: "Save password", password_saved: "Password updated.",
  orders_title: "Your orders", no_orders: "No orders yet.", order_again: "Order again", ordered_on: "Ordered",
  scheduled_for: "Scheduled for", deliver_now: "Deliver now", order_later: "Order for later",
  date: "Date", time: "Time",
  account_title: "My account", addresses: "Saved addresses", no_addresses: "No saved addresses yet.",
  add_address: "Add address", label: "Label (home, work…)", save_address: "Save this address",
  set_default: "Set as default", default_addr: "Default", remove: "Remove",
  search_dishes: "Search dishes…", matching_dishes: "Matching dishes",
  sign_in_to_save: "Sign in to save your orders and addresses.",
  error_generic: "Something went wrong. Please try again.",
  stat1: "12 local kitchens", stat2: "14 delivery areas", stat3: "Honest delivery times",
  crave: "What are you craving today?",
  cta_title: "Hungry later? Book your slot", cta_body: "Pick a delivery window at checkout — tonight's dinner or tomorrow's lunch.",
  cta_btn: "Plan an order", fast: "Fast delivery",
  map_title: "Streets & buildings", map_road: "Map", map_satellite: "Satellite", map_loading: "Loading map…",
  map_error: "The map could not load. Open Google Maps to view this area.", map_open: "Open Google Maps",
  map_area_note: "Area reference only — not an exact home address. Restaurants and delivery times are demo estimates.",
  map_terms: "Google Maps terms", map_privacy: "Google privacy policy",
  municipality: "Karlskrona municipality", location_search: "Search area, street or house number", location_search_btn: "Search location",
  location_signin: "Sign in to search real addresses", location_none: "No verified result within Karlskrona municipality. Try a full street address or another area name.",
  location_busy: "Searching…", location_selected: "Selected location", location_clear: "Clear location", subareas: "Areas & subareas", all_groups: "All areas",
  location_provider: "Location search is unavailable. Please try again later.", location_configuration: "Google location search is not configured.",
  location_referrer: "Google’s server key needs None or IP address restrictions in Google Cloud Console.", location_api: "Enable Geocoding API for the Google server key in Google Cloud Console.",
  locate_btn: "Use my location", locating: "Finding your location…", locate_outside: "You’re outside the Karlskrona delivery area — type your address instead.",
  locate_denied: "Location access was blocked — allow it in your browser.", locate_error: "We couldn’t find your address — please type it instead.",
  municipality_note: "Named areas and address search across the municipality. Demo delivery availability is not guaranteed.",
  group_city: "City & nearby islands", group_mainland: "Mainland & north", group_coast: "Coast & east", group_islands: "Archipelago", group_rural: "Villages & countryside",
  favourites_title: "Your favourites", favourites_sub: "The dishes you hearted, one tap from the cart.",
  fav_save: "Save to favourites", fav_saved: "Saved to favourites", theme_switch: "Switch between light and dark",
  qty_less: "Fewer", qty_more: "More", loading: "Loading…",
};

const sv: typeof en = {
  nav_restaurants: "Restauranger", nav_quiz: "Smaktest", nav_about: "Om oss", nav_cart: "Varukorg",
  hero_kicker: "Karlskrona · Blekinge",
  hero_title: "Mat från Karlskrona, hem till dig.",
  hero_sub: "Hitta kök i närheten som passar din smak — med en ärlig leveranstid hem till dig.",
  deliver_to: "Leverera till", find_food: "Hitta mat", take_quiz: "Gör smaktestet",
  for_you: "Utvalt för din smak", for_you_sub: "Rankat efter matchning och hur snabbt det når dig",
  see_all: "Se alla restauranger", match: "match", min: "min", km: "km",
  how_title: "Så funkar det",
  how1: "Berätta om din smak", how1d: "Kök, kost, styrka och budget på en minut.",
  how2: "Se vad som finns nära", how2d: "Verkligt avstånd från köket till ditt område i Karlskrona.",
  how3: "Vet när maten kommer", how3d: "Tillagning + budtid, visas innan du beställer.",
  filters: "Filter", cuisine: "Kök", diet: "Kost", max_spice: "Max styrka", max_price: "Max pris",
  sort: "Sortera", sort_match: "Bäst match", sort_fast: "Snabbast", sort_rating: "Betyg",
  results: "restauranger", no_results: "Inga restauranger matchar filtren.", reset: "Rensa filter",
  starters: "Förrätter", mains: "Varmrätter", desserts: "Efterrätter", add: "Lägg till", added: "Tillagd i varukorgen",
  eta: "Beräknad leverans", prep: "Tillagning", travel: "Bud", handoff: "Överlämning",
  cart_empty: "Din varukorg är tom.", browse: "Bläddra bland restauranger", subtotal: "Delsumma", delivery_fee: "Leverans",
  total: "Totalt", address: "Gatuadress", name: "Namn", phone: "Telefon", payment: "Betalning",
  card: "Kort", place_order: "Beställ", checkout: "Kassa", order_from: "Beställning från",
  demo_note: "Demo — ingen riktig betalning dras.", confirmed: "Beställningen är bekräftad!", arriving_in: "Framme om cirka",
  st_received: "Mottagen", st_cooking: "Tillagas", st_onway: "På väg", st_delivered: "Levererad",
  new_order: "Beställ något annat", quiz_title: "Vad är du sugen på?", step: "Steg",
  q_cuisine: "Vilka kök älskar du?", q_diet: "Några kostbehov?", q_spice: "Hur stark?",
  q_price: "Din budget?", q_area: "Vart ska vi leverera?", next: "Nästa", back: "Tillbaka", finish: "Visa mina matchningar",
  spice0: "Mild", spice4: "Eld", price1: "Billigt", price2: "Mellan", price3: "Unna dig",
  about_title: "Gjort för Karlskrona", about_body: "En demo av matleverans för öarna och stadsdelarna i Karlskrona och Blekinge — från Trossö till Jämjö. Vi rankar kök efter hur väl de passar din smak och hur snabbt ett bud når dig.",
  about_note: "Alla restauranger på sidan är påhittade exempel.",
  swedish: "Svenskt", pizza: "Pizza", sushi: "Sushi", thai: "Thai", burgers: "Burgare", indian: "Indiskt", kebab: "Kebab",
  vegan: "Veganskt", vegetarian: "Vegetariskt", glutenFree: "Glutenfritt", lactoseFree: "Laktosfritt", halal: "Halal",
  footer: "Matleveransdemo för Karlskrona, Blekinge.",
  nav_signin: "Logga in", nav_orders: "Beställningar", nav_account: "Mitt konto", sign_out: "Logga ut",
  auth_title: "Välkommen till Matbåten", auth_sub: "Logga in för att spara dina adresser och se din beställningshistorik.",
  sign_in: "Logga in", sign_up: "Skapa konto", email: "E-post", password: "Lösenord",
  forgot: "Glömt lösenordet?", send_reset: "Skicka återställningslänk",
  check_email: "Kolla din inkorg — vi har skickat en länk.", no_account: "Ny här?", have_account: "Har du redan ett konto?",
  continue_google: "Fortsätt med Google", continue_lovable: "Fortsätt med Lovable", or_email: "eller med e-post",
  reset_title: "Välj ett nytt lösenord", new_password: "Nytt lösenord", update_password: "Spara lösenord", password_saved: "Lösenordet är uppdaterat.",
  orders_title: "Dina beställningar", no_orders: "Inga beställningar än.", order_again: "Beställ igen", ordered_on: "Beställd",
  scheduled_for: "Tidsbokad för", deliver_now: "Leverera nu", order_later: "Beställ för senare",
  date: "Datum", time: "Tid",
  account_title: "Mitt konto", addresses: "Sparade adresser", no_addresses: "Inga sparade adresser än.",
  add_address: "Lägg till adress", label: "Namn (hem, jobb…)", save_address: "Spara denna adress",
  set_default: "Gör till standard", default_addr: "Standard", remove: "Ta bort",
  search_dishes: "Sök rätter…", matching_dishes: "Matchande rätter",
  sign_in_to_save: "Logga in för att spara beställningar och adresser.",
  error_generic: "Något gick fel. Försök igen.",
  stat1: "12 lokala kök", stat2: "14 leveransområden", stat3: "Ärliga leveranstider",
  crave: "Vad är du sugen på idag?",
  cta_title: "Hungrig senare? Boka din tid", cta_body: "Välj leveranstid i kassan — dagens middag eller morgondagens lunch.",
  cta_btn: "Planera en beställning", fast: "Snabb leverans",
  map_title: "Gator och byggnader", map_road: "Karta", map_satellite: "Satellit", map_loading: "Laddar kartan…",
  map_error: "Kartan kunde inte laddas. Öppna Google Maps för att se området.", map_open: "Öppna Google Maps",
  map_area_note: "Områdesreferens — inte en exakt hemadress. Restauranger och leveranstider är demoexempel.",
  map_terms: "Google Maps villkor", map_privacy: "Googles integritetspolicy",
  municipality: "Karlskrona kommun", location_search: "Sök område, gata eller husnummer", location_search_btn: "Sök plats",
  location_signin: "Logga in för att söka riktiga adresser", location_none: "Ingen verifierad träff inom Karlskrona kommun. Prova en fullständig gatuadress eller ett annat områdesnamn.",
  location_busy: "Söker…", location_selected: "Vald plats", location_clear: "Rensa plats", subareas: "Områden och delområden", all_groups: "Alla områden",
  location_provider: "Platssökningen är inte tillgänglig. Försök igen senare.", location_configuration: "Googles platssökning är inte konfigurerad.",
  location_referrer: "Googles servernyckel behöver begränsningen Ingen eller IP-adresser i Google Cloud Console.", location_api: "Aktivera Geocoding API för Googles servernyckel i Google Cloud Console.",
  locate_btn: "Använd min position", locating: "Hittar din position…", locate_outside: "Du är utanför Karlskronas leveransområde — skriv din adress istället.",
  locate_denied: "Platsåtkomst nekad — tillåt den i webbläsaren.", locate_error: "Vi hittade inte din adress — skriv in den istället.",
  municipality_note: "Namngivna områden och adressökning i hela kommunen. Leverans i denna demo garanteras inte.",
  group_city: "Staden och närliggande öar", group_mainland: "Fastlandet och norr", group_coast: "Kusten och öster", group_islands: "Skärgården", group_rural: "Byar och landsbygd",
  favourites_title: "Dina favoriter", favourites_sub: "Rätterna du sparat, ett klick från varukorgen.",
  fav_save: "Spara som favorit", fav_saved: "Sparad som favorit", theme_switch: "Växla mellan ljust och mörkt",
  qty_less: "Färre", qty_more: "Fler", loading: "Laddar…",
};

export type TKey = keyof typeof en;
const DICT = { en, sv };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string };
// Reuse one context across hot reloads so already-mounted pages keep finding the provider.
const g = globalThis as { __i18nCtx?: Context<Ctx | null> };
const I18nContext = (g.__i18nCtx ??= createContext<Ctx | null>(null));

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const s = localStorage.getItem("lang");
    if (s === "en" || s === "sv") setLangState(s);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };
  return <I18nContext.Provider value={{ lang, setLang, t: (k) => DICT[lang][k] }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const c = useContext(I18nContext);
  if (!c) throw new Error("useI18n outside provider");
  return c;
}
