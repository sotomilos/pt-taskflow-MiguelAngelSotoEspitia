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
    <div className="space-y-3">
      <form
        className="flex flex-col gap-3 sm:flex-row"
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
            placeholder="Escribe una tarea clara y accionable..."
            className="input min-h-[52px]"
            disabled={creating}
            maxLength={120}
          />
        </div>

        <button
          type="submit"
          disabled={creating || !text.trim()}
          className="btn-primary min-h-[52px] px-5"
        >
          {creating ? "Creando..." : "Crear tarea"}
        </button>
      </form>

      <div className="flex min-h-[24px] items-center justify-between gap-3">
        {error ? (
          <p className="text-sm text-rose-300">
            Error: {error}
          </p>
        ) : (
          <p className="text-xs text-white/60">
            Se refleja primero en la UI porque la API de prueba no persiste cambios.
          </p>
        )}

        <span className="text-xs text-white/40">
          {text.trim().length}/120
        </span>
      </div>
    </div>
  );
}