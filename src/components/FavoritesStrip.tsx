import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { findDish } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { FavoriteHeart } from "./FavoriteHeart";

// Home-page strip of hearted dishes; hidden until the visitor saves one.
export function FavoritesStrip() {
  const { t, lang } = useI18n();
  const { favorites, add } = useStore();
  const items = favorites.map(findDish).slice(0, 8);
  const usable = items.filter((x) => x !== null);
  if (usable.length === 0) return null;

  return (
    <section className="anim-rise mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center gap-2">
        <Heart className="h-6 w-6 fill-saffron text-saffron" />
        <h2 className="text-3xl md:text-4xl">{t("favourites_title")}</h2>
      </div>
      <p className="mt-1 text-muted-foreground">{t("favourites_sub")}</p>
      <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
        {usable.map(({ dish, restaurant }) => (
          <div key={dish.id} className="w-44 shrink-0 rounded-2xl border bg-card p-3 shadow-soft">
            <div className="relative">
              <img src={dish.img} alt={dish.name} loading="lazy" width={944} height={704} className="h-28 w-full rounded-xl object-cover" />
              <FavoriteHeart dishId={dish.id} dishName={dish.name} className="absolute right-1.5 top-1.5 bg-card/80 backdrop-blur" />
            </div>
            <div className="mt-2 truncate font-semibold">{dish.name}</div>
            <Link to="/restaurants/$id" params={{ id: restaurant.id }} className="truncate text-xs text-muted-foreground hover:text-primary">
              {restaurant.name}
            </Link>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-semibold">{dish.price} kr</span>
              <button
                onClick={() => add(dish, restaurant.id)}
                className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                aria-label={`${t("add")} ${dish.name}`}
              >
                <Plus className="h-3.5 w-3.5" /> {t("add")}
              </button>
            </div>
            <p className="sr-only">{dish.desc[lang]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
