# TaskFlow (Prueba Técnica Frontend Jr.)

Aplicación de una sola página (`/`) construida con **Next.js (App Router)** + **React** + **TypeScript** + **TailwindCSS**.

Implementa un CRUD de tareas consumiendo la API de DummyJSON:

- Listar tareas paginadas (10 por página)
- Crear tarea (POST)
- Marcar como completada (PATCH)
- Eliminar tarea (DELETE) con confirmación (modal)
- Filtro local (Todas / Completadas / Pendientes)

> **Nota importante:** DummyJSON “simula” writes pero **no persiste** cambios realmente.  
> Por eso la app guarda el estado final en memoria (store) para que el usuario vea sus cambios reflejados.

---

## 🚀 Demo (Deploy)

- Vercel: **Cuando acabe de modificar el css colocare url estoy volviendo a recordar three.js**

---

## 🧰 Stack

- Next.js (App Router) + React
- TypeScript
- TailwindCSS
- Zustand (state management)
- ESLint + Prettier

---

## ✅ Requisitos cubiertos

- ✅ Ruta única: todo vive en `/` (`src/app/page.tsx`)
- ✅ Lista paginada (10 por página), con loading, error y botón de reintento
- ✅ Crear todo (POST) y persistir en estado local
- ✅ Toggle completed (PATCH) con actualización optimista
- ✅ Eliminar (DELETE) con confirmación (modal custom, sin `window.confirm`)
- ✅ Filtro local (no dispara nuevas llamadas)
- ✅ Fetching encapsulado en custom hooks (no en componentes de UI)
- ✅ TypeScript sin `any`
- ✅ Componentes reutilizables (TodoList, TodoItem, Pagination, ConfirmDialog, etc.)
- ✅ `pnpm build` sin errores

---

## 🏗️ Estructura del proyecto

- `src/app/page.tsx` → página única `/` (orquesta UI)
- `src/lib/api.ts` → cliente HTTP tipado hacia DummyJSON
- `src/lib/env.ts` → variables de entorno tipadas
- `src/types/todo.ts` → tipos TS para modelos y respuestas
- `src/store/todosStore.ts` → Zustand store (fuente de verdad del estado)
- `src/hooks/*` → lógica de datos (fetch + actions)
- `src/components/*` → UI reutilizable

---

## 🧠 Decisiones técnicas

### 1) Estado local como fuente de verdad

DummyJSON no persiste cambios realmente, por lo que:

- Después de **crear/togglear/eliminar**, la UI debe reflejar cambios de forma consistente.
- Se usa **Zustand** para mantener el estado local en memoria.

### 2) IDs negativos para tareas locales

Cuando se crea una tarea, se agrega **primero al store** con un ID negativo (ej: `-1`, `-2`, etc.).
Esto evita colisiones con IDs reales de la API y permite:

- Mostrar tareas creadas por el usuario inmediatamente.
- Diferenciar claramente “local” vs “remoto”.

### 3) Actualizaciones optimistas

Para mejorar UX:

- Toggle y delete se reflejan inmediatamente en UI.
- Si la API falla, se hace rollback (se revierte el cambio).

### 4) Hooks para data fetching (separación UI/lógica)

La UI no hace fetch directo:

- `useTodosPage(page)` → trae página, loading/error/retry
- `useCreateTodo()` → creación con POST + persistencia local
- `useToggleTodo()` → PATCH optimista + rollback
- `useDeleteTodo()` → DELETE optimista + rollback

---

## ⚙️ Variables de entorno

Archivo de ejemplo: `.env.example`

NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com

---

## ⚒️ Cómo correr el proyecto

Instalar dependencias:

````terminal
pnpm install

Modo desarrollo:

```terminal
pnpm dev

Build producción:

```terminal
pnpm build
pnpm start

Lint y formato:

```terminal
pnpm lint
pnpm format


El filtro es 100% local: no hace llamadas adicionales.
la paginacion remota usa GET /todos?limit=10skip=...
Los cambios locales se muestran arriba como "Creadas por ti (local)"
````
