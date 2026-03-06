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
    <section className="rounded-2xl border bg-white/50 p-4">
      <h2 className="text-base font-semibold">Crear tarea</h2>

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
          placeholder="Escribe una tarea..."
          className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
          disabled={creating}
        />

        <button
          type="submit"
          disabled={creating || !text.trim()}
          className="rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {creating ? "Creando..." : "Crear"}
        </button>
      </form>

      {error ? (
        <p className="mt-2 text-sm text-red-600">Error: {error}</p>
      ) : (
        <p className="mt-2 text-xs opacity-70">
          Se guarda localmente (la API no persiste), pero hacemos el POST para cumplir el
          requisito.
        </p>
      )}
    </section>
  );
}
