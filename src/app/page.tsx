"use client";

import { useMemo, useState } from "react";
import { useTodosPage } from "@/hooks/useTodosPage";
import { TodoList } from "@/components/TodoList";
import { Pagination } from "@/components/Pagination";
import { ErrorState, LoadingState } from "@/components/States";
import { useCreateTodo } from "@/hooks/useCreateTodo";
import { CreateTodoForm } from "@/components/CreateTodoForm";
import { useToggleTodo } from "@/hooks/useToggleTodo";
import { useDeleteTodo } from "@/hooks/useDeleteTodo";
import { TodoFilter, type TodoFilterValue } from "@/components/TodoFilter";

export default function HomePage() {
  const [page, setPage] = useState(1);

  const { localTodos, remoteTodos, totalPages, loading, error, retry } =
    useTodosPage(page);

  // Mostramos locales arriba para que el usuario vea lo que creó “persistente” en UI
  const hasLocal = useMemo(() => localTodos.length > 0, [localTodos.length]);

  // Para crear nuevas tareas (optimistic UI)
  const { create, creating, error: createError } = useCreateTodo();

  // Para togglear (optimistic UI)
  const {
    toggle,
    toggling,
    error: toggleError,
    clearError: clearToggleError,
  } = useToggleTodo();

  // Para eliminar (soft-delete con opción de rollback)
  const {
    remove,
    deleting,
    error: deleteError,
    clearError: clearDeleteError,
  } = useDeleteTodo();

  // Para filtrar (solo a nivel de UI)
  const [filter, setFilter] = useState<TodoFilterValue>("all");

  // Filtramos los remotos según el filtro seleccionado (los locales no los filtramos para que el usuario vea todo lo que creó, aunque no se pierda la opción de filtro)
  const filteredLocalTodos = useMemo(() => {
    if (filter === "all") return localTodos;
    if (filter === "completed") return localTodos.filter((t) => t.completed);
    return localTodos.filter((t) => !t.completed);
  }, [filter, localTodos]);

  // Solo filtramos los remotos porque los locales ya son “nuestra versión de la verdad” y el usuario espera verlos siempre, incluso si no pasan el filtro (ej: completados) para evitar confusión de “dónde están mis tareas recién creadas”
  const filteredRemoteTodos = useMemo(() => {
    if (filter === "all") return remoteTodos;
    if (filter === "completed") return remoteTodos.filter((t) => t.completed);
    return remoteTodos.filter((t) => !t.completed);
  }, [filter, remoteTodos]);

  // Para mostrar conteos en el filtro
  const counts = useMemo(() => {
    const shown = [...localTodos, ...remoteTodos];
    const completed = shown.filter((t) => t.completed).length;
    return {
      all: shown.length,
      completed,
      pending: shown.length - completed,
    };
  }, [localTodos, remoteTodos]);

  return (
    <main className="container-page space-y-4 sm:px-6">
      {/* Header / Branding */}
      <header className="surface p-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="title">TaskFlow</h1>
          <span className="chip">Next.js + TS</span>
        </div>
        <p className="subtitle">
          CRUD con paginación, optimistic UI, estado local y filtro local.
        </p>
      </header>

      {/* Actions */}
      <TodoFilter value={filter} onChange={setFilter} counts={counts} />
      <CreateTodoForm onCreate={create} creating={creating} error={createError} />

      {/* Inline errors (toggle/delete) */}
      {toggleError ? (
        <div className="surface p-3 text-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">No se pudo actualizar el estado.</p>
              <p className="text-white/70">{toggleError}</p>
            </div>
            <button onClick={clearToggleError} className="btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      ) : null}

      {deleteError ? (
        <div className="surface p-3 text-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">No se pudo eliminar la tarea.</p>
              <p className="text-white/70">{deleteError}</p>
            </div>
            <button onClick={clearDeleteError} className="btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      ) : null}

      {/* Data states */}
      {loading && <LoadingState />}

      {!loading && error && <ErrorState message={error} onRetry={retry} />}

      {!loading && !error && (
        <>
          {hasLocal && (
            <TodoList
              title="Creadas por ti (local)"
              todos={filteredLocalTodos}
              onToggle={toggle}
              onDelete={remove}
              toggling={toggling}
              deleting={deleting}
            />
          )}

          <TodoList
            title="Tareas (DummyJSON)"
            todos={filteredRemoteTodos}
            onToggle={toggle}
            onDelete={remove}
            toggling={toggling}
            deleting={deleting}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </>
      )}
    </main>
  );
}
