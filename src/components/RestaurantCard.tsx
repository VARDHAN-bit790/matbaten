import { Link } from "@tanstack/react-router";
import { Clock, Star, Flame } from "lucide-react";
import { CUISINE_IMG } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import type { RankedRestaurant } from "@/lib/store";

export function RestaurantCard({ r }: { r: RankedRestaurant }) {
  const { t, lang } = useI18n();
  return (
    <Link to="/restaurants/$id" params={{ id: r.id }} className="group block overflow-hidden rounded-2xl bg-card shadow-soft transition hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={CUISINE_IMG[r.cuisine]} alt={r.name} loading="lazy" width={944} height={704} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-saffron px-3 py-1 text-xs font-semibold text-saffron-foreground">
          {r.score}% {t("match")}
        </span>
        {r.eta.total <= 30 && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            {t("fast")}
          </span>
        )}
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-navy px-3 py-1 text-xs font-medium text-navy-foreground">
          <Clock className="h-3 w-3" /> {r.eta.total}–{r.eta.total + 10} {t("min")}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-2xl leading-tight">{r.name}</h3>
          <span className="flex items-center gap-1 text-sm font-medium"><Star className="h-4 w-4 fill-saffron text-saffron" />{r.rating}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{r.tagline[lang]}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="font-medium text-primary">{t(r.cuisine)}</span>
          <span>{"kr".repeat(r.price)}</span>
          <span className="flex items-center">{Array.from({ length: r.spice }).map((_, i) => <Flame key={i} className="h-3 w-3 text-destructive" />)}</span>
          <span>{r.area} · {r.km.toFixed(1)} {t("km")}</span>
        </div>
      </div>
    </Link>
  );
}
