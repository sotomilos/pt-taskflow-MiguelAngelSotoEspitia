type PaginationProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button onClick={onPrev} disabled={isFirst} className="btn-secondary">
        ← Anterior
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-white/70">
        <span>Página</span>
        <span className="chip-active px-3 py-1 text-xs">{page}</span>
        <span>de</span>
        <span className="chip px-3 py-1 text-xs">{totalPages}</span>
      </div>

      <button onClick={onNext} disabled={isLast} className="btn-secondary">
        Siguiente →
      </button>
    </div>
  );
}
