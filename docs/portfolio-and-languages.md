# Portfolio styling and languages

The interface follows the `buisnessamz-design/sumairghouri` portfolio: warm gray
canvas (#e8e6e1), charcoal text (#292c27), olive accents (#65704d), rounded panels,
DM Sans body text and Manrope headings. Arabic keeps its local Noto Sans Arabic
font; Chinese uses native CJK system fonts. No portfolio content or private AI
configuration is copied into this application.

English, Simplified Chinese and Arabic are available on sign-in, navigation and
shared reports. The selection is stored locally and in a cookie. `?lng=zh`,
`?lng=en` and `?lng=ar` can select a language when linking from the portfolio.
Arabic sets HTML and Radix direction to RTL; English and Chinese use LTR.
Translations and local fonts are included in the production offline cache.

Database option translations take priority. Built-in option labels have local
translations, while custom project names, resource descriptions and other user
data remain as entered. Administrators can supply translated custom option labels
in the existing record's `translations` object using `en`, `zh` and `ar` keys.
Switching language does not convert currencies or change calculations.

## Later Vercel deployment

Import this repository as a Vite project, use `pnpm build`, output `dist`, and
set `VITE_POCKETBASE_URL` to the public HTTPS URL of your PocketBase server before
building. The checked-in `vercel.json` supports direct links to client routes.

Vercel hosts the frontend. PocketBase needs a separate persistent server running
the repository's existing migrations and hooks; the dev proxy in `vite.config.ts`
does not run on Vercel. Configure the backend's allowed origins for the deployed
frontend and verify sign-in, estimates and public shares against that backend.
Never put PocketBase administrator credentials in `VITE_` variables.

For the main website, link to the deployed tool with the desired `?lng=` value.
Embedding, shared login, DNS changes and production deployment are separate
integration steps, once the hosting URL and backend are selected.
