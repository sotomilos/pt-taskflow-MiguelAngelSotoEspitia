"use client";

import { useToastStore } from "@/store/toastStore";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-4 top-4 z-[60] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-3">
      {toasts.map((t) => {
        const tone =
          t.variant === "success"
            ? "border-emerald-400/20 bg-emerald-400/10"
            : t.variant === "error"
              ? "border-rose-400/20 bg-rose-400/10"
              : "border-sky-400/20 bg-sky-400/10";

        const titleTone =
          t.variant === "success"
            ? "text-emerald-200"
            : t.variant === "error"
              ? "text-rose-200"
              : "text-sky-200";

        return (
          <div
            key={t.id}
            role="status"
            className={[
              "rounded-2xl border p-4 backdrop-blur-xl shadow-lg shadow-black/30",
              "animate-in fade-in zoom-in-95",
              tone,
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className={["text-sm font-semibold", titleTone].join(" ")}>
                  {t.title}
                </p>

                {t.description ? (
                  <p className="mt-1 text-sm text-white/70">{t.description}</p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="btn-ghost px-3 py-2 text-xs"
                aria-label="Cerrar notificación"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}