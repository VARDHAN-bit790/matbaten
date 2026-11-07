import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AREAS, RESTAURANTS, type Dish, type Restaurant } from "./data";
import { DEFAULT_PROFILE, deliveryEta, distanceKm, matchScore, type TasteProfile } from "./match";
import type { ResolvedLocation } from './location-search';

export type CartItem = { dish: Dish; restaurantId: string; qty: number };

type Ctx = {
  areaId: string;
  setAreaId: (id: string) => void;
  selectedLocation: ResolvedLocation | null;
  setSelectedLocation: (location: ResolvedLocation | null) => void;
  profile: TasteProfile;
  setProfile: (p: TasteProfile) => void;
  favorites: string[];
  toggleFavorite: (dishId: string) => void;
  cart: CartItem[];
  add: (dish: Dish, restaurantId: string, qty?: number) => void;
  setQty: (dishId: string, qty: number) => void;
  clear: () => void;
  loadItems: (items: CartItem[]) => void;
};

const StoreContext = createContext<Ctx | null>(null);

function load<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [areaId, setAreaId] = useState(AREAS[0]!.id);
  const [selectedLocation, setSelectedLocation] = useState<ResolvedLocation | null>(null);
  const [profile, setProfile] = useState<TasteProfile>(DEFAULT_PROFILE);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const a = load<string>("area");
    if (a && AREAS.some((x) => x.id === a)) setAreaId(a);
    const p = load<TasteProfile>("profile");
    if (p) setProfile(p);
    const f = load<string[]>("favorites");
    if (f) setFavorites(f);
    const c = load<CartItem[]>("cart");
    if (c) setCart(c);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("area", JSON.stringify(areaId));
    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("favorites", JSON.stringify(favorites));
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [ready, areaId, profile, favorites, cart]);

  const toggleFavorite = (dishId: string) =>
    setFavorites((f) => (f.includes(dishId) ? f.filter((x) => x !== dishId) : [...f, dishId]));

  const value: Ctx = {
    areaId, setAreaId: id => { setAreaId(id); setSelectedLocation(null); }, selectedLocation, setSelectedLocation, profile, setProfile, favorites, toggleFavorite, cart,
    add: (dish, restaurantId, qty = 1) => {
      window.__lovableEvents?.track?.("project.add_to_cart", { dish_id: dish.id, restaurant_id: restaurantId, qty });
      setCart((c) => {
        // one restaurant per order
        const base = c.length && c[0]!.restaurantId !== restaurantId ? [] : c;
        const ex = base.find((i) => i.dish.id === dish.id);
        return ex ? base.map((i) => (i.dish.id === dish.id ? { ...i, qty: i.qty + qty } : i)) : [...base, { dish, restaurantId, qty }];
      });
    },
    setQty: (id, qty) => setCart((c) => (qty <= 0 ? c.filter((i) => i.dish.id !== id) : c.map((i) => (i.dish.id === id ? { ...i, qty } : i)))),
    clear: () => setCart([]),
    loadItems: (items) => setCart(items),
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const c = useContext(StoreContext);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

export type RankedRestaurant = Restaurant & { score: number; km: number; eta: ReturnType<typeof deliveryEta> };

export function useRanked(): RankedRestaurant[] {
  const { areaId, profile } = useStore();
  return useMemo(() => {
    const area = AREAS.find((a) => a.id === areaId) ?? AREAS[0]!;
    return RESTAURANTS.map((r) => {
      const km = distanceKm(area.lat, area.lng, r.lat, r.lng);
      return { ...r, km, score: matchScore(r, profile), eta: deliveryEta(r.prep, km) };
    });
  }, [areaId, profile]);
}
