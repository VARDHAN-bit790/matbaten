import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, RotateCcw } from "lucide-react";
import { getMenu, getRestaurant } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore, type CartItem } from "@/lib/store";
import { listOrders, type OrderItem } from "@/lib/orders";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "Your orders — Matbåten Karlskrona" },
      { name: "description", content: "Your past Matbåten orders, ready to order again." },
      { property: "og:title", content: "Your orders — Matbåten Karlskrona" },
      { property: "og:description", content: "Your past Matbåten orders, ready to order again." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrdersPage,
});

type OrderRow = {
  id: string;
  restaurant_id: string;
  restaurant_name: string;
  items: OrderItem[];
  subtotal: number;
  fee: number;
  total: number;
  area_id: string;
  street: string;
  eta_minutes: number;
  mode: string;
  scheduled_at: string | null;
  created_at: string;
};

function OrdersPage() {
  const { t, lang } = useI18n();
  const { loadItems } = useStore();
  const nav = useNavigate();
  const q = useQuery({ queryKey: ["orders"], queryFn: () => listOrders() });
  const rows = (q.data ?? []) as unknown as OrderRow[];

  const reorder = async (o: OrderRow) => {
    const r = getRestaurant(o.restaurant_id);
    if (!r) return;
    const menu = getMenu(r);
    const items: CartItem[] = o.items
      .map((it) => ({ dish: menu.find((d) => d.id === it.dishId), restaurantId: o.restaurant_id, qty: it.qty }))
      .filter((x): x is { dish: (typeof menu)[number]; restaurantId: string; qty: number } => Boolean(x.dish));
    if (items.length === 0) return;
    loadItems(items);
    await nav({ to: "/checkout" });
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(lang === "sv" ? "sv-SE" : "en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-5xl">{t("orders_title")}</h1>
      {q.isLoading && (
        <div className="mt-6 space-y-4" aria-busy="true" aria-label={t("loading")}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl border bg-card p-5">
              <div className="skeleton h-7 w-1/3" />
              <div className="skeleton mt-3 h-4 w-2/3" />
              <div className="skeleton mt-3 h-4 w-1/2" />
              <div className="skeleton mt-4 h-10 w-36 rounded-full" />
            </div>
          ))}
        </div>
      )}
      {q.data && q.data.length === 0 && <p className="mt-6 text-muted-foreground">{t("no_orders")}</p>}
      <div className="mt-6 space-y-4">
        {rows.map((o) => (
          <div key={o.id} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-2xl">{o.restaurant_name}</h3>
              <span className="text-sm text-muted-foreground">{t("ordered_on")} {fmt(o.created_at)}</span>
            </div>
            {o.mode === "later" && o.scheduled_at && (
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-primary">
                <Clock className="h-3.5 w-3.5" /> {t("scheduled_for")} {fmt(o.scheduled_at)}
              </p>
            )}
            <ul className="mt-3 divide-y text-sm">
              {o.items.map((it) => (
                <li key={it.dishId} className="flex justify-between py-1.5">
                  <span>{it.qty} × {it.name}</span>
                  <span className="text-muted-foreground">{it.price * it.qty} kr</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{o.street}</span>
              <span className="font-semibold">{t("total")} {o.total} kr</span>
            </div>
            <button onClick={() => void reorder(o)} className="btn-ghost mt-4 flex items-center gap-2 text-primary">
              <RotateCcw className="h-4 w-4" /> {t("order_again")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
