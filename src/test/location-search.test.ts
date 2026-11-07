import { describe, it, expect } from 'vitest';
import { municipalityResults, locateResult, bestAreaMatch, type GeocodeResult } from '@/lib/location-search';
const place = (name: string, municipality: string, country = 'SE', extra: GeocodeResult['address_components'] = []): GeocodeResult => ({ formatted_address: name, address_components: [...extra, { long_name: municipality, types: ['administrative_area_level_2'] }, { long_name: 'Sweden', short_name: country, types: ['country'] }], geometry: { location: { lat: 56.2, lng: 15.6 } } });
describe('municipality-wide location search', () => {
  it('accepts both city addresses and rural/island locations within Karlskrona municipality', () => {
    expect(municipalityResults([place('Kungsmarksvägen 45', 'Karlskrona kommun'), place('Sturkö', 'Karlskrona Municipality'), place('Holmsjö', 'Karlskrona')])).toHaveLength(3);
  });
  it('excludes other municipalities and results without verified municipality membership', () => {
    expect(municipalityResults([place('Ronneby', 'Ronneby'), place('Karlskrona', ''), place('Karlskrona', 'Karlskrona', 'NO')])).toEqual([]);
  });
  it('caps and deduplicates search results', () => {
    const rows = Array.from({ length: 9 }, (_, i) => place(`Street ${i}`, 'Karlskrona'));
    expect(municipalityResults([rows[0], ...rows].filter((r): r is GeocodeResult => !!r))).toHaveLength(5);
  });
});
describe('GPS address detection', () => {
  const street = (name: string, municipality: string, placeName: string, country = 'SE'): GeocodeResult => place(name, municipality, country, [{ long_name: placeName, types: ['sublocality', 'sublocality_level_1', 'political'] }, { long_name: name, types: ['route'] }]);
  it('keeps a street-level address inside Karlskrona municipality and names its area', () => {
    expect(locateResult([street('Kungsmarksvägen 45', 'Karlskrona', 'Kungsmarken')])).toEqual({ label: 'Kungsmarksvägen 45', lat: 56.2, lng: 15.6, place: 'Kungsmarken' });
  });
  it('rejects coordinates outside the delivery municipality', () => {
    expect(locateResult([street('Ronnebyvägen 1', 'Ronneby', 'Ronneby')])).toBeNull();
  });
  it('rejects municipality-only results with no usable address', () => {
    expect(locateResult([place('Karlskrona kommun', 'Karlskrona', 'SE', [{ long_name: 'Karlskrona kommun', types: ['administrative_area_level_1'] }])])).toBeNull();
  });
  it('accepts real street results that carry postal_town Karlskrona instead of the municipality component', () => {
    const kungsmarken: GeocodeResult = { formatted_address: 'Kungsmarksvägen 45, 371 44 Karlskrona', address_components: [{ long_name: 'Kungsmarksvägen', types: ['route'] }, { long_name: 'Kungsmarken', types: ['sublocality', 'sublocality_level_1', 'political'] }, { long_name: 'Karlskrona', types: ['postal_town'] }, { long_name: 'Blekinge län', types: ['administrative_area_level_1', 'political'] }, { long_name: 'Sweden', short_name: 'SE', types: ['country', 'political'] }], geometry: { location: { lat: 56.2, lng: 15.6 } } };
    expect(locateResult([kungsmarken])).toEqual({ label: 'Kungsmarksvägen 45, 371 44 Karlskrona', lat: 56.2, lng: 15.6, place: 'Kungsmarken' });
  });
  it('still rejects postal towns outside the delivery municipality', () => {
    const ronneby: GeocodeResult = { formatted_address: 'Kungsbäcksvägen 1, 372 40 Ronneby', address_components: [{ long_name: 'Kungsbäcksvägen', types: ['route'] }, { long_name: 'Ronneby', types: ['postal_town'] }, { long_name: 'Blekinge län', types: ['administrative_area_level_1', 'political'] }, { long_name: 'Sweden', short_name: 'SE', types: ['country', 'political'] }], geometry: { location: { lat: 56.2, lng: 15.6 } } };
    expect(locateResult([ronneby])).toBeNull();
  });
  it('falls back to a locality result inside Karlskrona when no street component exists', () => {
    expect(locateResult([place('Sturkö', 'Karlskrona', 'SE', [{ long_name: 'Sturkö', types: ['locality'] }])])?.label).toBe('Sturkö');
  });
});
describe('area suggestion from GPS place name', () => {
  const areas = [{ id: 'trosso', name: 'Trossö (Centrum)' }, { id: 'salto', name: 'Saltö' }, { id: 'kungsmarken', name: 'Kungsmarken' }];
  it('matches an area ignoring accents and parenthetical suffixes', () => {
    expect(bestAreaMatch('Trossö', areas)).toBe('trosso');
    expect(bestAreaMatch('Salto', areas)).toBe('salto');
    expect(bestAreaMatch('Kungsmarken', areas)).toBe('kungsmarken');
    expect(bestAreaMatch('Saltövägen', areas)).toBe('salto');
  });
  it('returns null for unknown or missing place names', () => {
    expect(bestAreaMatch('Ronneby', areas)).toBeNull();
    expect(bestAreaMatch(null, areas)).toBeNull();
  });
});