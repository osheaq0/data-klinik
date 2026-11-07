-- Jalankan setelah seed dua akun dibuat dengan npm run seed:users.
-- Email akun pertama harus sama dengan lib/auth-users.json (ayuk).
-- Seluruh migrasi berada dalam satu transaksi: bila email tidak ditemukan,
-- semua perubahan di bawah dibatalkan dan data lama tetap utuh.

BEGIN;

ALTER TABLE public.data_klinik
  ADD COLUMN IF NOT EXISTS owner_id UUID;

DO $$
DECLARE
  primary_email TEXT := 'ayuktri1003@gmail.com';
  primary_id UUID;
BEGIN
  SELECT id INTO primary_id
  FROM auth.users
  WHERE lower(email) = lower(primary_email)
  LIMIT 1;

  IF primary_id IS NULL THEN
    RAISE EXCEPTION 'Akun pertama (%) tidak ditemukan. Buat akun di Authentication > Users dan ganti email dalam migrasi.', primary_email;
  END IF;

  UPDATE public.data_klinik
  SET owner_id = primary_id
  WHERE owner_id IS NULL;
END $$;

ALTER TABLE public.data_klinik
  ALTER COLUMN owner_id SET DEFAULT auth.uid(),
  ALTER COLUMN owner_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'data_klinik_owner_id_fkey'
      AND conrelid = 'public.data_klinik'::regclass
  ) THEN
    ALTER TABLE public.data_klinik
      ADD CONSTRAINT data_klinik_owner_id_fkey
      FOREIGN KEY (owner_id) REFERENCES auth.users(id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_data_klinik_owner_id
  ON public.data_klinik (owner_id);

-- Indeks versi mingguan sebelumnya bersifat global; dua akun boleh memakai minggu yang sama.
DROP INDEX IF EXISTS public.idx_data_klinik_tanggal_mulai;
CREATE UNIQUE INDEX IF NOT EXISTS idx_data_klinik_owner_tanggal_mulai
  ON public.data_klinik (owner_id, tanggal_mulai)
  WHERE tanggal_mulai IS NOT NULL;

ALTER TABLE public.data_klinik ENABLE ROW LEVEL SECURITY;

-- Hapus semua policy lama: policy permisif tambahan dapat melewati pembatasan pemilik.
DO $$
DECLARE
  old_policy RECORD;
BEGIN
  FOR old_policy IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'data_klinik'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.data_klinik', old_policy.policyname);
  END LOOP;
END $$;

REVOKE ALL ON public.data_klinik FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.data_klinik TO authenticated;
REVOKE ALL ON SEQUENCE public.data_klinik_id_seq FROM PUBLIC, anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.data_klinik_id_seq TO authenticated;

CREATE POLICY "owner_select" ON public.data_klinik
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = owner_id);

CREATE POLICY "owner_insert" ON public.data_klinik
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = owner_id);

CREATE POLICY "owner_update" ON public.data_klinik
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = owner_id)
  WITH CHECK ((SELECT auth.uid()) = owner_id);

CREATE POLICY "owner_delete" ON public.data_klinik
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = owner_id);

COMMIT;
