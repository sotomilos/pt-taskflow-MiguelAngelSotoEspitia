import { beforeEach, describe, expect, it } from "vitest";
import { resetTodosStore } from "@/test/resetStores";
import { useTodosStore } from "@/store/todosStore";

describe("todosStore", () => {
  beforeEach(() => {
    resetTodosStore();
  });

  it("addLocal crea una tarea local con id negativo y texto limpio", () => {
    const todo = useTodosStore.getState().addLocal("  Nueva tarea  ");
    const state = useTodosStore.getState();

    expect(todo).toEqual({
      id: -1,
      todo: "Nueva tarea",
      completed: false,
      userId: 1,
    });

    expect(state.byId[-1]).toEqual(todo);
    expect(state.localIds).toEqual([-1]);
    expect(state.tempId).toBe(-2);
  });

  it("upsertPage guarda la página y actualiza total y limit", () => {
    useTodosStore.getState().upsertPage(1, {
      todos: [
        { id: 1, todo: "Todo 1", completed: false, userId: 1 },
        { id: 2, todo: "Todo 2", completed: true, userId: 1 },
      ],
      total: 20,
      skip: 0,
      limit: 10,
    });

    const state = useTodosStore.getState();

    expect(state.byId[1].todo).toBe("Todo 1");
    expect(state.byId[2].todo).toBe("Todo 2");
    expect(state.pages[1]).toEqual([1, 2]);
    expect(state.apiTotal).toBe(20);
    expect(state.limit).toBe(10);
  });

  it("upsertPage no sobreescribe un todo tocado localmente", () => {
    useTodosStore.setState({
      byId: {
        1: { id: 1, todo: "Cambio local", completed: true, userId: 1 },
      },
      touchedIds: { 1: true },
    });

    useTodosStore.getState().upsertPage(1, {
      todos: [{ id: 1, todo: "Dato API", completed: false, userId: 1 }],
      total: 1,
      skip: 0,
      limit: 10,
    });

    const state = useTodosStore.getState();

    expect(state.byId[1]).toEqual({
      id: 1,
      todo: "Cambio local",
      completed: true,
      userId: 1,
    });
    expect(state.pages[1]).toEqual([1]);
  });

  it("patchTodo actualiza un todo existente y lo marca como tocado", () => {
    useTodosStore.setState({
      byId: {
        5: { id: 5, todo: "Original", completed: false, userId: 1 },
      },
    });

    useTodosStore.getState().patchTodo(5, {
      completed: true,
      todo: "Actualizado",
    });

    const state = useTodosStore.getState();

    expect(state.byId[5]).toEqual({
      id: 5,
      todo: "Actualizado",
      completed: true,
      userId: 1,
    });

    expect(state.touchedIds[5]).toBe(true);
  });

  it("patchTodo no cambia el estado si el todo no existe", () => {
    const prevState = useTodosStore.getState();

    useTodosStore.getState().patchTodo(999, { completed: true });

    const nextState = useTodosStore.getState();

    expect(nextState).toEqual(prevState);
  });

  it("markDeleted y unmarkDeleted gestionan deletedIds", () => {
    useTodosStore.getState().markDeleted(3);
    expect(useTodosStore.getState().deletedIds[3]).toBe(true);

    useTodosStore.getState().unmarkDeleted(3);
    expect(useTodosStore.getState().deletedIds[3]).toBeUndefined();
  });

  it("purgeTodo elimina el todo de byId, localIds, touchedIds, deletedIds y pages", () => {
    useTodosStore.setState({
      byId: {
        1: { id: 1, todo: "API todo", completed: false, userId: 1 },
        [-1]: { id: -1, todo: "Local todo", completed: false, userId: 1 },
      },
      localIds: [-1],
      touchedIds: { [-1]: true },
      deletedIds: { [-1]: true },
      pages: {
        1: [1, -1],
        2: [-1],
      },
    });

    useTodosStore.getState().purgeTodo(-1);

    const state = useTodosStore.getState();

    expect(state.byId[-1]).toBeUndefined();
    expect(state.localIds).toEqual([]);
    expect(state.touchedIds[-1]).toBeUndefined();
    expect(state.deletedIds[-1]).toBeUndefined();
    expect(state.pages[1]).toEqual([1]);
    expect(state.pages[2]).toEqual([]);
  });
});
