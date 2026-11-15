# Plan de épicas · Pathfinders42 (front)

> **Para la IA que lea esto (Claude Code):** este es el plan de trabajo del front. Cada sub-issue de GitHub sale de
> aquí. Antes de empezar una tarea, lee su sub-issue, las secciones de `docs/sistema-visual.md` que cite y
> `CLAUDE.md`. No hagas trabajo de otra sub-issue ni añadas dependencias que la tarea no nombre: si hace falta, pregunta.
>
> Versión: borrador 2 · 4 nov 2026 · Repo: `mr-melenas/Pathfinders42-front` · API de referencia: v0.2.0

## Índice

1. [Cómo leer este plan](#1-cómo-leer-este-plan)
2. [Supuestos que conviene confirmar](#2-supuestos-que-conviene-confirmar)
3. [Mapa de épicas](#3-mapa-de-épicas)
4. [Orden recomendado para el S3](#4-orden-recomendado-para-el-s3)
5. [Épicas inmediatas, en detalle](#5-épicas-inmediatas-en-detalle) (E0, E1, E2, E3)
6. [Resto de épicas](#6-resto-de-épicas) (E4 a E12)
7. [Tareas que no están en el tablero](#7-tareas-que-no-están-en-el-tablero-pedir-a-max)
8. [Issues para el repo del back](#8-issues-para-el-repo-del-back)
9. [Cómo crearlo todo en GitHub](#9-cómo-crearlo-todo-en-github)

---

## 1. Cómo leer este plan

- **Épica** = una issue «padre» que agrupa un objetivo grande. **Sub-issue** = una tarea que cabe en **un PR pequeño**.
- Los identificadores (`F1.2`, `B3`…) son provisionales. Cuando crees las issues en GitHub, cada una tendrá su número
  (`#7`) y conviene **cambiar las dependencias** de las siguientes issues por esos números.
- Campos del tablero en cada sub-issue: **Prioridad** (P0 imprescindible, P1 importante, P2 si sobra tiempo),
  **Sprint** (S3: 2–8 nov · S4: 9–13 nov), **Área** (siempre Front aquí).
- **Tamaño:** **S** = unas 2 horas o menos · **M** = media jornada · **L** = una jornada. Si una tarea crece más de L,
  se parte en dos.
- **Tablero:** el tablero todavía está vacío, así que «tarea del tablero» quiere decir **la lista de tareas del front del
  apartado 7 de `CONTEXTO_PATHFINDERS42.md`**. Las sub-issues que no salen de esa lista llevan la marca
  **⚠️ fuera del tablero** y están juntas en el apartado 7 de este plan, para pedirle a Max que las añada.
- Las **frases de los prompts** son para pegarlas en Claude Code al empezar. `[MODO]` se cambia por uno de los dos modos
  de trabajo (se explican en `docs/guia-de-trabajo.md`, Fase 4):
  - «**propónmelo paso a paso y lo escribo yo**» (el que prefiere Adriana ahora),
  - «**escribe tú el código y explícamelo**».

**Plantilla de cada sub-issue.** El título va como título de la issue. Todo lo que hay desde «Descripción» hasta el
prompt va en el cuerpo de la issue.

---

## 2. Supuestos que conviene confirmar

Este plan da por hechas varias decisiones que todavía no están confirmadas. Si alguna no vale, se cambia aquí antes de
crear las issues.

| # | Supuesto | Por qué | Afecta a |
|---|---|---|---|
| S1 | **React Router** para las rutas | Es la opción estándar en React + Vite y la que más ejemplos y ayuda tiene | F3.5 |
| S2 | **TanStack Query** para pedir datos a la API | Da hechos los estados de carga y error, el «Reintentar» y la caché. Sin ella habría que programar eso a mano en cada vista | F3.4 y todas las vistas |
| S3 | **openapi-fetch** para el cliente de la API | Es de los mismos autores que `openapi-typescript` y usa los tipos generados, así que las rutas y los campos se comprueban solos. `CLAUDE.md` prohíbe escribir los tipos a mano | F3.2 |
| S4 | **MapLibre con react-map-gl** (versión `maplibre`) para los mapas (decidido por Adriana, 4 nov; descartado Three.js) | Es lo que dice el CONTEXTO, trae el globo de serie, lee el GeoJSON de la API y deja usar el mapa como un componente de React | E4, E5, E8, E10 |
| S4a | **MapLibre sin `react-map-gl`** (15 nov, #74) | Solo hay un mapa MapLibre (el globo de la Tierra del detalle): basta un `useEffect` que lo crea y lo destruye, y se ahorra una dependencia. Se carga con `lazy`, en su propio archivo | E5 |
| S4b | **Mapas de la Luna y Marte en SVG propio** con la imagen equirectangular de NASA Trek, no con MapLibre (decidido por Adriana, 15 nov, F4.1) | Prueba del 15 nov: MapLibre 6 en globo usa teselas Web Mercator, que acaban en ±85,05°. Por debajo, la imagen sale en franjas y los sitios no se dibujan (Malapert, −85,99°). Son 12 de los 67 sitios de la Luna, los de Artemis. Las imágenes de Trek cubren los polos, tienen CORS y no añaden dependencias. MapLibre queda para el mapa de la Tierra | E4, E5 |
| S5 | **i18next + react-i18next** para los idiomas | Ya decidido en el diseño | F2.1 |
| S6 | **Vitest solo en las piezas con lógica** (chip de veredicto, formateo de números, cliente API) | No hay tests en el repo y no da tiempo a cubrir todo antes del 8 nov. Esas piezas son donde un fallo engaña al jurado (`null` pintado como `false`) | F2.2, F2.4, F3.2 |
| S7 | **La tarea de diseño E0 la prepara Claude en el proyecto** y el equipo la aprueba | Falta la arquitectura de pantallas y el wireframe de «Explorar»; sin ellos E3.5 y E4 no se pueden planificar bien | E0 |
| S8 | **Sin persona asignada** por ahora | Adriana monta primero toda la configuración inicial; el reparto se hace después, respetando el máximo de 2 tareas en curso por persona | Todas |
| S9 | **Arquitectura por features** (decidido por Adriana, 4 nov) | Cada funcionalidad vive en su carpeta y crece sin tocar las demás. Estructura en F3.0 | Todas |

Cada librería nueva se justifica y se confirma antes de instalarla, como pide `CLAUDE.md`. Este plan es esa
justificación; aun así, Claude Code debe pedir el OK antes de ejecutar `pnpm add`.

---

## 3. Mapa de épicas

| Épica | Objetivo | Prioridad · Sprint | Tarea del tablero (CONTEXTO §7) | Detalle |
|---|---|---|---|---|
| **E0 · Arquitectura de pantallas** | Decidir qué pantallas hay, sus rutas y cómo es «Explorar» | P0 · S3 | ⚠️ fuera del tablero | Completo |
| **E1 · Sistema visual** | Llevar `sistema-visual.md` al código: fuentes, tokens, logo | P0 · S3 | (base de todas) ⚠️ | Completo |
| **E2 · Componentes base** | Los componentes pequeños que usan todas las vistas, con i18n | P0 · S3 | Panel «funciona / falla» (en parte) ⚠️ | Completo |
| **E3 · Base de la app y cliente API** | Estructura por features, tipos, cliente, datos falsos, rutas, cabecera y despliegue | P0 · S3 | Cliente API con tipos generados | Completo |
| E4 · Explorar: mapa con los sitios | Ver los 160 sitios en el mapa de su cuerpo y elegir uno | P0 · S3 | Globo/mapa con los sitios reales | Resumen |
| E5 · Detalle del sitio | La pantalla de Malapert ↔ Lofoten del diseño, con datos reales | P0 · S3 | Vista de detalle · Panel «funciona / falla» | Resumen |
| E6 · Comparación sitio ↔ análogo | Todas las parejas de una capa y sus variables lado a lado | P1 · S3 | Comparación de variables | Resumen |
| E7 · Límites de la Tierra | Sección que explica por qué ningún sitio de la Tierra es un análogo perfecto | P1 · S3 | Sección «Límites de la Tierra» | Resumen |
| E8 · Capas del índice y regiones | Capas PNG del índice y regiones en MapLibre; imágenes de Worldview | P1/P2 · S3 | Capas del índice · Imágenes de Worldview | Resumen |
| E9 · Usos de misión y ranking | Enfoque D: elegir un uso y ver el ranking | P0 · S4 | Selector de uso de misión y ranking | Resumen |
| E10 · Candidatos M1 | Análogos nuevos del modelo en el mapa, con explicación | P1 · S4 | Candidatos nuevos de M1 | Resumen |
| E11 · Asistente | Chat con fuentes citadas | P1 · S4 | Asistente en la web | Resumen |
| E12 · Pulido e integración final | Accesibilidad, rendimiento, textos y entrega | P0/P1 · S4 | Pulir interfaz · Integración final | Resumen |

---

## 4. Orden recomendado para el S3

Hoy es miércoles 4 nov y el S3 acaba el domingo 8. **Primero se monta toda la configuración inicial** (lo hace Adriana)
y después se reparten las vistas. Orden de la configuración inicial, cada paso es un PR pequeño:

```
1. F1.1  documentación en docs/                 7. F2.2  Vitest
2. F3.0  estructura de carpetas por features    8. F3.1  tipos de la API
3. F1.2  fuentes Red Hat                        9. F3.2  cliente de la API
4. F1.3  tokens del tema (primera tarea visual) 10. F3.3  datos falsos
5. F1.4  página de muestra                      11. F3.4  TanStack Query
6. F2.1  i18n y formateo                        12. F3.6  despliegue en Vercel
```

Después (ya con reparto): F0.1 y F3.5 (rutas y cabecera), los componentes de E2 y las vistas de E4 y E5.

- **F3.0 y F1.3 van primero** porque todo lo demás se apoya en la estructura de carpetas y en las clases de los tokens.
- **F3.6 (despliegue) entra en la configuración, no al final:** la definición de «hecho» del equipo es «fusionado,
  desplegado y comprobado en la web». Sin despliegue, ninguna tarea puede estar hecha.
- Aunque lo haga una sola persona, se respeta el **máximo de 2 tareas en curso**: una en revisión y otra empezada.

---

## 5. Épicas inmediatas, en detalle

### E0 · Arquitectura de pantallas

**Objetivo:** antes de programar rutas y vistas, saber qué pantallas tiene la app, qué URL tiene cada una y cómo es
la vista «Explorar», que el diseño final no dibuja (solo dibuja el detalle).

**Prioridad:** P0 · **Sprint:** S3 · **Área:** Front · ⚠️ fuera del tablero

#### F0.1 · Definir la arquitectura de pantallas y las rutas

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | S | ⚠️ fuera del tablero |

**Descripción**
Escribir `docs/arquitectura-pantallas.md` con: lista de pantallas del MVP (S3) y de S4, la URL de cada una, qué
endpoint de la API usa, y cómo se navega de una a otra. Cierra los pendientes 11 (rutas) y 12 (ancho máximo) de
`docs/sistema-visual.md`.

**Criterios de aceptación**
- [ ] Lista de pantallas con su ruta: como mínimo Explorar, Detalle del sitio y Límites de la Tierra (S3); Usos de
      misión, Fuentes y Asistente (S4)
- [ ] Para cada pantalla: endpoints que usa (de los que existen en la API v0.2.0 o están planificados en el CONTEXTO)
- [ ] Se decide si el cuerpo (luna / marte) va en la URL y cómo se representa el idioma
- [ ] Se decide el ancho máximo del contenido
- [ ] El equipo de front lo aprueba

**Archivos:** `docs/arquitectura-pantallas.md` (nuevo)
**Depende de:** nada
**Referencias:** `CONTEXTO_PATHFINDERS42.md` §6 y §7 · `docs/sistema-visual.md` §8 (pendientes 11 y 12) · diseño final
(cabecera: Explorar, Usos de misión, Límites de la Tierra, Fuentes)

**Prompt para Claude Code**
> Tarea F0.1: definir la arquitectura de pantallas. Lee `CONTEXTO_PATHFINDERS42.md` (§6 y §7) y `docs/sistema-visual.md`
> (§6.2 `AppHeader` y §8). Modo: [MODO]. Antes de escribir nada, hazme las preguntas que necesites y propón un índice
> del documento. No inventes endpoints: usa solo los que existen o están planificados.

#### F0.2 · Wireframe de la vista «Explorar»

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | M | ⚠️ fuera del tablero |

**Descripción**
Boceto de baja fidelidad de la pantalla «Explorar»: mapa del cuerpo elegido con los sitios, selector Luna / Marte,
leyenda de marcadores, filtro por tipo y una lista de sitios como alternativa accesible al mapa. Debe usar los
componentes y tokens del sistema visual, sin inventar estilos nuevos.

**Criterios de aceptación**
- [ ] Wireframe en escritorio y en móvil (< 820 px)
- [ ] Se ve qué pasa al elegir un sitio (ir al detalle o abrir un panel)
- [ ] Incluye la leyenda de marcadores por forma (`SiteMarker`) y cómo se ve el veredicto si se colorea por veredicto
- [ ] Incluye los estados cargando, error (API caída, `503`) y vacío (filtro sin resultados)
- [ ] Guardado en `docs/design/` y aprobado por el equipo de front

**Archivos:** `docs/design/explorar-wireframe.html` (nuevo)
**Depende de:** F0.1
**Referencias:** `docs/sistema-visual.md` §5.4 y §6.3 · `GET /api/v1/sitios/geojson` · `GET /api/v1/sitios?cuerpo=&tipo=`

**Prompt para Claude Code**
> Tarea F0.2: wireframe de «Explorar». Lee `docs/arquitectura-pantallas.md` y `docs/sistema-visual.md` (§5.4, §6.3).
> Modo: [MODO]. Propón primero 2 opciones de distribución en texto, espera que elija una y luego haz un HTML estático en
> `docs/design/explorar-wireframe.html` usando solo los tokens del sistema visual.

---

### E1 · Sistema visual

**Objetivo:** que el repo tenga el sistema visual funcionando: documentación a mano para Claude Code, fuentes Red Hat,
tokens de Tailwind v4, logo y una página para comprobar que todo se ve como en el diseño.

**Prioridad:** P0 · **Sprint:** S3 · **Área:** Front · ⚠️ fuera del tablero (es la base de todas las tareas del tablero)

#### F1.1 · Añadir la documentación de diseño al repo

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | S | ⚠️ fuera del tablero |

**Descripción**
Subir al repo los documentos que Claude Code tiene que consultar: el sistema visual, el diseño final, las direcciones
visuales y este plan.

**Criterios de aceptación**
- [ ] Existen `docs/sistema-visual.md`, `docs/plan/epicas.md`, `docs/design/diseno-final.html` y
      `docs/design/direcciones-visuales.html`
- [ ] Los HTML se abren en el navegador y se ven bien
- [ ] `README.md` tiene un apartado «Documentación» con enlaces a esos archivos

**Archivos:** `docs/` (nuevo) · `README.md`
**Depende de:** nada
**Referencias:** proyecto «Hackathon Nasa» (carpeta del proyecto)

**Prompt para Claude Code**
> Tarea F1.1: ya he copiado los archivos de `docs/`. Modo: [MODO]. Comprueba que están todos los de la sub-issue y
> propón el apartado «Documentación» del `README.md`. No cambies el contenido de los documentos.

#### F1.2 · Cargar las fuentes Red Hat con Fontsource

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | S | ⚠️ fuera del tablero |

**Descripción**
Instalar Red Hat Display, Red Hat Text y Red Hat Mono (versiones variables) con Fontsource e importarlas en
`main.tsx`. Así la versión queda fijada en `package.json` y no dependemos de Google Fonts.

**Criterios de aceptación**
- [ ] Instalados `@fontsource-variable/red-hat-display`, `@fontsource-variable/red-hat-text` y
      `@fontsource-variable/red-hat-mono` con pnpm
- [ ] Importados en `src/main.tsx` antes de `./index.css`
- [ ] En las herramientas del navegador (pestaña Red) se cargan archivos `.woff2` desde nuestro servidor, no desde
      `fonts.googleapis.com`
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `package.json` · `pnpm-lock.yaml` · `src/main.tsx`
**Depende de:** nada
**Referencias:** `docs/sistema-visual.md` §3

**Prompt para Claude Code**
> Tarea F1.2: cargar las fuentes con Fontsource. Lee `docs/sistema-visual.md` §3 y `CLAUDE.md`. Modo: [MODO]. Dame
> primero el plan y el comando de pnpm, y espera mi OK antes de instalar nada.

#### F1.3 · Tokens del tema, estilos base y utilidades

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | M | ⚠️ fuera del tablero |

**Descripción**
Sustituir el contenido de `src/index.css` por el bloque del apartado 4 de `docs/sistema-visual.md`: tokens en
`@theme` (colores, tipografía, tamaños, radios, sombras, breakpoint `md2`, animación), estilos base (fondo, texto,
foco, reducir movimiento) y utilidades propias (`stripes-null`, `stripes-bar`, `header-gradient`).

**Criterios de aceptación**
- [ ] `src/index.css` contiene el bloque del §4, sin estilos de la plantilla de Vite
- [ ] `src/App.tsx` ya no usa clases que han dejado de existir (`text-4xl`); usa `text-site-title`, `font-display`
- [ ] La página tiene fondo `background` y el texto sale en Red Hat Text
- [ ] Un elemento de prueba con `text-verdict-pass font-mono` sale verde en Red Hat Mono, y `bg-red-500` no hace nada
- [ ] Al llegar con el tabulador a un botón aparece el anillo naranja de foco
- [ ] Con «reducir movimiento» activado en el sistema, `motion-safe:animate-pulse-ring` no se anima
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `src/index.css` · `src/App.tsx`
**Depende de:** F1.2
**Referencias:** `docs/sistema-visual.md` §2 y §4 (incluye «Cómo comprobar que funciona»)

**Prompt para Claude Code**
> Tarea F1.3: tokens del tema. Lee `docs/sistema-visual.md` §2 y §4. Modo: [MODO]. Explícame qué hace cada parte del
> bloque (`@theme`, `@layer base`, `@utility`) antes de tocar `src/index.css`. No añadas ni cambies valores: copia los
> del documento.

#### F1.4 · Página de muestra del sistema visual

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P1 | S3 | Front | S | ⚠️ fuera del tablero |

**Descripción**
Una página solo para desarrollo que enseña todos los tokens (colores con su nombre, escala de textos, radios) y, según
se vayan creando, los componentes base con todas sus variantes. Sirve para revisar de un vistazo que todo coincide con
el diseño y para detectar fallos al cambiar algo.

**Criterios de aceptación**
- [ ] Componente `StyleGuide` que muestra colores, tamaños de texto, radios y sombras
- [ ] Solo se ve en desarrollo (`import.meta.env.DEV`), no en el build de producción
- [ ] Cada componente nuevo de E2 se añade aquí con todas sus variantes (se apunta en sus criterios)

**Archivos:** `src/app/dev/StyleGuide.tsx` (nuevo) · `src/App.tsx` (o la ruta de desarrollo, si F3.5 ya existe)
**Depende de:** F1.3
**Referencias:** `docs/sistema-visual.md` §2

**Prompt para Claude Code**
> Tarea F1.4: página de muestra. Lee `docs/sistema-visual.md` §2. Modo: [MODO]. Propón cómo hacer que solo exista en
> desarrollo y cómo listar los tokens sin repetir los valores a mano.

#### F1.5 · Logo y favicon sin la insignia de la NASA

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P1 | S3 | Front | S | ⚠️ fuera del tablero |

**Descripción**
Componente `Logo` en SVG (estrella blanca, arco y punto naranjas, «Pathfinders**42**» con el 42 en `accent`) y favicon
a juego. Sin la insignia de la NASA, que no se puede usar sin permiso.

**Criterios de aceptación**
- [ ] `Logo` redibujado a partir del SVG del diseño final, con los colores como tokens (`currentColor` / `var(--color-…)`)
- [ ] Tiene nombre accesible («Pathfinders42, inicio») y el SVG decorativo lleva `aria-hidden`
- [ ] `public/favicon.svg` sustituido por el símbolo del equipo
- [ ] Ningún archivo del repo contiene la insignia de la NASA

**Archivos:** `src/shared/ui/Logo.tsx` (nuevo) · `public/favicon.svg` · `index.html`
(título de la página)
**Depende de:** F1.3
**Referencias:** `docs/sistema-visual.md` §6.2 (`Logo`) y §8 (pendiente 13) · `docs/design/diseno-final.html` (función `logo`)

**Prompt para Claude Code**
> Tarea F1.5: logo y favicon. Lee `docs/sistema-visual.md` §6.2 y busca la función `logo` en
> `docs/design/diseno-final.html`. Modo: [MODO]. Usa ese SVG como base, sin la insignia de la NASA.

---

### E2 · Componentes base

**Objetivo:** tener los componentes pequeños que repiten todas las vistas, con sus textos en i18n y sus variantes,
probados con datos reales de ejemplo. Cuando E2 termine, montar el detalle del sitio (E5) es juntar piezas.

**Prioridad:** P0 · **Sprint:** S3 · **Área:** Front · Tablero: parte del «Panel “dónde funciona / dónde falla”» (P0 S3)

> **Datos de ejemplo:** mientras no exista F3.3 (datos falsos), los componentes se prueban en `StyleGuide` con los
> ejemplos reales de `CONTEXTO_PATHFINDERS42.md` §6 (Malapert Massif, Jezero). **Nunca con números inventados.**

#### F2.1 · Configurar i18n (es / en) y el formateo de números

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | M | ⚠️ fuera del tablero (lo pide el diseño) |

**Descripción**
Instalar i18next y react-i18next, crear `es.json` y `en.json` con las primeras claves (veredictos, estados comunes) y
funciones de formateo con `Intl.NumberFormat` para números, distancias, temperaturas y coordenadas según el idioma.

**Criterios de aceptación**
- [ ] Instalados `i18next` y `react-i18next` (con el OK previo)
- [ ] Idioma por defecto español; el idioma elegido se recuerda entre visitas (`localStorage`, con `try/catch`)
- [ ] `<html lang>` cambia al cambiar de idioma
- [ ] Claves en inglés y por grupos: `verdict.pass`, `verdict.fail`, `verdict.null`, `verdict.nullShort`,
      `state.loading`, `state.error`, `state.retry`, `state.empty`, `state.pending`
- [ ] Textos: «Funciona», «Falla», «La capa no lo decide», «No decide» (es) y su traducción (en)
- [ ] Funciones de formateo: `0,229` en español y `0.229` en inglés; signo menos tipográfico (−); unidades °C y km²
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `src/shared/i18n/index.ts` · `src/shared/i18n/locales/es.json` · `src/shared/i18n/locales/en.json` · `src/shared/lib/format.ts`
· `src/main.tsx`
**Depende de:** nada (puede ir en paralelo a E1)
**Referencias:** `docs/sistema-visual.md` §7 · diseño final («Dos idiomas desde el día 1»)

**Prompt para Claude Code**
> Tarea F2.1: i18n y formateo. Lee `docs/sistema-visual.md` §7 y `CLAUDE.md`. Modo: [MODO]. Justifica cada dependencia
> antes de instalarla y espera mi OK. Las claves van en inglés y los textos en cada idioma.

#### F2.2 · Configurar Vitest para las piezas con lógica

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P1 | S3 | Front | S | ⚠️ fuera del tablero |

**Descripción**
Instalar Vitest y Testing Library para poder probar las piezas donde un error engaña al usuario: el chip de veredicto
(`null` ≠ `false`), el formateo de números y el cliente de la API.

**Criterios de aceptación**
- [ ] Instalados `vitest`, `@testing-library/react` y `jsdom` (con el OK previo)
- [ ] Script `pnpm test` en `package.json`
- [ ] Un primer test de `src/shared/lib/format.ts` (F2.1) que comprueba `0,229` / `0.229` y el signo menos
- [ ] `pnpm test`, `pnpm lint` y `pnpm build` en verde

**Archivos:** `package.json` · `vite.config.ts` (bloque `test`) · `src/shared/lib/format.test.ts`
**Depende de:** F2.1
**Referencias:** supuesto S6 de este plan

**Prompt para Claude Code**
> Tarea F2.2: configurar Vitest. Modo: [MODO]. Sigue la documentación actual de Vitest para Vite 8. Explícame qué es
> cada paquete antes de instalarlo y escribe el primer test para `src/shared/lib/format.ts`.

#### F2.3 · Componente `Icon`

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | S | ⚠️ fuera del tablero |

**Descripción**
Los 5 iconos SVG del diseño (`check`, `cross`, `dash`, `seal`, `circle`) en un solo componente, con
`stroke="currentColor"` para heredar el color del texto.

**Criterios de aceptación**
- [ ] `<Icon name="check" />` pinta el icono del diseño; `name` solo acepta los 5 valores (tipo de TypeScript)
- [ ] Por defecto lleva `aria-hidden="true"`
- [ ] Tamaño configurable (14 px en chips, 16 px en listas)
- [ ] Añadido a `StyleGuide` (si F1.4 existe)

**Archivos:** `src/shared/ui/Icon.tsx`
**Depende de:** F1.3
**Referencias:** `docs/sistema-visual.md` §6.1 · `docs/design/diseno-final.html` (objeto `I` del script)

**Prompt para Claude Code**
> Tarea F2.3: componente Icon. Lee `docs/sistema-visual.md` §6.1 y copia los SVG del objeto `I` de
> `docs/design/diseno-final.html`. Modo: [MODO].

#### F2.4 · Componente `VerdictChip`

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | M | Panel «funciona / falla» (P0 S3) |

**Descripción**
El chip del veredicto: color + icono + palabra para `true`, `false` y `null`. Es el componente más importante del
sistema, porque es el que cumple la regla de que `null` no se pinta como `false`.

**Criterios de aceptación**
- [ ] Prop `value: boolean | null` (el tipo sale de la API, no se escribe a mano si ya existe F3.1) y prop `short`
- [ ] `true` → `verdict-pass`, `check`, «Funciona» · `false` → `verdict-fail`, `cross`, «Falla» ·
      `null` → `verdict-null`, `dash`, «La capa no lo decide» («No decide» con `short`)
- [ ] `null` lleva `border-dashed` y `stripes-null`; `false` borde continuo y fondo liso
- [ ] La comparación se hace con `=== true` / `=== false` / `=== null`, nunca con `if (value)`
- [ ] Textos de i18n; se ve bien en español (el texto más largo) y en inglés
- [ ] Test con Vitest que comprueba que `null` y `false` muestran textos distintos (si F2.2 existe)
- [ ] Añadido a `StyleGuide` con las 6 combinaciones

**Archivos:** `src/shared/ui/VerdictChip.tsx` · `src/shared/ui/VerdictChip.test.tsx` · `src/shared/i18n/locales/*.json`
**Depende de:** F1.3, F2.1, F2.3
**Referencias:** `docs/sistema-visual.md` §5.1, §5.2 y §6.1 · campos `parecido`, `hay_parecido`, `parecidos` de la API

**Prompt para Claude Code**
> Tarea F2.4: VerdictChip. Lee `docs/sistema-visual.md` §5.1, §5.2 y §6.1. Modo: [MODO]. Lo más importante es que `null`
> y `false` no se confundan nunca: explícame cómo lo garantizas en el código y en el test.

#### F2.5 · Componentes `VerificationChip` y `SiteTypeChip`

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | S | Vista de detalle del sitio (P0 S3) |

**Descripción**
Chip «Verificada / Candidato» de cada análogo y chip con el tipo de sitio (`region_aterrizaje_artemis`…), con el texto
visible traducido.

**Criterios de aceptación**
- [ ] `VerificationChip` recibe `status` con el valor de la API tal cual (`"verificada"` / `"candidato"`)
- [ ] Si la API no trae verificación, el componente no pinta nada (no se supone «candidato»)
- [ ] `SiteTypeChip` recibe `tipo` y muestra el texto de i18n con el `tipo` como clave, para los 7 tipos del CONTEXTO
- [ ] Estilos del §6.1 (sello / círculo discontinuo; borde `body-moon`)
- [ ] Añadidos a `StyleGuide`

**Archivos:** `src/shared/ui/VerificationChip.tsx` · `src/shared/ui/SiteTypeChip.tsx` · `src/shared/i18n/locales/*.json`
**Depende de:** F2.3, F2.1
**Referencias:** `docs/sistema-visual.md` §6.1 y §8 (pendiente 6) · CONTEXTO §5 (lista de `tipo`) · campo
`detalles.verificacion`

**Prompt para Claude Code**
> Tarea F2.5: VerificationChip y SiteTypeChip. Lee `docs/sistema-visual.md` §6.1 y CONTEXTO §5. Modo: [MODO]. Usa los
> valores de la API sin traducirlos en el código; solo se traduce el texto que ve la persona.

#### F2.6 · Componentes `SimilarityBar` y `MetricsTable`

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | M | Panel «funciona / falla» (P0 S3) |

**Descripción**
La barra de «parecido» (1 − distancia) y la tabla de métricas con los campos de `detalles` tal cual vienen de la API.

**Criterios de aceptación**
- [ ] `SimilarityBar` recibe `distancia` y `parecido`; el relleno es `(1 − distancia) × 100 %`
- [ ] Con `parecido === null`, el relleno es rayado (`stripes-bar`)
- [ ] Lleva `role="img"` y `aria-label` con porcentaje y distancia formateados según el idioma
- [ ] `MetricsTable` recibe `detalles` y muestra cada campo con su nombre de la API, su valor formateado y, si la hay,
      su unidad. **No** inventa unidades ni textos para campos que no conoce: si no la sabe, la deja vacía
- [ ] Sin `detalles`, ninguno de los dos pinta nada
- [ ] Añadidos a `StyleGuide` con los datos de Malapert ↔ Lofoten y Malapert ↔ Askja del CONTEXTO §6

**Archivos:** `src/shared/ui/SimilarityBar.tsx` · `src/shared/ui/MetricsTable.tsx`
**Depende de:** F1.3, F2.1
**Referencias:** `docs/sistema-visual.md` §6.1 · CONTEXTO §5 (tabla de capas) y §6 (ejemplos)

**Prompt para Claude Code**
> Tarea F2.6: SimilarityBar y MetricsTable. Lee `docs/sistema-visual.md` §6.1 y los ejemplos del CONTEXTO §6. Modo:
> [MODO]. La barra es información extra, nunca el veredicto. No inventes unidades para campos que no aparecen en el
> CONTEXTO ni en el OpenAPI.

#### F2.7 · Componentes `SourceFooter` y `LinkButton`

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P1 | S3 | Front | S | Vista de detalle del sitio (P0 S3) |

**Descripción**
El pie «Capa · Fuente · N parejas · ver todas» de cada tarjeta, y el botón con aspecto de enlace.

**Criterios de aceptación**
- [ ] `SourceFooter` recibe `capa`, la fuente (opcional) y `n_parejas` (opcional)
- [ ] Si no hay fuente, muestra «dato pendiente» (`state.pending`), nunca un texto de relleno
- [ ] `LinkButton` es un `<button>` (o `<a>` si recibe `href`) con color `horizon`, subrayado y foco visible
- [ ] Añadidos a `StyleGuide`

**Archivos:** `src/shared/ui/SourceFooter.tsx` · `src/shared/ui/LinkButton.tsx`
**Depende de:** F1.3, F2.1
**Referencias:** `docs/sistema-visual.md` §5.5, §6.1 y §8 (pendiente 5)

**Prompt para Claude Code**
> Tarea F2.7: SourceFooter y LinkButton. Lee `docs/sistema-visual.md` §5.5 y §6.1. Modo: [MODO].

#### F2.8 · Componente `SegmentedToggle`

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P1 | S3 | Front | S | Globo/mapa con los sitios (P0 S3) |

**Descripción**
Conmutador de botones para elegir cuerpo (Luna / Marte) e idioma (ES / EN).

**Criterios de aceptación**
- [ ] Grupo de `<button>` con `aria-pressed` y una etiqueta del grupo (`aria-label` de i18n)
- [ ] Recibe las opciones, la seleccionada y una función `onChange`
- [ ] Estilos seleccionado / no seleccionado / foco del §6.1; funciona con teclado
- [ ] Añadido a `StyleGuide`

**Archivos:** `src/shared/ui/SegmentedToggle.tsx`
**Depende de:** F1.3
**Referencias:** `docs/sistema-visual.md` §5.6 y §6.1

**Prompt para Claude Code**
> Tarea F2.8: SegmentedToggle. Lee `docs/sistema-visual.md` §5.6 y §6.1. Modo: [MODO]. Explícame qué es `aria-pressed` y
> por qué usamos `<button>`.

#### F2.9 · Estados comunes: cargando, error y vacío

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | S | Cliente API (P0 S3) |

**Descripción**
Tres componentes para los estados que el diseño no dibuja, con la propuesta del sistema visual. El error recibe el
código de la API y muestra un mensaje y un botón «Reintentar».

**Criterios de aceptación**
- [ ] `LoadingState`: bloque `bg-surface-2` del tamaño indicado, `aria-busy="true"`, sin animación salvo `motion-safe:`
- [ ] `ErrorState`: texto en `foreground` (no en `verdict-fail`), mensaje de i18n según `404`, `422`, `503` u otro, y
      botón «Reintentar» que llama a una función `onRetry`
- [ ] `EmptyState`: texto `muted` en cursiva
- [ ] Añadidos a `StyleGuide`

**Archivos:** `src/shared/ui/LoadingState.tsx` · `src/shared/ui/ErrorState.tsx` · `src/shared/ui/EmptyState.tsx`
· `src/shared/i18n/locales/*.json`
**Depende de:** F1.3, F2.1
**Referencias:** `docs/sistema-visual.md` §6 («Estados comunes») y §8 (pendiente 3) · CONTEXTO §6 (errores de la API)

**Prompt para Claude Code**
> Tarea F2.9: estados comunes. Lee `docs/sistema-visual.md` §6 («Estados comunes») y los errores de la API en el
> CONTEXTO §6. Modo: [MODO]. El error no usa el color de «falla», para no confundirlo con un veredicto.

#### F2.10 · Componente `LayerCard`

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | L | Panel «funciona / falla» (P0 S3) |

**Descripción**
La tarjeta de capa del diseño: nombre y descripción de la capa con su `VerdictChip`, la mejor pareja (nombre,
verificación, veredicto por pareja, barra, métricas) y el pie de fuente. Recibe un elemento de `resumen[]` de
`GET /sitios/{id}`.

**Criterios de aceptación**
- [ ] Recibe un elemento de `resumen` con el tipo generado de la API (F3.1)
- [ ] Franja `shadow-stripe-pass` si `hay_parecido === true`, `shadow-stripe-fail` si `=== false`, sin franja si `null`
- [ ] Muestra los dos veredictos cuando son distintos (sitio «Falla», pareja «No decide»)
- [ ] Sin `mejor`, muestra «dato pendiente» en lugar de la pareja
- [ ] Orden de los bloques y estilos del §6.2; nombre y descripción de la capa desde i18n con `capa` como clave
- [ ] Añadido a `StyleGuide` con las dos tarjetas del diseño (anortosita · funciona; clima · falla con pareja null)
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `src/shared/ui/LayerCard.tsx` · `src/shared/i18n/locales/*.json`
**Depende de:** F2.4, F2.5, F2.6, F2.7, F3.1
**Referencias:** `docs/sistema-visual.md` §5.2 y §6.2 · `GET /api/v1/sitios/{id}` (campo `resumen`) · diseño final
(«Tarjeta de capa»)

**Prompt para Claude Code**
> Tarea F2.10: LayerCard. Lee `docs/sistema-visual.md` §5.2 y §6.2, y busca la función `capaCard` en
> `docs/design/diseno-final.html`. Modo: [MODO]. Usa los tipos generados de la API, no escribas tipos a mano. La frase
> en lenguaje llano no entra en esta tarea.

---

### E3 · Base de la app y cliente API

**Objetivo:** que la app sepa hablar con la API (con tipos generados y datos falsos mientras no esté desplegada), tenga
rutas, cabecera y esté desplegada desde el primer día.

**Prioridad:** P0 · **Sprint:** S3 · **Área:** Front · Tablero: «Cliente API con tipos generados del OpenAPI; datos
falsos hasta que la API esté desplegada» (P0 S3)

#### F3.0 · Estructura de carpetas por features

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | S | ⚠️ fuera del tablero |

**Descripción**
Crear la estructura de carpetas «por features» y documentarla, para que cada funcionalidad crezca en su carpeta sin
tocar las demás. Mover `App.tsx` a `src/app/`.

```
src/
├─ app/                 arranque de la app: App.tsx, router.tsx, providers.tsx, layout/ (AppHeader), dev/ (StyleGuide)
├─ features/            una carpeta por funcionalidad
│  ├─ explore/          E4 · mapa con los sitios
│  ├─ site-detail/      E5 · detalle del sitio
│  ├─ comparison/       E6
│  ├─ earth-limits/     E7
│  └─ …                 (mission-uses, candidates, assistant en S4)
│     cada una con: components/ · hooks/ · pages/ · index.ts (lo único que se importa desde fuera)
├─ shared/              lo que usan varias features
│  ├─ ui/               componentes base (VerdictChip, Icon, LayerCard…)
│  ├─ api/              schema.d.ts, client.ts, queries.ts, mocks/
│  ├─ i18n/             index.ts, locales/es.json, locales/en.json
│  └─ lib/              utilidades sin React (format.ts)
├─ index.css
└─ main.tsx
```

Reglas: una feature puede importar de `shared/`, pero **no de otra feature** (si dos la necesitan, se sube a
`shared/`). `shared/` nunca importa de `features/`.

**Criterios de aceptación**
- [ ] Carpetas creadas (con un `.gitkeep` o un `index.ts` donde aún no haya nada)
- [ ] `App.tsx` movido a `src/app/` y `main.tsx` actualizado
- [ ] Alias `@/` → `src/` en `tsconfig.app.json` y `vite.config.ts`, para importar `@/shared/ui/VerdictChip` en vez de
      `../../../shared/ui/VerdictChip`
- [ ] La estructura y sus reglas quedan explicadas en `docs/guia-de-trabajo.md` (Fase 4) o, mientras tanto, en el
      `README.md`
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `src/app/` · `src/features/` · `src/shared/` · `src/main.tsx` · `tsconfig.app.json` · `vite.config.ts`
**Depende de:** nada
**Referencias:** supuesto S9 de este plan

**Prompt para Claude Code**
> Tarea F3.0: estructura por features. Lee el apartado F3.0 de `docs/plan/epicas.md` y `CLAUDE.md`. Modo: [MODO].
> Explícame por qué se organiza por features y qué hace el alias `@/` antes de tocar ningún archivo. Sigue la
> documentación actual de Vite para el alias.

#### F3.1 · Generar los tipos de la API con openapi-typescript

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | S | Cliente API (P0 S3) |

**Descripción**
Generar `src/shared/api/schema.d.ts` a partir del `/openapi.json` de la API (levantada en local) y dejar un script para
regenerarlo cuando cambie la API.

**Criterios de aceptación**
- [ ] `openapi-typescript` instalado como dependencia de desarrollo
- [ ] Script `pnpm gen:api` que genera `src/shared/api/schema.d.ts` desde `http://localhost:8000/openapi.json` (o desde la
      URL de la variable de entorno, si se prefiere)
- [ ] `schema.d.ts` se sube al repo, para que quien no tenga la API levantada pueda compilar
- [ ] El `README.md` explica cuándo y cómo regenerarlo
- [ ] Se comprueba qué tipo tiene `parecido` en el OpenAPI (¿`boolean | null`?) y se anota en la PR

**Archivos:** `package.json` · `src/shared/api/schema.d.ts` (generado) · `README.md`
**Depende de:** F3.0 (necesita la API en local: CONTEXTO §4)
**Referencias:** CONTEXTO §4 («Contrato») y §6 · `CLAUDE.md` («Datos y API»)

**Prompt para Claude Code**
> Tarea F3.1: tipos de la API. Lee `CLAUDE.md` y el CONTEXTO §4. Tengo la API levantada en `http://localhost:8000`.
> Modo: [MODO]. No escribas ningún tipo a mano.

#### F3.2 · Cliente de la API con openapi-fetch

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | M | Cliente API (P0 S3) |

**Descripción**
Un cliente tipado que usa `VITE_API_URL` y los tipos generados, y convierte las respuestas de error (`404`, `422`,
`503`, sin conexión) en un error propio con el código, para que `ErrorState` sepa qué mensaje mostrar.

**Criterios de aceptación**
- [ ] `openapi-fetch` instalado (con el OK previo)
- [ ] `src/shared/api/client.ts` crea el cliente con `import.meta.env.VITE_API_URL` y, si no existe, el valor por defecto
      del README
- [ ] Error propio `ApiError` con `status` y `detail` (el `{"detail": "..."}` de la API)
- [ ] Funciones para los endpoints del MVP: `getSites`, `getSitesGeojson`, `getSite`, `getPairs`, `getHealth`
- [ ] Test con Vitest de la conversión de errores (si F2.2 existe)
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `package.json` · `src/shared/api/client.ts` · `src/shared/api/client.test.ts`
**Depende de:** F3.1
**Referencias:** CONTEXTO §6 (endpoints y errores) · `README.md` (variables de entorno)

**Prompt para Claude Code**
> Tarea F3.2: cliente de la API. Lee el CONTEXTO §6 y `src/shared/api/schema.d.ts`. Modo: [MODO]. Justifica `openapi-fetch`
> antes de instalarlo. Los nombres de los campos de la API no se traducen.

#### F3.3 · Datos falsos con la forma real de la API

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | M | Cliente API (P0 S3) |

**Descripción**
Respuestas guardadas de la API **real** (levantada en local) para poder trabajar y desplegar el front aunque la API no
esté desplegada. Se activan con una variable de entorno.

**Criterios de aceptación**
- [ ] Respuestas reales copiadas de la API local (no escritas a mano) en `src/shared/api/mocks/`: `sitios`,
      `sitios/geojson`, `sitios/artemis-malapert-massif`, `sitios/ez-jezero-isidis-syrtis` y sus `parejas` de una capa
- [ ] Variable `VITE_USE_MOCKS=true` que hace que el cliente lea esos archivos en vez de llamar a la API
- [ ] Añadida a `.env.example` y al `README.md`
- [ ] Con los datos falsos, la app no hace ninguna petición a la API (comprobado en la pestaña Red)

**Archivos:** `src/shared/api/mocks/*.json` · `src/shared/api/client.ts` · `.env.example` · `README.md`
**Depende de:** F3.2
**Referencias:** CONTEXTO §6 («Mientras no existan, el front puede maquetar con datos falsos con la forma esperada»)

**Prompt para Claude Code**
> Tarea F3.3: datos falsos. Lee el CONTEXTO §6. Modo: [MODO]. Los JSON se descargan de la API local con los comandos
> que me propongas; no inventes ningún dato.

#### F3.4 · TanStack Query y hooks de datos

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | M | Cliente API (P0 S3) |

**Descripción**
Configurar TanStack Query y crear un hook por cada consulta del MVP, para que las vistas tengan carga, error,
reintento y caché sin programarlo cada vez.

**Criterios de aceptación**
- [ ] `@tanstack/react-query` instalado (con el OK previo) y `QueryClientProvider` en `main.tsx`
- [ ] Hooks `useSites(cuerpo)`, `useSitesGeojson()`, `useSite(id)`, `usePairs(id, capa)`
- [ ] Los errores `404` y `422` no se reintentan solos; el `503` y los fallos de red sí (una vez)
- [ ] Ejemplo de uso con `LoadingState` / `ErrorState` en `StyleGuide` o en `App`

**Archivos:** `package.json` · `src/main.tsx` · `src/shared/api/queries.ts`
**Depende de:** F3.2, F2.9
**Referencias:** supuesto S2 de este plan · CONTEXTO §6

**Prompt para Claude Code**
> Tarea F3.4: TanStack Query. Modo: [MODO]. Explícame primero qué problema resuelve y qué es una «query key». Sigue la
> documentación actual de TanStack Query v5.

#### F3.5 · Rutas, layout y cabecera (`AppHeader`)

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | L | Vista de detalle · Globo/mapa (P0 S3) |

**Descripción**
React Router con las rutas que decida F0.1, un layout común con `AppHeader` (logo, navegación, conmutador de cuerpo y
de idioma) y una página 404 propia. Las páginas pueden estar vacías: se rellenan en E4 y E5.

**Criterios de aceptación**
- [ ] `react-router` instalado (con el OK previo) y rutas de `docs/arquitectura-pantallas.md`
- [ ] `AppHeader` con `header-gradient`, línea del horizonte y los elementos del §6.2
- [ ] «Usos de misión» y «Fuentes» ocultos o deshabilitados hasta el S4
- [ ] El conmutador de idioma cambia todos los textos y `<html lang>`
- [ ] Página «no encontrada» con el mismo layout
- [ ] Se ve bien en escritorio y por debajo de 820 px
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `package.json` · `src/main.tsx` · `src/App.tsx` · `src/app/layout/AppHeader.tsx` · `src/app/router.tsx` · `src/features/*/`
**Depende de:** F0.1, F1.5, F2.1, F2.8
**Referencias:** `docs/sistema-visual.md` §6.2 (`AppHeader`, `Logo`) · `docs/arquitectura-pantallas.md`

**Prompt para Claude Code**
> Tarea F3.5: rutas y cabecera. Lee `docs/arquitectura-pantallas.md` y `docs/sistema-visual.md` §6.2. Modo: [MODO].
> Explícame cómo funciona un layout con rutas anidadas antes de escribirlo.

#### F3.6 · Desplegar el front en Vercel

| Prioridad | Sprint | Área | Tamaño | Tablero |
|---|---|---|---|---|
| P0 | S3 | Front | S | ⚠️ fuera del tablero (lo exige la definición de «hecho») |

**Descripción**
Conectar el repo a Vercel para que cada PR tenga una vista previa y `main` se publique solo. Mientras la API no tenga
URL pública, el despliegue usa los datos falsos.

**Criterios de aceptación**
- [ ] Proyecto de Vercel conectado al repo (lo hace quien tenga permisos: Max o el equipo)
- [ ] Variables `VITE_API_URL` y `VITE_USE_MOCKS` configuradas en Vercel
- [ ] Cada PR a `dev` genera una URL de vista previa
- [ ] Las rutas internas funcionan al recargar la página (reescritura a `index.html`)
- [ ] La URL de producción está en el `README.md`
- [ ] Cuando la API esté desplegada, se pide al back que añada el dominio de Vercel a `CORS_ORIGINS` (issue B6)

**Archivos:** `vercel.json` (si hace falta para las rutas) · `README.md`
**Depende de:** F3.3 (y F3.5 para comprobar las rutas)
**Referencias:** CONTEXTO §2 («Hecho») y §4 (despliegue previsto en Vercel, CORS)

**Prompt para Claude Code**
> Tarea F3.6: despliegue en Vercel. Lee el CONTEXTO §2 y §4. Modo: [MODO]. Dime qué pasos hago yo en la web de Vercel y
> qué cambia en el repo. No subas secretos.

---

## 6. Resto de épicas

Se detallarán cuando toque, con el mismo formato. Las que tienen ⚠️ incluyen sub-issues fuera del tablero.

### E4 · Explorar: mapa con los sitios

> Detallada el 15 nov solo en parte: por falta de tiempo se empieza por la lista (F4.6 + F4.7), que no depende del
> mapa base. F4.5 (conmutador Luna / Marte) ya está hecha con las rutas (#13). El resto se detalla al empezarlo.

**Objetivo:** ver los 160 sitios de su cuerpo (en una lista y en el mapa), filtrarlos y entrar al detalle de uno.

**Prioridad:** P0 · **Área:** Front · Tablero: «Globo/mapa con los sitios reales (`/sitios/geojson`), coloreado por
cuerpo/tipo o por veredicto»

> **Datos:** la lista usa `GET /api/v1/sitios?cuerpo=` (tipo generado, hook `useSites(cuerpo)`): 67 sitios en la Luna
> y 93 en Marte con la API v0.3.0. El mapa usará `GET /api/v1/sitios/geojson`.

**F4.1 · Mapa base: decidido (15 nov).** SVG propio con la imagen equirectangular de NASA Solar System Treks (Luna:
mosaico LRO WAC; Marte: mosaico Viking MDIM 2.1). MapLibre en globo no sirve para el polo sur de la Luna (supuesto S4b).
Sin issue propia: la decisión queda aquí y en `sistema-visual.md` §8 (pendiente 9).

**Sub-issues pendientes de detallar:** F4.8 elegir el color de Marte (pendiente 1) ⚠️. F4.2 y F4.3 se juntan en una
sola sub-issue (abajo). F4.4 se detalla abajo solo con la leyenda de formas: colorear por veredicto no entra, porque la
API no da un veredicto por sitio y el front no recalcula veredictos (`CLAUDE.md`).

#### F4.6 · Lista de sitios en Explorar (incluye F4.7)

| Prioridad | Área | Tamaño |
|---|---|---|
| P0 | Front | M |

**Descripción**
La página Explorar (`/:cuerpo`) muestra todos los sitios del cuerpo en una lista agrupada por tipo. Cada sitio enlaza a
su detalle (`/:cuerpo/:siteId`). Es la alternativa accesible al mapa y, mientras no haya mapa, la forma de entrar al
detalle.

**Criterios de aceptación**
- [ ] `ExplorePage` pide los sitios con `useSites(cuerpo)`; cargando con `LoadingState`, error con `ErrorState` y
      «Reintentar», y `EmptyState` si no hay sitios
- [ ] Bajo el `<h1>`, el número de sitios con plural de i18n
- [ ] Un grupo por `tipo`, con su nombre de i18n y su número en un `<h2>`, en el orden de `siteType` de i18n; los
      sitios de cada grupo por orden alfabético. Un `tipo` desconocido se muestra tal cual, al final
- [ ] Cada sitio: nombre como enlace a su detalle y recuento «N de M capas funcionan» contando solo los `=== true` de
      `parecidos` (como `VerdictPanel`)
- [ ] La agrupación y el orden están en una función pura (`groupSitesByType`), lista para probarla en la #23
- [ ] Una columna en móvil y dos desde 820 px (`md2:`); a 320 px sin scroll horizontal
- [ ] Textos nuevos en `es.json` y `en.json`; probada en Luna y Marte, en español e inglés, y con teclado
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `src/features/explore/pages/ExplorePage.tsx` · `src/features/explore/components/*` ·
`src/shared/i18n/locales/*.json`
**Depende de:** #13 (rutas)
**Referencias:** `docs/arquitectura-pantallas.md` · `docs/sistema-visual.md` §6 (estados comunes) · `VerdictPanel`
(recuento) · tipo `SitioResumen` en `src/shared/api/schema.d.ts`

**Prompt para Claude Code**
> Tarea F4.6: lista de sitios en Explorar. Lee `docs/arquitectura-pantallas.md` y los estados comunes de
> `docs/sistema-visual.md` §6. Modo: [MODO]. Usa `useSites(cuerpo)` y los tipos generados; el recuento cuenta solo los
> `=== true`.

#### F4.2 · Mapa de sitios en SVG (`BodyMap`, incluye F4.3)

| Prioridad | Área | Tamaño |
|---|---|---|
| P0 | Front | M |

**Descripción**
Encima de la lista de Explorar, un mapa del cuerpo: la imagen equirectangular de NASA Trek de fondo y un marcador por
sitio, con la forma de su tipo, que enlaza a su detalle. En la Luna, además, una vista del polo sur (por debajo de
80° S), donde están los sitios de Artemis. Decisión y motivo en el supuesto S4b.

**Criterios de aceptación**
- [ ] `BodyMap` recibe el `cuerpo` y los sitios de `useSites(cuerpo)` (la misma petición que la lista, sin pedir nada más)
- [ ] Fondo: imagen de NASA Solar System Treks (Luna: LRO WAC; Marte: Viking MDIM 2.1); mientras carga, `bg-map`.
      Pie con la fuente («NASA Solar System Treks»)
- [ ] Posición con una función pura (`x = (lon + 180) / 360`, `y = (90 − lat) / 180`), lista para probarla en la #23
- [ ] Marcadores por forma según el tipo (`SiteMarker`, §6.3): región Artemis, aterrizaje (rombo), cueva (anillo y
      punto). Color `body-moon` en la Luna; en Marte, `foreground` hasta decidir su color (F4.8)
- [ ] Luna: vista del polo sur con anillos de latitud (centro = polo, borde = 80° S), como el esquema del diseño final
- [ ] Cada marcador enlaza a `/:cuerpo/:siteId` y muestra el nombre al pasar el ratón. Con teclado se usa la lista, que
      tiene los mismos enlaces: el mapa no añade 67 paradas de tabulador (el mapa se anuncia con un texto que lo explica)
- [ ] Se adapta al ancho: en móvil, el mapa y la vista polar uno debajo del otro; desde 820 px, uno al lado del otro
- [ ] Sin dependencias nuevas; `pnpm lint` y `pnpm build` en verde; probado en Luna y Marte, es/en y a 320 px

**Archivos:** `src/features/explore/components/BodyMap.tsx` · `src/features/explore/components/*` ·
`src/features/explore/pages/ExplorePage.tsx` · `src/shared/i18n/locales/*.json`
**Depende de:** #60 (lista de sitios)
**Referencias:** `docs/sistema-visual.md` §6.3 (`BodyMap`, `SiteMarker`) y §8 (pendiente 9) · supuesto S4b ·
`docs/design/diseno-final.html` (función `moonMap`)

**Prompt para Claude Code**
> Tarea F4.2: mapa de sitios en SVG. Lee el supuesto S4b de `docs/plan/epicas.md`, `docs/sistema-visual.md` §6.3 y la
> función `moonMap` de `docs/design/diseno-final.html`. Modo: [MODO]. Sin MapLibre ni dependencias nuevas.

#### F4.4 · Leyenda del mapa

| Prioridad | Área | Tamaño |
|---|---|---|
| P1 | Front | S |

**Descripción**
Debajo de los mapas de Explorar, una leyenda que explica qué forma tiene cada tipo de sitio: región (cuadrado),
aterrizaje (rombo) y cueva (anillo con punto). Cada entrada lleva el dibujo y la palabra, nunca solo el dibujo.

**Criterios de aceptación**
- [ ] El dibujo de cada forma se saca de `SiteMarker` a un componente propio (`MarkerShape`) y lo usan el marcador y la
      leyenda, para que nunca se vean distintos
- [ ] La relación tipo → forma vive en un archivo `.ts` aparte (`siteShapes.ts`), junto con el color de cada cuerpo
- [ ] La leyenda es una lista (`<ul>`) con nombre accesible («Leyenda del mapa»), con el color del cuerpo en los dibujos
- [ ] Solo salen las formas que aparecen en los sitios del cuerpo
- [ ] Textos nuevos en `es.json` y `en.json`; probada en Luna y Marte, en español e inglés, y a 320 px
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `src/features/explore/components/MarkerShape.tsx` · `src/features/explore/components/siteShapes.ts` ·
`src/features/explore/components/MapLegend.tsx` · `SiteMarker.tsx` · `MapFrame.tsx` · `ExplorePage.tsx` ·
`src/shared/i18n/locales/*.json`
**Depende de:** #62 (mapas)
**Referencias:** `docs/sistema-visual.md` §6.3 (`SiteMarker`) y §5.1 (siempre dibujo y palabra)

**Prompt para Claude Code**
> Tarea F4.4: leyenda del mapa. Lee `docs/sistema-visual.md` §6.3 y `SiteMarker.tsx`. Modo: [MODO]. Saca la forma a un
> componente compartido; no colorees por veredicto.

### E5 · Detalle del sitio

> Detallada el 14 nov (antes solo había un resumen). La antigua F5.6 (estados `404` / `503`) queda dentro de F5.3.

**Objetivo:** la pantalla Malapert ↔ Lofoten del diseño final, con datos reales de `GET /sitios/{id}`: migas, nombre y
datos del sitio, frase en lenguaje llano, mapas, panel «Dónde funciona / dónde falla» y panel «Mejor pareja».

**Prioridad:** P0 · **Área:** Front · Tablero: «Vista de detalle del sitio» y «Panel “dónde funciona / dónde falla”»

> **Datos:** todo sale de `GET /api/v1/sitios/{id}` (tipo generado `SitioDetalle`) con el hook `useSite(id)`. Para
> probar: `artemis-malapert-massif` (CONTEXTO §6).

#### F5.1 · Componentes `SiteHeader` y `Breadcrumbs`

| Prioridad | Área | Tamaño |
|---|---|---|
| P0 | Front | M |

**Descripción**
La cabecera del detalle: migas, nombre del sitio, chip del tipo y una línea de datos (coordenadas, área, fuente y
número de capas), como en la pantalla final del diseño.

**Criterios de aceptación**
- [ ] `SiteHeader` recibe el `SitioDetalle` de la API (tipo generado) y no inventa ningún dato
- [ ] Nombre del sitio en `<h1>` con `text-site-title`, peso 800 y `tracking-display`, y `SiteTypeChip` con el `tipo`
- [ ] Coordenadas con el formateo del idioma y su hemisferio (`85,9948° S · 0,2358° O`); si `lat` / `lon` son `null`,
      no se muestran
- [ ] Área con `formatArea` si `propiedades.area_km2` es un número; fuente de `propiedades.fuente` con enlace a
      `propiedades.url_fuente` si existe; número de capas (`capas`) con plural de i18n
- [ ] `Breadcrumbs`: `<nav aria-label>` de i18n, separador «›» decorativo, último elemento con `aria-current="page"`.
      Niveles: cuerpo › tipo de sitio › nombre. Mientras no haya rutas (#13), los dos primeros niveles son texto
- [ ] Textos nuevos en `es.json` y `en.json`; se ve bien en español y en inglés, y a 320 px sin scroll horizontal
- [ ] Añadidos a `StyleGuide` con los datos reales de Malapert Massif
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `src/features/site-detail/components/SiteHeader.tsx` · `src/features/site-detail/components/Breadcrumbs.tsx`
· `src/shared/i18n/locales/*.json`
**Depende de:** nada (usa `SiteTypeChip`, el formateo y los tipos generados, ya hechos)
**Referencias:** `docs/sistema-visual.md` §6.2 (`SiteHeader`, `Breadcrumbs`) · `docs/design/diseno-final.html`
(función `detail`, variable `head`) · tipo `SitioDetalle` en `src/shared/api/schema.d.ts`

**Prompt para Claude Code**
> Tarea F5.1: SiteHeader y Breadcrumbs. Lee `docs/sistema-visual.md` §6.2 y la variable `head` de la función `detail`
> en `docs/design/diseno-final.html`. Modo: [MODO]. Usa los tipos generados y los datos reales de la API local; no
> inventes ningún dato.

#### F5.2 · Componentes `LayerRow` y `VerdictPanel`

| Prioridad | Área | Tamaño |
|---|---|---|
| P0 | Front | M |

**Descripción**
El panel «Dónde funciona / dónde falla»: una fila por capa con su veredicto y una línea de detalle, y el recuento de
capas que funcionan.

**Criterios de aceptación**
- [ ] `LayerRow` recibe un elemento de `resumen` (tipo generado): `VerdictChip` del sitio + nombre de la capa (i18n) +
      una línea de detalle con la mejor pareja (nombre · distancia formateada · verificación si la hay). Sin `mejor`,
      «Dato pendiente»
- [ ] Estilos del §6.2: `bg-surface`, `rounded-row`, `p-3`
- [ ] `VerdictPanel` recibe el `SitioDetalle`: título «Dónde funciona / dónde falla» en `<h2>`, recuento «1 de 5 capas
      funcionan» contando los `=== true` de `parecidos` (con plural de i18n) y la lista de `LayerRow`
- [ ] El recuento compara con `=== true`: `null` no cuenta como «funciona» ni como «falla»
- [ ] `EarthLimitsBox` no entra (es la F7.1 de E7)
- [ ] Textos nuevos en `es.json` y `en.json`; añadidos a `StyleGuide` con los datos reales de Malapert Massif
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `src/features/site-detail/components/LayerRow.tsx` · `src/features/site-detail/components/VerdictPanel.tsx`
· `src/shared/i18n/locales/*.json`
**Depende de:** nada (usa `VerdictChip`, `VerificationChip` y el formateo, ya hechos)
**Referencias:** `docs/sistema-visual.md` §5.1, §5.2 y §6.2 (`LayerRow`, `VerdictPanel`) · `docs/design/diseno-final.html`
(`LROWS`, `rowsHTML`) · campos `parecidos` y `resumen` de la API

**Prompt para Claude Code**
> Tarea F5.2: LayerRow y VerdictPanel. Lee `docs/sistema-visual.md` §5.1, §5.2 y §6.2, y `LROWS` / `rowsHTML` en
> `docs/design/diseno-final.html`. Modo: [MODO]. El recuento cuenta solo los `=== true`; `null` no es `false`.

#### F5.3 · Página de detalle del sitio

| Prioridad | Área | Tamaño |
|---|---|---|
| P0 | Front | L |

**Descripción**
La pantalla `SiteDetailPage` de la feature `site-detail`: pide el sitio con `useSite(id)` y junta la cabecera (F5.1),
el panel de veredictos (F5.2) y el panel «Mejor pareja» con una `LayerCard`, con sus estados de carga y error
(incluye la antigua F5.6). Mientras no haya rutas (#13), se muestra en `App` con un sitio fijo (Malapert Massif).

**Criterios de aceptación**
- [ ] `SiteDetailPage` recibe el `id` del sitio y usa `useSite(id)`; se exporta desde `src/features/site-detail/index.ts`
- [ ] Cargando: `LoadingState` con el tamaño aproximado de la página. Error: `ErrorState` con «Reintentar»
      (`refetch`), con el mensaje de `404` (sitio desconocido) y `503` (API sin datos)
- [ ] Panel «Mejor pareja»: la `LayerCard` de la capa con `hay_parecido === true` y menor distancia; si no hay
      ninguna, la de menor distancia entre todas. Siempre sale de los datos
- [ ] Distribución del diseño final: cabecera arriba y, debajo, los dos paneles en dos columnas desde 820 px (`md2:`)
      y en una sola columna por debajo
- [ ] Un solo `<h1>` (nombre del sitio); los títulos de los paneles en `<h2>` y los de las tarjetas en `<h3>`
- [ ] Mientras no exista la #13, `App` muestra `SiteDetailPage` con `artemis-malapert-massif` en lugar del título
      provisional
- [ ] Probada con la API local (y con un `id` inexistente para el `404`), a 320 px y en escritorio, y con teclado
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `src/features/site-detail/pages/SiteDetailPage.tsx` · `src/features/site-detail/index.ts` ·
`src/app/App.tsx` · `src/shared/i18n/locales/*.json`
**Depende de:** F5.1, F5.2
**Referencias:** `docs/sistema-visual.md` §6.2 · `docs/design/diseno-final.html` (función `detail`, caso `'f'`) ·
`useSite` en `src/shared/api/queries.ts`

**Prompt para Claude Code**
> Tarea F5.3: página de detalle. Lee el caso `'f'` de la función `detail` en `docs/design/diseno-final.html` y
> `docs/sistema-visual.md` §6.2. Modo: [MODO]. Usa `useSite`, `LoadingState` y `ErrorState`; no escribas tipos a mano.

#### F5.4 · Frase en lenguaje llano (`PlainSummary`) ⚠️

| Prioridad | Área | Tamaño |
|---|---|---|
| P1 | Front | M |

**Descripción**
La frase de entrada del diseño («Malapert Massif se parece a Lofoten en la roca y el relieve, pero falla en la
temperatura…»), construida con plantillas de i18n sobre los datos de la API, nunca escrita a mano.

**Criterios de aceptación**
- [ ] Plantillas de i18n (es / en) que solo usan datos de `SitioDetalle` (nombre, capas que funcionan y que fallan,
      mejor pareja, brechas)
- [ ] La frase sobre temperatura solo se muestra cuando el back confirme el signo de `brecha_*` (B4)
- [ ] Sin datos suficientes, la frase no se muestra
- [ ] `font-display` 700, `text-lede`, `max-w-[40ch]`; palabras de «funciona» en `verdict-pass` y de «falla» en
      `verdict-fail`, sin tachado
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `src/features/site-detail/components/PlainSummary.tsx` · `src/shared/i18n/locales/*.json`
**Depende de:** F5.3 · B4 (signo de `brecha_*`, pregunta al back)
**Referencias:** `docs/sistema-visual.md` §6.2 (`PlainSummary`) y §8 (pendiente 4) · `docs/design/diseno-final.html`
(`hero-line`)

**Prompt para Claude Code**
> Tarea F5.4: PlainSummary. Lee `docs/sistema-visual.md` §6.2 y §8 (pendiente 4). Modo: [MODO]. No escribas ninguna
> frase a mano: plantillas de i18n sobre datos de la API.

#### F5.5 · Fila de mapas (`MapsRow`)

| Prioridad | Área | Tamaño |
|---|---|---|
| P0 | Front | L |

**Descripción**
El mapa del cuerpo con el sitio, el arco «puente» con la capa y la distancia, y el mapa de la Tierra con la pareja,
a la misma altura.

**Criterios de aceptación**
- [ ] `MapsRow` con `BodyMap` · `MapBridge` · `EarthMap`, misma altura; por debajo de 820 px se apilan y el puente
      gira 90°
- [ ] `MapBridge`: arco y punto `accent` + nombre de capa + distancia en `font-mono`
- [ ] `EarthMap` con «posición pendiente» (marcador discontinuo) mientras la API no dé la posición de la pareja (B1)
- [ ] Cada mapa con texto alternativo; animaciones solo con `motion-safe:`
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `src/features/site-detail/components/MapsRow.tsx` · `MapBridge.tsx` · `EarthMap.tsx`
**Depende de:** F5.3 · F4.2 (`BodyMap`, de E4) · B1 (posición de las parejas)
**Referencias:** `docs/sistema-visual.md` §6.3 · `docs/design/diseno-final.html` (`maps-row`, `bridge`)

**Prompt para Claude Code**
> Tarea F5.5: MapsRow. Lee `docs/sistema-visual.md` §6.3. Modo: [MODO]. Usa el `BodyMap` de F4.2; no inventes la
> posición de las parejas.

### E6 · Comparación sitio ↔ análogo · P1 · S3
**Objetivo:** ver todas las parejas de una capa y comparar variable a variable el sitio y su análogo.
**Tablero:** «Comparación de variables entre sitio y análogo (`/parejas` + `detalles`)».
**Sub-issues:** F6.1 lista «ver todas» con `GET /sitios/{id}/parejas?capa=&n=` · F6.2 tabla sitio vs pareja con
`datos_capas` y `detalles` · F6.3 brechas en °C con su signo explicado (depende de B4).

### E7 · Límites de la Tierra

> Detallada el 15 nov. La API v0.3.0 no trae nada sobre los límites, y la documentación solo los nombra (CONTEXTO §1:
> «gravedad, vacío lunar, atmósfera marciana, radiación»; `sistema-visual.md` §6.2, `EarthLimitsBox`). El front muestra
> esos nombres y la frase del diseño; las explicaciones y sus fuentes las tiene que dar el equipo de datos (F7.3).

**Objetivo:** explicar por qué ningún sitio de la Tierra reproduce la gravedad, el vacío, la atmósfera ni la radiación.

**Prioridad:** P1 · **Área:** Front · Tablero: «Sección “Límites de la Tierra como análogo”»

#### F7.1 + F7.2 · Límites de la Tierra: caja del detalle y página

| Prioridad | Área | Tamaño |
|---|---|---|
| P1 | Front | S |

**Descripción**
La caja «Límites de la Tierra como análogo · siempre fallan» del diseño final (`EarthLimitsBox`), debajo de las capas en
el panel «Dónde funciona / dónde falla» del detalle, y la página `/limites-tierra` con una caja por cuerpo. Solo los
nombres de los límites y la frase del diseño: ninguna cifra hasta que lleguen los textos del equipo (F7.3).

**Criterios de aceptación**
- [ ] `EarthLimitsBox` en `shared/ui` (la usan dos features), con los estilos del §6.2: `bg-surface`, borde discontinuo,
      chips con borde `verdict-fail` e icono ✗ (siempre icono y palabra)
- [ ] Recibe el `cuerpo`: Luna → gravedad reducida, vacío lunar, radiación; Marte → gravedad reducida, atmósfera
      marciana, radiación. Un cuerpo desconocido no muestra la caja
- [ ] Título «Límites de la Tierra como análogo · siempre fallan» y la frase «Ninguna pareja de la Tierra los reproduce»
- [ ] En el detalle, dentro de `VerdictPanel`, debajo de la lista de capas
- [ ] Página `/limites-tierra`: `<h1>`, una sección por cuerpo con su `<h2>` y su caja, y «Dato pendiente» donde irán las
      explicaciones y las fuentes
- [ ] Textos en `es.json` y `en.json`; probado en un detalle de la Luna y otro de Marte, en la página, es/en y 320 px
- [ ] `pnpm lint` y `pnpm build` en verde

**Archivos:** `src/shared/ui/EarthLimitsBox.tsx` · `src/features/site-detail/components/VerdictPanel.tsx` ·
`src/features/earth-limits/pages/EarthLimitsPage.tsx` · `src/shared/i18n/locales/*.json`
**Depende de:** #50 (VerdictPanel) y #13 (ruta de la página)
**Referencias:** `docs/sistema-visual.md` §6.2 (`EarthLimitsBox`) · `docs/design/diseno-final.html` (función `limits`)

**Prompt para Claude Code**
> Tarea F7.1 + F7.2: límites de la Tierra. Lee `docs/sistema-visual.md` §6.2 y la función `limits` de
> `docs/design/diseno-final.html`. Modo: [MODO]. Solo nombres y la frase del diseño; no escribas ninguna cifra.

#### F7.3 · Pedir al equipo de datos los textos y las fuentes de los límites ⚠️

| Prioridad | Área | Tamaño |
|---|---|---|
| P1 | Datos | S |

**Descripción**
El front no puede inventar datos científicos. Para completar la página «Límites de la Tierra» hace falta, por cada
límite y cuerpo, una o dos frases que expliquen por qué la Tierra no lo reproduce, con su cifra si la hay y su fuente,
en español y en inglés.

**Criterios de aceptación**
- [ ] Textos para: gravedad reducida (Luna y Marte), vacío lunar, atmósfera marciana y radiación (Luna y Marte)
- [ ] Cada texto con su fuente (nombre y URL) y en los dos idiomas
- [ ] Decidido si llegan por la API (un endpoint o un campo en `/meta`) o como texto fijo en i18n del front

**Depende de:** el equipo de datos
**Referencias:** CONTEXTO §1 · `docs/sistema-visual.md` §6.2 (`EarthLimitsBox`)

### E8 · Capas del índice, regiones e imágenes · P1/P2 · S3
**Objetivo:** mostrar en el mapa las capas PNG del índice y las regiones, y enlazar imágenes de NASA Worldview.
**Tablero:** «Capas del índice (PNG) y regiones en MapLibre» (P1) · «Imágenes de NASA Worldview enlazadas en el
detalle» (P2).
**Sub-issues:** F8.1 capa PNG del índice en `EarthMap` · F8.2 regiones candidatas (depende de B1) · F8.3 control para
mostrar u ocultar capas · F8.4 enlace a Worldview en el detalle (P2).

### E9 · Usos de misión y ranking · P0 · S4
**Objetivo:** enfoque D: elegir un uso (aterrizaje, movilidad, ISRU…) y ver los análogos ordenados para ese uso.
**Tablero:** «Selector de uso de misión y ranking (enfoque D)».
**Sub-issues:** F9.1 regenerar tipos cuando existan `/usos` y `/ranking` · F9.2 selector de uso · F9.3 vista de
ranking · F9.4 `?uso=` en las parejas del detalle · F9.5 activar «Usos de misión» en la cabecera.

### E10 · Candidatos M1 · P1 · S4
**Objetivo:** mostrar en el mapa de la Tierra los análogos nuevos que propone el modelo, con su explicación.
**Tablero:** «Candidatos nuevos de M1 en el mapa, con explicación (SHAP)».
**Sub-issues:** F10.1 capa de candidatos (marcador discontinuo `body-earth`) con `/candidatos?uso=` · F10.2 panel de
explicación SHAP · F10.3 mapa de probabilidad `/mapas/{uso}.png`.

### E11 · Asistente · P1 · S4
**Objetivo:** chat que responde con fuentes citadas y números sacados de la API.
**Tablero:** «Asistente en la web: chat con fuentes citadas».
**Sub-issues:** F11.1 interfaz del chat (mensajes, envío, carga, error, límite de uso) · F11.2 conexión con
`POST /asistente` · F11.3 citas enlazadas a las fuentes.

### E12 · Pulido e integración final · P0/P1 · S4
**Objetivo:** llegar a la congelación del jueves 12 nov y al despliegue del viernes 13 con todo integrado y revisado.
**Tablero:** «Pulir interfaz» (P1) · «Integración final del front» (P0).
**Sub-issues:** F12.1 conectar la API desplegada y quitar los datos falsos · F12.2 página «Fuentes» con `/fuentes` ·
F12.3 revisión de accesibilidad (teclado, contraste, lector de pantalla, reducir movimiento) ⚠️ · F12.4 revisión en
móvil · F12.5 textos en inglés completos · F12.6 PR `dev → main` y comprobación en producción.

---

## 7. Tareas que no están en el tablero (pedir a Max)

Estas sub-issues no salen de la lista de tareas del front del CONTEXTO. Conviene pedirle a Max que las añada (o que
diga cuáles no se hacen):

| Sub-issue | Prioridad · Sprint | Por qué hace falta |
|---|---|---|
| F0.1 Arquitectura de pantallas y rutas | P0 · S3 | Sin ella no se pueden hacer las rutas ni las vistas |
| F0.2 Wireframe de «Explorar» | P0 · S3 | El diseño final solo dibuja el detalle |
| E1 completa (F1.1 a F1.5): documentación, fuentes, tokens, página de muestra, logo | P0/P1 · S3 | Base de todas las tareas visuales; el logo actual lleva la insignia de la NASA |
| F2.1 i18n y formateo de números | P0 · S3 | El diseño exige interfaz bilingüe desde el día 1 |
| F2.2 Vitest | P1 · S3 | Proteger las piezas donde un fallo engaña (`null` ≠ `false`) |
| F2.3 `Icon` | P0 · S3 | Lo usan todos los chips |
| F3.0 Estructura de carpetas por features | P0 · S3 | Base de la arquitectura escalable |
| F3.6 Despliegue en Vercel | P0 · S3 | La definición de «hecho» exige que esté desplegado |
| F4.1 Mapa base | P0 · S3 | Pendiente 9 del sistema visual |
| F4.6 Lista accesible de sitios | P1 · S3 | Un mapa no se puede usar con teclado ni lector de pantalla |
| F4.8 Color de Marte | P1 · S3 | Pendiente 1 del sistema visual |
| F5.4 Frase en lenguaje llano | P1 · S3 | Es parte del diseño aprobado (C) |
| F7.3 Textos de «Límites» con fuentes | P1 · S3 | El front no puede inventar las cifras |
| F12.3 Revisión de accesibilidad | P1 · S4 | Lo exige el diseño (5.6) |

---

## 8. Issues para el repo del back

Repo: `mr-melenas/Pathfinders42`. Son las peticiones que salen del diseño y de este plan. Cada una lleva su título y
el texto para el cuerpo.

### B1 · Posición y geometría de las parejas de la Tierra (`/analogos`)

**Título:** Exponer posición y geometría de los análogos de la Tierra (`/analogos`, `/analogos/{id}`)

> El front necesita pintar en el mapa de la Tierra la pareja de cada sitio (p. ej. `lofoten_flakstadoy` para Malapert
> Massif). Hoy `resumen[].mejor` y `/parejas` dan `id`, `nombre`, `distancia` y `detalles`, pero no la posición.
> En el CONTEXTO está planificado `GET /analogos` y `/analogos/{id}` para el S3.
>
> **Qué pedimos:** que cada análogo tenga al menos `id`, `nombre`, `lat`, `lon` y, si existe, `geometria` (GeoJSON),
> con el mismo `id` que usa `/parejas`. Si es más fácil, añadir `lat`/`lon` a cada pareja de `/parejas` también nos
> sirve.
>
> **Para qué:** `EarthMap` del detalle del sitio y la capa de regiones (E8). Mientras no exista, el front muestra
> «posición pendiente».
>
> Prioridad P0 · Sprint S3 · Área Back · Lo pide: Front

### B2 · Fuente (dataset) de cada capa en el resumen del sitio

**Título:** Añadir la fuente de datos de cada capa en `resumen` de `GET /sitios/{id}`

> El diseño pone al pie de cada tarjeta de capa «Capa · Fuente · N parejas», porque el reto puntúa que cada dato diga
> de dónde sale. Hoy solo hay fuente a nivel de sitio (`propiedades.fuente`).
>
> **Qué pedimos:** un campo por capa con el nombre de los datasets usados (p. ej. para clima, Diviner para la Luna y
> MODIS para la Tierra) y, si se puede, su URL. Puede ser un campo en cada elemento de `resumen` o una tabla en
> `/capas` que el front cruce por `capa`.
>
> **Relacionado:** `GET /fuentes` está previsto para el S4; si se adelanta, se puede usar eso.
>
> Prioridad P1 · Sprint S3 · Área Back · Lo pide: Front

### B3 · Textos en inglés de nombres y descripciones

**Título:** Decidir cómo se sirven en inglés `descripcion` de capa y textos de la API

> La interfaz es bilingüe (es/en). La API devuelve `descripcion` de cada capa solo en español.
>
> **Propuesta del front (no hace falta cambiar la API):** las 6 descripciones de capa y los nombres de `tipo` van en
> los archivos de traducción del front, con `capa` y `tipo` como clave, y los nombres propios de sitios y análogos no
> se traducen. **Pedimos confirmar** que `capa` y `tipo` son estables (no van a cambiar de valor), o, si preferís,
> añadir `descripcion_en` en la API.
>
> Prioridad P2 · Sprint S3 · Área Back · Lo pide: Front

### B4 · Confirmar el signo de `brecha_*`

**Título:** Documentar el signo de `brecha_ts_media` y `brecha_ts_min` (¿sitio − pareja?)

> En clima, Malapert ↔ Askja trae `brecha_ts_media: -121.7` y `brecha_ts_min: -188.2`. El front quiere escribir
> «Malapert es 121,7 °C más frío de media que Askja», pero solo es correcto si la brecha es **sitio − pareja**.
>
> **Qué pedimos:** confirmar el sentido y, si se puede, añadirlo a la descripción del campo en el OpenAPI.
>
> Prioridad P1 · Sprint S3 · Área Back · Lo pide: Front

### B5 · Verificación de la pareja en todas las capas

**Título:** Incluir `verificacion` (verificada / candidato) de la pareja en todas las capas

> El diseño muestra en cada análogo el chip «verificada / candidato». Hoy `detalles.verificacion` solo aparece en
> algunas capas (p. ej. `anortosita`).
>
> **Qué pedimos:** que cada pareja traiga `verificacion` cuando el análogo está en la ficha, y que el campo falte (o
> sea `null`) cuando no aplica, para que el front no lo suponga.
>
> Prioridad P2 · Sprint S3 · Área Back · Lo pide: Front

### B6 · URL pública de la API y CORS para el front desplegado

**Título:** Añadir el dominio de Vercel del front a `CORS_ORIGINS` en la API desplegada

> El front se despliega en Vercel (vistas previas por PR y producción). Cuando la API tenga URL pública, necesitamos
> que `CORS_ORIGINS` incluya el dominio de producción del front y, si se puede, el de las vistas previas.
>
> **Qué pedimos:** la URL pública de la API en cuanto exista (para `VITE_API_URL`) y añadir nuestros dominios a CORS.
> Os pasamos los dominios cuando Vercel los dé.
>
> Prioridad P0 · Sprint S3 · Área Back · Lo pide: Front

### B7 · Tipos completos en el OpenAPI

**Título:** Revisar que el OpenAPI declare los tipos de `parecido`, `resumen` y `detalles`

> El front genera sus tipos con `openapi-typescript`. Si un campo no está declarado en el OpenAPI (por ejemplo, si
> `resumen` sale como objeto genérico), el front pierde la comprobación de tipos y tendría que adivinar.
>
> **Qué pedimos:** que `parecido` y `hay_parecido` se declaren como `boolean | null`, y que `resumen`, `mejor` y
> `parejas` tengan su esquema. `detalles` y `datos_capas` pueden seguir siendo objetos libres si cada capa trae campos
> distintos.
>
> Prioridad P1 · Sprint S3 · Área Back · Lo pide: Front · *Se confirma en F3.1: si los tipos ya están bien, esta issue
> no hace falta.*

---

## 9. Cómo crearlo todo en GitHub

### 9.1 Preparación (una vez)

1. **Etiqueta `epic`** en el repo del front: *Issues → Labels → New label* → nombre `epic`. Sirve para filtrar las
   épicas en el tablero.
2. **Añadir automáticamente al tablero:** en el tablero (*Projects → el del equipo → … → Workflows → Auto-add to
   project*), activa el flujo con el filtro `is:issue` para el repo del front. Así cada issue nueva entra sola en el
   tablero. En las cuentas gratuitas solo se permite un flujo de este tipo; si ya lo usa el repo del back, lo hace Max
   o se añaden a mano (paso 9.3).

### 9.2 Crear una épica con sus sub-issues (desde la web)

1. *Issues → New issue*. Título: `[Épica] E1 · Sistema visual`. Cuerpo: el «Objetivo» de la épica y la lista de sus
   sub-issues. Etiqueta `epic`. *Create*.
2. Dentro de la épica, abajo, pulsa **Create sub-issue** (o el botón *Add sub-issue → Create new sub-issue*).
3. Título de la sub-issue: el de este plan **sin** el identificador (p. ej. «Cargar las fuentes Red Hat con
   Fontsource»). Cuerpo: desde «Descripción» hasta el prompt. *Create*.
4. Repite con cada sub-issue, **en el orden del plan**, y apunta el número que le da GitHub.
5. Cuando tengas todos los números, edita las sub-issues y cambia «Depende de: F1.2» por «Depende de: #8». Para las
   dependencias, GitHub permite además marcar una issue como **bloqueada por** otra (*Relationships → Mark as blocked
   by*), que se ve en el tablero.

> **Por qué épicas con sub-issues:** la épica muestra una barra de progreso con cuántas sub-issues están cerradas, y
> cada sub-issue es un PR. Cuando el PR dice `Closes #8`, al fusionarlo se cierra la sub-issue y avanza la épica sola.

### 9.3 Rellenar los campos del tablero

1. Abre el tablero y la vista «Sprint actual».
2. Si una issue no está, *+ Add item* → escribe `#` y busca la issue (o, en la issue, barra lateral *Projects* → elige
   el tablero).
3. Rellena para cada issue **Status** = Todo, **Prioridad**, **Sprint** y **Área** = Front con los valores del plan.
   Truco: en la vista de tabla puedes seleccionar varias filas y pegar el mismo valor en todas.
4. Las épicas también entran en el tablero, con la prioridad y el sprint de la épica.
5. Las tareas ⚠️ fuera del tablero: créalas igual, pero coméntaselas a Max (apartado 7) antes de moverlas a In Progress.

### 9.4 Las issues del back

En `mr-melenas/Pathfinders42` → *New issue* con el título y el texto de cada B1–B7, Área = Back. Avisa a Max para que
las reparta. Las de P0 (B1 y B6) son las que bloquean al front.

### 9.5 Alternativa con la terminal (opcional)

Si tienes `gh` instalado y has iniciado sesión (`gh auth login`), se puede hacer por comandos. Es más rápido, pero la
web es más fácil la primera vez.

```bash
# Crear una issue con el cuerpo en un archivo
gh issue create -R mr-melenas/Pathfinders42-front --title "Cargar las fuentes Red Hat con Fontsource" --body-file f1-2.md

# Enganchar una sub-issue a su épica (pide el id interno de la sub-issue, no su número)
SUB_ID=$(gh api repos/mr-melenas/Pathfinders42-front/issues/8 --jq .id)
gh api repos/mr-melenas/Pathfinders42-front/issues/5/sub_issues -X POST -F sub_issue_id=$SUB_ID

# Añadirla al tablero (requiere permiso de proyectos: gh auth refresh -s project)
gh project item-add 5 --owner mr-melenas --url https://github.com/mr-melenas/Pathfinders42-front/issues/8
```
