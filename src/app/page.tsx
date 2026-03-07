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

  const visibleTodos = useMemo(
    () => [...filteredLocalTodos, ...filteredRemoteTodos],
    [filteredLocalTodos, filteredRemoteTodos]
  );

  const totalVisible = visibleTodos.length;
  const progress = counts.all ? Math.round((counts.completed / counts.all) * 100) : 0;

  return (
    <main className="container-page">
      <div className="space-y-8">
        <section className="page-shell px-5 py-6 md:px-8 md:py-8">
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <span className="eyebrow">Organiza tu día</span>

                <div className="space-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                    TaskFlow
                  </h1>

                  <p className="subtitle max-w-2xl text-base md:text-lg">
                    Crea tareas, mantén el control de tus pendientes y avanza con
                    claridad en un espacio simple, limpio y enfocado.
                  </p>
                </div>
              </div>

              <div className="surface-muted min-w-[280px] p-5 md:p-6">
                <p className="text-sm text-white/60">Progreso general</p>

                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-semibold text-white">{progress}%</p>
                    <p className="mt-1 text-sm text-white/60">
                      {counts.completed} completadas de {counts.all}
                    </p>
                  </div>

                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70">
                    Página {page} de {totalPages}
                  </div>
                </div>
              </div>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="surface-muted p-5">
                <p className="text-sm text-white/60">Tareas visibles</p>
                <p className="mt-2 text-2xl font-semibold text-white">{totalVisible}</p>
              </div>

              <div className="surface-muted p-5">
                <p className="text-sm text-white/60">Completadas</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {counts.completed}
                </p>
              </div>

              <div className="surface-muted p-5">
                <p className="text-sm text-white/60">Pendientes</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {counts.pending}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="surface px-5 py-5 md:px-6 md:py-6">
            <div className="section-header">
              <div className="space-y-2">
                <h2 className="title">Ver tareas</h2>
                <p className="section-copy">
                  Elige la vista que necesitas para enfocarte en lo importante.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <TodoFilter value={filter} onChange={setFilter} counts={counts} />
            </div>
          </section>

          <section className="surface px-5 py-5 md:px-6 md:py-6">
            <div className="section-header">
              <div className="space-y-2">
                <h2 className="title">Nueva tarea</h2>
                <p className="section-copy">
                  Añade un pendiente claro y accionable para empezar de inmediato.
                </p>
              </div>
            </div>

            <div className="mt-5">
              <CreateTodoForm
                onCreate={create}
                creating={creating}
                error={createError}
              />
            </div>
          </section>
        </div>

        {toggleError ? (
          <section className="surface px-5 py-5 md:px-6 md:py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  No pudimos actualizar la tarea.
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
          <section className="surface px-5 py-5 md:px-6 md:py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">
                  No pudimos eliminar la tarea.
                </p>
                <p className="mt-1 text-sm text-white/70">{deleteError}</p>
              </div>

              <button onClick={clearDeleteError} className="btn-secondary">
                Cerrar
              </button>
            </div>
          </section>
        ) : null}

        {loading ? (
          <section className="surface px-5 py-5 md:px-6 md:py-6">
            <LoadingState />
          </section>
        ) : null}

        {!loading && error ? (
          <section className="surface px-5 py-5 md:px-6 md:py-6">
            <ErrorState message={error} onRetry={retry} />
          </section>
        ) : null}

        {!loading && !error ? (
          <div className="space-y-6">
            <TodoList
              title="Tus tareas"
              todos={visibleTodos}
              onToggle={toggle}
              onDelete={remove}
              toggling={toggling}
              deleting={deleting}
            />

            {totalPages > 1 ? (
              <section className="surface px-5 py-5 md:px-6 md:py-6">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPrev={() => setPage((p) => Math.max(1, p - 1))}
                  onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                />
              </section>
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}