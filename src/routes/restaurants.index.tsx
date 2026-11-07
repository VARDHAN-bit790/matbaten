import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CUISINES, DIETS, RESTAURANTS, getMenu, type Cuisine, type Diet } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useRanked, useStore } from "@/lib/store";
import { AreaSelect } from "@/components/SiteHeader";
import { RestaurantCard } from "@/components/RestaurantCard";
import { AreaMap } from "@/components/AreaMap";
import { FavoriteHeart } from "@/components/FavoriteHeart";
import { AddDishButton } from "@/components/AddDishButton";

export const Route = createFileRoute("/restaurants/")({
  head: () => ({
    meta: [
      { title: "Restaurants in Karlskrona — Matbåten" },
      { name: "description", content: "Filter Karlskrona restaurants by cuisine, diet, spice and price. See delivery time to your area." },
      { property: "og:title", content: "Restaurants in Karlskrona — Matbåten" },
      { property: "og:description", content: "Swedish, sushi, Thai, pizza and more near you in Blekinge." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Restaurants,
});

type Sort = "match" | "fast" | "rating";

function Restaurants() {
  const { t, lang } = useI18n();
  const ranked = useRanked();
  const { add } = useStore();
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [spice, setSpice] = useState(4);
  const [price, setPrice] = useState(3);
  const [sort, setSort] = useState<Sort>("match");
  const [q, setQ] = useState("");

  const query = q.trim().toLowerCase();
  const dishMatches = useMemo(() => {
    if (query.length < 1) return [];
    return RESTAURANTS.flatMap((r) =>
      getMenu(r)
        .filter((d) => d.name.toLowerCase().includes(query))
        .map((d) => ({ d, r })),
    ).slice(0, 8);
  }, [query]);

  const list = ranked
    .filter((r) => (cuisines.length === 0 || cuisines.includes(r.cuisine)) && diets.every((d) => r.diets.includes(d)) && r.spice <= spice && r.price <= price)
    .sort((a, b) => (sort === "match" ? b.score - a.score : sort === "fast" ? a.eta.total - b.eta.total : b.rating - a.rating));

  const reset = () => { setCuisines([]); setDiets([]); setSpice(4); setPrice(3); };
  const tog = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-5xl">{t("nav_restaurants")}</h1>
        <AreaSelect />
      </div>

      <AreaMap />

      <div className="relative mt-6">
        <label className="flex items-center gap-2 rounded-full border bg-card px-5 py-3 shadow-soft">
          <Search className="h-4 w-4 text-primary" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search_dishes")}
            className="w-full bg-transparent text-sm outline-none"
            aria-label={t("search_dishes")}
          />
        </label>

        {query.length > 0 && (
          <div role="listbox" aria-label={t("matching_dishes")} className="absolute inset-x-0 top-14 z-30 overflow-hidden rounded-2xl border bg-popover shadow-soft">
            {dishMatches.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">{t("no_results")}</p>
            ) : (
              dishMatches.map(({ d, r }) => (
                <div key={d.id} className="flex items-center justify-between gap-3 border-b px-4 py-2.5 last:border-0">
                  <Link to="/restaurants/$id" params={{ id: r.id }} className="flex min-w-0 items-center gap-3">
                    <img src={d.img} alt="" loading="lazy" width={944} height={704} className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{d.name}</span>
                      <span className="block truncate text-sm text-muted-foreground">{r.name} · {d.price} kr</span>
                    </span>
                  </Link>
                  <div className="flex shrink-0 items-center gap-1">
                    <FavoriteHeart dishId={d.id} dishName={d.name} />
                    <AddDishButton onAdd={(n) => add(d, r.id, n)} label={t("add")} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 rounded-2xl border bg-card p-5 lg:sticky lg:top-24 lg:self-start">
          <div>
            <h3 className="text-xl">{t("cuisine")}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {CUISINES.map((c) => <button key={c} className="chip" data-active={cuisines.includes(c)} onClick={() => setCuisines(tog(cuisines, c))}>{t(c)}</button>)}
            </div>
          </div>
          <div>
            <h3 className="text-xl">{t("diet")}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {DIETS.map((d) => <button key={d} className="chip" data-active={diets.includes(d)} onClick={() => setDiets(tog(diets, d))}>{t(d)}</button>)}
            </div>
          </div>
          <div>
            <h3 className="text-xl">{t("max_spice")}: {"🌶".repeat(spice) || t("spice0")}</h3>
            <input type="range" min={0} max={4} value={spice} onChange={(e) => setSpice(+e.target.value)} className="w-full" />
          </div>
          <div>
            <h3 className="text-xl">{t("max_price")}: {"kr".repeat(price)}</h3>
            <input type="range" min={1} max={3} value={price} onChange={(e) => setPrice(+e.target.value)} className="w-full" />
          </div>
          <button onClick={reset} className="text-sm text-primary underline">{t("reset")}</button>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{list.length} {t("results")}</p>
            <div className="flex gap-2">
              {(["match", "fast", "rating"] as Sort[]).map((s) => (
                <button key={s} className="chip" data-active={sort === s} onClick={() => setSort(s)}>{t(`sort_${s}` as const)}</button>
              ))}
            </div>
          </div>
          {list.length === 0 ? (
            <div className="mt-10 text-center text-muted-foreground">{t("no_results")}</div>
          ) : (
            <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((r) => <RestaurantCard key={r.id} r={r} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
