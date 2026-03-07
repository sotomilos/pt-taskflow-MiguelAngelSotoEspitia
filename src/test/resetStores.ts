import { useTodosStore } from "@/store/todosStore";

export function resetTodosStore() {
  const current = useTodosStore.getState();

  useTodosStore.setState(
    {
      ...current,
      byId: {},
      localIds: [],
      tempId: -1,
      pages: {},
      touchedIds: {},
      deletedIds: {},
      apiTotal: 0,
      limit: 10,
    },
    true,
  );
}
