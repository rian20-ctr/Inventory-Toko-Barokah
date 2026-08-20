"use client";

import { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

export function Button({
  variant = "primary",
  loading = false,
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: "var(--color-accent)", color: "#fff" },
    secondary: { backgroundColor: "var(--color-surface-alt)", color: "var(--color-ink)", border: "1px solid var(--color-border)" },
    danger: { backgroundColor: "var(--color-rust-soft)", color: "var(--color-rust)" },
    ghost: { backgroundColor: "transparent", color: "var(--color-ink-muted)" },
  };
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      style={styles[variant]}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity disabled:opacity-60 active:opacity-80 ${className}`}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
}

export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium" style={{ color: "var(--color-ink)" }}>
        {label}
        {required && <span style={{ color: "var(--color-rust)" }}> *</span>}
      </span>
      {children}
      {hint && (
        <span className="text-[11px]" style={{ color: "var(--color-ink-muted)" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

const fieldClass =
  "w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`${fieldClass} ${props.className ?? ""}`}
      style={{
        backgroundColor: "var(--color-surface-alt)",
        border: "1px solid var(--color-border)",
        color: "var(--color-ink)",
      }}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${fieldClass} resize-none ${props.className ?? ""}`}
      style={{
        backgroundColor: "var(--color-surface-alt)",
        border: "1px solid var(--color-border)",
        color: "var(--color-ink)",
      }}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${fieldClass} ${props.className ?? ""}`}
      style={{
        backgroundColor: "var(--color-surface-alt)",
        border: "1px solid var(--color-border)",
        color: "var(--color-ink)",
      }}
    />
  );
}

export function Badge({
  children,
  tone = "moss",
}: {
  children: React.ReactNode;
  tone?: "moss" | "accent" | "rust" | "muted";
}) {
  const tones: Record<string, React.CSSProperties> = {
    moss: { backgroundColor: "var(--color-moss-soft)", color: "var(--color-moss)" },
    accent: { backgroundColor: "var(--color-accent-soft)", color: "var(--color-accent-strong)" },
    rust: { backgroundColor: "var(--color-rust-soft)", color: "var(--color-rust)" },
    muted: { backgroundColor: "var(--color-surface-alt)", color: "var(--color-ink-muted)" },
  };
  return (
    <span
      style={tones[tone]}
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
    >
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 mb-7 md:flex-row md:items-end md:justify-between">
      <div>
        <p
          className="tag-shape inline-flex text-[11px] font-semibold tracking-wider uppercase mb-2"
          style={{ color: "var(--color-accent-strong)" }}
        >
          {eyebrow}
        </p>
        <h1 className="font-display text-2xl md:text-[28px] font-semibold" style={{ color: "var(--color-ink)" }}>
          {title}
        </h1>
        <p className="text-sm mt-1.5 max-w-lg" style={{ color: "var(--color-ink-muted)" }}>
          {description}
        </p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center text-center gap-3 rounded-xl border border-dashed py-16 px-6"
      style={{ borderColor: "var(--color-border)" }}
    >
      <p className="font-display font-semibold text-base" style={{ color: "var(--color-ink)" }}>
        {title}
      </p>
      <p className="text-sm max-w-sm" style={{ color: "var(--color-ink-muted)" }}>
        {description}
      </p>
      {action}
    </div>
  );
}

export function Banner({
  tone = "rust",
  children,
}: {
  tone?: "rust" | "moss";
  children: React.ReactNode;
}) {
  const style =
    tone === "rust"
      ? { backgroundColor: "var(--color-rust-soft)", color: "var(--color-rust)" }
      : { backgroundColor: "var(--color-moss-soft)", color: "var(--color-moss)" };
  return (
    <div style={style} className="rounded-lg px-4 py-3 text-sm font-medium mb-5">
      {children}
    </div>
  );
}
