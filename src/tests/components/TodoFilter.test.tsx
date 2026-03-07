import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { TodoFilter } from "@/components/TodoFilter";

describe("TodoFilter", () => {
  it("renderiza los tres filtros sin mostrar conteos", () => {
    render(<TodoFilter value="all" onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Todas" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Completadas" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pendientes" })).toBeInTheDocument();

    expect(screen.queryByText("10")).not.toBeInTheDocument();
    expect(screen.queryByText("5")).not.toBeInTheDocument();
  });

  it("llama onChange con el filtro correcto", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TodoFilter value="all" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Completadas" }));

    expect(onChange).toHaveBeenCalledWith("completed");
  });

  it("marca aria-pressed en el filtro activo", () => {
    render(<TodoFilter value="pending" onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Pendientes" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    expect(screen.getByRole("button", { name: "Todas" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
