-- ============================================================
-- Migration: Create data_klinik table
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.data_klinik (
  id              BIGSERIAL PRIMARY KEY,
  bulan           TEXT        NOT NULL,          -- format: YYYY-MM
  jml_peserta     INTEGER     NOT NULL DEFAULT 0,
  rujukan         INTEGER     NOT NULL DEFAULT 0,
  kunj_sakit      INTEGER     NOT NULL DEFAULT 0,
  kunj_sehat      INTEGER     NOT NULL DEFAULT 0,
  ranap_umum      INTEGER     NOT NULL DEFAULT 0,
  hp_umum         NUMERIC(15,2) NOT NULL DEFAULT 0,
  ranap_bpjs      INTEGER     NOT NULL DEFAULT 0,
  hp_bpjs         NUMERIC(15,2) NOT NULL DEFAULT 0,
  partus_umum     INTEGER     NOT NULL DEFAULT 0,
  hp_partus_umum  NUMERIC(15,2) NOT NULL DEFAULT 0,
  partus_bpjs     INTEGER     NOT NULL DEFAULT 0,
  hp_partus_bpjs  NUMERIC(15,2) NOT NULL DEFAULT 0,
  kunjungan_rajal INTEGER     NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast ordering by bulan
CREATE INDEX IF NOT EXISTS idx_data_klinik_bulan ON public.data_klinik (bulan DESC);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_data_klinik_updated_at ON public.data_klinik;
CREATE TRIGGER trg_data_klinik_updated_at
  BEFORE UPDATE ON public.data_klinik
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.data_klinik ENABLE ROW LEVEL SECURITY;

-- Allow full access via the anon/public key.
-- Replace this with stricter policies once you add authentication.
CREATE POLICY "public_all" ON public.data_klinik
  FOR ALL
  USING (true)
  WITH CHECK (true);
