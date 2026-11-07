import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Star, Trash2 } from "lucide-react";
import { AREAS } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { addAddress, deleteAddress, listAddresses, makeAddressDefault } from "@/lib/orders";
import { LocateAddress } from "@/components/LocateAddress";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My account — Matbåten Karlskrona" },
      { name: "description", content: "Manage your saved delivery addresses on Matbåten." },
      { property: "og:title", content: "My account — Matbåten Karlskrona" },
      { property: "og:description", content: "Manage your saved delivery addresses on Matbåten." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { t } = useI18n();
  const { user, signOut } = useAuth();
  const { areaId, setAreaId } = useStore();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["addresses"], queryFn: () => listAddresses() });

  const [label, setLabel] = useState("");
  const [street, setStreet] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [asDefault, setAsDefault] = useState(false);
  const [err, setErr] = useState(false);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["addresses"] });
  const addMut = useMutation({
    mutationFn: (v: { label: string; areaId: string; street: string; name: string; phone: string; isDefault: boolean }) => addAddress({ data: v }),
    onSuccess: () => {
      invalidate();
      setLabel(""); setStreet(""); setName(""); setPhone(""); setAsDefault(false); setErr(false);
    },
    onError: () => setErr(true),
  });
  const delMut = useMutation({ mutationFn: (id: string) => deleteAddress({ data: { id } }), onSuccess: invalidate });
  const defMut = useMutation({ mutationFn: (id: string) => makeAddressDefault({ data: { id } }), onSuccess: invalidate });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    addMut.mutate({ label: label.trim() || street.slice(0, 40), areaId, street, name, phone, isDefault: asDefault || (q.data ?? []).length === 0 });
  };

  const input = "w-full rounded-xl border bg-card px-4 py-3 outline-none focus:border-primary";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-5xl">{t("account_title")}</h1>
      <p className="mt-2 text-muted-foreground">{user?.email}</p>

      <section className="mt-8">
        <h2 className="text-3xl">{t("addresses")}</h2>
        {q.isLoading && (
          <div className="mt-4 space-y-3" aria-busy="true" aria-label={t("loading")}>
            {[0, 1].map((i) => (
              <div key={i} className="rounded-2xl border bg-card p-4">
                <div className="skeleton h-5 w-1/4" />
                <div className="skeleton mt-2 h-4 w-2/3" />
              </div>
            ))}
          </div>
        )}
        {q.data && q.data.length === 0 && <p className="mt-4 text-muted-foreground">{t("no_addresses")}</p>}
        <div className="mt-4 space-y-3">
          {(q.data ?? []).map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
              <div>
                <div className="flex items-center gap-2 font-semibold">
                  {a.label}
                  {a.is_default && (
                    <span className="flex items-center gap-1 rounded-full bg-saffron px-2 py-0.5 text-[11px] font-semibold text-saffron-foreground">
                      <Star className="h-3 w-3" /> {t("default_addr")}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{a.street} · {a.name} · {a.phone}</div>
              </div>
              <div className="flex gap-2">
                {!a.is_default && (
                  <button onClick={() => defMut.mutate(a.id)} className="rounded-full border px-3 py-1.5 text-xs font-medium hover:border-primary">
                    {t("set_default")}
                  </button>
                )}
                <button onClick={() => delMut.mutate(a.id)} aria-label={t("remove")} className="rounded-full border p-2 hover:border-destructive">
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3 rounded-2xl border bg-card p-5">
          <h3 className="text-xl">{t("add_address")}</h3>
          <input required placeholder={t("label")} value={label} onChange={(e) => setLabel(e.target.value)} className={input} />
          <input required placeholder={t("address")} value={street} onChange={(e) => setStreet(e.target.value)} className={input} />
          <LocateAddress onLocated={(address, areaId) => { setStreet(address); if (areaId) setAreaId(areaId); }} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder={t("name")} value={name} onChange={(e) => setName(e.target.value)} className={input} />
            <input required type="tel" placeholder={t("phone")} value={phone} onChange={(e) => setPhone(e.target.value)} className={input} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{t("deliver_to")}</span>
            <select value={areaId} onChange={(e) => setAreaId(e.target.value)} className="rounded-xl border bg-card px-3 py-2 text-sm font-medium outline-none">
              {AREAS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={asDefault} onChange={(e) => setAsDefault(e.target.checked)} className="accent-[hsl(var(--primary))]" />
            {t("set_default")}
          </label>
          {err && <p className="text-sm text-destructive">{t("error_generic")}</p>}
          <button type="submit" disabled={addMut.isPending} className="btn-primary">{t("add_address")}</button>
        </form>
      </section>

      <button onClick={signOut} className="btn-ghost mt-10 flex items-center gap-2 text-destructive">
        <LogOut className="h-4 w-4" /> {t("sign_out")}
      </button>
    </div>
  );
}
