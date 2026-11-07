export type ResolvedLocation = { label: string; lat: number; lng: number };
type Component = { long_name: string; short_name?: string; types: string[] };
export type GeocodeResult = { formatted_address: string; partial_match?: boolean; address_components: Component[]; geometry: { location: { lat: number; lng: number } } };

// Require the municipality component, not a rectangular approximation of its border.
export function municipalityResults(results: GeocodeResult[]): ResolvedLocation[] {
  const seen = new Set<string>();
  return results.filter(result => inKarlskrona(result) && Number.isFinite(result.geometry.location.lat) && Number.isFinite(result.geometry.location.lng)).flatMap(result => {
    if (seen.has(result.formatted_address)) return [];
    seen.add(result.formatted_address);
    return [{ label: result.formatted_address, ...result.geometry.location }];
  }).slice(0, 5);
}

const isKarlskrona = (municipality: string) => ['karlskrona', 'karlskrona kommun', 'karlskrona municipality'].includes(municipality.toLowerCase());

function inKarlskrona(result: GeocodeResult, allowPostalTown = false): boolean {
  const municipality = result.address_components.find(c => c.types.includes('administrative_area_level_2'));
  const country = result.address_components.find(c => c.types.includes('country'));
  if (country?.short_name !== 'SE') return false;
  if (municipality) return isKarlskrona(municipality.long_name);
  // Street-level reverse-geocode results inside Karlskrona often omit the
  // municipality component and carry only postal_town: Karlskrona.
  if (!allowPostalTown) return false;
  const town = result.address_components.find(c => c.types.includes('postal_town'));
  return !!town && isKarlskrona(town.long_name);
}

const STREET_TYPES = ['street_address', 'route', 'premise', 'subpremise', 'establishment'];
const PLACE_TYPES = ['sublocality', 'sublocality_level_1', 'neighborhood', 'locality'];

export type LocatedAddress = { label: string; lat: number; lng: number; place: string | null };

// Pick the best reverse-geocoded result: a street-level address inside
// Karlskrona municipality. Returns null when the coordinates fall outside it
// or when only the bare municipality name comes back.
export function locateResult(results: GeocodeResult[]): LocatedAddress | null {
  const inside = results.filter(r => inKarlskrona(r, true));
  const usable = (r: GeocodeResult) => r.address_components.some(c => c.types.some(t => STREET_TYPES.includes(t) || PLACE_TYPES.includes(t)));
  const streetLevel = inside.find(r => r.address_components.some(c => c.types.some(t => STREET_TYPES.includes(t))));
  const result = streetLevel ?? inside.find(usable);
  if (!result) return null;
  const place = result.address_components.find(c => c.types.some(t => PLACE_TYPES.includes(t)))?.long_name ?? null;
  return { label: result.formatted_address, ...result.geometry.location, place };
}

const stripDiacritics = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const normPlace = (s: string) => stripDiacritics(s.toLowerCase()).replace(/\s*\(.*\)\s*$/, '').trim();

// Match a reverse-geocoded place name to a delivery area ID, accent-insensitively.
export function bestAreaMatch(place: string | null, areas: ReadonlyArray<{ id: string; name: string }>): string | null {
  if (!place) return null;
  const target = normPlace(place);
  if (!target) return null;
  const hit = areas.find(a => normPlace(a.name) === target)
    ?? areas.find(a => { const n = normPlace(a.name); return n && (target.startsWith(n) || n.startsWith(target)); });
  return hit?.id ?? null;
}