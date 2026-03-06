export function LoadingState({ label = "Cargando..." }: { label?: string }) {
  return <div className="rounded-xl border bg-white/70 p-4 text-sm">{label}</div>;
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border bg-white/70 p-4">
      <p className="text-sm font-medium">Ocurrió un error</p>
      <p className="mt-1 text-sm opacity-80">{message}</p>
      <button
        onClick={onRetry}
        className="mt-3 rounded-lg bg-black px-3 py-2 text-sm text-white"
      >
        Reintentar
      </button>
    </div>
  );
}
