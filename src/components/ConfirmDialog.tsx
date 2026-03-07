"use client";

import { useEffect, useRef } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);

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

    // Focus inicial para accesibilidad
    cancelBtnRef.current?.focus();

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
      aria-label={title}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-150"
        aria-label="Cerrar"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
        <div className="surface p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white">{title}</h3>
              {description ? (
                <p className="mt-2 text-sm text-white/70">{description}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="btn-ghost px-3 py-2 text-xs"
              aria-label="Cerrar diálogo"
            >
              ✕
            </button>
          </div>

          <div className="divider" />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              ref={cancelBtnRef}
              className="btn-secondary"
            >
              {cancelLabel}
            </button>

            <button type="button" onClick={onConfirm} className="btn-danger">
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}