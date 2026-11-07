# Dua Akun dengan Data Terpisah Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Dua pengguna login pada satu website dan hanya dapat mengakses data miliknya.

**Architecture:** Supabase Auth mengelola sesi. Kolom `owner_id` dan RLS Postgres menjaga isolasi data. Migrasi memindahkan semua data lama ke akun pertama secara atomik.

**Tech Stack:** Next.js 15, React, Supabase Auth, PostgreSQL RLS.

**Spec:** `docs/superpowers/specs/2026-11-07-two-user-auth-design.md`

## Global Constraints

- Data lama harus menjadi milik akun pertama, tanpa kehilangan baris.
- Hanya dua akun yang dibuat oleh pengelola; tidak ada pendaftaran terbuka di aplikasi.
- Rumus dan format data yang ada tetap berlaku.

## Review Focus

- Pengguna anonim tidak dapat membaca atau menulis tabel.
- Akun kedua tidak dapat membaca, mengubah, atau menghapus baris akun pertama.
- Pergantian akun pada browser yang sama tidak menampilkan data akun sebelumnya.
- Migrasi gagal tanpa email akun pertama yang valid, tanpa mengubah data.
- Login gagal menampilkan pesan dan tidak membuka tabel.

---

### Task 1: Migrasi kepemilikan dan RLS

**Files:** `supabase/migrations/004_two_user_auth.sql`, `supabase/tests/data_klinik_rls.sql`

- [x] Tulis kueri uji untuk anonim, pemilik, dan pengguna lain. Eksekusi memerlukan migrasi pada Supabase.
- [x] Tambahkan `owner_id`, alihkan data lama ke akun pertama, buat kebijakan RLS, dan cabut akses anonim dalam satu transaksi.
- [x] Tinjau urutan migrasi dan dokumentasikan langkah menjalankannya.

### Task 2: Login dan pergantian sesi

**Files:** `components/LoginForm.tsx`, `app/page.tsx`, `lib/types.ts`

- [x] Tampilkan formulir login untuk pengguna tanpa sesi.
- [x] Muat data setelah login dan hapus data dari layar saat keluar atau akun berganti.
- [x] Batasi semua kueri data dengan `owner_id` selain perlindungan RLS.
- [x] Jalankan TypeScript, tes yang tersedia, dan build.

### Task 3: Panduan penggunaan

**Files:** `README.md`

- [x] Jelaskan pembuatan dua akun, pengisian email akun pertama pada migrasi, dan pengaturan Supabase Auth.
- [x] Pastikan tidak ada sandi atau kunci rahasia dalam perubahan.
