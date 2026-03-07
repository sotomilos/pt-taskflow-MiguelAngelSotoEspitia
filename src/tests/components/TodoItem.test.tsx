import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
    expect(dialog).toHaveTextContent("Watch a documentary");
    expect(within(dialog).getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: /sí, eliminar/i }),
    ).toBeInTheDocument();
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

  it("usa title como fallback y muestra estado completada", () => {
    const todoWithTitle = {
      id: 8,
      title: "Read docs",
      completed: true,
      userId: 1,
    } as unknown as Todo;

    render(<TodoItem todo={todoWithTitle} />);

    expect(screen.getByText("Read docs")).toBeInTheDocument();
    expect(screen.getByText("Completada")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /cambiar estado de read docs/i }),
    ).toHaveAttribute("aria-checked", "true");
  });

  it("cierra el diálogo al cancelar", async () => {
    const user = userEvent.setup();

    render(<TodoItem todo={todo} onDelete={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: /eliminar watch a documentary/i }),
    );

    const dialog = screen.getByRole("dialog", { name: /eliminar tarea/i });

    await user.click(within(dialog).getByRole("button", { name: /cancelar/i }));

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /eliminar tarea/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("confirma la eliminación con el id correcto y cierra el diálogo", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn().mockResolvedValue(undefined);

    render(<TodoItem todo={todo} onDelete={onDelete} />);

    await user.click(
      screen.getByRole("button", { name: /eliminar watch a documentary/i }),
    );

    const dialog = screen.getByRole("dialog", { name: /eliminar tarea/i });

    await user.click(within(dialog).getByRole("button", { name: /sí, eliminar/i }));

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith(7);
    });

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: /eliminar tarea/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("no ejecuta acciones cuando está disabled", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onDelete = vi.fn();

    render(<TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} disabled />);

    const checkbox = screen.getByRole("checkbox", {
      name: /cambiar estado de watch a documentary/i,
    });

    const deleteButton = screen.getByRole("button", {
      name: /eliminar watch a documentary/i,
    });

    expect(checkbox).toBeDisabled();
    expect(deleteButton).toBeDisabled();

    await user.click(checkbox);
    await user.click(deleteButton);

    expect(onToggle).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("dialog", { name: /eliminar tarea/i }),
    ).not.toBeInTheDocument();
  });
});
