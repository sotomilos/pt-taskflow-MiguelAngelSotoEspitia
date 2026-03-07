import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "@/components/ConfirmDialog";

describe("ConfirmDialog", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    vi.clearAllMocks();
  });

  const baseProps = {
    title: "Eliminar tarea",
    description: 'Esta acción eliminará la tarea "Watch a documentary".',
    confirmText: "Sí, eliminar",
    cancelText: "Cancelar",
    onConfirm: vi.fn(),
    onClose: vi.fn(),
  };

  it("no renderiza nada cuando open es false", () => {
    render(<ConfirmDialog {...baseProps} open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renderiza título, descripción y botones cuando está abierto", () => {
    render(<ConfirmDialog {...baseProps} open />);
    expect(screen.getByRole("dialog", { name: /eliminar tarea/i })).toBeInTheDocument();
    expect(screen.getByText(/watch a documentary/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sí, eliminar/i })).toBeInTheDocument();
  });

  it("llama onClose al hacer click en cancelar", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ConfirmDialog {...baseProps} open onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("llama onConfirm al hacer click en confirmar", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();

    render(<ConfirmDialog {...baseProps} open onConfirm={onConfirm} />);

    await user.click(screen.getByRole("button", { name: /sí, eliminar/i }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("cierra al hacer click en el overlay cuando no está loading", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ConfirmDialog {...baseProps} open onClose={onClose} />);

    const dialog = screen.getByRole("dialog", { name: /eliminar tarea/i });
    const overlay = dialog.parentElement;

    expect(overlay).not.toBeNull();

    if (!overlay) throw new Error("No se encontró el overlay");

    await user.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("no cierra al hacer click dentro del panel", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ConfirmDialog {...baseProps} open onClose={onClose} />);

    await user.click(screen.getByRole("dialog", { name: /eliminar tarea/i }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("cierra con Escape cuando no está loading", () => {
    const onClose = vi.fn();

    render(<ConfirmDialog {...baseProps} open onClose={onClose} />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("no cierra con Escape ni con overlay cuando loading es true", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmDialog
        {...baseProps}
        open
        loading
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    const dialog = screen.getByRole("dialog", { name: /eliminar tarea/i });
    const overlay = dialog.parentElement;

    expect(screen.getByRole("button", { name: /cancelar/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /eliminando/i })).toBeDisabled();

    fireEvent.keyDown(window, { key: "Escape" });

    if (!overlay) throw new Error("No se encontró el overlay");

    await user.click(overlay);

    expect(onClose).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("restaura el overflow previo del body al desmontarse", async () => {
    document.body.style.overflow = "auto";

    const { unmount } = render(<ConfirmDialog {...baseProps} open />);

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    await waitFor(() => {
      expect(document.body.style.overflow).toBe("auto");
    });
  });
});
