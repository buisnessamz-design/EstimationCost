import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import LanguageProvider from "@/app/providers/LanguageProvider";
import LanguageSwitcher from "../LanguageSwitcher";

describe("language selection across writing directions", () => {
  it("switches all three languages without clearing entered form data", async () => {
    const i18n = createInstance();
    const common = { switchLanguage: "Language", languageNameEn: "English", languageNameZh: "简体中文", languageNameAr: "العربية", appTitle: "BinaaCost" };
    await i18n.init({ lng: "en", fallbackLng: "en", defaultNS: "common", resources: {
      en: { common }, ar: { common: { ...common, appTitle: "مقدار" } }, zh: { common: { ...common, appTitle: "成本估算工具" } },
    } });
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <LanguageSwitcher />
          <input aria-label="Project name" defaultValue="Existing estimate" />
        </LanguageProvider>
      </I18nextProvider>,
    );
    const selector = screen.getByRole("combobox", { name: "Language" });
    for (const [language, direction] of [["zh", "ltr"], ["ar", "rtl"], ["en", "ltr"]]) {
      fireEvent.change(selector, { target: { value: language } });
      await waitFor(() => {
        expect(document.documentElement.lang).toBe(language);
        expect(document.documentElement.dir).toBe(direction);
        expect(document.title).toBe(language === "zh" ? "成本估算工具" : language === "ar" ? "مقدار" : "BinaaCost");
      });
      expect((screen.getByRole("textbox", { name: "Project name" }) as HTMLInputElement).value).toBe("Existing estimate");
    }
    cleanup();
  });
});
