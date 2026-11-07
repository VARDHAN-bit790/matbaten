import { Link } from "@tanstack/react-router";
import { ShoppingBag, Anchor, MapPin, UserRound, Moon, Sun } from "lucide-react";
import { AREAS } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const { cart } = useStore();
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const link = "text-sm font-medium hover:text-primary";
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Anchor className="h-5 w-5 text-primary" />
          <span className="font-serif text-2xl">Matbåten</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/restaurants" className={link} activeProps={{ className: "text-primary" }}>{t("nav_restaurants")}</Link>
          <Link to="/quiz" className={link} activeProps={{ className: "text-primary" }}>{t("nav_quiz")}</Link>
          <Link to="/about" className={link} activeProps={{ className: "text-primary" }}>{t("nav_about")}</Link>
          {user && <Link to="/orders" className={link} activeProps={{ className: "text-primary" }}>{t("nav_orders")}</Link>}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="rounded-full border p-2 text-muted-foreground hover:text-primary" aria-label={t("theme_switch")} aria-pressed={theme === "dark"}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <Link to="/account" className={link} aria-label={t("nav_account")}>
              <span className="flex items-center gap-1.5"><UserRound className="h-4 w-4" /><span className="hidden sm:inline">{t("nav_account")}</span></span>
            </Link>
          ) : (
            <Link to="/auth" className={link}>{t("nav_signin")}</Link>
          )}
          <div className="flex rounded-full border p-0.5 text-xs font-semibold">
            {(["en", "sv"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`rounded-full px-2.5 py-1 ${lang === l ? "bg-navy text-navy-foreground" : ""}`} aria-label={l === "en" ? "English" : "Svenska"}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <Link to="/checkout" className="relative rounded-full bg-primary p-2.5 text-primary-foreground" aria-label={t("nav_cart")}>
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-saffron text-[10px] font-bold text-saffron-foreground">{count}</span>}
          </Link>
        </div>
      </div>
      <nav className="flex justify-center gap-6 border-t py-2 md:hidden">
        <Link to="/restaurants" className={link}>{t("nav_restaurants")}</Link>
        <Link to="/quiz" className={link}>{t("nav_quiz")}</Link>
        <Link to="/about" className={link}>{t("nav_about")}</Link>
        {user ? <Link to="/orders" className={link}>{t("nav_orders")}</Link> : <Link to="/auth" className={link}>{t("nav_signin")}</Link>}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-20 bg-navy text-navy-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <span className="font-serif text-2xl">Matbåten</span>
        <span className="text-sm opacity-80">{t("footer")}</span>
      </div>
    </footer>
  );
}

export function AreaSelect({ className = "" }: { className?: string }) {
  const { areaId, setAreaId } = useStore();
  const { t } = useI18n();
  return (
    <label className={`flex items-center gap-2 rounded-full border bg-card px-4 py-2 ${className}`}>
      <MapPin className="h-4 w-4 text-primary" />
      <span className="text-xs text-muted-foreground">{t("deliver_to")}</span>
      <select value={areaId} onChange={(e) => setAreaId(e.target.value)} className="bg-transparent text-sm font-medium outline-none">
        {AREAS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
    </label>
  );
}
