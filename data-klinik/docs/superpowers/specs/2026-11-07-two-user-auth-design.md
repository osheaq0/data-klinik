# Dua Akun dengan Data Terpisah

## Tujuan

Satu website dipakai dua pengguna yang login dengan username dan password. Setiap pengguna hanya melihat dan mengubah data kliniknya sendiri. Semua data yang sudah ada menjadi milik akun pertama.

## Pendekatan

- Dipilih: Supabase Auth untuk login dan Row Level Security (RLS) pada `data_klinik` berdasarkan `owner_id`. Ini menjaga pemisahan juga saat API diakses langsung.
- Alternatif: dua website dan database terpisah. Ini menambah pekerjaan pengelolaan dan tidak diperlukan untuk dua akun.
- Pemilih pengguna tanpa login tidak dipakai karena tidak mengamankan data.

## Perilaku

- Akun `ayuk` dan `rinda` dibuat melalui script seed Supabase Auth Admin API; halaman aplikasi menyediakan login, logout, dan penggantian password.
- Data lama dialihkan ke akun pertama berdasarkan email yang diisi pengelola dalam migrasi SQL. Migrasi gagal dan rollback jika akun itu belum ada.
- Pengguna kedua mulai dengan daftar kosong, lalu dapat membuat data sendiri.
- Rumus bulanan, tanggal input, dan arsip mingguan tetap mengikuti versi saat ini.
- RLS membatasi baca, tambah, ubah, dan hapus ke baris dengan `owner_id = auth.uid()`; akses anonim ke tabel dicabut.

## Batasan

- Migrasi SQL dan pembuatan dua akun perlu dijalankan pada project Supabase produksi sebelum fitur dipakai.
- Password dan kunci rahasia tidak disimpan di kode atau diberikan kepada asisten.
