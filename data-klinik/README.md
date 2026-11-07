# Data Klinik

Aplikasi web untuk input dan manajemen **data klinik bulanan** dengan beberapa entri pada tanggal berbeda dalam bulan yang sama.

## Stack

| Layer    | Teknologi |
|----------|-----------|
| Frontend | Next.js 15 · TypeScript · Tailwind CSS |
| Database | Supabase (PostgreSQL – free tier) |
| Hosting  | Vercel (deploy via GitHub) |

---

## Fitur

- Login dua akun dengan username dan kata sandi; setiap akun hanya melihat datanya sendiri
- Input data klinik berdasarkan bulan dan tanggal dalam bulan tersebut; beberapa entri per bulan diperbolehkan
- BOR dibagi jumlah hari pada bulan yang dipilih dan 20 tempat tidur; AVLOS dihitung dari total hari perawatan per pasien keluar
- Data bulanan lama tetap terlihat tanpa tanggal; data mingguan dari versi sebelumnya tampil sebagai arsip
- Edit & hapus data
- Tabel data dengan format angka lokal (id-ID)
- Konfirmasi sebelum menghapus
- Notifikasi sukses / error
- Responsive layout

---

## Setup Lokal

### 1. Clone & Install

```bash
git clone https://github.com/<username>/data-klinik.git
cd data-klinik
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com) (free tier cukup)
2. Buka **SQL Editor** dan jalankan migrasi dasar secara berurutan pada database baru:
   ```
   supabase/migrations/001_create_data_klinik.sql
   supabase/migrations/002_add_weekly_period.sql
   supabase/migrations/003_add_monthly_entry_date.sql
   ```
   Jika database sudah dipakai, cukup jalankan migrasi yang belum pernah dijalankan.
3. Seed akun melalui Supabase Auth Admin API. Siapkan `.env.local` seperti bagian **Environment Variables** di bawah, lalu salin `.env.seed.local.example` ke `.env.seed.local` dan isi `SUPABASE_SERVICE_ROLE_KEY` serta `SEED_PASSWORD`. File `.env.seed.local` diabaikan Git. Untuk instalasi lokal ini, kata sandi awal yang diminta sudah diisi; service role key masih perlu diisi. Jalankan `npm run seed:users`. Username `ayuk` memakai email akun pertama di `lib/auth-users.json`; `rinda` memakai email internal. Script dapat dijalankan ulang: akun yang sudah ada diperbarui tanpa mengubah ID, sehingga hubungan data lama tetap terjaga. **Jangan masukkan service role key ke variabel `NEXT_PUBLIC_*` atau Vercel frontend.**
4. Jalankan **seluruh file** `supabase/migrations/004_two_user_auth.sql` di SQL Editor. Email akun pertama di dalamnya harus sama dengan email `ayuk` di `lib/auth-users.json`. Migrasi ini mengalihkan semua data lama ke akun pertama, menutup akses anonim, dan mengaktifkan pemisahan data di database. Jika email belum ada, transaksi gagal tanpa mengubah tabel.
   Setelah itu, `supabase/tests/data_klinik_rls.sql` dapat dijalankan di SQL Editor untuk memeriksa aturan akses; transaksi uji dibatalkan di akhir.
5. Setelah kedua akun siap, nonaktifkan **Allow new users to sign up** di Supabase Authentication agar hanya akun yang dibuat pengelola dapat masuk.
6. Salin kredensial dari **Settings → API**:
   - Project URL
   - `anon` public key

### 3. Environment Variables

```bash
cp .env.local.example .env.local
```

Isi `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Jalankan Dev Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

Masuk dengan username `ayuk` atau `rinda` dan kata sandi awal dari `.env.seed.local`. Setelah login, masing-masing pengguna dapat menekan **Atur kata sandi** untuk menggantinya.

---

## Deploy ke Vercel via GitHub

1. Push repo ke GitHub
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. Tambahkan environment variables di **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Deploy**. Jalankan migrasi 004 pada database yang sama sebelum pengguna mulai memakai versi login.

---

## Struktur Database

Tabel: `data_klinik`

| Kolom            | Tipe            | Keterangan               |
|------------------|-----------------|--------------------------|
| `id`             | BIGSERIAL (PK)  | Auto-increment           |
| `owner_id`       | UUID            | ID akun Supabase Auth pemilik baris; data lama milik akun pertama |
| `bulan`          | TEXT            | Bulan perhitungan, format `YYYY-MM`; kosong hanya pada arsip mingguan |
| `tanggal_catat`  | DATE            | Tanggal input dalam bulan yang dipilih; kosong pada data lama |
| `tanggal_mulai`  | DATE            | Arsip mingguan dari versi sebelumnya |
| `jml_peserta`    | INTEGER         | Jumlah peserta           |
| `rujukan`        | INTEGER         | Rujukan                  |
| `kunj_sakit`     | INTEGER         | Kunjungan sakit          |
| `kunj_sehat`     | INTEGER         | Kunjungan sehat          |
| `ranap_umum`     | INTEGER         | Rawat inap umum          |
| `hp_umum`        | NUMERIC(15,2)   | HP umum                  |
| `ranap_bpjs`     | INTEGER         | Rawat inap BPJS          |
| `hp_bpjs`        | NUMERIC(15,2)   | HP BPJS                  |
| `partus_umum`    | INTEGER         | Partus umum              |
| `hp_partus_umum` | NUMERIC(15,2)   | HP partus umum           |
| `partus_bpjs`    | INTEGER         | Partus BPJS              |
| `hp_partus_bpjs` | NUMERIC(15,2)   | HP partus BPJS           |
| `kunjungan_rajal`| INTEGER         | Kunjungan rawat jalan    |
| `created_at`     | TIMESTAMPTZ     | Dibuat otomatis          |
| `updated_at`     | TIMESTAMPTZ     | Diperbarui otomatis      |

---

## Struktur Proyek

```
data-klinik/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Halaman utama (CRUD logic)
│   └── globals.css
├── components/
│   ├── DataForm.tsx        # Form input / edit
│   ├── LoginForm.tsx       # Form login username
│   ├── PasswordForm.tsx    # Ganti kata sandi
│   └── DataTable.tsx       # Tabel data + konfirmasi hapus
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── auth-users.json     # Pemetaan username ke email Auth
│   └── types.ts            # TypeScript types & column config
├── supabase/
│   └── migrations/
│       ├── 001_create_data_klinik.sql
│       ├── 002_add_weekly_period.sql
│       ├── 003_add_monthly_entry_date.sql
│       └── 004_two_user_auth.sql
├── .env.local.example
├── .env.seed.local.example
├── scripts/seed-users.mjs  # Seed akun via Auth Admin API
├── next.config.js
├── tailwind.config.ts
└── README.md
```
