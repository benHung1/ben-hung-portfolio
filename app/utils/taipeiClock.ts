/** Fixed timezone; does not depend on the visitor's location or server timezone. */
export function formatTaipeiClock(timestamp: number, locale: 'zh' | 'en') {
  const instant = new Date(timestamp);
  const date = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-TW' : 'en-GB', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: locale === 'zh' ? '2-digit' : 'short',
    day: '2-digit',
  }).format(instant);
  return {
    date: locale === 'zh' ? date.replaceAll('/', '.') : date.toUpperCase(),
    time: new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Taipei',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(instant),
    iso: instant.toISOString(),
  };
}
export const untilNextMinute = (timestamp: number) =>
  60_000 - (timestamp % 60_000) + 20;
