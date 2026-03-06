import type { Todo, TodoId } from "@/types/todo";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type TodoItemProps = {
  todo: Todo;
  onToggle?: (id: TodoId) => void;
  onDelete?: (id: TodoId) => void | Promise<void>;
  disabled?: boolean;
};

export function TodoItem({ todo, onToggle, onDelete, disabled }: TodoItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const statusLabel = todo.completed ? "Completada" : "Pendiente";
  const statusClass = todo.completed ? "status-completed" : "status-pending";

  return (
    <li
      className={[
        "card-task group flex items-start justify-between gap-4",
        disabled ? "opacity-70" : "",
      ].join(" ")}
    >
      <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={todo.completed}
            disabled={disabled}
            onChange={() => onToggle?.(todo.id)}
            className="h-5 w-5 cursor-pointer rounded border-white/20 bg-transparent accent-blue-500 disabled:cursor-not-allowed"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p
              className={[
                "truncate text-sm font-medium text-white md:text-base",
                todo.completed ? "line-through text-white/45" : "",
              ].join(" ")}
            >
              {todo.todo}
            </p>

            <span className={`chip ${statusClass}`}>{statusLabel}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/55">
            <span>ID #{todo.id}</span>
            {disabled ? <span>• procesando...</span> : null}
          </div>
        </div>
      </label>

      <div className="flex shrink-0 items-center gap-2">
        {onDelete ? (
          <>
            <button
              type="button"
              disabled={disabled}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              className="btn-danger px-3 py-2 text-xs"
            >
              Eliminar
            </button>

            <ConfirmDialog
              open={confirmOpen}
              title="Eliminar tarea"
              description="¿Seguro que quieres eliminar esta tarea? Esta acción no se puede deshacer."
              confirmLabel="Sí, eliminar"
              cancelLabel="Cancelar"
              onCancel={() => setConfirmOpen(false)}
              onConfirm={async () => {
                setConfirmOpen(false);
                await onDelete(todo.id);
              }}
            />
          </>
        ) : null}
      </div>
    </li>
  );
}
