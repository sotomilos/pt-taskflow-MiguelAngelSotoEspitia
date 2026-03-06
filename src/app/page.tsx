"use client";

import { useMemo, useState } from "react";
import { useTodosPage } from "@/hooks/useTodosPage";
import { TodoList } from "@/components/TodoList";
import { Pagination } from "@/components/Pagination";
import { ErrorState, LoadingState } from "@/components/States";

export default function HomePage() {
  const [page, setPage] = useState(1);

  const { localTodos, remoteTodos, totalPages, loading, error, retry } =
    useTodosPage(page);

  // Mostramos locales arriba para que el usuario vea lo que creó “persistente” en UI
  const hasLocal = useMemo(() => localTodos.length > 0, [localTodos.length]);

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <header className="rounded-2xl border bg-white/50 p-4">
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
          {hasLocal && <TodoList title="Creadas por ti (local)" todos={localTodos} />}

          <TodoList title="Tareas (DummyJSON)" todos={remoteTodos} />

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
