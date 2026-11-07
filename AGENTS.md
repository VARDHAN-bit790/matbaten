<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- All UI strings live in src/lib/i18n.tsx (en + sv dictionaries); never hardcode user-facing text, so both languages stay complete.
- Match score and delivery ETA logic live in src/lib/match.ts with tests in src/test/match.test.ts; keep them pure so they stay testable.
- Delivery areas use source-cited representative coordinates in src/lib/data.ts; preserve persisted area IDs when correcting names so saved addresses remain usable. These pins are not home geocoding or road-routing data.
- Render geographic streets/buildings through Google Maps JavaScript loaded in an effect with its async callback; keep server credentials private and do not plot fictional kitchens as real businesses.
- Municipality browsing uses a curated source-cited place-name directory and authenticated on-demand Google geocoding; accept results only with Karlskrona municipality membership, and never invent coordinates for directory entries. Map selections are session-only and do not replace delivery-area ETA pins.
- GPS home-address lookup (locateResult in src/lib/location-search.ts) accepts street results with postal_town Karlskrona, since Google reverse-geocode street results omit the municipality component; forward search still requires administrative_area_level_2 membership. Reverse geocoding runs only for signed-in users (paid Google call, src/components/LocateAddress.tsx).
- Signed-in data (orders, saved addresses) lives in the Lovable Cloud tables `public.orders`/`public.addresses`, accessed through server functions in src/lib/orders.ts with `requireSupabaseAuth`; session state comes from the AuthProvider in src/lib/auth.tsx (mounted once in __root). Protected routes live under src/routes/_authenticated/ with the pathless layout gate redirecting to /auth.
