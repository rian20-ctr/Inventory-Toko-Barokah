"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Tags, Ruler, Truck, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/barang", label: "Barang", icon: Package },
  { href: "/kategori", label: "Kategori", icon: Tags },
  { href: "/satuan", label: "Satuan", icon: Ruler },
  { href: "/supplier", label: "Supplier", icon: Truck },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex md:flex-col md:w-64 md:shrink-0 border-r"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 border-r flex flex-col"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <div className="flex items-center justify-between px-5 pt-5">
              <Brand />
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Tutup menu"
                className="p-2 -mr-2 rounded-full"
                style={{ color: "var(--color-ink-muted)" }}
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent
              pathname={pathname}
              hideBrand
              onNavigate={() => setDrawerOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header
          className="md:hidden flex items-center justify-between px-4 h-14 border-b sticky top-0 z-30"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Buka menu"
            className="p-2 -ml-2 rounded-full"
            style={{ color: "var(--color-ink)" }}
          >
            <Menu size={22} />
          </button>
          <Brand compact />
          <div className="w-8" />
        </header>

        <main className="flex-1 px-4 py-6 md:px-10 md:py-10 pb-24 md:pb-10 max-w-6xl w-full mx-auto">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 border-t flex z-30"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
                style={{
                  color: active ? "var(--color-accent-strong)" : "var(--color-ink-muted)",
                }}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center tag-shape"
        style={{ backgroundColor: "var(--color-ink)", color: "var(--color-accent-soft)" }}
      >
        <span className="font-display font-bold text-xs">G</span>
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="font-display font-semibold text-[15px]">Gudang</p>
          <p className="text-[11px]" style={{ color: "var(--color-ink-muted)" }}>
            Data Master
          </p>
        </div>
      )}
    </div>
  );
}

function SidebarContent({
  pathname,
  hideBrand = false,
  onNavigate,
}: {
  pathname: string | null;
  hideBrand?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col h-full py-5">
      {!hideBrand && (
        <div className="px-5 pb-6">
          <Brand />
        </div>
      )}
      <p
        className="px-5 pb-2 text-[11px] font-semibold tracking-wider uppercase"
        style={{ color: "var(--color-ink-muted)" }}
      >
        Data Master
      </p>
      <nav className="flex flex-col gap-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? "var(--color-accent-soft)" : "transparent",
                color: active ? "var(--color-accent-strong)" : "var(--color-ink)",
              }}
            >
              <Icon size={18} strokeWidth={active ? 2.4 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-5 pt-4">
        <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
          Terhubung ke Supabase. Perubahan tersimpan langsung ke database.
        </p>
      </div>
    </div>
  );
}
