import { useCallback, useState } from "react";
import { updateTodo } from "@/lib/api";
import { useTodosStore } from "@/store/todosStore";
import type { TodoId } from "@/types/todo";

function errMsg(e: unknown) {
  if (e instanceof Error) return e.message;
  return "Error";
}

export function useToggleTodo() {
  const patchTodo = useTodosStore((s) => s.patchTodo);

  const [toggling, setToggling] = useState<Record<number, true>>({});
  const [error, setError] = useState("");

  const toggle = useCallback(
    async (id: TodoId) => {
      const current = useTodosStore.getState().byId[id];
      if (!current) return;

      const nextCompleted = !current.completed;
      const prevCompleted = current.completed;

      setError("");
      patchTodo(id, { completed: nextCompleted });

      // Si es local (id negativo), no hacemos PATCH a la API
      if (id < 0) return;

      setToggling((m) => ({ ...m, [id]: true }));
      try {
        await updateTodo(id, { completed: nextCompleted });
      } catch (e) {
        // rollback
        patchTodo(id, { completed: prevCompleted });
        setError(errMsg(e));
      } finally {
        setToggling((m) => {
          const next = { ...m };
          delete next[id];
          return next;
        });
      }
    },
    [patchTodo],
  );

  return {
    toggle,
    toggling,
    error,
    clearError: () => setError(""),
  };
}
