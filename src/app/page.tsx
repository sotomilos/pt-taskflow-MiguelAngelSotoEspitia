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
  const [filter, setFilter] = useState<TodoFilterValue>("all");

  const { localTodos, remoteTodos, totalPages, loading, error, retry } =
    useTodosPage(page);

  const hasLocal = useMemo(() => localTodos.length > 0, [localTodos.length]);

  const { create, creating, error: createError } = useCreateTodo();

  const {
    toggle,
    toggling,
    error: toggleError,
    clearError: clearToggleError,
  } = useToggleTodo();

  const {
    remove,
    deleting,
    error: deleteError,
    clearError: clearDeleteError,
  } = useDeleteTodo();

  const filteredLocalTodos = useMemo(() => {
    if (filter === "all") return localTodos;
    if (filter === "completed") return localTodos.filter((t) => t.completed);
    return localTodos.filter((t) => !t.completed);
  }, [filter, localTodos]);

  const filteredRemoteTodos = useMemo(() => {
    if (filter === "all") return remoteTodos;
    if (filter === "completed") return remoteTodos.filter((t) => t.completed);
    return remoteTodos.filter((t) => !t.completed);
  }, [filter, remoteTodos]);

  const counts = useMemo(() => {
    const shown = [...localTodos, ...remoteTodos];
    const completed = shown.filter((t) => t.completed).length;

    return {
      all: shown.length,
      completed,
      pending: shown.length - completed,
    };
  }, [localTodos, remoteTodos]);

  const totalVisible = filteredLocalTodos.length + filteredRemoteTodos.length;

  return (
    <main className="container-page">
      <div className="space-y-6">
        <section className="page-shell p-5 md:p-7">
          <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="eyebrow">Task management demo</span>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
                  TaskFlow
                </h1>
                <p className="subtitle max-w-xl">
                  Administra tareas con paginación, optimistic UI, estado local
                  y una experiencia visual más moderna, clara y profesional.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="chip">Next.js</span>
                <span className="chip">TypeScript</span>
                <span className="chip">Optimistic UI</span>
              </div>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="surface-muted p-4">
                <p className="text-sm text-white/60">Tareas visibles</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {totalVisible}
                </p>
              </div>

              <div className="surface-muted p-4">
                <p className="text-sm text-white/60">Página actual</p>
                <p className="mt-2 text-2xl font-semibold text-white">{page}</p>
              </div>

              <div className="surface-muted p-4">
                <p className="text-sm text-white/60">Fuente remota</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  DummyJSON
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="surface p-4 md:p-5">
          <div className="section-header">
            <div>
              <h2 className="title">Filtrar tareas</h2>
              <p className="subtitle">
                El filtrado es local y no dispara nuevas peticiones.
              </p>
            </div>
            <span className="chip">{counts.all} totales</span>
          </div>

          <TodoFilter value={filter} onChange={setFilter} counts={counts} />
        </section>

        <section className="surface p-4 md:p-5">
          <div className="section-header">
            <div>
              <h2 className="title">Crear tarea</h2>
              <p className="subtitle">
                Las nuevas tareas se reflejan primero en UI para una experiencia
                más ágil.
              </p>
            </div>
            <span className="chip">Estado local</span>
          </div>

          <CreateTodoForm
            onCreate={create}
            creating={creating}
            error={createError}
          />
        </section>

        {toggleError ? (
          <section className="surface p-4 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  No se pudo actualizar el estado.
                </p>
                <p className="mt-1 text-sm text-white/70">{toggleError}</p>
              </div>

              <button onClick={clearToggleError} className="btn-secondary">
                Cerrar
              </button>
            </div>
          </section>
        ) : null}

        {deleteError ? (
          <section className="surface p-4 md:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  No se pudo eliminar la tarea.
                </p>
                <p className="mt-1 text-sm text-white/70">{deleteError}</p>
              </div>

              <button onClick={clearDeleteError} className="btn-secondary">
                Cerrar
              </button>
            </div>
          </section>
        ) : null}

        {loading && <LoadingState />}

        {!loading && error && <ErrorState message={error} onRetry={retry} />}

        {!loading && !error && (
          <div className="space-y-6">
            {hasLocal && (
              <TodoList
                title="Creadas por ti"
                todos={filteredLocalTodos}
                onToggle={toggle}
                onDelete={remove}
                toggling={toggling}
                deleting={deleting}
              />
            )}

            <TodoList
              title="Tareas disponibles"
              todos={filteredRemoteTodos}
              onToggle={toggle}
              onDelete={remove}
              toggling={toggling}
              deleting={deleting}
            />

            <section className="surface p-4 md:p-5">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </section>
          </div>
        )}
      </div>
    </main>
  );
}