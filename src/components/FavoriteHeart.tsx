import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";

// Heart toggle for a single dish; the pick shows up in the home favourites strip.
export function FavoriteHeart({ dishId, dishName, className = "" }: { dishId: string; dishName: string; className?: string }) {
  const { favorites, toggleFavorite } = useStore();
  const { t } = useI18n();
  const saved = favorites.includes(dishId);
  return (
    <button
      type="button"
      onClick={() => {
        // count only the save direction, not unhearting
        if (!saved) window.__lovableEvents?.track?.("project.dish_favourited", { dish_id: dishId });
        toggleFavorite(dishId);
      }}
      aria-label={`${saved ? t("fav_saved") : t("fav_save")} ${dishName}`}
      aria-pressed={saved}
      className={`rounded-full p-1 transition-transform hover:scale-110 active:scale-90 ${className}`}
    >
      <Heart className={`h-4 w-4 transition-colors ${saved ? "anim-pop fill-saffron text-saffron" : "text-muted-foreground hover:text-saffron"}`} />
    </button>
  );
}
