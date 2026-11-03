function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString().slice(0, 10) === value ? date : null;
}

export function daysInMonth(monthValue: string | null | undefined): number {
  if (!monthValue || !/^\d{4}-(0[1-9]|1[0-2])$/.test(monthValue)) return 0;
  const [year, month] = monthValue.split('-').map(Number);
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function periodDays(monthValue: string | null | undefined, weeklyStart: string | null | undefined): number {
  return monthValue ? daysInMonth(monthValue) : weeklyStart ? 7 : 0;
}

export function isDateInMonth(dateValue: string | null | undefined, monthValue: string | null | undefined): boolean {
  return !!dateValue && !!monthValue && !!parseDate(dateValue) && dateValue.slice(0, 7) === monthValue;
}

export function formatMonth(value: string | null | undefined): string {
  if (!value || !daysInMonth(value)) return '-';
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatEntryDate(value: string | null | undefined): string {
  const date = value ? parseDate(value) : null;
  return date
    ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)
    : 'Belum dicatat';
}
