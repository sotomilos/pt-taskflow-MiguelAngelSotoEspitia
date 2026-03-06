export type TodoId = number;

export interface Todo {
  id: TodoId;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodoListResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

/** Payload para crear (DummyJSON usa /todos/add) */
export interface CreateTodoInput {
  todo: string;
  completed?: boolean;
  userId?: number;
}

/** Payload para actualizar (DummyJSON usa PATCH /todos/{id}) */
export interface UpdateTodoInput {
  todo?: string;
  completed?: boolean;
}

/** Respuesta típica al borrar (DummyJSON marca flags adicionales) */
export interface DeleteTodoResponse extends Todo {
  isDeleted?: boolean;
  deletedOn?: string;
}