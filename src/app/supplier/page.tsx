"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Truck, Phone, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Supplier } from "@/lib/types";
import { Button, Field, Input, PageHeader, EmptyState, Banner } from "@/components/ui";
import Modal from "@/components/Modal";

const emptyForm = { id: 0, nama: "", kontak: "", alamat: "" };

export default function SupplierPage() {
  const [items, setItems] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from("supplier").select("*").order("nama", { ascending: true });
    if (error) setError(error.message);
    else setItems(data as Supplier[]);
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

  function openEdit(s: Supplier) {
    setForm({ id: s.id, nama: s.nama, kontak: s.kontak ?? "", alamat: s.alamat ?? "" });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.nama.trim()) return;
    setSaving(true);
    setError(null);
    const payload = {
      nama: form.nama.trim(),
      kontak: form.kontak.trim() || null,
      alamat: form.alamat.trim() || null,
    };
    const { error } = form.id
      ? await supabase.from("supplier").update(payload).eq("id", form.id)
      : await supabase.from("supplier").insert(payload);
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
    const { error } = await supabase.from("supplier").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) {
      setError(error.message);
      setDeleteTarget(null);
      return;
    }
    setDeleteTarget(null);
    load();
  }

  const filtered = items.filter(
    (s) =>
      s.nama.toLowerCase().includes(query.toLowerCase()) ||
      (s.kontak ?? "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        eyebrow="Data Master"
        title="Supplier"
        description="Kontak dan detail pemasok barang untuk toko Anda."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Tambah Supplier
          </Button>
        }
      />

      {error && <Banner tone="rust">{error}</Banner>}

      <div className="relative mb-5 max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-ink-muted)" }} />
        <Input placeholder="Cari supplier..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl animate-pulse" style={{ backgroundColor: "var(--color-surface-alt)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={query ? "Supplier tidak ditemukan" : "Belum ada supplier"}
          description={query ? "Coba kata kunci lain." : "Tambahkan pemasok pertama untuk toko Anda."}
          action={!query ? <Button variant="secondary" onClick={openCreate}><Plus size={16} /> Tambah Supplier</Button> : undefined}
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border p-4 flex flex-col gap-3"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent-strong)" }}
                  >
                    <Truck size={15} />
                  </span>
                  <p className="font-medium text-sm">{s.nama}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(s)} className="p-2 rounded-lg" style={{ color: "var(--color-ink-muted)" }} aria-label="Edit">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(s)} className="p-2 rounded-lg" style={{ color: "var(--color-rust)" }} aria-label="Hapus">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-[13px]" style={{ color: "var(--color-ink-muted)" }}>
                {s.kontak && (
                  <span className="flex items-center gap-2">
                    <Phone size={13} /> {s.kontak}
                  </span>
                )}
                {s.alamat && (
                  <span className="flex items-center gap-2">
                    <MapPin size={13} /> {s.alamat}
                  </span>
                )}
                {!s.kontak && !s.alamat && <span>Tidak ada detail kontak</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Ubah Supplier" : "Tambah Supplier"}>
        <div className="flex flex-col gap-4">
          <Field label="Nama Supplier" required>
            <Input autoFocus value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: CV Sumber Makmur" />
          </Field>
          <Field label="Kontak" hint="Nomor telepon atau email">
            <Input value={form.kontak} onChange={(e) => setForm({ ...form, kontak: e.target.value })} placeholder="0812-3456-7890" />
          </Field>
          <Field label="Alamat" hint="Opsional">
            <Input value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} placeholder="Jl. Industri No. 12" />
          </Field>
          <div className="flex gap-3 mt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button className="flex-1" loading={saving} onClick={handleSave}>Simpan</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Supplier">
        <p className="text-sm mb-5" style={{ color: "var(--color-ink-muted)" }}>
          Yakin ingin menghapus <strong style={{ color: "var(--color-ink)" }}>{deleteTarget?.nama}</strong>?
          Barang dari supplier ini akan kehilangan info pemasoknya.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>Batal</Button>
          <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDelete}>Hapus</Button>
        </div>
      </Modal>
    </div>
  );
}
