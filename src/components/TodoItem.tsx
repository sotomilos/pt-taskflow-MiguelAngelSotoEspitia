import type { Todo, TodoId } from "@/types/todo";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  disabled,
}: {
  todo: Todo;
  onToggle?: (id: TodoId) => void;
  onDelete?: (id: TodoId) => void | Promise<void>;
  disabled?: boolean;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <li className="flex items-start justify-between gap-3 rounded-xl border bg-white/70 p-3">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4"
          checked={todo.completed}
          disabled={disabled}
          onChange={() => onToggle?.(todo.id)}
        />

        <div>
          <p
            className={[
              "text-sm font-medium",
              todo.completed ? "line-through opacity-70" : "",
            ].join(" ")}
          >
            {todo.todo}
          </p>
          <p className="mt-1 text-xs opacity-70">
            Estado: {todo.completed ? "Completada ✅" : "Pendiente ⏳"}
            {disabled ? " (procesando…)" : ""}
          </p>
        </div>
      </label>

      <div className="flex flex-col items-end gap-2">
        <span className="text-xs opacity-60">#{todo.id}</span>

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
              className="rounded-lg border px-3 py-1 text-xs disabled:opacity-50"
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
