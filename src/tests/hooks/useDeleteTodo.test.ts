import { act, renderHook } from "@testing-library/react";
import { useDeleteTodo } from "@/hooks/useDeleteTodo";
import { useTodosStore } from "@/store/todosStore";
import { resetTodosStore } from "@/test/resetStores";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { deleteTodoMock, pushMock } = vi.hoisted(() => ({
  deleteTodoMock: vi.fn(),
  pushMock: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  deleteTodo: deleteTodoMock,
}));

vi.mock("@/store/toastStore", () => ({
  useToastStore: {
    getState: () => ({
      push: pushMock,
    }),
  },
}));

describe("useDeleteTodo", () => {
  beforeEach(() => {
    resetTodosStore();
    deleteTodoMock.mockReset();
    pushMock.mockReset();
  });

  it("elimina una tarea remota y usa el nombre en el toast", async () => {
    useTodosStore.setState({
      ...useTodosStore.getState(),
      byId: {
        4: {
          id: 4,
          todo: "Watch a documentary",
          completed: false,
          userId: 1,
        },
      },
      pages: { 1: [4] },
    });

    deleteTodoMock.mockResolvedValue({
      id: 4,
      todo: "Watch a documentary",
      completed: false,
      userId: 1,
      isDeleted: true,
    });

    const { result } = renderHook(() => useDeleteTodo());

    await act(async () => {
      await result.current.remove(4);
    });

    expect(deleteTodoMock).toHaveBeenCalledWith(4);
    expect(useTodosStore.getState().byId[4]).toBeUndefined();

    expect(pushMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: "success",
        title: "Tarea eliminada",
        description: "Watch a documentary",
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

    const { result } = renderHook(() => useDeleteTodo());

    await act(async () => {
      await result.current.remove(-1);
    });

    expect(deleteTodoMock).not.toHaveBeenCalled();
    expect(useTodosStore.getState().byId[-1]).toBeUndefined();

    expect(pushMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: "success",
        title: "Tarea eliminada",
        description: "Escribir tests",
      }),
    );
  });

  it("revierte el soft delete si falla la API", async () => {
    useTodosStore.setState({
      ...useTodosStore.getState(),
      byId: {
        4: {
          id: 4,
          todo: "Watch a documentary",
          completed: false,
          userId: 1,
        },
      },
      pages: { 1: [4] },
    });

    deleteTodoMock.mockRejectedValue(new Error("DELETE failed"));

    const { result } = renderHook(() => useDeleteTodo());

    await act(async () => {
      await result.current.remove(4);
    });

    expect(useTodosStore.getState().byId[4]).toBeDefined();
    expect(useTodosStore.getState().deletedIds[4]).toBeUndefined();
    expect(result.current.error).toBe("DELETE failed");

    expect(pushMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: "error",
        title: "No se pudo eliminar",
        description: "DELETE failed",
      }),
    );
  });
});
