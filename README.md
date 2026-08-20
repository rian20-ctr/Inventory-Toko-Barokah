# Gudang — Data Master Inventaris

Aplikasi web untuk mengelola data master toko: **Barang**, **Kategori**, **Satuan**, dan **Supplier**. Dibangun dengan Next.js + Supabase, tampilan responsif (bisa dibuka di HP), siap deploy ke Vercel.

## Fitur

- **Barang** — kode/SKU, nama, kategori, satuan, supplier, harga beli, harga jual, stok. CRUD lengkap.
- **Kategori** — pengelompokan barang (mis. Makanan, Minuman).
- **Satuan** — satuan ukur (mis. Pcs, Dus, Kg).
- **Supplier** — nama, kontak, alamat pemasok.
- Pencarian di setiap halaman, tampilan tabel di desktop dan kartu di HP, navigasi bawah di mobile.

## 1. Siapkan database di Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** → **New query**, lalu jalankan seluruh isi file `sql/schema.sql` yang ada di folder ini. Ini akan membuat 4 tabel (`kategori`, `satuan`, `supplier`, `barang`) beserta relasinya, mengaktifkan Row Level Security, dan mengisi beberapa data contoh.
3. Buka **Project Settings → API**, salin:
   - `Project URL` → jadi `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → jadi `NEXT_PUBLIC_SUPABASE_ANON_KEY`

> Catatan keamanan: policy RLS di `schema.sql` diset terbuka (`using (true)`) supaya demo bisa langsung jalan tanpa login. Sebelum dipakai produksi dengan data sensitif, tambahkan sistem autentikasi (Supabase Auth) dan ganti policy agar memakai `auth.uid()`.

## 2. Jalankan di lokal

```bash
npm install
cp .env.local.example .env.local
# isi .env.local dengan URL & anon key dari Supabase Anda
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## 3. Deploy ke Vercel

1. Push folder ini ke sebuah repository GitHub.
2. Di [vercel.com](https://vercel.com), klik **Add New → Project**, lalu pilih repository tersebut.
3. Saat konfigurasi, tambahkan Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Deploy**. Setelah selesai, aplikasi bisa diakses lewat browser HP maupun desktop.

## Struktur proyek

```
src/
  app/
    barang/page.tsx      # halaman & CRUD Barang
    kategori/page.tsx    # halaman & CRUD Kategori
    satuan/page.tsx      # halaman & CRUD Satuan
    supplier/page.tsx    # halaman & CRUD Supplier
    layout.tsx           # root layout + font
    globals.css          # design tokens (warna, tipografi)
  components/
    AppShell.tsx          # sidebar (desktop) + bottom nav (mobile)
    Modal.tsx              # dialog form tambah/ubah/hapus
    ui.tsx                  # tombol, input, badge, dll.
  lib/
    supabase.ts            # koneksi client Supabase
    types.ts                # tipe data TypeScript
sql/
  schema.sql                # skema tabel + RLS + data contoh untuk Supabase
```

## Menambah fitur berikutnya

Struktur ini sengaja dibuat modular per-entitas sehingga mudah dikembangkan, misalnya menambah modul **Transaksi Stok Masuk/Keluar** atau **Laporan** dengan mengikuti pola yang sama pada folder `src/app`.
