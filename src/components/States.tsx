export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return <div className="surface p-4 text-sm text-white/80">{label}</div>;
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="surface p-4">
      <p className="text-sm font-semibold">Ocurrió un error</p>
      <p className="mt-1 text-sm text-white/70">{message}</p>
      <button onClick={onRetry} className="btn-secondary mt-3">
        Reintentar
      </button>
    </div>
  );
}
