import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AREAS, CUISINES, DIETS } from "@/lib/data";
import { useI18n, type TKey } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import type { TasteProfile } from "@/lib/match";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Taste quiz — Matbåten Karlskrona" },
      { name: "description", content: "Answer five quick questions and get restaurants in Karlskrona matched to your taste." },
      { property: "og:title", content: "Taste quiz — Matbåten" },
      { property: "og:description", content: "Find your perfect Karlskrona takeaway in a minute." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Quiz,
});

function toggle<T>(arr: T[], v: T) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

function Quiz() {
  const { t } = useI18n();
  const { profile, setProfile, areaId, setAreaId } = useStore();
  const nav = useNavigate();
  const [p, setP] = useState<TasteProfile>(profile);
  const [step, setStep] = useState(0);
  const titles: TKey[] = ["q_cuisine", "q_diet", "q_spice", "q_price", "q_area"];
  const last = step === titles.length - 1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{t("quiz_title")}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / titles.length) * 100}%` }} />
      </div>
      <p className="mt-6 text-sm text-muted-foreground">{t("step")} {step + 1}/{titles.length}</p>
      <h1 className="mt-1 text-5xl">{t(titles[step]!)}</h1>

      <div className="mt-8 min-h-48">
        {step === 0 && (
          <div className="flex flex-wrap gap-2">
            {CUISINES.map((c) => <button key={c} className="chip" data-active={p.cuisines.includes(c)} onClick={() => setP({ ...p, cuisines: toggle(p.cuisines, c) })}>{t(c)}</button>)}
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-wrap gap-2">
            {DIETS.map((d) => <button key={d} className="chip" data-active={p.diets.includes(d)} onClick={() => setP({ ...p, diets: toggle(p.diets, d) })}>{t(d)}</button>)}
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="text-center text-6xl">{"🌶".repeat(p.spice) || "🥛"}</div>
            <input type="range" min={0} max={4} value={p.spice} onChange={(e) => setP({ ...p, spice: +e.target.value })} className="mt-6 w-full" />
            <div className="flex justify-between text-sm text-muted-foreground"><span>{t("spice0")}</span><span>{t("spice4")}</span></div>
          </div>
        )}
        {step === 3 && (
          <div className="grid grid-cols-3 gap-3">
            {([1, 2, 3] as const).map((n) => (
              <button key={n} className="chip py-6 text-center" data-active={p.price === n} onClick={() => setP({ ...p, price: n })}>
                <div className="font-serif text-3xl">{"kr".repeat(n)}</div>
                <div className="text-xs">{t(`price${n}` as TKey)}</div>
              </button>
            ))}
          </div>
        )}
        {step === 4 && (
          <div className="flex flex-wrap gap-2">
            {AREAS.map((a) => <button key={a.id} className="chip" data-active={areaId === a.id} onClick={() => setAreaId(a.id)}>{a.name}</button>)}
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-between">
        <button className="btn-ghost" disabled={step === 0} onClick={() => setStep(step - 1)} style={{ visibility: step === 0 ? "hidden" : "visible" }}>{t("back")}</button>
        <button
          className="btn-primary"
          onClick={() => {
            if (last) { setProfile(p); nav({ to: "/restaurants" }); } else setStep(step + 1);
          }}
        >
          {last ? t("finish") : t("next")}
        </button>
      </div>
    </div>
  );
}
