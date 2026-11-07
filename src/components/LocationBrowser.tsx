import { useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { MapPin, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { MUNICIPALITY_GROUPS } from '@/lib/municipality-areas';
import { searchMunicipality } from '@/lib/locations.functions';
import type { ResolvedLocation } from '@/lib/location-search';

export function LocationBrowser() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { selectedLocation, setSelectedLocation } = useStore();
  const search = useServerFn(searchMunicipality);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const [results, setResults] = useState<ResolvedLocation[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<'none' | 'provider' | 'configuration' | 'referrer' | 'api' | null>(null);
  const sequence = useRef(0);
  const cache = useRef(new Map<string, ResolvedLocation[]>());
  const run = async (value: string) => {
    setQuery(value);
    setError(null);
    setResults([]);
    if (!user || busy || value.trim().length < 3) return;
    const current = ++sequence.current;
    const cacheKey = `${lang}:${value.trim().toLowerCase()}`;
    const cached = cache.current.get(cacheKey);
    if (cached) { setResults(cached); setError(cached.length ? null : 'none'); return; }
    setBusy(true);
    try {
      const response = await search({ data: { query: value, lang } });
      if (current !== sequence.current) return;
      setResults(response.results);
      setError(response.error ?? (response.results.length ? null : 'none'));
      if (!response.error) cache.current.set(cacheKey, response.results);
    } catch { if (current === sequence.current) setError('provider'); }
    finally { setBusy(false); }
  };
  return <div className="mb-5 space-y-4">
    <div>
      <h3 className="text-xl">{t('municipality')}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{t('municipality_note')}</p>
    </div>
    <div className="flex gap-2">
      <label className="flex min-w-0 flex-1 items-center gap-2 rounded-md border bg-card px-3">
        <Search className="h-4 w-4 shrink-0 text-primary" />
        <input value={query} maxLength={120} onChange={e => { setQuery(e.target.value); setError(null); setResults([]); }} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); void run(query); } }} aria-label={t('location_search')} placeholder={t('location_search')} className="h-10 w-full min-w-0 bg-transparent text-sm outline-none" />
      </label>
      <Button disabled={!user || busy || query.trim().length < 3} onClick={() => void run(query)} aria-label={t('location_search_btn')} size="icon" className="h-10 w-10 shrink-0"><Search /></Button>
    </div>
    {!user && <Button asChild variant="link" className="h-auto p-0"><Link to="/auth">{t('location_signin')}</Link></Button>}
    {busy && <p role="status" className="text-sm text-muted-foreground">{t('location_busy')}</p>}
    {error && <p role="status" className="text-sm text-muted-foreground">{t(error === 'none' ? 'location_none' : error === 'configuration' ? 'location_configuration' : error === 'referrer' ? 'location_referrer' : error === 'api' ? 'location_api' : 'location_provider')}</p>}
    {results.length > 0 && <div className="divide-y border-y">
      {results.map(result => <Button key={result.label} variant="ghost" className="h-auto w-full justify-start whitespace-normal py-3 text-left" onClick={() => { setSelectedLocation(result); setResults([]); }}><MapPin />{result.label}</Button>)}
    </div>}
    {selectedLocation && <div className="flex items-center gap-2 border-l-2 border-primary pl-3 text-sm"><MapPin className="h-4 w-4 shrink-0 text-primary" /><span className="min-w-0 flex-1 break-words">{t('location_selected')}: {selectedLocation.label}</span><Button variant="ghost" size="icon" onClick={() => setSelectedLocation(null)} aria-label={t('location_clear')}><X /></Button></div>}
    <details>
      <summary className="cursor-pointer text-sm font-semibold text-primary">{t('subareas')}</summary>
      <label className="mt-3 block"><span className="sr-only">{t('subareas')}</span><select value={group} onChange={e => setGroup(e.target.value)} className="h-9 w-full rounded-md border bg-card px-3 text-sm"><option value="all">{t('all_groups')}</option>{MUNICIPALITY_GROUPS.map(g => <option key={g.id} value={g.id}>{t(g.key)}</option>)}</select></label>
      <div className="mt-3 space-y-4">{MUNICIPALITY_GROUPS.filter(g => group === 'all' || g.id === group).map(g => <div key={g.id}><h4 className="mb-2 text-sm font-semibold">{t(g.key)}</h4><div className="flex flex-wrap gap-2">{g.places.map(name => <Button key={name} size="sm" variant="outline" disabled={busy} onClick={() => void run(name)}>{name}</Button>)}</div></div>)}</div>
    </details>
  </div>;
}