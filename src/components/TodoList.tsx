import type { Todo, TodoId } from "@/types/todo";
import { TodoItem } from "@/components/TodoItem";

type TodoListProps = {
  title: string;
  todos: Todo[];
  onToggle?: (id: TodoId) => void;
  onDelete?: (id: TodoId) => void | Promise<void>;
  toggling?: Record<number, true>;
  deleting?: Record<number, true>;
};

export function TodoList({
  title,
  todos,
  onToggle,
  onDelete,
  toggling,
  deleting,
}: TodoListProps) {
  const isEmpty = todos.length === 0;

  return (
    <section className="surface p-4 md:p-5">
      <div className="section-header">
        <div>
          <h2 className="title text-lg md:text-xl">{title}</h2>
          <p className="subtitle">
            {isEmpty
              ? "No hay tareas disponibles en esta vista."
              : "Gestiona el estado de cada tarea de forma rápida y clara."}
          </p>
        </div>

        <span className="chip">
          {todos.length} {todos.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="divider" />

      {isEmpty ? (
        <div className="surface-muted flex min-h-[140px] items-center justify-center p-6 text-center">
          <div className="max-w-sm">
            <p className="text-sm font-medium text-white">
              No hay tareas para mostrar
            </p>
            <p className="mt-2 text-sm text-white/60">
              Prueba cambiando el filtro o creando una nueva tarea para ver
              resultados aquí.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => {
            const busy = Boolean(toggling?.[todo.id] || deleting?.[todo.id]);

            return (
              <TodoItem
                key={todo.id}
                todo={todo}
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