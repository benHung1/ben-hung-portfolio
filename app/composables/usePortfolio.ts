import { messages, type Locale } from '~/data/messages';

export function usePortfolio() {
  const preference = useCookie<Locale>('bh-language', {
    default: () => 'zh',
    maxAge: 31536000,
    sameSite: 'lax',
    path: '/',
  });
  const locale = computed<Locale>(() =>
    preference.value === 'en' ? 'en' : 'zh',
  );
  const t = computed(() => messages[locale.value]);
  const toggleLocale = () => {
    preference.value = locale.value === 'zh' ? 'en' : 'zh';
  };
  const email = 'ga2006206521@gmail.com';
  return { locale, t, toggleLocale, email };
}
