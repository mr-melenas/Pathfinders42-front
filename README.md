# Pathfinders42 — Frontend

Frontend del proyecto **Pathfinders42**, nuestra participación en la **NASA Space Apps Challenge 2026**.

Construido con **Vite + React + TypeScript** y **Tailwind CSS**.

## Requisitos

- **Node.js** `^20.19.0 || >=22.12.0` (lo que exige Vite 8; probado con Node 24).
- **pnpm** como único gestor de paquetes. No uses `npm` ni `yarn`.

La versión exacta de pnpm está fijada en el campo `packageManager` del `package.json`. La forma recomendada de respetarla es **Corepack** (viene incluido con Node), que activará esa versión automáticamente al trabajar en el repo:

```bash
corepack enable
```

## Puesta en marcha

```bash
# 1. Instalar dependencias
pnpm install

# 2. Crear tu archivo de entorno a partir de la plantilla
cp .env.example .env    # en Windows (PowerShell): Copy-Item .env.example .env

# 3. Arrancar el servidor de desarrollo
pnpm dev
```

La aplicación queda disponible en **http://localhost:5173** (puerto por defecto de Vite, que es el que la API permite por CORS).

## Documentación

Toda la documentación del front está en [`docs/`](docs/), en español. Es la que consulta Claude Code en cada tarea.

| Documento | Qué es |
|---|---|
| [`docs/sistema-visual.md`](docs/sistema-visual.md) | Tokens, reglas de uso y componentes. **Fuente de verdad del diseño.** |
| [`docs/design/diseno-final.html`](docs/design/diseno-final.html) | Diseño aprobado («Horizonte comparado»). Ábrelo en el navegador. |
| [`docs/design/direcciones-visuales.html`](docs/design/direcciones-visuales.html) | Las tres direcciones visuales (A, B, C) de las que sale el diseño final. |
| [`docs/plan/epicas.md`](docs/plan/epicas.md) | Plan de trabajo: épicas y sub-issues con sus criterios de aceptación. |
| [`docs/guia-de-trabajo.md`](docs/guia-de-trabajo.md) | Cómo se hace cada tarea: ramas, commits, PR, estructura de carpetas y nombres. |
| [`docs/CONTEXTO_PATHFINDERS42.md`](docs/CONTEXTO_PATHFINDERS42.md) | Copia del contexto del equipo: decisiones, datos y API. |

Si el diseño HTML y `sistema-visual.md` no coinciden, manda `sistema-visual.md`.

## Estructura del código

El código se organiza **por features**: cada funcionalidad vive en su carpeta y crece sin tocar las demás.

```
src/
├─ app/        arranque de la app (App, rutas, providers, layout)
├─ features/   una carpeta por funcionalidad: explore, site-detail, comparison, earth-limits…
├─ shared/     lo que usan varias features: ui, api, i18n, lib
├─ index.css   tokens del sistema visual
└─ main.tsx
```

- Una feature **no importa de otra feature**: lo común va a `shared/`, y `shared/` nunca importa de `features/` ni de `app/`.
- Las importaciones usan el alias `@/` (`@/` = `src/`): `import { App } from '@/app/App'`.

Detalle de cada carpeta, reglas y convenciones de nombres: [`docs/guia-de-trabajo.md` §5](docs/guia-de-trabajo.md#5-estructura-de-carpetas-y-nombres).

## Scripts

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo con recarga en caliente (puerto 5173). |
| `pnpm build` | Comprueba los tipos (`tsc -b`) y genera el build de producción en `dist/`. |
| `pnpm preview` | Sirve en local el build de producción para revisarlo. |
| `pnpm lint` | Analiza el código con oxlint. |

## Variables de entorno

Las variables de entorno van en un archivo `.env` (ignorado por git). Usa `.env.example` como plantilla.

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `VITE_API_URL` | URL base de la API. | `http://localhost:8000/api/v1` |

> En Vite, **solo** las variables con prefijo `VITE_` se exponen al código del cliente. Las demás quedan fuera del bundle.

## Flujo de ramas

Trabajamos con GitFlow ligero sobre dos ramas protegidas:

- **`main`** — versión estable. No se hace push directo.
- **`dev`** — rama de integración. No se hace push directo.

Para cada cambio:

1. Crea una rama desde `dev`: `feat/<descripcion>` para funcionalidades o `fix/<descripcion>` para correcciones.
2. Abre una **Pull Request a `dev`** (PRs pequeñas y descriptivas).
3. Cuando `dev` está probado, se abre una **PR de `dev` a `main`**.

Los mensajes de commit siguen **Conventional Commits** en español (p. ej. `feat: añade listado de recursos`).
