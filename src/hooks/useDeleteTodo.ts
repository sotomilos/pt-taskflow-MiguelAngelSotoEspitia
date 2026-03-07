import { useCallback, useState } from "react";
import { deleteTodo } from "@/lib/api";
import { useTodosStore } from "@/store/todosStore";
import { useToastStore } from "@/store/toastStore";
import type { TodoId } from "@/types/todo";

function errMsg(e: unknown) {
  if (e instanceof Error) return e.message;
  return "Error";
}

export function useDeleteTodo() {
  const markDeleted = useTodosStore((s) => s.markDeleted);
  const unmarkDeleted = useTodosStore((s) => s.unmarkDeleted);
  const purgeTodo = useTodosStore((s) => s.purgeTodo);

  const [deleting, setDeleting] = useState<Record<number, true>>({});
  const [error, setError] = useState("");

  const remove = useCallback(
    async (id: TodoId) => {
      // Evita doble click
      if (deleting[id]) return;

      setError("");

      // 1) Optimistic: lo ocultamos ya (sin esperar API)
      markDeleted(id);

      // Si es local (id negativo), NO llamamos API. Lo removemos del store.
      if (id < 0) {
        purgeTodo(id);

        useToastStore.getState().push({
          variant: "success",
          title: "Tarea eliminada",
          description: `ID #${id}`,
          duration: 2200,
        });

        return;
      }

      setDeleting((m) => ({ ...m, [id]: true }));
      try {
        // 2) DELETE real
        await deleteTodo(id);

        // 3) Limpieza: lo removemos definitivamente del store
        purgeTodo(id);

        useToastStore.getState().push({
          variant: "success",
          title: "Tarea eliminada",
          description: `ID #${id}`,
          duration: 2200,
        });
      } catch (e) {
        // Rollback: lo volvemos a mostrar
        unmarkDeleted(id);

        const msg = errMsg(e);
        setError(msg);

        useToastStore.getState().push({
          variant: "error",
          title: "No se pudo eliminar",
          description: msg,
        });
      } finally {
        setDeleting((m) => {
          const next = { ...m };
          delete next[id];
          return next;
        });
      }
    },
    [deleting, markDeleted, purgeTodo, unmarkDeleted],
  );

  return {
    remove,
    deleting,
    error,
    clearError: () => setError(""),
  };
}