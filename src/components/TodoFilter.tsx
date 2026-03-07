"use client";

export type TodoFilterValue = "all" | "completed" | "pending";

type TodoFilterProps = {
  value: TodoFilterValue;
  onChange: (v: TodoFilterValue) => void;
  counts?: { all: number; completed: number; pending: number };
};

export function TodoFilter({ value, onChange, counts }: TodoFilterProps) {
  const items: Array<{ key: TodoFilterValue; label: string }> = [
    { key: "all", label: "Todas" },
    { key: "completed", label: "Completadas" },
    { key: "pending", label: "Pendientes" },
  ];

  return (
    <div className="space-y-5">
      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-3 pt-1">
        {items.map((item) => {
          const active = value === item.key;

          const count =
            item.key === "all"
              ? counts?.all
              : item.key === "completed"
                ? counts?.completed
                : counts?.pending;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              aria-pressed={active}
              className={[
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                active
                  ? "bg-white text-black border-white"
                  : "bg-white/5 border-white/10 hover:bg-white/10",
              ].join(" ")}
            >
              {item.label}

              {typeof count === "number" && (
                <span className="text-xs opacity-70">{count}</span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-white/50">
        Este filtro es local y no genera nuevas peticiones.
      </p>
    </div>
  );
}
