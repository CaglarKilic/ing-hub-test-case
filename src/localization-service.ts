import { configureLocalization } from '@lit/localize';
import { sourceLocale, targetLocales } from './generated/locale-codes.js';

export const { setLocale, getLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: (locale) => import(
    /* @vite-ignore */
    `/src/generated/locales/${locale}.js`),
});

const savedLocale = localStorage.getItem('preferredLocale') || 'en';
setLocale(savedLocale); 