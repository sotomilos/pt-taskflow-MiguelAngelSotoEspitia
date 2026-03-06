import type { Todo } from "@/types/todo";

export function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li className="flex items-start justify-between gap-3 rounded-xl border bg-white/70 p-3">
      <div>
        <p className="text-sm font-medium">{todo.todo}</p>
        <p className="mt-1 text-xs opacity-70">
          Estado: {todo.completed ? "Completada ✅" : "Pendiente ⏳"}
        </p>
      </div>

      <span className="text-xs opacity-60">#{todo.id}</span>
    </li>
  );
}
