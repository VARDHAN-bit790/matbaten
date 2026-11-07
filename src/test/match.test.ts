import { describe, expect, it } from "vitest";
import { deliveryEta, distanceKm, matchScore } from "@/lib/match";

describe("delivery ETA", () => {
  it("adds prep, travel at 25 km/h and 5 min handoff", () => {
    expect(deliveryEta(15, 10)).toEqual({ prep: 15, travel: 24, handoff: 5, total: 44 });
  });
  it("Trossö to Jämjö is roughly 16 km", () => {
    const km = distanceKm(56.1612, 15.5869, 56.1906, 15.8418);
    expect(km).toBeGreaterThan(15);
    expect(km).toBeLessThan(17);
  });
});

describe("match score", () => {
  const r = { cuisine: "thai" as const, diets: ["vegan" as const], spice: 4, price: 2 };
  it("perfect match scores 100", () => {
    expect(matchScore(r, { cuisines: ["thai"], diets: ["vegan"], spice: 4, price: 2 })).toBe(100);
  });
  it("wrong cuisine, missing diet, opposite spice and price scores low", () => {
    expect(matchScore({ ...r, price: 3 }, { cuisines: ["pizza"], diets: ["halal"], spice: 0, price: 1 })).toBe(10);
  });
});
