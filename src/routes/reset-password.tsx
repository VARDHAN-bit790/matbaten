import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Matbåten Karlskrona" },
      { name: "description", content: "Choose a new password for your Matbåten account." },
      { property: "og:title", content: "Set a new password — Matbåten Karlskrona" },
      { property: "og:description", content: "Choose a new password for your Matbåten account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { t } = useI18n();
  const [pw, setPw] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(false);
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) setErr(true);
    else setDone(true);
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-3xl border bg-card p-8 shadow-soft">
        <h1 className="text-4xl">{done ? t("password_saved") : t("reset_title")}</h1>
        {done ? (
          <Link to="/" className="btn-primary mt-6">{t("new_order")}</Link>
        ) : (
          <form className="mt-6 space-y-3" onSubmit={submit}>
            <input
              type="password"
              required
              minLength={6}
              placeholder={t("new_password")}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full rounded-xl border bg-card px-4 py-3 outline-none focus:border-primary"
            />
            {err && <p className="text-sm text-destructive">{t("error_generic")}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full">{t("update_password")}</button>
          </form>
        )}
      </div>
    </div>
  );
}
