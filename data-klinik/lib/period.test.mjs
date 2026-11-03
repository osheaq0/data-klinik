import test from 'node:test';
import assert from 'node:assert/strict';
import { daysInMonth, isDateInMonth, formatMonth, formatEntryDate, periodDays } from './period.ts';

test('jumlah hari mengikuti bulan dan tahun kabisat', () => {
  assert.equal(daysInMonth('2024-02'), 29);
  assert.equal(daysInMonth('2025-02'), 28);
  assert.equal(daysInMonth('2026-04'), 30);
  assert.equal(daysInMonth('2026-10'), 31);
});

test('entri bulanan memakai hari kalender; arsip mingguan tetap tujuh hari', () => {
  assert.equal(periodDays('2024-02', null), 29);
  assert.equal(periodDays('2026-11', null), 30);
  assert.equal(periodDays(null, '2026-10-26'), 7);
});

test('tanggal entri harus tanggal nyata pada bulan terpilih', () => {
  assert.equal(isDateInMonth('2026-11-04', '2026-11'), true);
  assert.equal(isDateInMonth('2026-11-04', '2026-10'), false);
  assert.equal(isDateInMonth('2026-02-30', '2026-02'), false);
});

test('bulan dan tanggal ditampilkan dalam bahasa Indonesia', () => {
  assert.equal(formatMonth('2026-11'), 'November 2026');
  assert.equal(formatEntryDate('2026-11-04'), '4 Nov 2026');
});
