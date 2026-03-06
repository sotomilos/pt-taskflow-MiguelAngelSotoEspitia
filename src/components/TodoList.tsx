import type { Todo, TodoId } from "@/types/todo";
import { TodoItem } from "@/components/TodoItem";

export function TodoList({
  title,
  todos,
  onToggle,
  onDelete,
  toggling,
  deleting,
}: {
  title: string;
  todos: Todo[];
  onToggle?: (id: TodoId) => void;
  onDelete?: (id: TodoId) => void | Promise<void>;
  toggling?: Record<number, true>;
  deleting?: Record<number, true>;
}) {
  return (
    <section className="surface p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        <span className="chip">{todos.length} items</span>
      </div>

      <div className="divider" />

      {todos.length === 0 ? (
        <p className="text-sm text-white/70">No hay tareas para mostrar.</p>
      ) : (
        <ul className="space-y-2">
          {todos.map((t) => {
            const busy = !!toggling?.[t.id] || !!deleting?.[t.id];
            return (
              <TodoItem
                key={t.id}
                todo={t}
                onToggle={onToggle}
                onDelete={onDelete}
                disabled={busy}
              />
            );
          })}
        </ul>
      )}
    </section>
  );
}
