"use client";

import { useEffect } from "react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        aria-label="Cerrar"
        onClick={onCancel}
      />

      <div className="surface relative w-full max-w-md p-4">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? <p className="mt-2 text-sm text-white/70">{description}</p> : null}

        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn-secondary">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="btn-danger">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
