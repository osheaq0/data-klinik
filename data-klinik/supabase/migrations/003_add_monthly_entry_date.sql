-- Jalankan sesudah 002_add_weekly_period.sql pada database yang sudah dipakai.
-- Baris bulanan lama tetap ada dengan tanggal_catat NULL; arsip mingguan tetap utuh.

ALTER TABLE public.data_klinik
  ADD COLUMN IF NOT EXISTS tanggal_catat DATE;

ALTER TABLE public.data_klinik
  ADD CONSTRAINT data_klinik_tanggal_catat_matches_bulan
  CHECK (tanggal_catat IS NULL OR (bulan IS NOT NULL AND LEFT(tanggal_catat::text, 7) = bulan));

CREATE INDEX IF NOT EXISTS idx_data_klinik_bulan_tanggal_catat
  ON public.data_klinik (bulan DESC, tanggal_catat DESC);
