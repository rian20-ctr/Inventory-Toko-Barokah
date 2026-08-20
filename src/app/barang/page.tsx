"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Barang, Kategori, Satuan, Supplier } from "@/lib/types";
import { Button, Field, Input, Select, PageHeader, EmptyState, Banner, Badge } from "@/components/ui";
import Modal from "@/components/Modal";

const emptyForm = {
  id: 0,
  kode_barang: "",
  nama_barang: "",
  kategori_id: "",
  satuan_id: "",
  supplier_id: "",
  harga_beli: "",
  harga_jual: "",
  stok: "",
};

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function BarangPage() {
  const [items, setItems] = useState<Barang[]>([]);
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [satuanList, setSatuanList] = useState<Satuan[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Barang | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const [barangRes, kategoriRes, satuanRes, supplierRes] = await Promise.all([
      supabase
        .from("barang")
        .select("*, kategori(*), satuan(*), supplier(*)")
        .order("created_at", { ascending: false }),
      supabase.from("kategori").select("*").order("nama_kategori"),
      supabase.from("satuan").select("*").order("nama_satuan"),
      supabase.from("supplier").select("*").order("nama"),
    ]);
    if (barangRes.error) setError(barangRes.error.message);
    else setItems(barangRes.data as Barang[]);
    setKategoriList((kategoriRes.data as Kategori[]) ?? []);
    setSatuanList((satuanRes.data as Satuan[]) ?? []);
    setSupplierList((supplierRes.data as Supplier[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  function openCreate() {
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(b: Barang) {
    setForm({
      id: b.id,
      kode_barang: b.kode_barang,
      nama_barang: b.nama_barang,
      kategori_id: b.kategori_id ? String(b.kategori_id) : "",
      satuan_id: b.satuan_id ? String(b.satuan_id) : "",
      supplier_id: b.supplier_id ? String(b.supplier_id) : "",
      harga_beli: String(b.harga_beli),
      harga_jual: String(b.harga_jual),
      stok: String(b.stok),
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.kode_barang.trim() || !form.nama_barang.trim()) return;
    setSaving(true);
    setError(null);
    const payload = {
      kode_barang: form.kode_barang.trim(),
      nama_barang: form.nama_barang.trim(),
      kategori_id: form.kategori_id ? Number(form.kategori_id) : null,
      satuan_id: form.satuan_id ? Number(form.satuan_id) : null,
      supplier_id: form.supplier_id ? Number(form.supplier_id) : null,
      harga_beli: Number(form.harga_beli) || 0,
      harga_jual: Number(form.harga_jual) || 0,
      stok: Number(form.stok) || 0,
    };
    const { error } = form.id
      ? await supabase.from("barang").update(payload).eq("id", form.id)
      : await supabase.from("barang").insert(payload);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setModalOpen(false);
    load();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from("barang").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) {
      setError(error.message);
      setDeleteTarget(null);
      return;
    }
    setDeleteTarget(null);
    load();
  }

  const filtered = useMemo(
    () =>
      items.filter(
        (b) =>
          b.nama_barang.toLowerCase().includes(query.toLowerCase()) ||
          b.kode_barang.toLowerCase().includes(query.toLowerCase())
      ),
    [items, query]
  );

  return (
    <div>
      <PageHeader
        eyebrow="Data Master"
        title="Barang"
        description="Informasi barang: kode, nama, kategori, satuan, supplier, dan harga."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Tambah Barang
          </Button>
        }
      />

      {error && <Banner tone="rust">{error}</Banner>}

      <div className="relative mb-5 max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-ink-muted)" }} />
        <Input placeholder="Cari kode atau nama barang..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="flex flex-col gap-2.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: "var(--color-surface-alt)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={query ? "Barang tidak ditemukan" : "Belum ada barang"}
          description={query ? "Coba kata kunci lain." : "Pastikan kategori, satuan, dan supplier sudah ada, lalu tambahkan barang pertama."}
          action={!query ? <Button variant="secondary" onClick={openCreate}><Plus size={16} /> Tambah Barang</Button> : undefined}
        />
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="flex flex-col gap-2.5 md:hidden">
            {filtered.map((b) => (
              <div key={b.id} className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] mb-1" style={{ color: "var(--color-accent-strong)" }}>{b.kode_barang}</p>
                    <p className="font-medium text-sm truncate">{b.nama_barang}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {b.kategori?.nama_kategori && <Badge tone="accent">{b.kategori.nama_kategori}</Badge>}
                      {b.satuan?.nama_satuan && <Badge tone="muted">{b.satuan.nama_satuan}</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEdit(b)} className="p-2 rounded-lg" style={{ color: "var(--color-ink-muted)" }} aria-label="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(b)} className="p-2 rounded-lg" style={{ color: "var(--color-rust)" }} aria-label="Hapus">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t text-[13px]" style={{ borderColor: "var(--color-border)" }}>
                  <span style={{ color: "var(--color-ink-muted)" }}>Jual {rupiah(b.harga_jual)}</span>
                  <span style={{ color: "var(--color-ink-muted)" }}>Stok {b.stok}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left" style={{ backgroundColor: "var(--color-surface-alt)" }}>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--color-ink-muted)" }}>Kode</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--color-ink-muted)" }}>Nama Barang</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--color-ink-muted)" }}>Kategori</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--color-ink-muted)" }}>Satuan</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "var(--color-ink-muted)" }}>Supplier</th>
                  <th className="px-4 py-3 font-semibold text-right" style={{ color: "var(--color-ink-muted)" }}>Harga Beli</th>
                  <th className="px-4 py-3 font-semibold text-right" style={{ color: "var(--color-ink-muted)" }}>Harga Jual</th>
                  <th className="px-4 py-3 font-semibold text-right" style={{ color: "var(--color-ink-muted)" }}>Stok</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                    <td className="px-4 py-3 font-mono text-[12px]" style={{ color: "var(--color-accent-strong)" }}>{b.kode_barang}</td>
                    <td className="px-4 py-3 font-medium flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent-strong)" }}>
                        <Package size={14} />
                      </span>
                      {b.nama_barang}
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--color-ink-muted)" }}>{b.kategori?.nama_kategori ?? "—"}</td>
                    <td className="px-4 py-3" style={{ color: "var(--color-ink-muted)" }}>{b.satuan?.nama_satuan ?? "—"}</td>
                    <td className="px-4 py-3" style={{ color: "var(--color-ink-muted)" }}>{b.supplier?.nama ?? "—"}</td>
                    <td className="px-4 py-3 text-right" style={{ color: "var(--color-ink-muted)" }}>{rupiah(b.harga_beli)}</td>
                    <td className="px-4 py-3 text-right font-medium">{rupiah(b.harga_jual)}</td>
                    <td className="px-4 py-3 text-right">{b.stok}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(b)} className="p-2 rounded-lg" style={{ color: "var(--color-ink-muted)" }} aria-label="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(b)} className="p-2 rounded-lg" style={{ color: "var(--color-rust)" }} aria-label="Hapus">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Ubah Barang" : "Tambah Barang"}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kode Barang" required>
              <Input
                autoFocus
                value={form.kode_barang}
                onChange={(e) => setForm({ ...form, kode_barang: e.target.value })}
                placeholder="BRG-0001"
                className="font-mono"
              />
            </Field>
            <Field label="Stok">
              <Input
                type="number"
                inputMode="decimal"
                value={form.stok}
                onChange={(e) => setForm({ ...form, stok: e.target.value })}
                placeholder="0"
              />
            </Field>
          </div>

          <Field label="Nama Barang" required>
            <Input value={form.nama_barang} onChange={(e) => setForm({ ...form, nama_barang: e.target.value })} placeholder="Contoh: Beras Premium 5kg" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Kategori">
              <Select value={form.kategori_id} onChange={(e) => setForm({ ...form, kategori_id: e.target.value })}>
                <option value="">Pilih kategori</option>
                {kategoriList.map((k) => (
                  <option key={k.id} value={k.id}>{k.nama_kategori}</option>
                ))}
              </Select>
            </Field>
            <Field label="Satuan">
              <Select value={form.satuan_id} onChange={(e) => setForm({ ...form, satuan_id: e.target.value })}>
                <option value="">Pilih satuan</option>
                {satuanList.map((s) => (
                  <option key={s.id} value={s.id}>{s.nama_satuan}</option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Supplier">
            <Select value={form.supplier_id} onChange={(e) => setForm({ ...form, supplier_id: e.target.value })}>
              <option value="">Pilih supplier</option>
              {supplierList.map((s) => (
                <option key={s.id} value={s.id}>{s.nama}</option>
              ))}
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga Beli">
              <Input
                type="number"
                inputMode="decimal"
                value={form.harga_beli}
                onChange={(e) => setForm({ ...form, harga_beli: e.target.value })}
                placeholder="0"
              />
            </Field>
            <Field label="Harga Jual">
              <Input
                type="number"
                inputMode="decimal"
                value={form.harga_jual}
                onChange={(e) => setForm({ ...form, harga_jual: e.target.value })}
                placeholder="0"
              />
            </Field>
          </div>

          <div className="flex gap-3 mt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button className="flex-1" loading={saving} onClick={handleSave}>Simpan</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Barang">
        <p className="text-sm mb-5" style={{ color: "var(--color-ink-muted)" }}>
          Yakin ingin menghapus <strong style={{ color: "var(--color-ink)" }}>{deleteTarget?.nama_barang}</strong>?
          Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>Batal</Button>
          <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDelete}>Hapus</Button>
        </div>
      </Modal>
    </div>
  );
}
