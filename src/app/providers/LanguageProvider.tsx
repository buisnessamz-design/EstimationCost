import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DirectionProvider } from "@radix-ui/react-direction";

import { isRtlLanguage } from "@/shared/lib/utils";

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const isRtl =
    (typeof i18n.dir === "function" && i18n.dir() === "rtl") ||
    isRtlLanguage(i18n.language);
  const dir = isRtl ? "rtl" : "ltr";

  // Set dir/lang synchronously during render to avoid an LTR flash for Arabic
  // users before the effect runs. The effect keeps it in sync on language
  // changes and also updates the document <title>.
  if (typeof document !== "undefined") {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    const title = i18n.t("common:appTitle");
    if (title && title !== "common:appTitle") {
      document.title = title;
    }
  }, [dir, i18n, language]);

  return <DirectionProvider dir={dir}>{children}</DirectionProvider>;
}
