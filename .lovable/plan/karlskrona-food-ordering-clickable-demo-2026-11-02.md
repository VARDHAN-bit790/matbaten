# Karlskrona Food Ordering — Clickable Demo

A bilingual (English / Svenska) food ordering site for Karlskrona, Blekinge. Users find nearby restaurants matched to their tastes, see expected delivery time to their home, and go through cart and checkout (no real payment).

## Look and feel
- Nordic Coast palette: cream #f4f1ea background, deep navy #0c2340 text/headers, sea teal #2d8a9e primary, saffron #f2a541 highlights (badges, "fast delivery").
- Instrument Serif headings, Work Sans body. Generous whitespace, rounded cards, appetizing food photography (generated).
- Language toggle EN / SV in the header, remembered between visits. All text translated.

## Pages
- **Home (/)** — hero "Food from Karlskrona, to your door", address picker (Karlskrona areas: Centrum, Trossö, Lyckeby, Nättraby, Rödeby, Jämjö, Hasslö...), "Take the taste quiz" button, featured restaurants sorted by your match and delivery time.
- **Taste quiz (/quiz)** — 5 short steps: favorite cuisines, diet needs, spice level, budget, hunger speed. Saves a taste profile.
- **Restaurants (/restaurants)** — list with filters: cuisine chips (Swedish, Pizza, Sushi, Thai, Burgers, Indian, Kebab, Vegan), diet (vegan, vegetarian, gluten-free, lactose-free, halal), spice slider, price slider, sort by match / fastest / rating. Each card shows match %, rating, price level, estimated delivery minutes to the chosen area.
- **Restaurant detail (/restaurants/$id)** — menu grouped by category, diet tags, spice indicators, add to cart.
- **Cart & checkout (/checkout)** — items, delivery address, ETA breakdown (prep + travel), fake payment (Swish / card), confirmation with a live-feeling order tracker countdown.
- **About (/about)** — short page about the service in Blekinge.

## Sample data
About 12 invented Karlskrona restaurants with coordinates, ~8 dishes each. Delivery time = prep time + distance from restaurant to selected area. I'll mention to you that these restaurants are fictional.

## Technical details
- TanStack routes as listed; shared header/footer + language provider in __root.
- i18n via a small dictionary + React context (en/sv), persisted in localStorage after hydration.
- Cart and taste profile in context + localStorage.
- Match score: weighted cuisine/diet/spice/price overlap with profile; ETA from haversine distance at ~25 km/h + prep minutes.
- Unit tests for match score and ETA calculation.
- Per-route head() metadata in both languages' defaults (English).
