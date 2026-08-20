"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Ruler } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Satuan } from "@/lib/types";
import { Button, Field, Input, PageHeader, EmptyState, Banner } from "@/components/ui";
import Modal from "@/components/Modal";

const emptyForm = { id: 0, nama_satuan: "" };

export default function SatuanPage() {
  const [items, setItems] = useState<Satuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Satuan | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("satuan")
      .select("*")
      .order("nama_satuan", { ascending: true });
    if (error) setError(error.message);
    else setItems(data as Satuan[]);
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

  function openEdit(s: Satuan) {
    setForm({ id: s.id, nama_satuan: s.nama_satuan });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.nama_satuan.trim()) return;
    setSaving(true);
    setError(null);
    const payload = { nama_satuan: form.nama_satuan.trim() };
    const { error } = form.id
      ? await supabase.from("satuan").update(payload).eq("id", form.id)
      : await supabase.from("satuan").insert(payload);
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
    const { error } = await supabase.from("satuan").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) {
      setError(error.message);
      setDeleteTarget(null);
      return;
    }
    setDeleteTarget(null);
    load();
  }

  const filtered = items.filter((s) =>
    s.nama_satuan.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        eyebrow="Data Master"
        title="Satuan"
        description="Satuan ukur untuk barang, misalnya Pcs, Dus, atau Kg."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Tambah Satuan
          </Button>
        }
      />

      {error && <Banner tone="rust">{error}</Banner>}

      <div className="relative mb-5 max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-ink-muted)" }} />
        <Input placeholder="Cari satuan..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: "var(--color-surface-alt)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={query ? "Satuan tidak ditemukan" : "Belum ada satuan"}
          description={query ? "Coba kata kunci lain." : "Tambahkan satuan ukur pertama untuk barang Anda."}
          action={!query ? <Button variant="secondary" onClick={openCreate}><Plus size={16} /> Tambah Satuan</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border p-4 flex flex-col gap-3"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}
            >
              <span
                className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{ backgroundColor: "var(--color-moss-soft)", color: "var(--color-moss)" }}
              >
                <Ruler size={15} />
              </span>
              <p className="font-medium text-sm">{s.nama_satuan}</p>
              <div className="flex items-center gap-1 -ml-2 mt-auto">
                <button onClick={() => openEdit(s)} className="p-2 rounded-lg" style={{ color: "var(--color-ink-muted)" }} aria-label="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeleteTarget(s)} className="p-2 rounded-lg" style={{ color: "var(--color-rust)" }} aria-label="Hapus">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Ubah Satuan" : "Tambah Satuan"}>
        <div className="flex flex-col gap-4">
          <Field label="Nama Satuan" required>
            <Input
              autoFocus
              value={form.nama_satuan}
              onChange={(e) => setForm({ ...form, nama_satuan: e.target.value })}
              placeholder="Contoh: Pcs, Dus, Kg"
            />
          </Field>
          <div className="flex gap-3 mt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button className="flex-1" loading={saving} onClick={handleSave}>Simpan</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Satuan">
        <p className="text-sm mb-5" style={{ color: "var(--color-ink-muted)" }}>
          Yakin ingin menghapus <strong style={{ color: "var(--color-ink)" }}>{deleteTarget?.nama_satuan}</strong>?
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>Batal</Button>
          <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDelete}>Hapus</Button>
        </div>
      </Modal>
    </div>
  );
}
