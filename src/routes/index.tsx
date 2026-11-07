import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, MapPin, Clock, ArrowRight } from "lucide-react";
import { CUISINES } from "@/lib/data";
import hero from "@/assets/hero.jpg";
import { useI18n } from "@/lib/i18n";
import { useRanked } from "@/lib/store";
import { AreaSelect } from "@/components/SiteHeader";
import { RestaurantCard } from "@/components/RestaurantCard";
import { FavoritesStrip } from "@/components/FavoritesStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matbåten — Order food in Karlskrona, Blekinge" },
      { name: "description", content: "Nearby restaurants in Karlskrona ranked by your taste, with honest delivery times. English & Svenska." },
      { property: "og:title", content: "Matbåten — Order food in Karlskrona" },
      { property: "og:description", content: "Nearby food matched to your taste, delivered across Karlskrona." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const ranked = useRanked();
  const top = [...ranked].sort((a, b) => b.score - a.score || a.eta.total - b.eta.total).slice(0, 6);
  const best = ranked.length ? Math.min(...ranked.map((r) => r.eta.total)) : 0;
  const bestScore = ranked.length ? Math.max(...ranked.map((r) => r.score)) : 0;
  const steps = [
    { icon: Sparkles, title: t("how1"), d: t("how1d") },
    { icon: MapPin, title: t("how2"), d: t("how2d") },
    { icon: Clock, title: t("how3"), d: t("how3d") },
  ];
  return (
    <>
      <section className="hero-wash">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
          <div className="anim-rise">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("hero_kicker")}</p>
            <h1 className="mt-4 text-5xl leading-[1.02] md:text-7xl">{t("hero_title")}</h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">{t("hero_sub")}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <AreaSelect />
              <Link to="/restaurants" className="btn-primary">{t("find_food")} <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <Link to="/quiz" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline">
              <Sparkles className="h-4 w-4" /> {t("take_quiz")}
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
              <span><b className="text-foreground">{t("stat1")}</b></span>
              <span aria-hidden className="text-border">·</span>
              <span><b className="text-foreground">{t("stat2")}</b></span>
              <span aria-hidden className="text-border">·</span>
              <span><b className="text-foreground">{t("stat3")}</b></span>
            </div>
          </div>
          <div className="relative">
            <img src={hero} alt="Swedish dishes on a table by the Karlskrona sea" width={1600} height={1008} className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-soft" />
            <div className="absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-soft">
              <Clock className="h-5 w-5 text-primary" />
              <div className="text-sm"><b>{best} {t("min")}</b> <span className="text-muted-foreground">— {t("sort_fast").toLowerCase()}</span></div>
            </div>
            <div className="absolute -top-4 right-6 rounded-2xl bg-saffron px-4 py-3 text-saffron-foreground shadow-soft">
              <div className="text-sm"><b>{bestScore}% {t("match")}</b></div>
            </div>
          </div>
        </div>
      </section>

      <section className="anim-rise mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl">{t("for_you")}</h2>
            <p className="mt-1 text-muted-foreground">{t("for_you_sub")}</p>
          </div>
          <Link to="/restaurants" className="btn-ghost">{t("see_all")}</Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((r) => <RestaurantCard key={r.id} r={r} />)}
        </div>
      </section>

      <FavoritesStrip />

      <section className="anim-rise mx-auto max-w-6xl px-4 py-6">
        <h2 className="text-4xl">{t("crave")}</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <Link key={c} to="/restaurants" className="chip hover:border-primary">{t(c)}</Link>
          ))}
        </div>
      </section>

      <section className="anim-rise mx-auto max-w-6xl px-4 py-10">
        <div className="band-navy flex flex-col gap-6 rounded-[2rem] p-8 text-navy-foreground md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-4xl">{t("cta_title")}</h2>
            <p className="mt-2 max-w-xl opacity-80">{t("cta_body")}</p>
          </div>
          <Link to="/restaurants" className="btn-primary w-fit shrink-0 bg-saffron text-saffron-foreground">{t("cta_btn")}</Link>
        </div>
      </section>

      <section className="anim-rise mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-4xl">{t("how_title")}</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={i} className="rounded-2xl border bg-card p-6">
              <s.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
