# Guía de trabajo con Claude Code · Pathfinders42 (front)

> **Para quién:** las dos personas del front y Claude Code. Explica cómo se hace **cada tarea**, de la issue al PR, y
> las convenciones del repo. Las reglas cortas que Claude Code debe cumplir siempre están en `CLAUDE.md`; aquí está el
> porqué y el paso a paso.
>
> Versión: 1 · 4 nov 2026

## Índice

1. [Antes de empezar (una sola vez)](#1-antes-de-empezar-una-sola-vez)
2. [Los dos modos de trabajo](#2-los-dos-modos-de-trabajo)
3. [El flujo de cada tarea, paso a paso](#3-el-flujo-de-cada-tarea-paso-a-paso)
4. [Ramas, commits y PR](#4-ramas-commits-y-pr)
5. [Estructura de carpetas y nombres](#5-estructura-de-carpetas-y-nombres)
6. [Definición de «hecho» y límite de tareas](#6-definición-de-hecho-y-límite-de-tareas)
7. [El diseño dentro del repo](#7-el-diseño-dentro-del-repo)
8. [Cuando algo se tuerce](#8-cuando-algo-se-tuerce)
9. [Chuleta de prompts](#9-chuleta-de-prompts)

---

## 1. Antes de empezar (una sola vez)

| Qué | Cómo | Para qué |
|---|---|---|
| Node y pnpm | `corepack enable` (ver `README.md`) | El repo usa la versión de pnpm fijada en `package.json` |
| Dependencias | `pnpm install` y `cp .env.example .env` | Poder arrancar la app |
| GitHub CLI | Instalar `gh` y hacer `gh auth login` | Que Claude Code pueda leer las issues (`gh issue view 12`) |
| Permiso del tablero | `gh auth refresh -s project` | Que Claude Code pueda mover tarjetas y rellenar campos del tablero |
| API en local | Ver `CONTEXTO_PATHFINDERS42.md` §4 (`uvicorn app.main:app --reload`) | Probar contra datos reales y generar los tipos |
| Documentación | `docs/sistema-visual.md`, `docs/plan/epicas.md`, `docs/design/*.html`, esta guía y **una copia de `CONTEXTO_PATHFINDERS42.md` en `docs/`** | Lo que Claude Code consulta en cada tarea. El plan cita el CONTEXTO constantemente, así que tiene que estar en el repo. Cuando el equipo lo actualice, se actualiza también la copia |

> **Por qué todo tiene que estar en el repo:** Claude Code solo ve los archivos de la carpeta en la que lo abres. Lo
> que esté en un chat, en Drive o en tu cabeza no existe para él. Si una decisión importa, va a un archivo de `docs/`.

---

## 2. Los dos modos de trabajo

Al empezar cada tarea eliges uno y se lo dices a Claude Code con la frase exacta. Puedes cambiar de modo en mitad de
una tarea («a partir de aquí, escríbelo tú»).

| Modo | Frase para el prompt | Qué hace Claude Code | Qué haces tú | Cuándo conviene |
|---|---|---|---|---|
| **A · Lo escribo yo** (el que prefieres ahora) | «Modo: propónmelo paso a paso y lo escribo yo» | Explica el paso, enseña el código que propone y **no toca archivos**. Espera a que le digas «hecho» y revisa lo que has escrito | Escribes el código, guardas y le pides que lo revise | Cuando quieres aprender algo nuevo (tokens, i18n, hooks, rutas) |
| **B · Lo escribe Claude** | «Modo: escribe tú el código y explícamelo» | Escribe los archivos un paso cada vez, explica qué ha hecho y por qué, y espera tu OK antes del siguiente | Lees el diff de cada paso y das el OK | Cuando la tarea es repetitiva o ya sabes cómo se hace |

En **los dos modos**:
- Claude Code **pide tu OK** antes de cada comando y antes de instalar una dependencia.
- Claude Code **no hace** `git add`, `git commit`, `git push`, merges ni PR. Te propone los textos y los ejecutas tú.
- Claude Code **explica el porqué** de cada decisión en una o dos frases.

> **Por qué el modo A al principio:** escribirlo tú es más lento, pero es lo que hace que entiendas el código que vas a
> tener que mantener y defender en la demo. Cuando una pieza ya la dominas, el modo B te ahorra tiempo.

---

## 3. El flujo de cada tarea, paso a paso

```
Tablero → issue → rama → plan → código paso a paso → comprobaciones → commit → PR → revisión → merge → comprobar en la web → Done
```

### Paso 0 · Elegir la tarea en el tablero
- Coge una tarjeta de la vista «Sprint actual» que esté en **Todo** y cuyas dependencias estén en **Done**.
- Muévela a **In Progress** y asígnatela. Comprueba que no tienes ya 2 tareas en curso (apartado 6).

### Paso 1 · Abrir Claude Code y leer la issue
- Abre Claude Code en la carpeta del repo. Si vienes de otra tarea, empieza con una conversación nueva (`/clear`), para
  que no arrastre cosas de la anterior.
- Pega el **prompt de la sub-issue** (está al final de cada una) cambiando `[MODO]` por el modo elegido, y añade:
  «Lee la issue con `gh issue view <número>`».

### Paso 2 · Crear la rama desde `dev`
Claude Code te propone los comandos y tú los ejecutas (o le das el OK para que los ejecute):

```bash
git switch dev
git pull origin dev
git switch -c feat/12-theme-tokens
```

Formato del nombre en el apartado 4.1.

### Paso 3 · El plan
- Pídele **el plan antes de escribir nada**: qué archivos va a tocar, en qué orden y qué comprobará. Un truco de Claude
  Code: el **modo plan** (pulsa `Shift+Tab` hasta que ponga *plan mode*) hace que solo pueda leer y proponer, no
  cambiar archivos.
- Compara el plan con los **criterios de aceptación** de la issue. Si sobra algo, se quita; si falta algo, se añade.
- Si el plan necesita algo que no está en la issue (otra librería, otro archivo), **para**: o se añade a la issue o va
  a otra.

### Paso 4 · Implementación paso a paso
- Un paso = un archivo o un cambio pequeño. Tras cada paso, mira el resultado en el navegador (`pnpm dev`) si se puede
  ver.
- En el modo A, cuando hayas escrito el paso, di «hecho, revísalo». En el modo B, lee el diff antes de dar el OK.
- Si no entiendes algo, pregúntalo en ese momento. Es mejor que encontrarlo en la revisión.

### Paso 5 · Comprobaciones
Antes de hacer commit, siempre:

```bash
pnpm lint      # oxlint: errores de estilo y de React
pnpm build     # comprueba los tipos (tsc -b) y genera el build
pnpm test      # solo cuando exista Vitest (F2.2)
```

Y además:
- Repasa **uno a uno los criterios de aceptación** de la issue y márcalos.
- Si la tarea pinta datos: pruébala con los **datos falsos** (`VITE_USE_MOCKS=true`) y con la **API local**.
- Si la tarea tiene interfaz: pruébala con **teclado** (tabulador) y en una ventana **estrecha** (< 820 px).

Pídele a Claude Code: «Repasa los criterios de aceptación de la issue y dime cuáles se cumplen y cómo lo has comprobado».

### Paso 6 · Commit
- Revisa todo lo que ha cambiado: `git status` y `git diff`.
- Pídele el mensaje: «Propón el mensaje de commit en Conventional Commits, en inglés».
- Lo ejecutas tú:

```bash
git add src/index.css src/app/App.tsx
git commit -m "feat(theme): add design system tokens"
```

> Mejor `git add <archivos>` que `git add .`: así ves qué entra y no se cuela un `.env` ni un archivo de prueba.

### Paso 7 · Push y PR
- Pídele el texto del PR: «Propón el título y la descripción del PR siguiendo la plantilla del repo».
- Lo ejecutas tú:

```bash
git push -u origin feat/12-theme-tokens
```

- Abre el PR en GitHub **contra `dev`** (no contra `main`). El cuerpo sale de la plantilla (`.github/pull_request_template.md`)
  y debe llevar `Closes #12`, para que la issue se cierre sola al fusionar.
- Mueve la tarjeta a **In Review**.

### Paso 8 · Revisión, merge y comprobación en la web
- Tu compañera revisa (y tú los suyos). Si pide cambios, se hacen en la misma rama y se vuelve al paso 5.
- Con la revisión aprobada y la CI en verde, se fusiona en `dev`.
- Abre la **URL de Vercel** de `dev` y comprueba que la tarea funciona allí. Si funciona, la tarjeta pasa a **Done**.

---

## 4. Ramas, commits y PR

### 4.1 Nombre de las ramas

```
<tipo>/<número-de-issue>-<descripción-corta-en-inglés>
```

| Ejemplo | Para qué |
|---|---|
| `feat/12-theme-tokens` | Funcionalidad nueva (issue #12, tokens del tema) |
| `feat/15-verdict-chip` | Componente nuevo |
| `fix/23-null-verdict-color` | Corrección de un fallo |

- **Tipo:** `feat` o `fix`, que son los que pide el equipo. Para tareas solo de documentación o configuración se usa
  `feat` hasta que el equipo diga otra cosa.
- **Número de issue:** así, desde la rama, se sabe de qué tarea es, y GitHub enlaza la rama con la issue.
- **Descripción:** en inglés (como pide `CLAUDE.md` para las ramas), en minúsculas y con guiones, 2 a 4 palabras.

### 4.2 Mensajes de commit (Conventional Commits)

```
<type>(<optional scope>): <description in English, imperative mood, lowercase>
```

| Tipo | Cuándo | Ejemplo |
|---|---|---|
| `feat` | Algo nuevo que se ve o se usa | `feat(ui): add verdict chip` |
| `fix` | Corrige un fallo | `fix(ui): stop rendering null verdict as fail in layer card` |
| `docs` | Solo documentación | `docs: add workflow guide` |
| `style` | Formato, sin cambiar lo que hace | `style: sort imports` |
| `refactor` | Reorganiza sin cambiar lo que hace | `refactor(api): split client from query hooks` |
| `test` | Añade o cambia tests | `test(ui): check null and false verdicts differ` |
| `build` / `chore` | Dependencias, configuración | `build: add Fontsource for Red Hat fonts` |

- Todo el mensaje va **en inglés**, en modo imperativo («add», no «added» ni «adds»): se lee como «este commit… *add verdict chip*».
  Si no sabes cómo decirlo, pídele a Claude Code el mensaje y que te explique la traducción.
- **Un commit = un cambio con sentido.** Una tarea puede tener varios commits.
- Ningún mensaje lleva enlaces a conversaciones de IA.

### 4.3 Pull requests

- **Título:** como un commit (`feat(theme): add design system tokens`). **Título y descripción en inglés.**
- **Cuerpo:** la plantilla del repo: qué cambia, por qué, cómo se ha comprobado (con los criterios marcados), capturas
  si cambia algo visual, y `Closes #<número>`.
- **Pequeño:** una sub-issue por PR. Si crece, se parte.
- **Contra `dev`.** Cuando `dev` está probado, alguien abre el PR `dev → main`.
- Sin enlaces a conversaciones de IA.

---

## 5. Estructura de carpetas y nombres

### 5.1 Estructura por features

```
src/
├─ app/                 arranque: App.tsx, router.tsx, providers.tsx, layout/ (AppHeader), dev/ (StyleGuide)
├─ features/            una carpeta por funcionalidad
│  ├─ explore/          mapa con los sitios (E4)
│  ├─ site-detail/      detalle del sitio (E5)
│  ├─ comparison/       comparación sitio ↔ análogo (E6)
│  ├─ earth-limits/     límites de la Tierra (E7)
│  └─ …                 mission-uses, candidates, assistant (S4)
│     cada una:  components/  hooks/  pages/  index.ts
├─ shared/              lo que usan varias features
│  ├─ ui/               componentes base: VerdictChip, Icon, LayerCard…
│  ├─ api/              schema.d.ts (generado), client.ts, queries.ts, mocks/
│  ├─ i18n/             index.ts, locales/es.json, locales/en.json
│  └─ lib/              utilidades sin React: format.ts
├─ index.css            tokens del sistema visual
└─ main.tsx
```

**Reglas de dependencias:**
1. Una feature puede importar de `shared/`, **nunca de otra feature**. Si dos features necesitan lo mismo, se sube a
   `shared/`.
2. `shared/` nunca importa de `features/` ni de `app/`.
3. Desde fuera de una feature solo se importa su `index.ts` (su «puerta de entrada»).
4. Las importaciones usan el alias `@/` (`import { VerdictChip } from '@/shared/ui/VerdictChip'`).

> **Por qué por features:** cuando lleguen las funciones del S4 (usos de misión, candidatos, asistente), cada una será
> una carpeta nueva que no toca las demás. Dos personas pueden trabajar a la vez sin pisarse, y borrar una función es
> borrar una carpeta.

> **Buenas prácticas:** el repo es de portfolio, así que además de funcionar tiene que estar bien hecho. Las reglas
> (accesibilidad AA, SOLID adaptado a React, TypeScript estricto, código limpio) están en `CLAUDE.md`, apartado
> «Buenas prácticas». Ejemplo de SOLID aquí: `VerdictChip` solo pinta un veredicto (responsabilidad única) y no sabe de
> dónde viene el dato, porque se lo pasa quien lo usa (inversión de dependencias).

### 5.2 Nombres

**Regla general: todo lo técnico en inglés (código, comentarios, commits, PR), la interfaz bilingüe desde i18n, la
documentación de `docs/` en español y los campos de la API tal cual.**

| Qué | Convención | Ejemplo |
|---|---|---|
| Componentes | `PascalCase`, un componente por archivo, archivo con el mismo nombre | `VerdictChip.tsx` → `export function VerdictChip` |
| Hooks | `camelCase` empezando por `use` | `useSite.ts` → `useSite(id)` |
| Funciones y variables | `camelCase` en inglés | `formatDistance`, `selectedBody` |
| Tipos e interfaces | `PascalCase` | `VerdictChipProps` |
| Constantes globales | `UPPER_SNAKE_CASE` | `DEFAULT_LANGUAGE` |
| Carpetas | `kebab-case` en inglés | `site-detail/`, `earth-limits/` |
| Tests | junto al archivo, con `.test` | `VerdictChip.test.tsx` |
| Claves de i18n | en inglés, por grupos con punto, `camelCase` | `verdict.nullShort`, `state.retry` |
| Tokens de Tailwind | en inglés, por significado | `bg-surface`, `text-verdict-fail` |
| **Campos de la API** | **tal cual vienen** (en español) | `parecido`, `hay_parecido`, `brecha_ts_media` |
| Valores de la API | tal cual vienen | `cuerpo === 'luna'`, `tipo === 'cueva_marte'` |
| Comentarios | en inglés, solo cuando expliquen el porqué | `// null ≠ false: the layer does not decide` |

- **Exportaciones con nombre** (`export function X`), no `export default`. Así el nombre es el mismo en todas partes
  y el editor encuentra mejor los usos.
- Una prop que viene directa de la API conserva su nombre (`distancia`, `parecido`). Una prop que es solo del
  componente va en inglés (`short`, `onRetry`).

> **Por qué los campos de la API no se traducen:** si el front llama `similarity` a lo que la API llama `parecido`,
> cada vez que alguien lea la API y el código tendrá que traducir de cabeza, y los tipos generados dejarían de
> coincidir. Lo prohíben `CLAUDE.md` y el CONTEXTO.

---

## 6. Definición de «hecho» y límite de tareas

### Hecho = fusionado, desplegado y comprobado en la web

Una tarea está en **Done** solo si:
- [ ] Se cumplen todos los criterios de aceptación de la issue
- [ ] `pnpm lint` y `pnpm build` (y `pnpm test`, si existe) en verde
- [ ] Probada contra la API real (local o desplegada) o, mientras no haya API desplegada, con los datos falsos
- [ ] Cumple **WCAG 2.2 AA** (teclado, foco, contraste, semántica) y las buenas prácticas de `CLAUDE.md` (SOLID adaptado a React, TypeScript sin `any`)
- [ ] PR revisado por la otra persona y fusionado en `dev`
- [ ] Comprobada en la URL de Vercel

Hasta que exista el despliegue en Vercel (F3.6), las tareas fusionadas se quedan en **In Review** y se pasan a Done
cuando se puedan comprobar en la web.

### Máximo 2 tareas en curso por persona

Cuentan las tarjetas en **In Progress** e **In Review** asignadas a ti. Si ya tienes 2, antes de coger otra: revisa el
PR de tu compañera, termina las correcciones de tu PR o pide ayuda con lo que esté atascado.

> **Por qué el límite:** con muchas tareas a medias no se termina ninguna, y «hecho» exige que esté en la web. Dos a la
> vez permiten tener una en revisión y avanzar con otra.

---

## 7. El diseño dentro del repo

Claude Code no puede abrir los artefactos de claude.ai, así que el diseño tiene que estar en archivos:

| Archivo | Qué es | Cómo se usa |
|---|---|---|
| `docs/design/diseno-final.html` | El diseño aprobado («Horizonte comparado») | Abrirlo en el navegador para verlo. Para Claude Code, citar la parte concreta: «la función `capaCard` de `docs/design/diseno-final.html`» |
| `docs/design/direcciones-visuales.html` | Las 3 direcciones (A, B, C) de las que sale | Consultar el origen de una pieza |
| `docs/sistema-visual.md` | El diseño traducido a tokens, reglas y componentes | **La fuente de verdad para el código.** Si choca con el HTML, manda este documento |
| `docs/design/capturas/*.png` (opcional) | Capturas de pantalla de las partes clave | Claude Code puede **ver imágenes**: «mira `docs/design/capturas/detalle.png` y compáralo con lo que hemos hecho» |

**Cómo llevar un diseño nuevo al repo** (por ejemplo, el wireframe de «Explorar» de F0.2):
1. Descargar el HTML del artefacto, o copiarlo de la carpeta del proyecto («Hackathon Nasa»), a `docs/design/`.
2. Abrirlo en el navegador para comprobar que se ve bien sin conexión (las fuentes de Google pueden faltar: no pasa
   nada, es una maqueta).
3. Si hace falta, hacer capturas de las partes clave y guardarlas en `docs/design/capturas/`.
4. Si cambia alguna regla, actualizar `docs/sistema-visual.md` en el mismo PR.
5. Commit con tipo `docs`.

---

## 8. Cuando algo se tuerce

| Situación | Qué hacer |
|---|---|
| Claude Code quiere tocar archivos que no son de la tarea | «Para: eso no es de esta issue. Apúntalo como posible issue nueva y sigue solo con lo de esta». |
| Propone un color, tamaño o dato que no está en `docs/` | «No inventes valores: usa solo los tokens de `docs/sistema-visual.md`». Si de verdad falta uno, se apunta en el §8 de ese documento |
| Quiere instalar una librería que no está en el plan | Pídele que lo justifique. Si tiene sentido, se añade al plan (`docs/plan/epicas.md`) en el mismo PR |
| `pnpm build` falla y no sabes por qué | «Explícame el error en palabras sencillas y propón el cambio mínimo para arreglarlo» |
| Se ha liado mucho la conversación | `/clear`, y vuelve a empezar con el prompt de la issue y lo que ya está hecho |
| Te has equivocado de rama | No hagas commit. Pídele a Claude Code los comandos para llevar los cambios a la rama correcta (`git stash`) |
| La API devuelve un campo distinto al de los tipos | Regenera los tipos (`pnpm gen:api`). Si el contrato ha cambiado, avisa en el repo del back; el front no lo arregla por su cuenta |
| Algo contradice `CONTEXTO_PATHFINDERS42.md` o el diseño | Claude Code debe avisar antes de cambiarlo. Se decide con el equipo |

---

## 9. Chuleta de prompts

**Empezar una tarea**
> Vamos con la issue #`N`. Léela con `gh issue view N`, y lee `CLAUDE.md` y las secciones de `docs/` que cita.
> Modo: [propónmelo paso a paso y lo escribo yo | escribe tú el código y explícamelo]. Primero dame el plan y espera
> mi OK.

**Crear la rama**
> Propón los comandos para crear la rama desde `dev` con el formato de `docs/guia-de-trabajo.md` §4.1.

**Revisar lo que he escrito (modo A)**
> Hecho. Revisa lo que he escrito en `<archivo>`: dime si cumple el sistema visual y el paso, y qué mejorarías y por qué.

**Comprobar antes del commit**
> Ejecuta `pnpm lint` y `pnpm build` y repasa uno a uno los criterios de aceptación de la issue: dime cuáles se cumplen
> y cómo lo has comprobado.

**Commit y PR**
> Propón el mensaje de commit en Conventional Commits (en inglés) y el título y la descripción del PR (en inglés) con la plantilla
> del repo. No ejecutes nada.

**Entender algo**
> Explícame `<concepto>` como si empezara con React, con un ejemplo de este repo.

**Crear issues desde el plan**
> Lee `docs/plan/epicas.md` (apartados 5 y 9). Quiero crear en GitHub la épica `E1` y sus sub-issues con `gh`.
> Enséñame primero los comandos y espera mi OK. Después engancha cada sub-issue a su épica, añádelas al tablero 5 de
> `mr-melenas` y rellena Status, Prioridad, Sprint y Área.
