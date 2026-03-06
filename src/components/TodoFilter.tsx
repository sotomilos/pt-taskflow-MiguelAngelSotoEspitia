"use client";

export type TodoFilterValue = "all" | "completed" | "pending";

export function TodoFilter({
  value,
  onChange,
  counts,
}: {
  value: TodoFilterValue;
  onChange: (v: TodoFilterValue) => void;
  counts?: { all: number; completed: number; pending: number };
}) {
  const items: Array<{ key: TodoFilterValue; label: string }> = [
    { key: "all", label: "Todas" },
    { key: "completed", label: "Completadas" },
    { key: "pending", label: "Pendientes" },
  ];

  return (
    <section className="rounded-2xl border bg-white/50 p-4">
      <h2 className="text-base font-semibold">Filtro</h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((it) => {
          const active = value === it.key;
          const count =
            it.key === "all"
              ? counts?.all
              : it.key === "completed"
                ? counts?.completed
                : counts?.pending;

          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange(it.key)}
              className={[
                "rounded-lg border px-3 py-2 text-sm",
                active ? "bg-black text-white" : "bg-white/70",
              ].join(" ")}
            >
              {it.label}
              {typeof count === "number" ? ` (${count})` : ""}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-xs opacity-70">
        Este filtro es 100% local (no hace llamadas adicionales).
      </p>
    </section>
  );
}
