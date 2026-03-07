# TaskFlow

Aplicación de gestión de tareas desarrollada como prueba técnica frontend con **Next.js**, **React**, **TypeScript** y **Tailwind CSS**.

La app consume la API de **DummyJSON** para listar tareas y permite gestionar el estado de forma fluida con una capa local en memoria para reflejar los cambios del usuario de manera consistente.

## Demo

- **Aplicación desplegada:** [TaskFlow en Vercel](https://pt-taskflow-miguel-angel-soto-espit.vercel.app)
- **Repositorio:** [pt-taskflow-MiguelAngelSotoEspitia](https://github.com/sotomilos/pt-taskflow-MiguelAngelSotoEspitia)

---

## Características principales

- Listado de tareas con paginación
- Creación de nuevas tareas
- Cambio de estado de completado
- Eliminación con confirmación mediante modal
- Filtro local por estado:
  - Todas
  - Completadas
  - Pendientes
- Estados de carga, error y reintento
- Actualizaciones optimistas para mejorar la experiencia de usuario
- Persistencia visual local usando store en memoria

> **Nota:** DummyJSON simula operaciones de escritura (`POST`, `PATCH`, `DELETE`), pero no persiste realmente los cambios.  
> Por eso la aplicación mantiene el estado actualizado localmente para que la UI refleje las acciones del usuario de forma consistente.

---

## Stack tecnológico

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Zustand** para manejo de estado
- **Vitest + Testing Library** para pruebas
- **ESLint + Prettier** para calidad y formato del código

---

## Arquitectura y decisiones técnicas

### 1. Estado local como fuente de verdad

Como la API no persiste cambios reales, el estado final visible al usuario se mantiene en un store global con Zustand.

### 2. IDs negativos para tareas locales

Las tareas creadas localmente reciben IDs negativos temporales para evitar colisiones con los IDs reales de la API.

### 3. Actualizaciones optimistas

Las operaciones de completar y eliminar se reflejan primero en la interfaz.  
Si la petición falla, se realiza rollback para mantener consistencia.

### 4. Separación entre UI y lógica

La lógica de negocio y fetching está encapsulada en custom hooks, mientras que los componentes se enfocan en la presentación.

---

## Estructura del proyecto

```text
src/
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components/
│  ├─ ConfirmDialog.tsx
│  ├─ CreateTodoForm.tsx
│  ├─ Pagination.tsx
│  ├─ States.tsx
│  ├─ Toaster.tsx
│  ├─ TodoFilter.tsx
│  ├─ TodoItem.tsx
│  └─ TodoList.tsx
├─ hooks/
│  ├─ useCreateTodo.ts
│  ├─ useDeleteTodo.ts
│  ├─ useTodosPage.ts
│  └─ useToggleTodo.ts
├─ lib/
├─ store/
│  └─ todosStore.ts
├─ test/
│  ├─ resetStores.ts
│  └─ setup.ts
├─ tests/
│  ├─ components/
│  └─ hooks/
└─ types/
```

---

## Flujo funcional

La aplicación trabaja sobre una única ruta (`/`) y permite:

1. Consultar tareas paginadas desde la API
2. Crear nuevas tareas
3. Marcar tareas como completadas o pendientes
4. Eliminar tareas con confirmación
5. Filtrar resultados sin generar nuevas llamadas remotas

---

## Variables de entorno

Crea un archivo `.env.local` a partir del archivo de ejemplo:

```bash
cp .env.example .env.local
```

Contenido esperado:

```env
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
```

---

## Instalación y ejecución local

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Ejecutar en desarrollo

```bash
pnpm dev
```

### 3. Compilar para producción

```bash
pnpm build
pnpm start
```

---

## Scripts disponibles

```bash
pnpm dev
pnpm build
pnpm start
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
```

---

## Testing

El proyecto incluye pruebas para componentes y hooks clave.

### Componentes probados

- `TodoFilter`
- `TodoItem`
- `TodoList`

### Hooks probados

- `useDeleteTodo`
- `useToggleTodo`

Ejecutar pruebas:

```bash
pnpm test
```

Ejecutar cobertura:

```bash
pnpm test:coverage
```

---

## Enfoque de calidad

- Componentes reutilizables y desacoplados
- Estado centralizado con reglas claras de actualización
- Manejo explícito de loading y errores
- Código tipado con TypeScript
- Formato y linting automatizados

---

## Posibles mejoras futuras

- Persistencia real con backend propio
- Búsqueda por texto
- Ordenamiento por prioridad o fecha
- Pruebas end-to-end
- Mejoras adicionales de accesibilidad y navegación por teclado

---

## Autor

**Miguel Ángel Soto Espitia**  
GitHub: [@sotomilos](https://github.com/sotomilos)

---

## Contexto

Este proyecto fue desarrollado como parte de una prueba técnica frontend, con énfasis en:

- consumo de APIs
- manejo de estado
- separación de responsabilidades
- experiencia de usuario
- buenas prácticas de desarrollo
