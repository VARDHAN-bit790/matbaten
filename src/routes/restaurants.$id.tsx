import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, Flame, Star } from "lucide-react";
import { CUISINE_IMG, getMenu, getRestaurant } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useRanked, useStore } from "@/lib/store";
import { FavoriteHeart } from "@/components/FavoriteHeart";
import { AddDishButton } from "@/components/AddDishButton";

export const Route = createFileRoute("/restaurants/$id")({
  loader: ({ params }) => {
    const r = getRestaurant(params.id);
    if (!r) throw notFound();
    return { name: r.name, tagline: r.tagline.en };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Matbåten Karlskrona` },
          { name: "description", content: `${loaderData.tagline}. Order delivery in Karlskrona.` },
          { property: "og:title", content: `${loaderData.name} — Matbåten` },
          { property: "og:description", content: loaderData.tagline },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Unavailable — Matbåten" }, { name: "robots", content: "noindex" }],
  }),
  component: RestaurantPage,
});

function RestaurantPage() {
  const { id } = Route.useParams();
  const { t, lang } = useI18n();
  const { add } = useStore();
  const r = useRanked().find((x) => x.id === id)!;
  const menu = getMenu(r);

  return (
    <div>
      <div className="relative h-64 md:h-80">
        <img src={CUISINE_IMG[r.cuisine]} alt={r.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-4 pb-6 text-navy-foreground">
          <h1 className="text-5xl md:text-6xl">{r.name}</h1>
          <p className="mt-1 opacity-90">{r.tagline[lang]}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-10">
          {(["starters", "mains", "desserts"] as const).map((cat) => (
            <section key={cat}>
              <h2 className="text-3xl">{t(cat)}</h2>
              <div className="mt-4 grid gap-3">
                {menu.filter((d) => d.category === cat).map((d, i) => (
                  <div key={d.id} className="flex items-center justify-between gap-4 rounded-2xl border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft">
                    <div className="flex min-w-0 items-center gap-4">
                      <img src={d.img} alt={d.name} loading="lazy" width={944} height={704} className="h-16 w-16 shrink-0 rounded-xl object-cover md:h-20 md:w-20" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 font-semibold">
                          <span className="truncate">{d.name}</span>
                          <FavoriteHeart dishId={d.id} dishName={d.name} className="shrink-0" />
                          {Array.from({ length: d.spice }).map((_, fi) => <Flame key={fi} className="h-3.5 w-3.5 text-destructive" />)}
                        </div>
                        <p className="text-sm text-muted-foreground">{d.desc[lang]}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {d.diets.map((x) => <span key={x} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">{t(x)}</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="font-semibold">{d.price} kr</span>
                      <AddDishButton onAdd={(n) => add(d, r.id, n)} label={t("add")} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-navy p-5 text-navy-foreground">
            <div className="flex items-center gap-2 text-sm opacity-80"><Clock className="h-4 w-4" /> {t("eta")}</div>
            <div className="mt-1 font-serif text-5xl">{r.eta.total} {t("min")}</div>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between"><dt className="opacity-80">{t("prep")}</dt><dd>{r.eta.prep} {t("min")}</dd></div>
              <div className="flex justify-between"><dt className="opacity-80">{t("travel")} ({r.km.toFixed(1)} {t("km")})</dt><dd>{r.eta.travel} {t("min")}</dd></div>
              <div className="flex justify-between"><dt className="opacity-80">{t("handoff")}</dt><dd>{r.eta.handoff} {t("min")}</dd></div>
            </dl>
          </div>
          <div className="flex items-center justify-between rounded-2xl border bg-card p-5">
            <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-saffron text-saffron" /> {r.rating}</span>
            <span className="rounded-full bg-saffron px-3 py-1 text-sm font-semibold text-saffron-foreground">{r.score}% {t("match")}</span>
          </div>
          <Link to="/checkout" className="btn-primary w-full">{t("checkout")}</Link>
        </aside>
      </div>
    </div>
  );
}
