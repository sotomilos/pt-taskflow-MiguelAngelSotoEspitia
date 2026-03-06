import type { Todo, TodoId } from "@/types/todo";

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  disabled,
}: {
  todo: Todo;
  onToggle?: (id: TodoId) => void;
  onDelete?: (id: TodoId) => void;
  disabled?: boolean;
}) {
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
            {disabled ? " (actualizando…)" : ""}
          </p>
        </div>
      </label>

      <div className="flex flex-col items-end gap-2">
        <span className="text-xs opacity-60">#{todo.id}</span>

        {onDelete ? (
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              const ok = window.confirm("¿Seguro que quieres eliminar esta tarea?");
              if (!ok) return;

              onDelete(todo.id);
            }}
            className="rounded-lg border px-3 py-1 text-xs disabled:opacity-50"
          >
            Eliminar
          </button>
        ) : null}
      </div>
    </li>
  );
}
