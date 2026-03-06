import { env } from "@/lib/env";
import type {
  CreateTodoInput,
  DeleteTodoResponse,
  Todo,
  TodoId,
  TodoListResponse,
  UpdateTodoInput,
} from "@/types/todo";

const BASE_URL = env.API_BASE_URL.replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function safeJson(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...init,
    headers,
    // evitar cache para desarrollo (DummyJSON no tiene ETag ni similar, y así se ven los cambios al instante)
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await safeJson(res);
    const msg =
      (typeof data === "object" &&
        data &&
        "message" in data &&
        typeof (data as any).message === "string" &&
        (data as any).message) ||
      `Request failed (${res.status})`;

    throw new ApiError(res.status, msg, data);
  }

  // DummyJSON a veces responde con 200 OK pero sin JSON válido (ej. DELETE /todos/{id}), así que no asumir que siempre se puede parsear    
  const data = await safeJson(res);
  return data as T;
}

/** GET /todos?limit=10&skip=0 */
export function getTodos(params: { limit?: number; skip?: number } = {}) {
  const limit = params.limit ?? 10;
  const skip = params.skip ?? 0;
  return request<TodoListResponse>(`/todos?limit=${limit}&skip=${skip}`);
}

/** Helper por página (10 por defecto) */
export async function getTodosPage(page: number, limit = 10) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const skip = (safePage - 1) * limit;
  return getTodos({ limit, skip });
}

/** POST /todos/add */
export function createTodo(input: CreateTodoInput) {
  const body = {
    todo: input.todo,
    completed: input.completed ?? false,
    userId: input.userId ?? 1,
  };

  return request<Todo>("/todos/add", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** PATCH /todos/{id} */
export function updateTodo(id: TodoId, patch: UpdateTodoInput) {
  return request<Todo>(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

/** DELETE /todos/{id} */
export function deleteTodo(id: TodoId) {
  return request<DeleteTodoResponse>(`/todos/${id}`, {
    method: "DELETE",
  });
}