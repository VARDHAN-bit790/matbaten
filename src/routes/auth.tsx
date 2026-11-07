import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Anchor } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: { next?: unknown }): { next?: string | undefined } => ({ next: typeof s.next === "string" ? s.next : undefined }),
  head: () => ({
    meta: [
      { title: "Sign in — Matbåten Karlskrona" },
      { name: "description", content: "Sign in to Matbåten to save your addresses and keep your order history." },
      { property: "og:title", content: "Sign in — Matbåten" },
      { property: "og:description", content: "Save addresses and order history on Matbåten Karlskrona." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

export function safeNext(next?: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function AuthPage() {
  const { t } = useI18n();
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { next } = Route.useSearch();
  const target = safeNext(next);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [forgot, setForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!loading && user) nav({ to: target, replace: true });
  }, [loading, user]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(false);
    if (forgot) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) setErr(true);
      else setSent(true);
    } else if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) setErr(true);
      else nav({ to: target, replace: true });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pw,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) setErr(true);
      else if (!data.session) setSent(true);
      else nav({ to: target, replace: true });
    }
    setBusy(false);
  };

  const social = async (provider: "google" | "lovable") => {
    setBusy(true);
    setErr(false);
    sessionStorage.setItem("matbaten-next", target);
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (result.error) setErr(true);
    else if (!result.redirected) nav({ to: target, replace: true });
    setBusy(false);
  };

  const input = "w-full rounded-xl border bg-card px-4 py-3 outline-none focus:border-primary";
  const socialBtn = "w-full rounded-xl border bg-card px-4 py-3 text-sm font-medium hover:border-primary";

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-3xl border bg-card p-8 shadow-soft">
        <Anchor className="h-8 w-8 text-primary" />
        <h1 className="mt-4 text-4xl">{sent ? t("check_email") : t("auth_title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("auth_sub")}</p>

        {sent ? (
          <button onClick={() => { setSent(false); setForgot(false); }} className="btn-ghost mt-6">{t("sign_in")}</button>
        ) : (
          <>
            <div className="mt-6 space-y-2">
              <button type="button" disabled={busy} onClick={() => social("google")} className={socialBtn}>{t("continue_google")}</button>
              <button type="button" disabled={busy} onClick={() => social("lovable")} className={socialBtn}>{t("continue_lovable")}</button>
              <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />{t("or_email")}<span className="h-px flex-1 bg-border" />
              </div>
            </div>

            <form className="mt-4 space-y-3" onSubmit={submit}>
              <input type="email" required placeholder={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
              {!forgot && (
                <input type="password" required placeholder={t("password")} value={pw} onChange={(e) => setPw(e.target.value)} className={input} />
              )}
              {err && <p className="text-sm text-destructive">{t("error_generic")}</p>}
              <button type="submit" disabled={busy} className="btn-primary w-full">
                {forgot ? t("send_reset") : mode === "signin" ? t("sign_in") : t("sign_up")}
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
              {forgot ? (
                <button onClick={() => setForgot(false)} className="underline">{t("sign_in")}</button>
              ) : (
                <>
                  <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(false); }} className="underline">
                    {mode === "signin" ? `${t("no_account")} ${t("sign_up")}` : `${t("have_account")} ${t("sign_in")}`}
                  </button>
                  {mode === "signin" && <button onClick={() => { setForgot(true); setErr(false); }} className="underline">{t("forgot")}</button>}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
