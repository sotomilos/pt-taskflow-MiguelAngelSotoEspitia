"use client";

import { useState } from "react";

type CreateTodoFormProps = {
  onCreate: (text: string) => Promise<boolean>;
  creating: boolean;
  error?: string;
};

export function CreateTodoForm({
  onCreate,
  creating,
  error,
}: CreateTodoFormProps) {
  const [text, setText] = useState("");

  return (
    <div className="space-y-4">
      <form
        className="flex flex-col gap-4 sm:flex-row sm:items-start"
        onSubmit={async (e) => {
          e.preventDefault();

          const trimmed = text.trim();
          if (!trimmed) return;

          const ok = await onCreate(trimmed);
          if (ok) setText("");
        }}
      >
        <div className="flex-1">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="¿Qué necesitas hacer?"
            className="input h-14 w-full rounded-2xl px-4 text-sm md:text-base"
            disabled={creating}
            maxLength={120}
          />
        </div>

        <button
          type="submit"
          disabled={creating || !text.trim()}
          className="btn-primary h-14 w-full rounded-2xl px-6 sm:w-auto"
        >
          {creating ? "Creando..." : "Crear tarea"}
        </button>
      </form>

      <div className="flex min-h-[24px] items-start justify-between gap-4">
        <div className="flex-1">
          {error ? (
            <p className="text-sm text-rose-300">
              No se pudo crear la tarea. {error}
            </p>
          ) : (
            <p className="text-sm text-white/45">
              Escribe una tarea concreta y fácil de ejecutar.
            </p>
          )}
        </div>

        <span className="shrink-0 text-xs text-white/40">
          {text.trim().length}/120
        </span>
      </div>
    </div>
  );
}