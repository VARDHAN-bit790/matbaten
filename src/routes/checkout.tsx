import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bike, Check, ChefHat, CookingPot, Home, Minus, Plus } from "lucide-react";
import { getRestaurant } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useRanked, useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { addAddress, listAddresses, saveOrder } from "@/lib/orders";
import { AreaSelect } from "@/components/SiteHeader";
import { LocateAddress } from "@/components/LocateAddress";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Matbåten Karlskrona" },
      { name: "description", content: "Review your order and delivery time in Karlskrona." },
      { property: "og:title", content: "Checkout — Matbåten" },
      { property: "og:description", content: "Review your order and delivery time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});

const FEE = 39;

// half-hour slots from 10:30 to 20:30
const SLOTS = Array.from({ length: 21 }, (_, i) => {
  const mins = 630 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${mins % 60 === 0 ? "00" : "30"}`;
});

function nextDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });
}

function Checkout() {
  const { t, lang } = useI18n();
  const { cart, setQty, clear, areaId, setAreaId } = useStore();
  const ranked = useRanked();
  const { user } = useAuth();
  const [pay, setPay] = useState<"swish" | "card">("swish");
  const [mode, setMode] = useState<"now" | "later">("now");
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [phone, setPhone] = useState("");
  const [picked, setPicked] = useState<number | null>(null);
  const [saveAddr, setSaveAddr] = useState(true);
  const [days] = useState(() => nextDays(7));
  const [dateIdx, setDateIdx] = useState(0);
  const [time, setTime] = useState("12:00");
  const [done, setDone] = useState<{ total: number; name: string; scheduledAt: string | null } | null>(null);
  const [busy, setBusy] = useState(false);

  const addresses = useQuery({ queryKey: ["addresses"], queryFn: () => listAddresses(), enabled: !!user });
  const qc = useQueryClient();
  const saveAddrMut = useMutation({
    mutationFn: (v: { label: string; areaId: string; street: string; name: string; phone: string; isDefault: boolean }) => addAddress({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["addresses"] }),
  });

  if (done) return <Confirmation minutes={done.total} name={done.name} scheduledAt={done.scheduledAt} />;

  if (cart.length === 0)
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-4xl">{t("cart_empty")}</h1>
        <Link to="/restaurants" className="btn-primary mt-6">{t("browse")}</Link>
      </div>
    );

  const r = ranked.find((x) => x.id === cart[0]!.restaurantId)!;
  const sub = cart.reduce((s, i) => s + i.dish.price * i.qty, 0);
  const saved = addresses.data ?? [];
  const fmtDay = (d: Date) =>
    d.toLocaleDateString(lang === "sv" ? "sv-SE" : "en-GB", { weekday: "short", day: "numeric", month: "short" });

  const pickSaved = (a: (typeof saved)[number], i: number) => {
    setPicked(i);
    setName(a.name);
    setStreet(a.street);
    setPhone(a.phone);
    setAreaId(a.area_id);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    let scheduledAt: string | null = null;
    if (mode === "later") {
      const d = new Date(days[dateIdx]!);
      const [h = 0, m = 0] = time.split(":").map(Number);
      d.setHours(h, m, 0, 0);
      scheduledAt = d.toISOString();
    }
    if (user) {
      if (picked === null && saveAddr && street && name && phone) {
        try {
          await saveAddrMut.mutateAsync({ label: street.slice(0, 40), areaId, street, name, phone, isDefault: saved.length === 0 });
        } catch {
          // demo: address saving is best-effort
        }
      }
      try {
        await saveOrder({
          data: {
            restaurantId: r.id,
            restaurantName: r.name,
            items: cart.map((i) => ({ dishId: i.dish.id, name: i.dish.name, price: i.dish.price, qty: i.qty })),
            subtotal: sub,
            fee: FEE,
            total: sub + FEE,
            areaId,
            street,
            etaMinutes: r.eta.total,
            mode,
            scheduledAt,
          },
        });
      } catch {
        // demo: order saving is best-effort
      }
    }
    window.__lovableEvents?.track?.("project.order_completed", { restaurant_id: r.id, total: sub + FEE, mode });
    setDone({ total: r.eta.total, name: r.name, scheduledAt });
    clear();
    setBusy(false);
  };

  const input = "w-full rounded-xl border bg-card px-4 py-3 outline-none focus:border-primary";

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[1fr_340px]">
      <div>
        <h1 className="text-5xl">{t("checkout")}</h1>
        <p className="mt-1 text-muted-foreground">{t("order_from")} {getRestaurant(r.id)?.name}</p>
        <div className="mt-6 space-y-3">
          {cart.map((i) => (
            <div key={i.dish.id} className="flex items-center justify-between gap-3 rounded-2xl border bg-card p-4">
              <div className="flex min-w-0 items-center gap-3">
                <img src={i.dish.img} alt={i.dish.name} loading="lazy" width={944} height={704} className="h-12 w-12 shrink-0 rounded-lg object-cover md:h-14 md:w-14" />
                <div className="min-w-0">
                  <div className="truncate font-semibold">{i.dish.name}</div>
                  <div className="text-sm text-muted-foreground">{i.dish.price} kr</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(i.dish.id, i.qty - 1)} className="rounded-full border p-1.5" aria-label="-"><Minus className="h-3 w-3" /></button>
                <span className="w-4 text-center">{i.qty}</span>
                <button onClick={() => setQty(i.dish.id, i.qty + 1)} className="rounded-full border p-1.5" aria-label="+"><Plus className="h-3 w-3" /></button>
              </div>
            </div>
          ))}
        </div>

        <form id="order" className="mt-8 space-y-3" onSubmit={submit}>
          <AreaSelect className="w-fit" />

          {user && saved.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold">{t("addresses")}</p>
              <div className="flex flex-wrap gap-2">
                {saved.map((a, i) => (
                  <button type="button" key={a.id} className="chip" data-active={picked === i} onClick={() => pickSaved(a, i)}>
                    {a.label}
                  </button>
                ))}
                <button type="button" className="chip" data-active={picked === null} onClick={() => setPicked(null)}>
                  {t("add_address")}
                </button>
              </div>
            </div>
          )}

          <input required placeholder={t("name")} value={name} onChange={(e) => setName(e.target.value)} className={input} />
          <input required placeholder={t("address")} value={street} onChange={(e) => setStreet(e.target.value)} className={input} />
          <LocateAddress onLocated={(address, areaId) => { setStreet(address); if (areaId) setAreaId(areaId); }} />
          <input required type="tel" placeholder={t("phone")} value={phone} onChange={(e) => setPhone(e.target.value)} className={input} />
          {user && picked === null && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} className="accent-primary" />
              {t("save_address")}
            </label>
          )}

          <div className="pt-2">
            <p className="mb-2 font-semibold">{t("deliver_now")} / {t("order_later")}</p>
            <div className="flex gap-2">
              <button type="button" className="chip" data-active={mode === "now"} onClick={() => setMode("now")}>{t("deliver_now")}</button>
              <button type="button" className="chip" data-active={mode === "later"} onClick={() => setMode("later")}>{t("order_later")}</button>
            </div>
          </div>

          {mode === "later" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs text-muted-foreground">{t("date")}</span>
                <select value={dateIdx} onChange={(e) => setDateIdx(+e.target.value)} className="w-full rounded-xl border bg-card px-4 py-3 text-sm font-medium outline-none">
                  {days.map((d, i) => <option key={i} value={i}>{fmtDay(d)}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-muted-foreground">{t("time")}</span>
                <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl border bg-card px-4 py-3 text-sm font-medium outline-none">
                  {SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>
          )}

          <div className="pt-2">
            <p className="mb-2 font-semibold">{t("payment")}</p>
            <div className="flex gap-2">
              <button type="button" className="chip" data-active={pay === "swish"} onClick={() => setPay("swish")}>Swish</button>
              <button type="button" className="chip" data-active={pay === "card"} onClick={() => setPay("card")}>{t("card")}</button>
            </div>
          </div>

          {!user && (
            <p className="text-sm text-muted-foreground">
              {t("sign_in_to_save")} <Link to="/auth" className="text-primary underline">{t("sign_in")}</Link>
            </p>
          )}
        </form>
      </div>

      <aside className="h-fit space-y-3 rounded-2xl bg-navy p-6 text-navy-foreground md:sticky md:top-24">
        <div className="text-sm opacity-80">{t("eta")}</div>
        <div className="font-serif text-5xl">{r.eta.total} {t("min")}</div>
        <div className="text-xs opacity-70">{t("prep")} {r.eta.prep} + {t("travel")} {r.eta.travel} + {t("handoff")} {r.eta.handoff}</div>
        <hr className="opacity-20" />
        <div className="flex justify-between text-sm"><span>{t("subtotal")}</span><span>{sub} kr</span></div>
        <div className="flex justify-between text-sm"><span>{t("delivery_fee")}</span><span>{FEE} kr</span></div>
        <div className="flex justify-between text-lg font-semibold"><span>{t("total")}</span><span>{sub + FEE} kr</span></div>
        <button form="order" type="submit" disabled={busy} className="btn-primary w-full bg-saffron text-saffron-foreground">{t("place_order")}</button>
        <p className="text-center text-xs opacity-70">{t("demo_note")}</p>
      </aside>
    </div>
  );
}

function Confirmation({ minutes, name, scheduledAt }: { minutes: number; name: string; scheduledAt: string | null }) {
  const { t, lang } = useI18n();
  const [left, setLeft] = useState(minutes * 60);
  useEffect(() => {
    if (scheduledAt) return;
    // demo: time runs 20x faster
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 20)), 1000);
    return () => clearInterval(id);
  }, [scheduledAt]);
  const pct = 1 - left / (minutes * 60);
  const stages = [t("st_received"), t("st_cooking"), t("st_onway"), t("st_delivered")];
  const icons = [ChefHat, CookingPot, Bike, Home];
  const active = left === 0 ? 3 : pct > 0.5 ? 2 : pct > 0.05 ? 1 : 0;
  const scheduled = scheduledAt
    ? new Date(scheduledAt).toLocaleString(lang === "sv" ? "sv-SE" : "en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="anim-pop mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-8 w-8" /></div>
      <h1 className="anim-rise mt-6 text-5xl">{t("confirmed")}</h1>
      <p className="mt-2 text-muted-foreground">{name}</p>
      {scheduled ? (
        <>
          <p className="mt-6 text-sm text-muted-foreground">{t("scheduled_for")}</p>
          <div className="font-serif text-6xl">{scheduled}</div>
        </>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted-foreground">{t("arriving_in")}</p>
          <div className="font-serif text-7xl tabular-nums">{Math.ceil(left / 60)} {t("min")}</div>
          <div className="relative mt-12">
            <div className="absolute left-[12.5%] right-[12.5%] top-5 h-1 rounded-full bg-muted" />
            <div
              className="absolute left-[12.5%] top-5 h-1 rounded-full bg-primary transition-[width] duration-700 ease-out"
              style={{ width: `calc(${pct} * 75%)` }}
            />
            <div className="relative flex justify-between">
              {stages.map((s, i) => {
                const Icon = icons[i]!;
                const done = i < active;
                const now = i === active;
                return (
                  <div key={s} className="flex w-1/4 flex-col items-center gap-2">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 ${
                        done || now ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
                      } ${now ? "pulse-ring scale-110" : ""}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`text-xs ${now ? "font-semibold text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      <Link to="/restaurants" className="btn-ghost mt-10">{t("new_order")}</Link>
    </div>
  );
}
