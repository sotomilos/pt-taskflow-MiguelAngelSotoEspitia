import { render, screen } from "@testing-library/react";
import { TodoList } from "@/components/TodoList";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Todo } from "@/types/todo";

describe("TodoList", () => {
  const todos: Todo[] = [
    { id: 1, todo: "Tarea 1", completed: false, userId: 1 },
    { id: 2, todo: "Tarea 2", completed: true, userId: 1 },
  ];

  it("no muestra el contador repetido en el encabezado", () => {
    render(<TodoList title="Tareas disponibles" todos={todos} />);

    expect(screen.getByText("Tareas disponibles")).toBeInTheDocument();
    expect(screen.queryByText(/2 items/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/2 item/i)).not.toBeInTheDocument();
  });

  it("muestra empty state cuando no hay tareas", () => {
    render(<TodoList title="Tareas disponibles" todos={[]} />);

    expect(screen.getByText("No hay tareas para mostrar")).toBeInTheDocument();
  });
});