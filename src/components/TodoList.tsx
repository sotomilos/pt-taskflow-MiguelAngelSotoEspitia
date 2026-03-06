import type { Todo, TodoId } from "@/types/todo";
import { TodoItem } from "@/components/TodoItem";

export function TodoList({
  title,
  todos,
  onToggle,
  toggling,
}: {
  title: string;
  todos: Todo[];
  onToggle?: (id: TodoId) => void;
  toggling?: Record<number, true>;
}) {
  return (
    <section className="rounded-2xl border bg-white/50 p-4">
      <h2 className="text-base font-semibold">{title}</h2>

      {todos.length === 0 ? (
        <p className="mt-2 text-sm opacity-70">No hay tareas para mostrar.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {todos.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={onToggle}
              disabled={!!toggling?.[t.id]}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
