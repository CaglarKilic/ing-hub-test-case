import { initRouter } from './router.js';
import { configureLocalization } from '@lit/localize';
import { sourceLocale, targetLocales } from './generated/locale-codes.js';

// Set up localization
const { setLocale, getLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: (locale) => import(
    /* @vite-ignore */
    `/src/generated/locales/${locale}.js`),
});

console.log('Initial locale:', getLocale());

// Set the locale to Turkish
setLocale('tr').then(() => {
  console.log('Locale changed to:', getLocale());
}).catch((error) => {
  console.error('Failed to set locale:', error);
});

const outlet = document.getElementById('outlet')!;
initRouter(outlet);