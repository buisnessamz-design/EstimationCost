import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Locale key and interpolation parity regression test. Every key present in the English locale
// must exist in the Arabic locale (and vice-versa) so no raw key leaks into
// the UI. Mirrors the P1 finding where `profit_pricing.viewPricing` existed
// only in Arabic and rendered as a raw key in English.

const EN_DIR = join(process.cwd(), "public", "locales", "en");
const LOCALE_DIR = join(process.cwd(), "public", "locales");

function flatten(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      keys.push(...flatten(v as Record<string, unknown>, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

// i18next plural suffixes. Arabic has more plural categories (few/many/two)
// than English (one/other), so these legitimately differ per language.
const PLURAL_SUFFIXES = [
  "_zero",
  "_one",
  "_two",
  "_few",
  "_many",
  "_other",
];

function stripPluralSuffix(key: string): string {
  for (const suffix of PLURAL_SUFFIXES) {
    if (key.endsWith(suffix)) return key.slice(0, -suffix.length);
  }
  return key;
}

function load(dir: string): Record<string, Record<string, unknown>> {
  const out: Record<string, Record<string, unknown>> = {};
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    out[file] = JSON.parse(readFileSync(join(dir, file), "utf-8"));
  }
  return out;
}

describe.each(["ar", "zh"])("locale key parity (%s)", (language) => {
  const en = load(EN_DIR);
  const locale = load(join(LOCALE_DIR, language));

  it("has the same namespace files as English", () => {
    expect(Object.keys(locale).sort()).toEqual(Object.keys(en).sort());
  });

  it("preserves translation keys and interpolation variables", () => {
    for (const [file, enNs] of Object.entries(en)) {
      const ns = locale[file];
      expect(ns, file).toBeDefined();
      const enKeys = [...new Set(flatten(enNs).map(stripPluralSuffix))].sort();
      const localeKeys = [...new Set(flatten(ns).map(stripPluralSuffix))].sort();
      expect(localeKeys, `${language}/${file}`).toEqual(enKeys);
      for (const key of flatten(ns)) {
        const value = key.split(".").reduce<any>((obj, part) => obj?.[part], ns);
        expect(typeof value === "string" && value.trim() === "", `${file}:${key}`).toBe(false);
        const source = key.split(".").reduce<any>((obj, part) => obj?.[part], enNs);
        if (typeof source === "string" && typeof value === "string") {
          // Arabic singular and dual forms can express count grammatically.
          const grammaticalCount = language === "ar" && /_(one|two)$/.test(key);
          const variables = (text: string) => [...text.matchAll(/{{\s*([^}]+?)\s*}}/g)]
            .map((m) => m[1])
            .filter((name) => !(grammaticalCount && name === "count"))
            .sort();
          expect(variables(value), `${language}/${file}:${key}`).toEqual(variables(source));
        }
      }
    }
  });
});
