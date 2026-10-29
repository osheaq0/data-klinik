-- Run after 001_create_data_klinik.sql in Supabase SQL Editor.
-- Existing monthly rows remain unchanged; they cannot be split into real weekly data.

ALTER TABLE public.data_klinik
  ADD COLUMN IF NOT EXISTS tanggal_mulai DATE;

ALTER TABLE public.data_klinik
  ALTER COLUMN bulan DROP NOT NULL;

ALTER TABLE public.data_klinik
  ADD CONSTRAINT data_klinik_period_required
  CHECK (bulan IS NOT NULL OR tanggal_mulai IS NOT NULL);

ALTER TABLE public.data_klinik
  ADD CONSTRAINT data_klinik_week_starts_monday
  CHECK (tanggal_mulai IS NULL OR EXTRACT(ISODOW FROM tanggal_mulai) = 1);

CREATE UNIQUE INDEX IF NOT EXISTS idx_data_klinik_tanggal_mulai
  ON public.data_klinik (tanggal_mulai)
  WHERE tanggal_mulai IS NOT NULL;
