# CLAUDE.md — Pathfinders42 (Frontend)

Reglas para la IA (Claude Code) en este repositorio. **Este archivo tiene prioridad**: si un CLAUDE.md de una carpeta superior o una skill sugiere algo que lo contradice, manda este archivo.

## Documentación que hay que leer

- `docs/guia-de-trabajo.md`: flujo de cada tarea, ramas, commits, PR, estructura de carpetas y nombres.
- `docs/sistema-visual.md`: tokens, reglas de uso y componentes. **Fuente de verdad del diseño.**
- `docs/plan/epicas.md`: épicas y sub-issues, con sus criterios de aceptación.
- `docs/design/diseno-final.html`: diseño aprobado («Horizonte comparado»). Si choca con `sistema-visual.md`, manda `sistema-visual.md`.
- `docs/CONTEXTO_PATHFINDERS42.md`: copia del contexto del equipo (decisiones, datos y API). Si algo lo contradice, avisar antes de cambiarlo. Si la copia está desactualizada, pedir la última versión.

## Idioma

- Todo lo técnico va en **inglés**, porque es un repo de portfolio y sigue las buenas prácticas: nombres (variables, funciones, componentes, tipos, carpetas, claves de i18n, tokens), **comentarios del código**, ramas, **commits completos** y **PR** (título y descripción).
- La **interfaz es bilingüe**: los textos van en `src/shared/i18n/locales/es.json` y `en.json`, nunca escritos en el código.
- Los **campos y valores de la API se usan tal cual** (en español), sin traducirlos: son el contrato de la API.
- La documentación de `docs/` está en español (es la que usa el equipo). Claude **responde en español** a quien trabaja con él.

## Gestor de paquetes

- Se usa **siempre pnpm**. Nunca `npm` ni `yarn`.
- La versión de pnpm está fijada en `packageManager` (`package.json`) y se respeta vía Corepack.
- El único lockfile válido es `pnpm-lock.yaml`. No debe existir `package-lock.json` ni `yarn.lock`.

## Datos y API

- **No inventar datos científicos ni campos de la API.** Si un dato o un campo no se puede verificar, decirlo claramente.
- El **contrato de la API es su OpenAPI**. Es la fuente de verdad de la forma de los datos.
- Los tipos de TypeScript de la API **se generan con `openapi-typescript`** a partir de ese OpenAPI. No se escriben a mano ni se adivinan.
- **No traducir los nombres de los campos de la API**: se usan tal cual vienen en el contrato.
- Los datos falsos son respuestas reales de la API guardadas, nunca números escritos a mano.

## Diseño (resumen de `docs/sistema-visual.md`)

- Solo se usan los tokens de `src/index.css`. No añadir colores, tamaños ni valores sueltos (`text-[13px]`, `#hex`).
- El veredicto (`parecido`, `hay_parecido`, `parecidos`) se muestra **siempre con color + icono + palabra**, tal cual viene de la API. El front no recalcula veredictos.
- **`null` ≠ `false`**: comparar con `=== true`, `=== false`, `=== null`; nunca `if (parecido)`. `null` va rayado y con borde discontinuo.
- El naranja (`accent`) nunca significa un veredicto.
- Un mapa por cuerpo: Luna o Marte en su mapa, la Tierra en otro.
- Accesibilidad: foco visible, `<button>`/`<a>` para todo lo pulsable, animaciones solo con `motion-safe:`.

## Estructura del código

- Arquitectura **por features**: `src/app/`, `src/features/<feature>/`, `src/shared/{ui,api,i18n,lib}/`.
- Una feature no importa de otra feature; lo común va a `shared/`. `shared/` no importa de `features/`.
- Importaciones con el alias `@/`. Exportaciones con nombre, no `export default`.
- Detalle y convenciones de nombres en `docs/guia-de-trabajo.md` §5.

## Ramas y Pull Requests

- Ramas de trabajo desde `dev`: `feat/<número-issue>-<descripcion-en-ingles>` o `fix/<número-issue>-<descripcion-en-ingles>` (p. ej. `feat/12-theme-tokens`).
- Nada de push directo a `main` ni a `dev`.
- Las PRs son **pequeñas y descriptivas** (una sub-issue por PR), dirigidas a `dev`, con la plantilla del repo y `Closes #<número>`. Cuando `dev` está probado, PR de `dev` a `main`.
- Commits en **Conventional Commits**, en inglés (`feat(ui): add verdict chip`).
- **No pegar enlaces a conversaciones de IA** (ni a Claude ni a otras) en las PRs, commits ni comentarios.

## Forma de trabajar

- **Al empezar cada tarea, la persona elige el modo** (si no lo dice, preguntar):
  - **«Propónmelo paso a paso y lo escribo yo»**: Claude explica cada paso y enseña el código, **pero no edita archivos**. Espera a que la persona diga «hecho» y revisa lo que ha escrito.
  - **«Escribe tú el código y explícamelo»**: Claude escribe un paso cada vez, explica qué ha hecho y por qué, y espera el OK antes del siguiente.
- En los dos modos: primero leer la issue (`gh issue view <n>`) y proponer un **plan**; no empezar sin el OK.
- Antes de cada comando o archivo, explicar en una o dos frases qué hace y por qué, y **esperar el OK**.
- Hacer solo lo que pide la issue. Si aparece algo más, apuntarlo como posible issue nueva y no hacerlo.
- **Claude no hace `git add`, `commit`, `push`, merges ni Pull Requests** salvo que se le pida de forma explícita. Cuando toque, sugiere el mensaje de commit y el texto del PR, y la persona los ejecuta.
- No añadir dependencias nuevas sin justificarlas y confirmarlas antes.
- Seguir la documentación oficial **actual** de las herramientas (Vite, Tailwind, pnpm…); no usar configuraciones antiguas.
- Quien trabaja está aprendiendo: explicar brevemente el porqué de las decisiones importantes, incluida la buena práctica que se aplica.

## Buenas prácticas (siempre)

- **Accesibilidad WCAG 2.2 nivel AA en todo**: contraste mínimo 4,5:1 en texto y 3:1 en controles y gráficos, todo usable con teclado, foco visible, HTML semántico (`<button>`, `<nav>`, `<main>`, encabezados en orden), textos alternativos, `aria-*` solo cuando el HTML no basta, y respeto a «reducir movimiento». Si algo no llega a AA, avisar y no darlo por bueno.
- **SOLID adaptado a React**:
  - *Responsabilidad única*: un componente hace una cosa; la lógica de datos va en hooks (`useSite`), la presentación en componentes.
  - *Abierto/cerrado*: extender con props y composición (`children`), no con `if` para cada caso nuevo.
  - *Sustitución de Liskov*: los componentes que envuelven un elemento HTML aceptan sus props nativas y se comportan como él.
  - *Segregación de interfaces*: props pequeñas y concretas; no pasar objetos enormes «por si acaso».
  - *Inversión de dependencias*: los componentes no llaman a `fetch`; reciben datos o usan hooks de `shared/api`, que se pueden cambiar por los datos falsos.
- **TypeScript estricto**: sin `any` ni `as` para silenciar errores; tipos de la API generados.
- **Código limpio**: funciones y componentes cortos, nombres que digan qué hacen, sin código muerto ni `console.log`, sin duplicar (si se repite tres veces, se extrae).
- **Sin secretos en el repo**: las claves van en `.env`, que no se sube.
- **Rendimiento razonable**: no optimizar antes de tiempo, pero cargar con `lazy` las páginas pesadas (mapas, asistente).
- Si una buena práctica choca con el plazo, se dice y se decide; no se salta en silencio.

## Antes de dar una tarea por terminada

- `pnpm lint` y `pnpm build` en verde (y `pnpm test` cuando exista).
- Repasar uno a uno los criterios de aceptación de la issue y decir cómo se ha comprobado cada uno.
- Probado con la API real (local o desplegada) o, mientras no haya API desplegada, con los datos falsos.
- **Hecho** = fusionado en `dev`, desplegado y comprobado en la web (ver `docs/guia-de-trabajo.md` §6).

## Stack

- **Vite + React + TypeScript**, con **Tailwind CSS v4** (plugin `@tailwindcss/vite`, configuración desde el CSS con `@theme`, sin `tailwind.config.js`).
- Linter: **oxlint** (`pnpm lint`).
- Decididos en el plan: i18next + react-i18next, openapi-typescript + openapi-fetch, TanStack Query, React Router, MapLibre con react-map-gl, Vitest (solo piezas con lógica), Fontsource (Red Hat). Se instalan en su sub-issue, con OK previo.
