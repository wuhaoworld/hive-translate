import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  const locales = ['en', 'zh'];
  const defaultLocale = 'en';

  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  // 解析用户偏好的语言列表
  const userLanguages = acceptLanguage.split(',')
    .map(lang => {
      const [language, weight = 'q=1.0'] = lang.split(';');
      return {
        language: language.split('-')[0], // 只取主要语言代码
        weight: parseFloat(weight.split('=')[1])
      };
    })
    .sort((a, b) => b.weight - a.weight);

  // 查找第一个匹配的支持语言
  const matchedLocale = userLanguages.find(
    ({language}) => locales.includes(language)
  );

  console.log('userLanguages:', userLanguages);
  console.log('matchedLocale:', matchedLocale);

  const locale = matchedLocale ? matchedLocale.language : defaultLocale;

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default
  };
});