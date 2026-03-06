// src/store/todosStore.ts
import { create } from "zustand";
import type { Todo, TodoId, TodoListResponse } from "@/types/todo";

type PageNumber = number;

interface TodosState {
  // Datos en memoria (API + local)
  byId: Record<number, Todo>;

  // IDs creados localmente (usamos IDs negativos para no chocar con la API)
  localIds: number[];
  tempId: number;

  // Cache por página (solo IDs de API)
  pages: Record<PageNumber, number[]>;

  // Para que un refetch no pise cambios locales
  touchedIds: Record<number, true>;

  // Soft-delete (solo ocultar en UI). Permite "undo" si falla el DELETE.
  deletedIds: Record<number, true>;

  apiTotal: number;
  limit: number;

  upsertPage: (page: number, resp: TodoListResponse) => void;
  addLocal: (text: string) => Todo;
  patchTodo: (id: TodoId, patch: Partial<Todo>) => void;

  markDeleted: (id: TodoId) => void;
  unmarkDeleted: (id: TodoId) => void;

  // Para rollback total de un local creado si falla el POST
  purgeTodo: (id: TodoId) => void;
}

export const useTodosStore = create<TodosState>((set, get) => ({
  byId: {},
  localIds: [],
  tempId: -1,

  pages: {},
  touchedIds: {},
  deletedIds: {},

  apiTotal: 0,
  limit: 10,

  upsertPage: (page, resp) => {
    set((state) => {
      const nextById = { ...state.byId };

      for (const t of resp.todos) {
        // Si el usuario ya tocó ese "todo" (toggle), no se va a sobreescribir con refetch
        if (!state.touchedIds[t.id]) nextById[t.id] = t;
        // Si no existe aún, se guarda igual
        if (!nextById[t.id]) nextById[t.id] = t;
      }

      return {
        byId: nextById,
        pages: { ...state.pages, [page]: resp.todos.map((t) => t.id) },
        apiTotal: resp.total,
        limit: resp.limit ?? state.limit,
      };
    });
  },

  addLocal: (text) => {
    const id = get().tempId;
    const todo: Todo = {
      id,
      todo: text.trim(),
      completed: false,
      userId: 1,
    };

    set((state) => ({
      byId: { ...state.byId, [id]: todo },
      localIds: [id, ...state.localIds],
      tempId: id - 1,
    }));

    return todo;
  },

  patchTodo: (id, patch) => {
    set((state) => {
      const current = state.byId[id];
      if (!current) return state;

      return {
        byId: {
          ...state.byId,
          [id]: { ...current, ...patch },
        },
        touchedIds: { ...state.touchedIds, [id]: true },
      };
    });
  },

  markDeleted: (id) => {
    set((state) => ({
      deletedIds: { ...state.deletedIds, [id]: true },
    }));
  },

  unmarkDeleted: (id) => {
    set((state) => {
      const next = { ...state.deletedIds };
      delete next[id];
      return { deletedIds: next };
    });
  },

  purgeTodo: (id) => {
    set((state) => {
      const byId = { ...state.byId };
      delete byId[id];

      const touchedIds = { ...state.touchedIds };
      delete touchedIds[id];

      const deletedIds = { ...state.deletedIds };
      delete deletedIds[id];

      const pages: Record<number, number[]> = {};
      for (const [p, ids] of Object.entries(state.pages)) {
        pages[Number(p)] = ids.filter((x) => x !== id);
      }

      return {
        byId,
        touchedIds,
        deletedIds,
        pages,
        localIds: state.localIds.filter((x) => x !== id),
      };
    });
  },
}));
