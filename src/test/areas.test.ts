import { describe, expect, it } from "vitest";
import { AREAS } from "@/lib/data";
import { distanceKm } from "@/lib/match";

describe("real Karlskrona delivery locations", () => {
  const verified = [
    ["trosso", 56.1621073, 15.5866422],
    ["bjorkholmen", 56.16199, 15.5725],
    ["slottsbron", 56.19749, 15.64905],
    ["amiralen", 56.196339, 15.642083],
    ["hultvagen", 56.19251, 15.62707],
    ["salto", 56.169523, 15.5670153],
    ["kungsmarken", 56.1961866, 15.6208946],
    ["langö", 56.181827, 15.581658],
    ["gullberna", 56.19329, 15.63182],
    ["lyckeby", 56.19869, 15.65474],
    ["nattraby", 56.19990, 15.53649],
    ["rodeby", 56.26083, 15.62139],
    ["jamjo", 56.19197, 15.83505],
    ["hasslo", 56.11843, 15.48133],
  ] as const;

  it.each(verified)("%s uses its source-backed representative pin", (id, lat, lng) => {
    expect(AREAS.find((area) => area.id === id)).toMatchObject({ lat, lng });
  });

  it("keeps Amiralen close to Lyckeby rather than central Karlskrona", () => {
    const amiralen = AREAS.find((area) => area.id === "amiralen");
    const lyckeby = AREAS.find((area) => area.id === "lyckeby");
    expect(amiralen).toBeDefined();
    expect(lyckeby).toBeDefined();
    if (!amiralen || !lyckeby) throw new Error("Missing delivery location");
    expect(distanceKm(amiralen.lat, amiralen.lng, lyckeby.lat, lyckeby.lng)).toBeLessThan(1);
  });
});