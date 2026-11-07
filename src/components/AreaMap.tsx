import { useEffect, useRef, useState } from "react";
import { ExternalLink, Map as MapIcon, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AREAS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { LocationBrowser } from '@/components/LocationBrowser';

type MapInstance = { setCenter: (p: { lat: number; lng: number }) => void; setZoom: (z: number) => void; setMapTypeId: (id: string) => void };
type MapsApi = { Map: new (el: HTMLElement, options: Record<string, unknown>) => MapInstance };
declare global {
  interface Window { matbatenMapReady?: () => void; gm_authFailure?: () => void; google?: { maps?: MapsApi }; }
}
let loading: Promise<MapsApi> | undefined;
function loadMap(lang: string): Promise<MapsApi> {
  if (window.google?.maps?.Map) return Promise.resolve(window.google.maps);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const key = import.meta.env['VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY'];
    if (!key) { reject(new Error('Map configuration missing')); return; }
    window.matbatenMapReady = () => {
      if (window.google?.maps) resolve(window.google.maps);
      else reject(new Error('Map unavailable'));
    };
    window.gm_authFailure = () => { window.dispatchEvent(new Event('matbaten-map-error')); reject(new Error('Map authorization failed')); };
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=matbatenMapReady&channel=${import.meta.env['VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID'] ?? ''}&language=${lang}&region=SE`;
    script.onerror = () => reject(new Error('Map unavailable'));
    document.head.appendChild(script);
  });
  return loading;
}

export function AreaMap() {
  const { t, lang } = useI18n();
  const { areaId, selectedLocation } = useStore();
  const area = AREAS.find(a => a.id === areaId);
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapInstance | null>(null);
  const [mode, setMode] = useState<'roadmap' | 'hybrid'>('hybrid');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    let active = true;
    const failed = () => { if (active) setStatus('error'); };
    window.addEventListener('matbaten-map-error', failed);
    const timeout = window.setTimeout(failed, 20000);
    loadMap(lang).then(api => {
      if (!active || !container.current) return;
      map.current = new api.Map(container.current, { center: { lat: 56.1961866, lng: 15.6208946 }, zoom: 17, mapTypeId: 'hybrid', clickableIcons: false, streetViewControl: false, mapTypeControl: false, fullscreenControl: true, gestureHandling: 'cooperative' });
      setStatus('ready');
      window.clearTimeout(timeout);
    }).catch(failed);
    return () => { active = false; window.clearTimeout(timeout); window.removeEventListener('matbaten-map-error', failed); map.current = null; };
  }, []);
  useEffect(() => {
    if (status !== 'ready' || !area) return;
    const point = selectedLocation ?? area;
    map.current?.setCenter({ lat: point.lat, lng: point.lng });
    map.current?.setZoom(selectedLocation || area.id === 'kungsmarken' ? 18 : 16);
    map.current?.setMapTypeId(mode);
  }, [area, selectedLocation, mode, status]);
  if (!area) return null;
  return (
    <section className="mt-6 border-y py-5" aria-label={t('map_title')}>
      <LocationBrowser />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="min-w-0 break-words text-2xl">{t('map_title')} · {selectedLocation?.label ?? area.name}</h2>
        <div className="flex gap-2">
          <Button variant={mode === 'roadmap' ? 'default' : 'outline'} onClick={() => setMode('roadmap')} aria-pressed={mode === 'roadmap'}><MapIcon />{t('map_road')}</Button>
          <Button variant={mode === 'hybrid' ? 'default' : 'outline'} onClick={() => setMode('hybrid')} aria-pressed={mode === 'hybrid'}><Satellite />{t('map_satellite')}</Button>
        </div>
      </div>
      <div className="relative h-[360px] overflow-hidden rounded-lg border bg-muted sm:h-[420px]">
        <div ref={container} className="h-full w-full" />
        {status !== 'ready' && <div role="status" className="absolute inset-0 flex items-center justify-center bg-muted p-6 text-center text-muted-foreground">{t(status === 'loading' ? 'map_loading' : 'map_error')}</div>}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-xl text-xs text-muted-foreground">{t('map_area_note')}</p>
        <Button asChild variant="link" size="sm"><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedLocation?.label ?? area.name + ', Karlskrona, Sweden')}`} target="_blank" rel="noopener noreferrer"><ExternalLink />{t('map_open')}</a></Button>
      </div>
      <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
        <a className="underline" href="https://maps.google.com/help/terms_maps/" target="_blank" rel="noopener noreferrer">{t('map_terms')}</a>
        <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">{t('map_privacy')}</a>
      </div>
    </section>
  );
}