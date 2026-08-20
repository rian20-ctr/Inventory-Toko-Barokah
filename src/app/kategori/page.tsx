"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Tags } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Kategori } from "@/lib/types";
import { Button, Field, Input, Textarea, PageHeader, EmptyState, Banner } from "@/components/ui";
import Modal from "@/components/Modal";

const emptyForm = { id: 0, nama_kategori: "", keterangan: "" };

export default function KategoriPage() {
  const [items, setItems] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Kategori | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("kategori")
      .select("*")
      .order("nama_kategori", { ascending: true });
    if (error) setError(error.message);
    else setItems(data as Kategori[]);
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

  function openEdit(k: Kategori) {
    setForm({ id: k.id, nama_kategori: k.nama_kategori, keterangan: k.keterangan ?? "" });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.nama_kategori.trim()) return;
    setSaving(true);
    setError(null);
    const payload = {
      nama_kategori: form.nama_kategori.trim(),
      keterangan: form.keterangan.trim() || null,
    };
    const { error } = form.id
      ? await supabase.from("kategori").update(payload).eq("id", form.id)
      : await supabase.from("kategori").insert(payload);
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
    const { error } = await supabase.from("kategori").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    if (error) {
      setError(error.message);
      setDeleteTarget(null);
      return;
    }
    setDeleteTarget(null);
    load();
  }

  const filtered = items.filter((k) =>
    k.nama_kategori.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        eyebrow="Data Master"
        title="Kategori"
        description="Kelompokkan barang berdasarkan jenisnya, misalnya Makanan, Minuman, atau Kebersihan."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Tambah Kategori
          </Button>
        }
      />

      {error && <Banner tone="rust">{error}</Banner>}

      <div className="relative mb-5 max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--color-ink-muted)" }}
        />
        <Input
          placeholder="Cari kategori..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <SkeletonRows />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={query ? "Kategori tidak ditemukan" : "Belum ada kategori"}
          description={
            query
              ? "Coba kata kunci lain."
              : "Tambahkan kategori pertama untuk mulai mengelompokkan barang."
          }
          action={
            !query ? (
              <Button variant="secondary" onClick={openCreate}>
                <Plus size={16} /> Tambah Kategori
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ backgroundColor: "var(--color-surface-alt)" }}>
                <th className="px-4 py-3 font-semibold" style={{ color: "var(--color-ink-muted)" }}>Nama Kategori</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell" style={{ color: "var(--color-ink-muted)" }}>Keterangan</th>
                <th className="px-4 py-3 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((k) => (
                <tr key={k.id} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  <td className="px-4 py-3 font-medium flex items-center gap-2.5">
                    <span
                      className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent-strong)" }}
                    >
                      <Tags size={14} />
                    </span>
                    {k.nama_kategori}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell" style={{ color: "var(--color-ink-muted)" }}>
                    {k.keterangan || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(k)} className="p-2 rounded-lg" style={{ color: "var(--color-ink-muted)" }} aria-label="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(k)} className="p-2 rounded-lg" style={{ color: "var(--color-rust)" }} aria-label="Hapus">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Ubah Kategori" : "Tambah Kategori"}>
        <div className="flex flex-col gap-4">
          <Field label="Nama Kategori" required>
            <Input
              autoFocus
              value={form.nama_kategori}
              onChange={(e) => setForm({ ...form, nama_kategori: e.target.value })}
              placeholder="Contoh: Makanan"
            />
          </Field>
          <Field label="Keterangan" hint="Opsional">
            <Textarea
              rows={3}
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
              placeholder="Deskripsi singkat kategori ini"
            />
          </Field>
          <div className="flex gap-3 mt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button className="flex-1" loading={saving} onClick={handleSave}>
              Simpan
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Kategori">
        <p className="text-sm mb-5" style={{ color: "var(--color-ink-muted)" }}>
          Yakin ingin menghapus <strong style={{ color: "var(--color-ink)" }}>{deleteTarget?.nama_kategori}</strong>?
          Barang yang memakai kategori ini akan kehilangan kategorinya.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>
            Batal
          </Button>
          <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDelete}>
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function SkeletonRows() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-12 border-t first:border-t-0 animate-pulse"
          style={{ borderColor: "var(--color-border)", backgroundColor: i % 2 ? "var(--color-surface-alt)" : "transparent" }}
        />
      ))}
    </div>
  );
}
