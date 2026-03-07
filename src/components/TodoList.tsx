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
    <section className="surface px-5 py-5 md:px-6 md:py-6">
      <div className="section-header">
        <div className="space-y-2">
          <h2 className="title text-xl md:text-2xl">{title}</h2>
          <p className="section-copy">
            {isEmpty
              ? "No hay tareas en esta vista por ahora."
              : "Revisa, completa o elimina tareas de forma simple."}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {isEmpty ? (
          <div className="surface-muted flex min-h-[160px] items-center justify-center rounded-3xl p-6 text-center">
            <div className="max-w-md">
              <p className="text-base font-medium text-white">
                Todo está al día por aquí
              </p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Prueba cambiando el filtro o crea una nueva tarea para empezar a
                organizarte mejor.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-4">
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
      </div>
    </section>
  );
}