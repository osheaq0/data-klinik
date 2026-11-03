# Data Klinik

Aplikasi web untuk input dan manajemen **data klinik bulanan** dengan beberapa entri pada tanggal berbeda dalam bulan yang sama.

## Stack

| Layer    | Teknologi |
|----------|-----------|
| Frontend | Next.js 14 · TypeScript · Tailwind CSS |
| Database | Supabase (PostgreSQL – free tier) |
| Hosting  | Vercel (deploy via GitHub) |

---

## Fitur

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
2. Buka **SQL Editor** dan jalankan migrasi secara berurutan pada database baru:
   ```
   supabase/migrations/001_create_data_klinik.sql
   supabase/migrations/002_add_weekly_period.sql
   supabase/migrations/003_add_monthly_entry_date.sql
   ```
   Jika database sudah memakai versi mingguan, jalankan hanya `003_add_monthly_entry_date.sql`. Migrasi ini tidak menghapus data lama.
3. Salin kredensial dari **Settings → API**:
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

---

## Deploy ke Vercel via GitHub

1. Push repo ke GitHub
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. Tambahkan environment variables di **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Deploy** — selesai!

---

## Struktur Database

Tabel: `data_klinik`

| Kolom            | Tipe            | Keterangan               |
|------------------|-----------------|--------------------------|
| `id`             | BIGSERIAL (PK)  | Auto-increment           |
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
│   └── DataTable.tsx       # Tabel data + konfirmasi hapus
├── lib/
│   ├── supabase.ts         # Supabase client
│   └── types.ts            # TypeScript types & column config
├── supabase/
│   └── migrations/
│       ├── 001_create_data_klinik.sql
│       ├── 002_add_weekly_period.sql
│       └── 003_add_monthly_entry_date.sql
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
└── README.md
```
