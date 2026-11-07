-- Jalankan di SQL Editor setelah migrasi 004. Semua baris uji di-ROLLBACK.
-- Gunakan database uji bila ada trigger lain pada auth.users/data_klinik.
BEGIN;

DO $$
BEGIN
  IF has_table_privilege('anon', 'public.data_klinik', 'SELECT')
     OR has_table_privilege('anon', 'public.data_klinik', 'INSERT')
     OR has_table_privilege('anon', 'public.data_klinik', 'UPDATE')
     OR has_table_privilege('anon', 'public.data_klinik', 'DELETE') THEN
    RAISE EXCEPTION 'Akun anonim masih punya akses data_klinik';
  END IF;
END $$;

INSERT INTO auth.users (id, email)
VALUES
  ('00000000-0000-4000-8000-000000000001', 'rls-test-a@example.invalid'),
  ('00000000-0000-4000-8000-000000000002', 'rls-test-b@example.invalid');

INSERT INTO public.data_klinik (bulan, owner_id)
VALUES
  ('2099-01', '00000000-0000-4000-8000-000000000001'),
  ('2099-01', '00000000-0000-4000-8000-000000000002');

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);

DO $$
DECLARE n BIGINT;
BEGIN
  SELECT count(*) INTO n FROM public.data_klinik WHERE bulan = '2099-01';
  IF n <> 1 THEN RAISE EXCEPTION 'Akun A melihat % baris, seharusnya 1', n; END IF;
END $$;

-- Pindah sesi ke akun B. A tidak boleh terlihat atau dapat diubah.
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);

DO $$
DECLARE n BIGINT;
BEGIN
  SELECT count(*) INTO n FROM public.data_klinik WHERE bulan = '2099-01';
  IF n <> 1 THEN RAISE EXCEPTION 'Akun B melihat % baris, seharusnya 1', n; END IF;

  UPDATE public.data_klinik SET rujukan = 999
  WHERE owner_id = '00000000-0000-4000-8000-000000000001' AND bulan = '2099-01';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 0 THEN RAISE EXCEPTION 'Akun B dapat mengubah baris akun A'; END IF;

  DELETE FROM public.data_klinik
  WHERE owner_id = '00000000-0000-4000-8000-000000000001' AND bulan = '2099-01';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 0 THEN RAISE EXCEPTION 'Akun B dapat menghapus baris akun A'; END IF;

  BEGIN
    INSERT INTO public.data_klinik (bulan, owner_id)
    VALUES ('2099-02', '00000000-0000-4000-8000-000000000001');
    RAISE EXCEPTION 'Akun B dapat membuat baris milik akun A';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;

  BEGIN
    UPDATE public.data_klinik
    SET owner_id = '00000000-0000-4000-8000-000000000001'
    WHERE owner_id = '00000000-0000-4000-8000-000000000002' AND bulan = '2099-01';
    RAISE EXCEPTION 'Akun B dapat memindahkan barisnya ke akun A';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;

  INSERT INTO public.data_klinik (bulan, owner_id)
  VALUES ('2099-02', '00000000-0000-4000-8000-000000000002');
  DELETE FROM public.data_klinik WHERE bulan = '2099-02';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN RAISE EXCEPTION 'Akun B tidak dapat mengelola baris sendiri'; END IF;
END $$;

ROLLBACK;
