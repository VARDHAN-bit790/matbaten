import { Crosshair, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { locateMe } from "@/lib/locations.functions";
import { bestAreaMatch } from "@/lib/location-search";
import { AREAS } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

type Status = "idle" | "gps" | "lookup" | "outside" | "denied" | "error";

// Fills the customer's home address from their device location.
// Shown only when signed in: reverse geocoding is a paid Google call.
export function LocateAddress({ onLocated, className }: { onLocated: (address: string, areaId: string | null) => void; className?: string }) {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const locate = useServerFn(locateMe);
  const [status, setStatus] = useState<Status>("idle");

  if (!user) return null;

  const run = () => {
    if (!("geolocation" in navigator)) { setStatus("error"); return; }
    setStatus("gps");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStatus("lookup");
        locate({ data: { lat: pos.coords.latitude, lng: pos.coords.longitude, lang } })
          .then((res) => {
            if (res.error === "outside") setStatus("outside");
            else if (res.error || !res.address) setStatus("error");
            else {
              setStatus("idle");
              onLocated(res.address, bestAreaMatch(res.area, AREAS));
            }
          })
          .catch(() => setStatus("error"));
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  };

  const busy = status === "gps" || status === "lookup";
  const note = status === "gps" || status === "lookup" ? t("locating")
    : status === "outside" ? t("locate_outside")
    : status === "denied" ? t("locate_denied")
    : status === "error" ? t("locate_error") : null;

  return (
    <div className={className}>
      <button type="button" onClick={run} disabled={busy} className="inline-flex items-center gap-2 rounded-full border border-primary px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/10 disabled:opacity-60">
        {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
        {t("locate_btn")}
      </button>
      {note && <p role="status" className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
