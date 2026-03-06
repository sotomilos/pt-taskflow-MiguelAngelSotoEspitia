import { useCallback, useState } from "react";
import { createTodo } from "@/lib/api";
import { useTodosStore } from "@/store/todosStore";

function errMsg(e: unknown) {
  if (e instanceof Error) return e.message;
  return "Error";
}

export function useCreateTodo() {
  const addLocal = useTodosStore((s) => s.addLocal);
  const purgeTodo = useTodosStore((s) => s.purgeTodo);

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const create = useCallback(
    async (text: string): Promise<boolean> => {
      const trimmed = text.trim();
      if (!trimmed) return false;

      setError("");
      setCreating(true);

      // 1) Optimistic: lo guardamos en local (la API no persiste)
      const local = addLocal(trimmed);

      try {
        // 2) POST real a la API (aunque no persiste, sirve para simular latencia y posibles errores)
        await createTodo({ todo: trimmed, completed: false, userId: 1 });

        // Nota: no reemplazamos el id local por el id de la API
        // porque la API no persiste; nuestro source of truth es el store local.
        return true;
      } catch (e) {
        // 3) Rollback si falla
        purgeTodo(local.id);
        setError(errMsg(e));
        return false;
      } finally {
        setCreating(false);
      }
    },
    [addLocal, purgeTodo],
  );

  return {
    create,
    creating,
    error,
    clearError: () => setError(""),
  };
}
