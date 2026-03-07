"use client";

import { useMemo, useState } from "react";
import type { Todo, TodoId } from "@/types/todo";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type TodoItemProps = {
  todo: Todo;
  onToggle?: (id: TodoId) => void;
  onDelete?: (id: TodoId) => void | Promise<void>;
  disabled?: boolean;
};

export function TodoItem({ todo, onToggle, onDelete, disabled = false }: TodoItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const text = useMemo(() => {
    const maybeTodo = (todo as { todo?: string }).todo;
    const maybeTitle = (todo as { title?: string }).title;
    return maybeTodo ?? maybeTitle ?? "Tarea sin título";
  }, [todo]);

  const statusLabel = todo.completed ? "Completada" : "Pendiente";

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      setConfirmingDelete(true);
      await onDelete(todo.id);
      setConfirmOpen(false);
    } finally {
      setConfirmingDelete(false);
    }
  };

  return (
    <>
      <li className="card-task">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={todo.completed}
              aria-label={`Cambiar estado de ${text}`}
              onClick={() => onToggle?.(todo.id)}
              disabled={disabled}
              className={[
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition",
                todo.completed
                  ? "border-emerald-400/40 bg-emerald-400/20 text-emerald-300"
                  : "border-white/15 bg-white/5 text-transparent hover:border-white/30",
              ].join(" ")}
            >
              <span className="text-xs">✓</span>
            </button>

            <div className="min-w-0">
              <p
                className={[
                  "text-sm font-medium leading-6 md:text-base",
                  todo.completed ? "text-white/55 line-through" : "text-white",
                ].join(" ")}
              >
                {text}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={[
                    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
                    todo.completed ? "status-completed" : "status-pending",
                  ].join(" ")}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              aria-label={`Eliminar ${text}`}
              onClick={() => setConfirmOpen(true)}
              disabled={disabled}
              className="btn-danger"
            >
              Eliminar
            </button>
          </div>
        </div>
      </li>

      <ConfirmDialog
        open={confirmOpen}
        loading={confirmingDelete}
        title="Eliminar tarea"
        description={`Esta acción eliminará la tarea "${text}". No podrás deshacer este cambio.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onClose={() => {
          if (!confirmingDelete) setConfirmOpen(false);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}
