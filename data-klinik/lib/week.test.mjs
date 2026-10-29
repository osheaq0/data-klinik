import test from 'node:test';
import assert from 'node:assert/strict';
import { isMonday, weekEnd, formatWeekRange } from './week.ts';

test('minggu berjalan dari Senin sampai Minggu, termasuk lintas bulan', () => {
  assert.equal(isMonday('2026-10-26'), true);
  assert.equal(isMonday('2026-10-27'), false);
  assert.equal(weekEnd('2026-10-26'), '2026-11-01');
  assert.equal(formatWeekRange('2026-10-26'), '26 Okt 2026 – 1 Nov 2026');
});

test('tanggal tidak valid ditolak', () => {
  assert.equal(isMonday('2026-02-30'), false);
  assert.equal(isMonday(''), false);
});
