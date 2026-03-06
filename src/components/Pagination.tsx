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
    <div className="surface flex items-center justify-between gap-3 p-3">
      <button onClick={onPrev} disabled={page <= 1} className="btn-secondary">
        ← Anterior
      </button>

      <div className="text-sm text-white/80">
        Página <span className="font-semibold text-white">{page}</span> de{" "}
        <span className="font-semibold text-white">{totalPages}</span>
      </div>

      <button onClick={onNext} disabled={page >= totalPages} className="btn-secondary">
        Siguiente →
      </button>
    </div>
  );
}
