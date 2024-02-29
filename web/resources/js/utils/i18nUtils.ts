import { shouldPolyfill as shouldPolyfillLocale } from '@formatjs/intl-locale/should-polyfill'
import { match } from '@formatjs/intl-localematcher'
import { shouldPolyfill as shouldPolyfillPluralRules } from '@formatjs/intl-pluralrules/should-polyfill'
import ShopifyFormat from '@shopify/i18next-shopify'
import {
  DEFAULT_LOCALE as DEFAULT_POLARIS_LOCALE,
  SUPPORTED_LOCALES as SUPPORTED_POLARIS_LOCALES,
} from '@shopify/polaris'
import i18next, { Resource, ResourceLanguage } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'

const DEFAULT_APP_LOCALE = 'en'
const SUPPORTED_APP_LOCALES: string[] = ['en', 'de', 'fr']

let _userLocale: string | undefined
let _polarisTranslations: ResourceLanguage | undefined

export function getUserLocale(): string {
  if (_userLocale) {
    return _userLocale
  }
  const url = new URL(window.location.href)
  const locale = url.searchParams.get('locale') || DEFAULT_APP_LOCALE
  _userLocale = match([locale], SUPPORTED_APP_LOCALES, DEFAULT_APP_LOCALE)
  return _userLocale
}

export function getPolarisTranslations(): ResourceLanguage | undefined {
  return _polarisTranslations
}

const PLURAL_RULES_LOCALE_DATA: { [key: string]: () => Promise<Resource> } = {
  cs: () => import('@formatjs/intl-pluralrules/locale-data/cs'),
  da: () => import('@formatjs/intl-pluralrules/locale-data/da'),
  de: () => import('@formatjs/intl-pluralrules/locale-data/de'),
  en: () => import('@formatjs/intl-pluralrules/locale-data/en'),
  es: () => import('@formatjs/intl-pluralrules/locale-data/es'),
  fi: () => import('@formatjs/intl-pluralrules/locale-data/fi'),
  fr: () => import('@formatjs/intl-pluralrules/locale-data/fr'),
  it: () => import('@formatjs/intl-pluralrules/locale-data/it'),
  ja: () => import('@formatjs/intl-pluralrules/locale-data/ja'),
  ko: () => import('@formatjs/intl-pluralrules/locale-data/ko'),
  nb: () => import('@formatjs/intl-pluralrules/locale-data/nb'),
  nl: () => import('@formatjs/intl-pluralrules/locale-data/nl'),
  pl: () => import('@formatjs/intl-pluralrules/locale-data/pl'),
  pt: () => import('@formatjs/intl-pluralrules/locale-data/pt'),
  'pt-PT': () => import('@formatjs/intl-pluralrules/locale-data/pt-PT'),
  sv: () => import('@formatjs/intl-pluralrules/locale-data/sv'),
  th: () => import('@formatjs/intl-pluralrules/locale-data/th'),
  tr: () => import('@formatjs/intl-pluralrules/locale-data/tr'),
  vi: () => import('@formatjs/intl-pluralrules/locale-data/vi'),
  zh: () => import('@formatjs/intl-pluralrules/locale-data/zh'),
}

const POLARIS_LOCALE_DATA: { [key: string]: () => Promise<Resource> } = {
  cs: () => import('@shopify/polaris/locales/cs.json'),
  da: () => import('@shopify/polaris/locales/da.json'),
  de: () => import('@shopify/polaris/locales/de.json'),
  en: () => import('@shopify/polaris/locales/en.json'),
  es: () => import('@shopify/polaris/locales/es.json'),
  fi: () => import('@shopify/polaris/locales/fi.json'),
  fr: () => import('@shopify/polaris/locales/fr.json'),
  it: () => import('@shopify/polaris/locales/it.json'),
  ja: () => import('@shopify/polaris/locales/ja.json'),
  ko: () => import('@shopify/polaris/locales/ko.json'),
  nb: () => import('@shopify/polaris/locales/nb.json'),
  nl: () => import('@shopify/polaris/locales/nl.json'),
  pl: () => import('@shopify/polaris/locales/pl.json'),
  'pt-BR': () => import('@shopify/polaris/locales/pt-BR.json'),
  'pt-PT': () => import('@shopify/polaris/locales/pt-PT.json'),
  sv: () => import('@shopify/polaris/locales/sv.json'),
  th: () => import('@shopify/polaris/locales/th.json'),
  tr: () => import('@shopify/polaris/locales/tr.json'),
  vi: () => import('@shopify/polaris/locales/vi.json'),
  'zh-CN': () => import('@shopify/polaris/locales/zh-CN.json'),
  'zh-TW': () => import('@shopify/polaris/locales/zh-TW.json'),
}

async function loadIntlPluralRulesLocaleData(locale: string): Promise<void> {
  await PLURAL_RULES_LOCALE_DATA[locale]()
}

async function loadPolarisTranslations(locale: string): Promise<ResourceLanguage> {
  return (await POLARIS_LOCALE_DATA[locale]()).default
}

async function loadIntlPolyfills(): Promise<void> {
  if (shouldPolyfillLocale()) {
    await import('@formatjs/intl-locale/polyfill')
  }
  const promises: Promise<void>[] = []
  if (shouldPolyfillPluralRules(DEFAULT_APP_LOCALE)) {
    await import('@formatjs/intl-pluralrules/polyfill-force')
    promises.push(loadIntlPluralRulesLocaleData(DEFAULT_APP_LOCALE))
  }
  const userLocale = getUserLocale()
  if (DEFAULT_APP_LOCALE !== userLocale && shouldPolyfillPluralRules(userLocale)) {
    promises.push(loadIntlPluralRulesLocaleData(userLocale))
  }
  await Promise.all(promises)
}

async function fetchPolarisTranslations(): Promise<ResourceLanguage> {
  if (_polarisTranslations) {
    return _polarisTranslations
  }
  const defaultPolarisLocale = match([DEFAULT_APP_LOCALE], SUPPORTED_POLARIS_LOCALES, DEFAULT_POLARIS_LOCALE)
  const polarisLocale = match([getUserLocale()], SUPPORTED_POLARIS_LOCALES, defaultPolarisLocale)
  _polarisTranslations = await loadPolarisTranslations(polarisLocale)
  return _polarisTranslations
}

function localResourcesToBackend() {
  return resourcesToBackend(
    async (locale: string, _namespace: string) => (await import(`../locales/${locale}.json`)).default,
  )
}

async function initI18next(): Promise<void> {
  await i18next
    .use(initReactI18next)
    .use(ShopifyFormat)
    .use(localResourcesToBackend())
    .init({
      debug: process.env.NODE_ENV === 'development',
      lng: getUserLocale(),
      fallbackLng: DEFAULT_APP_LOCALE,
      supportedLngs: SUPPORTED_APP_LOCALES,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })
}

export async function initI18n(): Promise<void> {
  await loadIntlPolyfills()
  await Promise.all([initI18next(), fetchPolarisTranslations()])
}
