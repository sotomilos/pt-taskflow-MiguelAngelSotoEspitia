export function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border bg-white/70 p-3">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
      >
        ← Anterior
      </button>

      <div className="text-sm">
        Página <span className="font-semibold">{page}</span> de{" "}
        <span className="font-semibold">{totalPages}</span>
      </div>

      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
      >
        Siguiente →
      </button>
    </div>
  );
}
