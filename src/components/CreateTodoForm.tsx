"use client";

import { useState } from "react";

export function CreateTodoForm({
  onCreate,
  creating,
  error,
}: {
  onCreate: (text: string) => Promise<boolean>;
  creating: boolean;
  error?: string;
}) {
  const [text, setText] = useState("");

  return (
    <section className="surface p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Crear tarea</h2>
        <span className="chip">POST + estado local</span>
      </div>

      <form
        className="mt-3 flex flex-col gap-2 sm:flex-row"
        onSubmit={async (e) => {
          e.preventDefault();
          const ok = await onCreate(text);
          if (ok) setText("");
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe una tarea…"
          className="input"
          disabled={creating}
        />

        <button type="submit" disabled={creating || !text.trim()} className="btn-primary">
          {creating ? "Creando…" : "Crear"}
        </button>
      </form>

      {error ? (
        <p className="mt-2 text-sm text-rose-300">Error: {error}</p>
      ) : (
        <p className="mt-2 text-xs text-white/60">
          Se guarda localmente porque la API no persiste cambios.
        </p>
      )}
    </section>
  );
}
