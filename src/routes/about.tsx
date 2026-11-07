import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Matbåten food delivery in Blekinge" },
      { name: "description", content: "Matbåten is a demo food delivery service for Karlskrona and Blekinge, in English and Swedish." },
      { property: "og:title", content: "About Matbåten" },
      { property: "og:description", content: "Food delivery made for Karlskrona, Blekinge." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-6xl">{t("about_title")}</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t("about_body")}</p>
      <img src={hero} alt="Karlskrona table" loading="lazy" width={1600} height={1008} className="mt-10 rounded-[2rem] shadow-soft" />
      <p className="mt-6 text-sm italic text-muted-foreground">{t("about_note")}</p>
      <Link to="/quiz" className="btn-primary mt-6">{t("take_quiz")}</Link>
    </div>
  );
}
