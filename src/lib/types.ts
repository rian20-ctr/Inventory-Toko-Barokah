export type Kategori = {
  id: number;
  nama_kategori: string;
  keterangan: string | null;
  created_at: string;
};

export type Satuan = {
  id: number;
  nama_satuan: string;
  created_at: string;
};

export type Supplier = {
  id: number;
  nama: string;
  kontak: string | null;
  alamat: string | null;
  created_at: string;
};

export type Barang = {
  id: number;
  kode_barang: string;
  nama_barang: string;
  kategori_id: number | null;
  satuan_id: number | null;
  supplier_id: number | null;
  harga_beli: number;
  harga_jual: number;
  stok: number;
  created_at: string;
  kategori?: Kategori | null;
  satuan?: Satuan | null;
  supplier?: Supplier | null;
};
