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

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <header className="rounded-2xl border bg-white/50 p-4">
        <CreateTodoForm onCreate={create} creating={creating} error={createError} />
        {toggleError ? (
          <div className="rounded-xl border bg-white/70 p-3 text-sm">
            <p className="font-medium">No se pudo actualizar el estado.</p>
            <p className="mt-1 opacity-80">{toggleError}</p>
            <button
              onClick={clearToggleError}
              className="mt-2 rounded-lg border px-3 py-1 text-sm"
            >
              Cerrar
            </button>
          </div>
        ) : null}
        {deleteError ? (
          <div className="rounded-xl border bg-white/70 p-3 text-sm">
            <p className="font-medium">No se pudo eliminar la tarea.</p>
            <p className="mt-1 opacity-80">{deleteError}</p>
            <button
              onClick={clearDeleteError}
              className="mt-2 rounded-lg border px-3 py-1 text-sm"
            >
              Cerrar
            </button>
          </div>
        ) : null}
        <h1 className="text-xl font-semibold">TaskFlow – Todos</h1>
        <p className="mt-1 text-sm opacity-70">
          Lista paginada (10 por página). CRUD y filtros se agregan en los siguientes
          commits.
        </p>
      </header>

      {loading && <LoadingState />}

      {!loading && error && <ErrorState message={error} onRetry={retry} />}

      {!loading && !error && (
        <>
          {hasLocal && (
            <TodoList
              title="Creadas por ti (local)"
              todos={localTodos}
              onToggle={toggle}
              onDelete={remove}
              toggling={toggling}
              deleting={deleting}
            />
          )}

          <TodoList
            title="Tareas (DummyJSON)"
            todos={remoteTodos}
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
