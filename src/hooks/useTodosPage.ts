// src/hooks/useTodosPage.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { getTodosPage } from "@/lib/api";
import { useTodosStore } from "@/store/todosStore";
import type { Todo } from "@/types/todo";

function errMsg(e: unknown) {
  if (e instanceof Error) return e.message;
  return "Error";
}

export function useTodosPage(page: number) {
  const upsertPage = useTodosStore((s) => s.upsertPage);
  const byId = useTodosStore((s) => s.byId);
  const pages = useTodosStore((s) => s.pages);
  const deletedIds = useTodosStore((s) => s.deletedIds);
  const apiTotal = useTodosStore((s) => s.apiTotal);
  const limit = useTodosStore((s) => s.limit);
  const localIds = useTodosStore((s) => s.localIds);

  const pageIds = pages[page];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const resp = await getTodosPage(page, limit);
      upsertPage(page, resp);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [page, limit, upsertPage]);

  useEffect(() => {
    if (!pageIds) fetchPage();
  }, [pageIds, fetchPage]);

  const localTodos = useMemo(() => {
    return localIds
      .map((id) => byId[id])
      .filter(Boolean)
      .filter((t) => !deletedIds[t.id]) as Todo[];
  }, [localIds, byId, deletedIds]);

  const remoteTodos = useMemo(() => {
    return (pageIds ?? [])
      .map((id) => byId[id])
      .filter(Boolean)
      .filter((t) => !deletedIds[t.id]) as Todo[];
  }, [pageIds, byId, deletedIds]);

  const totalPages = Math.max(1, Math.ceil(apiTotal / limit));

  return {
    localTodos, // creados localmente (los mostraremos arriba)
    remoteTodos, // los 10 de la página
    totalPages,
    loading,
    error,
    retry: fetchPage,
  };
}
