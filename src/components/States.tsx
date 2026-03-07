type LoadingStateProps = { label?: string };

export function LoadingState({ label = "Cargando..." }: LoadingStateProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/70">
      <span
        className="h-4 w-4 animate-spin rounded-full border border-white/20 border-t-white/70"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-semibold text-white">Ocurrió un error</p>
        <p className="mt-1 text-sm text-white/70">{message}</p>
      </div>

      <div className="flex gap-2">
        <button onClick={onRetry} className="btn-secondary">
          Reintentar
        </button>
      </div>
    </div>
  );
}
