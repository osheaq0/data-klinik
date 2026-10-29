const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseDate(value: string): Date | null {
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return date.toISOString().slice(0, 10) === value ? date : null;
}

export function isMonday(value: string): boolean {
  return parseDate(value)?.getUTCDay() === 1;
}

export function weekEnd(start: string): string {
  const date = parseDate(start);
  if (!date) return '';
  date.setUTCDate(date.getUTCDate() + 6);
  return date.toISOString().slice(0, 10);
}

export function formatWeekRange(start: string): string {
  const first = parseDate(start);
  const last = parseDate(weekEnd(start));
  if (!first || !last) return '-';
  const formatter = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  });
  return `${formatter.format(first)} – ${formatter.format(last)}`;
}
