import type { Cuisine, Diet } from "./data";

export type TasteProfile = {
  cuisines: Cuisine[];
  diets: Diet[];
  spice: number; // 0-4
  price: 1 | 2 | 3;
};

export const DEFAULT_PROFILE: TasteProfile = { cuisines: [], diets: [], spice: 2, price: 2 };

type Scorable = { cuisine: Cuisine; diets: Diet[]; spice: number; price: number };

/** 0–100 match between a restaurant and a taste profile. */
export function matchScore(r: Scorable, p: TasteProfile): number {
  const cuisine = p.cuisines.length === 0 ? 30 : p.cuisines.includes(r.cuisine) ? 40 : 10;
  const diet = p.diets.length === 0 ? 25 : (25 * p.diets.filter((d) => r.diets.includes(d)).length) / p.diets.length;
  const spice = 20 * (1 - Math.abs(r.spice - p.spice) / 4);
  const price = 15 * (1 - Math.abs(r.price - p.price) / 2);
  return Math.round(cuisine + diet + spice + price);
}

export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const COURIER_KMH = 25;
export const HANDOFF_MIN = 5;

/** Delivery estimate: kitchen prep + courier travel + handoff. */
export function deliveryEta(prepMin: number, km: number) {
  const travel = Math.round((km / COURIER_KMH) * 60);
  return { prep: prepMin, travel, handoff: HANDOFF_MIN, total: prepMin + travel + HANDOFF_MIN };
}
