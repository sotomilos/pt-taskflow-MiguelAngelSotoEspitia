import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "@/components/TodoItem";
import type { Todo } from "@/types/todo";

describe("TodoItem", () => {
  const todo: Todo = {
    id: 7,
    todo: "Watch a documentary",
    completed: false,
    userId: 1,
  };

  it("no muestra el ID en la UI", () => {
    render(<TodoItem todo={todo} />);

    expect(screen.getByText("Watch a documentary")).toBeInTheDocument();
    expect(screen.queryByText(/ID\s*#/i)).not.toBeInTheDocument();
  });

  it("muestra el nombre de la tarea en el diálogo de confirmación", async () => {
    const user = userEvent.setup();

    render(<TodoItem todo={todo} onDelete={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: /eliminar watch a documentary/i }),
    );

    const dialog = screen.getByRole("dialog", { name: /eliminar tarea/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(
      '¿Seguro que quieres eliminar "Watch a documentary"?',
    );
  });

  it("llama onToggle con el id correcto", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    render(<TodoItem todo={todo} onToggle={onToggle} />);

    await user.click(
      screen.getByRole("checkbox", {
        name: /cambiar estado de watch a documentary/i,
      }),
    );

    expect(onToggle).toHaveBeenCalledWith(7);
  });
});
