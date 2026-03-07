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
    <div className="surface-muted rounded-3xl p-2">
      <div className="flex flex-wrap gap-3">
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
                "inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition",
                active
                  ? "border-white bg-white text-slate-950 shadow-sm"
                  : "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
              ].join(" ")}
            >
              <span>{item.label}</span>

              {typeof count === "number" && (
                <span
                  className={[
                    "rounded-full px-2 py-0.5 text-[11px]",
                    active ? "bg-black/10 text-slate-900/80" : "bg-white/8 text-white/60",
                  ].join(" ")}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
