import { act, renderHook } from "@testing-library/react";
import { useToggleTodo } from "@/hooks/useToggleTodo";
import { useTodosStore } from "@/store/todosStore";
import { resetTodosStore } from "@/test/resetStores";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { updateTodoMock, pushMock } = vi.hoisted(() => ({
  updateTodoMock: vi.fn(),
  pushMock: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  updateTodo: updateTodoMock,
}));

vi.mock("@/store/toastStore", () => ({
  useToastStore: {
    getState: () => ({
      push: pushMock,
    }),
  },
}));

describe("useToggleTodo", () => {
  beforeEach(() => {
    resetTodosStore();
    updateTodoMock.mockReset();
    pushMock.mockReset();
  });

  it("hace toggle optimista y usa el nombre de la tarea en el toast", async () => {
    useTodosStore.setState({
      ...useTodosStore.getState(),
      byId: {
        1: {
          id: 1,
          todo: "Watch a documentary",
          completed: false,
          userId: 1,
        },
      },
    });

    updateTodoMock.mockResolvedValue({
      id: 1,
      todo: "Watch a documentary",
      completed: true,
      userId: 1,
    });

    const { result } = renderHook(() => useToggleTodo());

    await act(async () => {
      await result.current.toggle(1);
    });

    expect(updateTodoMock).toHaveBeenCalledWith(1, { completed: true });
    expect(useTodosStore.getState().byId[1].completed).toBe(true);

    expect(pushMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: "success",
        title: "Marcada como completada",
        description: "Watch a documentary",
      }),
    );
  });

  it("hace rollback si falla la API", async () => {
    useTodosStore.setState({
      ...useTodosStore.getState(),
      byId: {
        1: {
          id: 1,
          todo: "Watch a documentary",
          completed: false,
          userId: 1,
        },
      },
    });

    updateTodoMock.mockRejectedValue(new Error("PATCH failed"));

    const { result } = renderHook(() => useToggleTodo());

    await act(async () => {
      await result.current.toggle(1);
    });

    expect(useTodosStore.getState().byId[1].completed).toBe(false);
    expect(result.current.error).toBe("PATCH failed");

    expect(pushMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: "error",
        title: "No se pudo actualizar",
        description: "PATCH failed",
      }),
    );
  });

  it("no llama la API para tareas locales", async () => {
    useTodosStore.setState({
      ...useTodosStore.getState(),
      byId: {
        [-1]: {
          id: -1,
          todo: "Escribir tests",
          completed: false,
          userId: 1,
        },
      },
      localIds: [-1],
    });

    const { result } = renderHook(() => useToggleTodo());

    await act(async () => {
      await result.current.toggle(-1);
    });

    expect(updateTodoMock).not.toHaveBeenCalled();
    expect(useTodosStore.getState().byId[-1].completed).toBe(true);

    expect(pushMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: "success",
        description: "Escribir tests",
      }),
    );
  });
});