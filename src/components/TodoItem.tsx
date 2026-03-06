import type { Todo, TodoId } from "@/types/todo";

export function TodoItem({
  todo,
  onToggle,
  disabled,
}: {
  todo: Todo;
  onToggle?: (id: TodoId) => void;
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

      <span className="text-xs opacity-60">#{todo.id}</span>
    </li>
  );
}
