import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", labelKey: "languageNameEn" },
  { code: "zh", labelKey: "languageNameZh" },
  { code: "ar", labelKey: "languageNameAr" },
];

/** Shared by sign-in, authenticated navigation, and public reports. */
export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation("common");
  const language = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];

  return (
    <label className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground">
      <Globe className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
      <span className="sr-only">{t("switchLanguage")}</span>
      <select
        aria-label={t("switchLanguage")}
        value={language}
        onChange={(event) => void i18n.changeLanguage(event.target.value)}
        className="min-w-0 cursor-pointer bg-transparent py-1 pe-1 text-sm text-foreground focus-visible:outline-offset-2"
      >
        {languages.map(({ code, labelKey }) => (
          <option key={code} value={code} lang={code} dir={code === "ar" ? "rtl" : "ltr"} className="bg-card text-foreground">
            {t(labelKey)}
          </option>
        ))}
      </select>
    </label>
  );
}
