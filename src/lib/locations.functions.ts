import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
import { municipalityResults, locateResult, type GeocodeResult } from '@/lib/location-search';

export const searchMunicipality = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ query: z.string().trim().min(3).max(120), lang: z.enum(['en', 'sv']) }).parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env['GOOGLE_MAPS_API_KEY'];
    const lovableKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey || !lovableKey) return { results: [], error: 'configuration' as const };
    const params = new URLSearchParams({ address: `${data.query}, Karlskrona kommun, Sweden`, components: 'country:SE', region: 'se', language: data.lang });
    const response = await fetch(`https://connector-gateway.lovable.dev/google_maps/maps/api/geocode/json?${params}`, { headers: { Authorization: `Bearer ${lovableKey}`, 'X-Connection-Api-Key': apiKey } });
    if (!response.ok) {
      const body = await response.text();
      console.error(`Google location search [${response.status}]: ${body}`);
      if (response.status === 403) {
        if (body.includes('API_KEY_HTTP_REFERRER_BLOCKED')) return { results: [], error: 'referrer' as const };
        if (body.includes('API_KEY_SERVICE_BLOCKED')) return { results: [], error: 'api' as const };
      }
      return { results: [], error: 'provider' as const };
    }
    const body = await response.json() as { status: string; error_message?: string; results?: GeocodeResult[] };
    if (body.status !== 'OK' && body.status !== 'ZERO_RESULTS') {
      console.error(`Google location search: ${body.status}: ${body.error_message ?? ''}`);
      return { results: [], error: 'provider' as const };
    }
    return { results: municipalityResults(body.results ?? []), error: null };
  });

// Turn the customer's GPS coordinates into a street address, accepted only
// inside Karlskrona municipality. Signed-in users only: paid Google call.
export const locateMe = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180), lang: z.enum(['en', 'sv']) }).parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env['GOOGLE_MAPS_API_KEY'];
    const lovableKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey || !lovableKey) return { address: null, area: null, error: 'configuration' as const };
    const params = new URLSearchParams({ latlng: `${data.lat},${data.lng}`, region: 'se', language: data.lang });
    const response = await fetch(`https://connector-gateway.lovable.dev/google_maps/maps/api/geocode/json?${params}`, { headers: { Authorization: `Bearer ${lovableKey}`, 'X-Connection-Api-Key': apiKey } });
    if (!response.ok) {
      const body = await response.text();
      console.error(`Google locate-me [${response.status}]: ${body}`);
      if (response.status === 403) {
        if (body.includes('API_KEY_HTTP_REFERRER_BLOCKED')) return { address: null, area: null, error: 'referrer' as const };
        if (body.includes('API_KEY_SERVICE_BLOCKED')) return { address: null, area: null, error: 'api' as const };
      }
      return { address: null, area: null, error: 'provider' as const };
    }
    const body = await response.json() as { status: string; error_message?: string; results?: GeocodeResult[] };
    if (body.status !== 'OK' && body.status !== 'ZERO_RESULTS') {
      console.error(`Google locate-me: ${body.status}: ${body.error_message ?? ''}`);
      return { address: null, area: null, error: 'provider' as const };
    }
    const located = locateResult(body.results ?? []);
    if (!located) return { address: null, area: null, error: 'outside' as const };
    return { address: located.label, area: located.place, error: null as null };
  });