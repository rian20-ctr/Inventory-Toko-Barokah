-- ============================================================
-- Skema Database: Manajemen Data Master Inventaris Toko
-- Jalankan file ini di Supabase SQL Editor (Project > SQL Editor > New query)
-- ============================================================

-- Hapus dulu jika sudah pernah dibuat (aman dijalankan ulang)
drop table if exists barang cascade;
drop table if exists supplier cascade;
drop table if exists satuan cascade;
drop table if exists kategori cascade;

-- ---------------------------
-- Tabel: kategori
-- ---------------------------
create table kategori (
  id bigint generated always as identity primary key,
  nama_kategori text not null,
  keterangan text,
  created_at timestamptz not null default now()
);

-- ---------------------------
-- Tabel: satuan
-- ---------------------------
create table satuan (
  id bigint generated always as identity primary key,
  nama_satuan text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------
-- Tabel: supplier
-- ---------------------------
create table supplier (
  id bigint generated always as identity primary key,
  nama text not null,
  kontak text,
  alamat text,
  created_at timestamptz not null default now()
);

-- ---------------------------
-- Tabel: barang
-- ---------------------------
create table barang (
  id bigint generated always as identity primary key,
  kode_barang text not null unique,
  nama_barang text not null,
  kategori_id bigint references kategori (id) on delete set null,
  satuan_id bigint references satuan (id) on delete set null,
  supplier_id bigint references supplier (id) on delete set null,
  harga_beli numeric(14, 2) not null default 0,
  harga_jual numeric(14, 2) not null default 0,
  stok numeric(14, 2) not null default 0,
  created_at timestamptz not null default now()
);

-- Index bantu pencarian & join
create index idx_barang_kategori on barang (kategori_id);
create index idx_barang_satuan on barang (satuan_id);
create index idx_barang_supplier on barang (supplier_id);

-- ============================================================
-- Row Level Security
-- Contoh ini memakai kunci "anon" (public) untuk kemudahan demo.
-- Untuk produksi, ganti policy di bawah dengan pengecekan auth.uid()
-- setelah Anda menambahkan sistem login.
-- ============================================================
alter table kategori enable row level security;
alter table satuan enable row level security;
alter table supplier enable row level security;
alter table barang enable row level security;

create policy "public_all_kategori" on kategori for all using (true) with check (true);
create policy "public_all_satuan" on satuan for all using (true) with check (true);
create policy "public_all_supplier" on supplier for all using (true) with check (true);
create policy "public_all_barang" on barang for all using (true) with check (true);

-- ============================================================
-- Data contoh (opsional, hapus jika tidak diperlukan)
-- ============================================================
insert into kategori (nama_kategori, keterangan) values
  ('Makanan', 'Produk makanan kemasan & segar'),
  ('Minuman', 'Produk minuman kemasan'),
  ('Kebersihan', 'Produk kebersihan rumah tangga');

insert into satuan (nama_satuan) values
  ('Pcs'), ('Dus'), ('Kg'), ('Liter');

insert into supplier (nama, kontak, alamat) values
  ('CV Sumber Makmur', '0812-3456-7890', 'Jl. Industri No. 12, Depok'),
  ('PT Distribusi Jaya', '021-5551234', 'Jl. Raya Bogor KM 30, Depok');

insert into barang (kode_barang, nama_barang, kategori_id, satuan_id, supplier_id, harga_beli, harga_jual, stok) values
  ('BRG-0001', 'Beras Premium 5kg', 1, 3, 1, 62000, 68000, 40),
  ('BRG-0002', 'Teh Botol 450ml', 2, 1, 2, 3500, 5000, 120),
  ('BRG-0003', 'Sabun Cuci Piring 800ml', 3, 1, 2, 9500, 13000, 75);
