# Sistema visual · Pathfinders42 (front)

> **Para la IA que lea esto (Claude Code):** este documento traduce a código el diseño final aprobado por el equipo,
> «Horizonte comparado» (copia en `docs/design/diseno-final.html`). Úsalo como fuente de verdad para colores, tipografía,
> tamaños y componentes. **No añadas colores, tamaños ni componentes que no estén aquí:** si hace falta uno nuevo, pregunta
> y apúntalo en el apartado 8 («Pendiente de decidir»). Los datos científicos salen siempre de la API, nunca del front.
>
> Versión: 2 · 3 nov 2026 · Diseño: versión final (mezcla C + B + A) · API de referencia: v0.2.0

> **Decisión de nombres (3 nov 2026, Adriana):** los nombres del código (tokens, clases propias, componentes, props)
> van **en inglés**, por buenas prácticas. Se mantienen en español: los **textos de la interfaz** (en `es.json`, con su
> traducción en `en.json`), los **campos de la API** (`parecido`, `hay_parecido`, `brecha_ts_media`… tal cual, sin
> traducir) y la documentación, los commits y los PR.
> El apartado 2 de `CONTEXTO_PATHFINDERS42.md` decía «código incluido: nombres de variables en español»: era un error
> y el equipo lo corregirá. Si aún lo ves así, manda este documento.

## Índice

1. [De dónde sale cada cosa](#1-de-dónde-sale-cada-cosa)
2. [Tokens para Tailwind v4](#2-tokens-para-tailwind-v4)
3. [Cómo cargar las fuentes](#3-cómo-cargar-las-fuentes)
4. [Bloque CSS completo, listo para pegar](#4-bloque-css-completo-listo-para-pegar)
5. [Reglas de uso](#5-reglas-de-uso)
6. [Componentes](#6-componentes)
7. [Textos e idiomas](#7-textos-e-idiomas)
8. [Pendiente de decidir](#8-pendiente-de-decidir)

---

## 1. De dónde sale cada cosa

El diseño final mezcla tres direcciones que el equipo votó el 3 nov 2026:

| Parte | Viene de | Qué aporta |
|---|---|---|
| Base, paleta, tipografía, cabecera, frase en lenguaje llano | **C · Horizonte** | Fondo noche, brillo del horizonte en la cabecera, familia Red Hat, «primero la frase, luego el número» |
| Mapas | **B · Atlas comparado** | Mapa del cuerpo (Luna o Marte) y mapa de la Tierra **a la misma altura**, unidos por el arco naranja |
| Componentes | **A · Sala de control** | Tarjeta de capa con franja de veredicto y tabla de métricas, chips rectangulares, marcadores por forma |

**Tema:** solo oscuro. **Prioridad de pantalla:** escritorio primero (sin olvidar que debe verse bien en móvil).

> **Por qué importa saber el origen:** cuando dudes de cómo debe verse algo, mira la dirección de la que viene en
> `docs/design/direcciones-visuales.html`. Ahí están las tres completas.

---

## 2. Tokens para Tailwind v4

### 2.1 Qué es un token y cómo lo usa Tailwind v4

Un **token** es un valor de diseño con nombre (un color, un tamaño, un radio). En vez de escribir `#7ee2b0` en 20
componentes, escribes el nombre `verdict-pass` y, si un día cambia el color, se cambia en un solo sitio.

En Tailwind v4 los tokens se declaran en CSS dentro de un bloque `@theme { … }`. Cada variable crea clases
automáticamente según su **prefijo** (lo que Tailwind llama *namespace*):

| Prefijo de la variable | Clases que crea | Ejemplo |
|---|---|---|
| `--color-verdict-pass` | `bg-verdict-pass`, `text-verdict-pass`, `border-verdict-pass`… | `<span class="text-verdict-pass">` |
| `--font-display` | `font-display` | `<h1 class="font-display">` |
| `--text-card-title` | `text-card-title` (tamaño + interlineado) | `<h3 class="text-card-title">` |
| `--radius-chip` | `rounded-chip` | `<span class="rounded-chip">` |
| `--shadow-stripe-pass` | `shadow-stripe-pass` | `<article class="shadow-stripe-pass">` |
| `--breakpoint-md2` | prefijo `md2:` | `<div class="grid md2:grid-cols-2">` |
| `--animate-pulse-ring` | `animate-pulse-ring` | `<circle class="motion-safe:animate-pulse-ring">` |

Además, cada token queda disponible como variable CSS normal (`var(--color-verdict-pass)`), que es lo que usaremos en
los estilos de MapLibre y en los SVG.

**Nombres en inglés y por significado:** la clase dice para qué sirve (`text-verdict-fail`), no qué color es
(`text-red-300`). Así, si cambia el color, el nombre sigue siendo verdad.

> **Decisión: borrar la paleta y la escala de tipos por defecto de Tailwind.** El bloque empieza con
> `--color-*: initial;` y `--text-*: initial;`. Así `bg-red-500` o `text-2xl` **dejan de existir** y solo se pueden usar
> los tokens de este documento. **Por qué:** con dos personas y una IA escribiendo código, es la forma más fácil de que
> nadie meta un color o un tamaño que no está en el diseño. Si alguien lo intenta, simplemente no funciona y se nota.
> Los espaciados, en cambio, se mantienen (ver 2.4). `bg-transparent` y `text-current` siguen funcionando.

### 2.2 Colores

Todos salen de la paleta de la versión final (los de C). Los valores con transparencia están escritos con la sintaxis
moderna `rgb(r g b / alfa)`, que es la que usa Tailwind v4.

#### Fondos y superficies

| Token | Valor | Clase de ejemplo | Para qué se usa |
|---|---|---|---|
| `--color-background` | `#0a1222` | `bg-background` | Fondo de la página y de la cabecera (inicio del degradado) |
| `--color-surface` | `#111c31` | `bg-surface` | Cajas de primer nivel: paneles, filas de «funciona / falla», caja de límites, conmutadores |
| `--color-surface-2` | `#18263f` | `bg-surface-2` | Tarjeta de capa, botón seleccionado de un conmutador, enlace activo de la navegación |
| `--color-border` | `#26385a` | `border-border` | Bordes y separadores **decorativos** (ver aviso de contraste en 5.6) |
| `--color-map` | `#03060c` | `bg-map` | Fondo del contenedor de cada mapa, mientras carga MapLibre |

#### Texto

| Token | Valor | Clase de ejemplo | Para qué se usa |
|---|---|---|---|
| `--color-foreground` | `#f1f5fb` | `text-foreground` | Texto principal, títulos, valores de las métricas |
| `--color-muted` | `#a7b4c9` | `text-muted` | Texto secundario: descripciones, unidades, pie de fuente, recuento «1 de 5 capas», migas |

#### Marca y acciones

| Token | Valor | Para qué se usa |
|---|---|---|
| `--color-accent` | `#f7862a` | Naranja del logo. **Solo** para: acciones, selección (marcador seleccionado y su pulso), el arco «puente» entre mapas, el «42» del logo y el anillo de foco. **Nunca** para un veredicto (ver 5.3) |
| `--color-horizon` | `#7cc8ff` | Azul del horizonte del logo: brillo de la cabecera y enlaces (botón «ver todas») |

#### Semáforo de veredicto

Es el veredicto de la API (`parecido` por pareja, `hay_parecido` / `parecidos` por sitio) **tal cual**, sin recalcular.

| Token | Valor | Valor de la API | Palabra (es) | Icono |
|---|---|---|---|---|
| `--color-verdict-pass` | `#7ee2b0` | `true` | «Funciona» | ✓ check |
| `--color-verdict-pass-bg` | `rgb(126 226 176 / 0.13)` | | | |
| `--color-verdict-fail` | `#ff9a8a` | `false` | «Falla» | ✗ aspa |
| `--color-verdict-fail-bg` | `rgb(255 154 138 / 0.13)` | | | |
| `--color-verdict-null` | `#b6bfce` | `null` | «La capa no lo decide» (corta: «No decide») | – guion |
| `--color-verdict-null-bg` | `rgb(182 191 206 / 0.10)` | | | |

Los `-bg` son el relleno suave de los chips. `verdict-null` además lleva **rayado** (utilidad `stripes-null`, apartado
4) y **borde discontinuo**.

> **Por qué `verdict-null` y no un nombre como «undecided»:** el nombre recuerda que corresponde al `null` de la API, y
> la regla más importante del sistema es que `null` no es `false`. Que el nombre lo diga ayuda a no confundirlos.

#### Cuerpos (mapas y marcadores)

| Token | Valor | Para qué se usa |
|---|---|---|
| `--color-body-moon` | `#d3d8e1` | «Regolito»: marcadores de sitios de la Luna, chip del tipo de sitio, punto de la etiqueta «Luna · polo sur» |
| `--color-body-earth` | `#7cc8ff` | Marcadores de parejas de la Tierra y candidatos M1, punto de la etiqueta «Tierra · pareja». Es el mismo valor que `horizon` |
| `--color-body-mars` | `#f2d27e` | «Arena dorada» (propuesta A de 8.1, decidida el 15 nov): marcadores y leyenda de Marte, chip del tipo de los sitios de Marte |

#### Cabecera (solo para el degradado del horizonte)

| Token | Valor | Para qué se usa |
|---|---|---|
| `--color-header-mid` | `#0d1d3a` | Parada del degradado al 70 % |
| `--color-header-end` | `#123059` | Parada final del degradado (abajo) |
| `--color-header-border` | `#2b4877` | Borde de la cabecera |
| `--color-horizon-line` | `rgb(124 200 255 / 0.65)` | Línea curva del horizonte en la parte baja de la cabecera |
| `--color-horizon-glow` | `rgb(124 200 255 / 0.25)` | Halo bajo esa línea |

> **Por qué el degradado solo va en la cabecera:** un degradado detrás de un texto baja el contraste en una parte del
> texto. En la cabecera solo hay logo y botones cortos, así que no molesta.

### 2.3 Tipografía

Una sola familia, **Red Hat**, en tres versiones. Pesos que usa el diseño:

| Token | Fuente | Pesos usados | Para qué se usa |
|---|---|---|---|
| `--font-display` | Red Hat Display | 700 (frase llana, nombres de capa), 800 (nombre del sitio, logo) | Títulos, nombre del sitio, nombre de capa, frase en lenguaje llano, logo |
| `--font-sans` | Red Hat Text | 400 (texto), 500 (chips de verificación), 600 (chips de veredicto, nombres de pareja) | Todo el texto de la interfaz. Es la fuente por defecto |
| `--font-mono` | Red Hat Mono | 400 (valores), 600 | Números, coordenadas, nombres de campos de la API (`d_topo`), etiquetas en mayúsculas |

> **Por qué `sans` y `mono` y no nombres nuevos:** son los nombres que Tailwind ya usa para «la fuente normal» y «la
> monoespaciada». Si los sobrescribimos, Tailwind aplica Red Hat Text a toda la página y Red Hat Mono a `<code>` sin
> que tengamos que hacer nada más. Solo `display` es nuevo.

Reglas tipográficas del diseño:
- Los **títulos** (`font-display`) llevan peso 800 y `letter-spacing: -0.015em` (clase `tracking-display`).
- Los **números** siempre en `font-mono` con **cifras tabulares** (clase de Tailwind `tabular-nums`): así las cifras
  ocupan lo mismo y se alinean en columnas. En el diseño el texto de datos va al 86 % del tamaño del texto que lo rodea
  (`.data { font-size: .86em }`), para que la mono no se vea más grande: clase `text-[0.86em]`.
- Las **etiquetas en mayúsculas** (por ejemplo «CAPA ANORTOSITA») van en `font-mono`, `text-data` (12 px),
  `uppercase` y `letter-spacing: 0.14em` (clase `tracking-label`).
- La frase en lenguaje llano mide como mucho unos 40 caracteres por línea (`max-w-[40ch]`).

#### Escala de tamaños

Es la conversión de los tamaños sueltos de la maqueta a una escala con nombre, agrupados por para qué se usan. Cada uno
lleva su interlineado (en Tailwind v4 se declara con `--text-<nombre>--line-height`).

| Token | Clase | Tamaño | Interlineado | Para qué se usa |
|---|---|---|---|---|
| `--text-unit` | `text-unit` | 11 px (`0.6875rem`) | 1.4 | Unidades y aclaraciones de las métricas, pie de los mapas |
| `--text-data` | `text-data` | 12 px (`0.75rem`) | 1.4 | Tabla de métricas, pie de fuente, etiquetas en mayúsculas, etiqueta del mapa |
| `--text-caption` | `text-caption` | 13 px (`0.8125rem`) | 1.4 | Descripción de capa, chips, migas, recuento, datos del sitio |
| `--text-compact` | `text-compact` | 14 px (`0.875rem`) | 1.5 | Nombres de pareja, nombre de capa en las filas, navegación de la cabecera |
| `--text-body` | `text-body` | 15 px (`0.9375rem`) | 1.55 | Texto normal y frase llana de cada tarjeta (base del `body`) |
| `--text-card-title` | `text-card-title` | 17 px (`1.0625rem`) | 1.2 | Nombre de la capa en la tarjeta |
| `--text-panel-title` | `text-panel-title` | 18 px (`1.125rem`) | 1.25 | Títulos de panel («Dónde funciona / dónde falla», «Mejor pareja») |
| `--text-logo` | `text-logo` | 19 px (`1.1875rem`) | 1 | Wordmark «Pathfinders42» de la cabecera |
| `--text-lede` | `text-lede` | `clamp(1.25rem, 2.4vw, 1.625rem)` (20 → 26 px) | 1.25 | Frase en lenguaje llano al inicio del detalle |
| `--text-site-title` | `text-site-title` | `clamp(1.625rem, 3.4vw, 2.375rem)` (26 → 38 px) | 1 | Nombre del sitio en el detalle |

> **Por qué en `rem` y no en `px`:** `rem` respeta el tamaño de letra que la persona haya elegido en su navegador.
> Si alguien lo sube por baja visión, toda la interfaz crece con él. Es un requisito básico de accesibilidad.
>
> **Por qué `clamp()`:** hace que el título crezca con el ancho de la ventana pero sin bajar del mínimo ni pasar del
> máximo. Son los mismos valores que la maqueta.
>
> *«Lede»* es el término de periodismo para la frase de entrada que resume la noticia: es justo lo que hace la frase
> en lenguaje llano.

### 2.4 Espaciados

**Se usa la escala por defecto de Tailwind v4** (`--spacing: 0.25rem`, es decir, múltiplos de 4 px). Todos los huecos de
la maqueta caben en ella:

| En la maqueta | Clase de Tailwind |
|---|---|
| 4 px | `gap-1`, `p-1` |
| 6 px | `gap-1.5` |
| 8 px | `gap-2` |
| 10 px | `gap-2.5`, `p-2.5` |
| 12 px | `gap-3`, `p-3` |
| 14 px | `gap-3.5`, `p-3.5` |
| 16 px | `gap-4`, `p-4` |
| 20 px | `gap-5` |
| 34 px (entre bloques grandes) | `gap-8.5` |

Uso habitual en el diseño: **16 px** de margen interior en paneles y pantalla, **14 px** en la tarjeta de capa,
**10 px** entre elementos de una tarjeta y entre los dos mapas, **16 px** de margen lateral mínimo en móvil.

> **Por qué no definimos espaciados propios:** la escala de Tailwind ya es regular y cubre todo lo que pide el diseño.
> Inventar nombres («card-spacing») añade cosas que aprender sin ganar nada.

### 2.5 Radios

La versión final mezcla contenedores redondeados (de C) y componentes rectos (de A). Por eso se fijan en tokens:

| Token | Valor | Clase | Para qué se usa |
|---|---|---|---|
| `--radius-chip` | 4 px | `rounded-chip` | Chips de veredicto y verificación, botones de los conmutadores, enlaces de la navegación, etiqueta del mapa |
| `--radius-card` | 6 px | `rounded-card` | Tarjeta de capa, caja de límites, marcadores de la leyenda |
| `--radius-row` | 12 px | `rounded-row` | Filas de la lista «funciona / falla» |
| `--radius-container` | 16 px | `rounded-container` | Contenedores grandes: mapas, cabecera, paneles |
| `--radius-frame` | 20 px | `rounded-frame` | Marco exterior de la pantalla (16 + 4) |
| (de Tailwind) | | `rounded-full` | Barra de parecido |

### 2.6 Sombras

El diseño casi no usa sombras: las únicas son la **franja de veredicto** de la tarjeta de capa (una «sombra interior»
de 3 px a la izquierda) y el **halo del horizonte**.

| Token | Valor | Clase | Para qué se usa |
|---|---|---|---|
| `--shadow-stripe-pass` | `inset 3px 0 0 var(--color-verdict-pass)` | `shadow-stripe-pass` | Tarjeta de capa con veredicto `true` |
| `--shadow-stripe-fail` | `inset 3px 0 0 var(--color-verdict-fail)` | `shadow-stripe-fail` | Tarjeta de capa con veredicto `false` |
| `--shadow-horizon` | `0 -6px 18px var(--color-horizon-glow)` | `shadow-horizon` | Halo de la línea del horizonte de la cabecera |

La tarjeta con veredicto `null` **no lleva franja** (en el diseño solo tienen franja `true` y `false`).

### 2.7 Breakpoints

Se mantienen los de Tailwind y se añade uno: **`md2` en 820 px**, que es el único punto en el que cambia el diseño
(por debajo, los dos mapas y las dos columnas del detalle se apilan en una sola columna y el arco puente gira 90°).

| Token | Valor | Prefijo | Origen |
|---|---|---|---|
| `--breakpoint-sm` | 40rem (640 px) | `sm:` | Tailwind |
| `--breakpoint-md` | 48rem (768 px) | `md:` | Tailwind |
| `--breakpoint-md2` | 51.25rem (820 px) | `md2:` | **Diseño final** |
| `--breakpoint-lg` | 64rem (1024 px) | `lg:` | Tailwind |
| `--breakpoint-xl` | 80rem (1280 px) | `xl:` | Tailwind |

> **Cómo encaja «escritorio primero» con Tailwind.** Tailwind es *mobile first*: una clase sin prefijo vale para todas
> las pantallas y `md2:` significa «de 820 px en adelante». Así que se escribe **primero la versión de una columna** y
> luego se añade la de escritorio con el prefijo:
>
> ```html
> <!-- Una columna en móvil; mapa · puente · mapa a partir de 820 px -->
> <div class="grid gap-2.5 md2:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)]">
> ```
>
> «Escritorio primero» quiere decir que **diseñamos y probamos antes en escritorio**, no que escribamos las clases al revés.

### 2.8 Movimiento

| Token | Valor | Para qué se usa |
|---|---|---|
| `--animate-pulse-ring` | `pulse-ring 2.4s ease-out infinite` | Pulso naranja alrededor del sitio seleccionado en el mapa |

Siempre con el prefijo `motion-safe:` (`motion-safe:animate-pulse-ring`): así **solo** se anima si la persona no ha
pedido «reducir movimiento» en su sistema. Ver 5.6.

> **Por qué `pulse-ring` y no `pulse`:** Tailwind ya trae una animación `animate-pulse` (parpadeo de opacidad). Con otro
> nombre no la pisamos.

### 2.9 Foco

Todo elemento con el que se interactúa muestra, al llegar con el teclado, un **contorno naranja de 2 px separado 2 px**
(`outline: 2px solid var(--color-accent); outline-offset: 2px`). Va en la capa base del CSS (apartado 4), así que no hay
que acordarse en cada componente.

---

## 3. Cómo cargar las fuentes

### Recomendación: **Fontsource** (las fuentes se instalan como paquetes de npm y se sirven desde nuestra web)

```bash
pnpm add @fontsource-variable/red-hat-display @fontsource-variable/red-hat-text @fontsource-variable/red-hat-mono
```

```ts
// src/main.tsx (arriba del todo, antes de importar los estilos)
import '@fontsource-variable/red-hat-display'
import '@fontsource-variable/red-hat-text'
import '@fontsource-variable/red-hat-mono'
import './index.css'
```

Los paquetes `-variable` traen la versión **variable** de cada fuente: un solo archivo que contiene todos los pesos
(400, 500, 600, 700, 800). Los nombres de familia que registran son `Red Hat Display Variable`, `Red Hat Text Variable`
y `Red Hat Mono Variable`, que son los que se usan en los tokens del apartado 4.

### Por qué Fontsource y no las otras opciones

| Opción | Pros | Contras |
|---|---|---|
| **Fontsource (recomendada)** | La versión queda fijada en `package.json`, como cualquier dependencia. Funciona sin internet al desarrollar. Vite empaqueta los archivos con nombre único, así que el navegador los guarda en caché. No se manda nada a servidores de terceros. Una línea por fuente | Añade 3 dependencias |
| `<link>` a Google Fonts en `index.html` (lo que usa la maqueta) | Cero instalación | Cada visita hace una petición a Google con la IP de la persona (en la UE hubo sentencias por esto, en 2022). Depende de un servicio externo. Sin internet, en local se ve con otra fuente |
| Descargar los `.woff2` a mano y escribir los `@font-face` | Control total | Más pasos, fácil equivocarse con los pesos, y nadie las actualiza |

> **En resumen:** Fontsource es igual de fácil que el `<link>` de Google, pero las fuentes viajan con el proyecto. Para
> una web que va a ser portafolio y que se presenta en directo, es lo más seguro.

**Fuentes de respaldo:** si una fuente no ha cargado todavía, el navegador usa `system-ui` (o `ui-monospace` para datos).
Fontsource usa `font-display: swap`, así que el texto se ve desde el primer momento con la de respaldo y cambia cuando
llega la buena.

---

## 4. Bloque CSS completo, listo para pegar

La configuración inicial del repo ya está hecha, así que `src/index.css` ya existe con `@import "tailwindcss";`. Este
bloque **sustituye todo el contenido** de ese archivo. Es la primera tarea de código.

Antes de pegarlo, mira si quedan estilos de la plantilla de Vite (`:root { font-family: Inter… }`, `a { color… }`,
`button { … }`) en `src/index.css` o en `src/App.css`: hay que **quitarlos**, porque pisarían los tokens. Si
`App.css` se queda vacío, se borra el archivo y su `import` en `App.tsx`.

```css
/* src/index.css · Sistema visual de Pathfinders42 (ver docs/sistema-visual.md) */
@import "tailwindcss";

@theme {
  /* Borramos la paleta y la escala de tipos por defecto: solo valen los tokens del diseño (ver 2.1) */
  --color-*: initial;
  --text-*: initial;

  /* ---------- Colores: fondos y superficies ---------- */
  --color-background: #0a1222;
  --color-surface: #111c31;
  --color-surface-2: #18263f;
  --color-border: #26385a;   /* solo decorativo: 1,6:1 (ver 5.6) */
  --color-map: #03060c;

  /* ---------- Colores: texto ---------- */
  --color-foreground: #f1f5fb;
  --color-muted: #a7b4c9;

  /* ---------- Colores: marca y acciones ---------- */
  --color-accent: #f7862a;   /* acciones, selección, puente, foco. NUNCA veredicto */
  --color-horizon: #7cc8ff;  /* brillo de la cabecera y enlaces */

  /* ---------- Colores: semáforo (veredicto de la API) ---------- */
  --color-verdict-pass: #7ee2b0;                    /* true */
  --color-verdict-pass-bg: rgb(126 226 176 / 0.13);
  --color-verdict-fail: #ff9a8a;                    /* false */
  --color-verdict-fail-bg: rgb(255 154 138 / 0.13);
  --color-verdict-null: #b6bfce;                    /* null (≠ false) */
  --color-verdict-null-bg: rgb(182 191 206 / 0.10);

  /* ---------- Colores: cuerpos ---------- */
  --color-body-moon: #d3d8e1;
  --color-body-earth: #7cc8ff;
  --color-body-mars: #f2d27e; /* «Arena dorada», propuesta A de §8.1 */

  /* ---------- Colores: cabecera ---------- */
  --color-header-mid: #0d1d3a;
  --color-header-end: #123059;
  --color-header-border: #2b4877;
  --color-horizon-line: rgb(124 200 255 / 0.65);
  --color-horizon-glow: rgb(124 200 255 / 0.25);

  /* ---------- Tipografía ---------- */
  --font-display: "Red Hat Display Variable", system-ui, sans-serif;
  --font-sans: "Red Hat Text Variable", system-ui, sans-serif;
  --font-mono: "Red Hat Mono Variable", ui-monospace, monospace;

  --tracking-display: -0.015em;
  --tracking-label: 0.14em;

  --text-unit: 0.6875rem;          --text-unit--line-height: 1.4;
  --text-data: 0.75rem;            --text-data--line-height: 1.4;
  --text-caption: 0.8125rem;       --text-caption--line-height: 1.4;
  --text-compact: 0.875rem;        --text-compact--line-height: 1.5;
  --text-body: 0.9375rem;          --text-body--line-height: 1.55;
  --text-card-title: 1.0625rem;    --text-card-title--line-height: 1.2;
  --text-panel-title: 1.125rem;    --text-panel-title--line-height: 1.25;
  --text-logo: 1.1875rem;          --text-logo--line-height: 1;
  --text-lede: clamp(1.25rem, 2.4vw, 1.625rem);          --text-lede--line-height: 1.25;
  --text-site-title: clamp(1.625rem, 3.4vw, 2.375rem);   --text-site-title--line-height: 1;

  /* ---------- Radios ---------- */
  --radius-chip: 4px;
  --radius-card: 6px;
  --radius-row: 12px;
  --radius-container: 16px;
  --radius-frame: 20px;

  /* ---------- Sombras ---------- */
  --shadow-stripe-pass: inset 3px 0 0 var(--color-verdict-pass);
  --shadow-stripe-fail: inset 3px 0 0 var(--color-verdict-fail);
  --shadow-horizon: 0 -6px 18px var(--color-horizon-glow);

  /* ---------- Breakpoints (se suman a los de Tailwind) ---------- */
  --breakpoint-md2: 51.25rem; /* 820 px: único cambio de diseño */

  /* ---------- Maquetación ---------- */
  --container-content: 75rem; /* 1200 px: ancho máximo de la cabecera y del contenido (max-w-content) */

  /* ---------- Movimiento ---------- */
  --animate-pulse-ring: pulse-ring 2.4s ease-out infinite;
  @keyframes pulse-ring {
    0%   { opacity: 0.8; transform: scale(1); }
    100% { opacity: 0;   transform: scale(2.2); }
  }
}

/* ---------- Estilos base ---------- */
@layer base {
  html {
    color-scheme: dark; /* barras de scroll y controles nativos en oscuro */
    scrollbar-gutter: stable; /* reserva siempre el hueco de la barra de scroll: el contenido no salta al aparecer */
  }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-sans);
    font-size: var(--text-body);
    line-height: var(--text-body--line-height);
  }
  h1, h2, h3, h4, h5, h6 {
    text-wrap: balance; /* reparte las líneas de los títulos para que no quede una palabra sola */
  }
  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

/* ---------- Utilidades propias ---------- */

/* Rayado del estado null (chip). Uso: class="stripes-null" */
@utility stripes-null {
  background-image: repeating-linear-gradient(
    135deg, var(--color-verdict-null-bg) 0 5px, transparent 5px 10px
  );
}

/* Rayado del relleno de la barra de parecido cuando la pareja es null */
@utility stripes-bar {
  background-image: repeating-linear-gradient(
    135deg, var(--color-verdict-null) 0 4px, transparent 4px 8px
  );
}

/* Degradado de la cabecera (horizonte) */
@utility header-gradient {
  background-image: linear-gradient(
    180deg, var(--color-background) 0%, var(--color-header-mid) 70%, var(--color-header-end) 100%
  );
}

/* Línea curva del horizonte de la cabecera (el elemento necesita "relative overflow-hidden") */
@utility horizon-line {
  &::after {
    content: "";
    position: absolute;
    left: -10%;
    right: -10%;
    bottom: -38px;
    height: 44px;
    border-radius: 50%;
    border-top: 2px solid var(--color-horizon-line);
    box-shadow: var(--shadow-horizon);
    pointer-events: none;
  }
}
```

> **Por qué `@utility` y no clases sueltas en CSS:** con `@utility` Tailwind trata nuestras clases como las suyas, así
> que funcionan con los prefijos (`md2:header-gradient`, `hover:…`) y se ordenan bien con el resto.
>
> **Por qué el bloque de «reducir movimiento» además de `motion-safe:`:** `motion-safe:` cubre lo que escribamos
> nosotros; el bloque base cubre también las animaciones CSS que traigan librerías. Las de MapLibre se hacen con
> JavaScript y no se paran así: ver 5.6.

**Cómo comprobar que funciona** (criterio para dar la tarea por terminada):
1. `pnpm dev`: la página tiene fondo azul noche y el texto sale en Red Hat Text (en las herramientas del navegador,
   pestaña *Computed* → `font-family`).
2. Un elemento de prueba con `class="text-verdict-pass font-mono"` sale verde y en Red Hat Mono; uno con `bg-red-500`
   **no** cambia de color.
3. Al moverte con el tabulador por un botón aparece el anillo naranja.
4. `pnpm lint` y `pnpm build` pasan sin errores.

---

## 5. Reglas de uso

Estas reglas **no se saltan nunca**. Si un diseño o una petición las contradice, se avisa antes de cambiar nada.

### 5.1 El veredicto siempre lleva icono y palabra

- El color del semáforo sale de `parecido` / `hay_parecido` / `parecidos` **tal cual vienen de la API**. El front **no
  recalcula** veredictos a partir de la distancia (solo 3 de las 6 capas tienen umbral numérico).
- Cada veredicto se muestra **siempre** con los tres elementos: **color + icono + palabra**.
  - `true` → `verdict-pass`, icono ✓, «Funciona».
  - `false` → `verdict-fail`, icono ✗, «Falla».
  - `null` → `verdict-null`, icono –, «La capa no lo decide» (o «No decide» donde no quepa).
- **Por qué:** la paleta final (verde y salmón) **no se distingue bien con daltonismo rojo-verde**, que tiene en torno a
  1 de cada 12 hombres. El icono y la palabra hacen que se entienda sin ver el color, también en blanco y negro o en un
  proyector malo.
- Prohibido: un punto de color solo, un borde de color solo, o la franja de la tarjeta sin el chip.

### 5.2 `null` va rayado y nunca se pinta como `false`

`null` significa «la capa no lo decide», que **no** es lo mismo que «no es análogo». Para que no se confundan:

| | `false` (Falla) | `null` (No decide) |
|---|---|---|
| Color | `verdict-fail` | `verdict-null` |
| Borde | continuo | **discontinuo** (`border-dashed`) |
| Fondo | liso (`bg-verdict-fail-bg`) | **rayado** (`stripes-null`) |
| Icono | ✗ | – |
| Franja en la tarjeta | sí (`shadow-stripe-fail`) | no |
| Barra de parecido | relleno liso | relleno rayado (`stripes-bar`) |

- En el código, se comprueba con `=== true`, `=== false` y `=== null`. **Nunca** con `if (parecido)` ni `!parecido`,
  porque así `null` y `false` acaban en el mismo sitio.
- Puede pasar que el **sitio** «falle» en una capa y su **mejor pareja** «no decida» (es el caso de clima en Malapert).
  Son dos veredictos distintos y se muestran los dos.

### 5.3 El naranja nunca significa veredicto

`accent` se usa **solo** para: acciones, selección (marcador seleccionado y su pulso), el arco puente entre mapas, el
«42» del logo y el anillo de foco. **Por qué:** un naranja cerca de un salmón se lee como «aviso» o «falla»; si el
naranja nunca es veredicto, nadie duda.

### 5.4 Un mapa por cuerpo

- El sitio se pinta en el mapa de **su** cuerpo (Luna o Marte) y la pareja en el mapa de la **Tierra**. Nunca en el
  mismo lienzo: las coordenadas de cuerpos distintos no son comparables.
- En el detalle, los dos mapas van **a la misma altura**: cuerpo a la izquierda, Tierra a la derecha, unidos por el arco
  naranja con el nombre de la capa y la distancia. Por debajo de 820 px se apilan.
- El selector Luna / Marte cambia el mapa del cuerpo; la Tierra aparece siempre como mapa de parejas.
- El **tipo** de sitio lo dice la **forma** del marcador (región, aterrizaje, cueva), no el color. El color queda libre
  para el cuerpo y la selección.

### 5.5 Cada dato dice de dónde sale

Cada tarjeta acaba con **capa · fuente · nº de parejas**, y cada análogo lleva su chip **verificada / candidato**. Los
números salen siempre de la API; si un dato aún no llega, se muestra el estado «dato pendiente» (ver 6), no un número
de relleno.

### 5.6 Accesibilidad: contraste, foco y movimiento

**Contraste (calculado con la fórmula de WCAG 2.1):** todos los colores de texto superan AA (4,5:1) sobre los tres fondos.

| Texto | sobre `background` | sobre `surface` | sobre `surface-2` |
|---|---|---|---|
| `foreground` | 17,10 | 15,55 | 13,83 |
| `muted` | 8,92 | 8,11 | 7,22 |
| `accent` | 7,48 | 6,80 | 6,05 |
| `horizon` / `body-earth` | 10,30 | 9,37 | 8,33 |
| `verdict-pass` | 11,93 | 10,85 | 9,65 |
| `verdict-fail` | 9,12 | 8,30 | 7,38 |
| `verdict-null` | 10,10 | 9,18 | 8,17 |
| `body-moon` | 13,08 | 11,89 | 10,58 |
| `border` | 1,60 | 1,45 | 1,29 |

⚠️ **`border` no llega a 3:1**, que es lo que WCAG pide para el contorno de un control (botón, campo, conmutador). Vale
para separadores y cajas decorativas, pero **no** para marcar dónde está un control. Ver 8.

**Foco visible:** el anillo naranja de 2 px va en la capa base. No se quita nunca (`outline-none` está prohibido salvo
que se ponga otro foco igual de visible). Todo lo que se pueda pulsar debe ser un `<button>` o un `<a>`, no un `<div>`
con `onClick`, para que funcione con teclado.

**Reducir movimiento:**
- Animaciones propias con `motion-safe:` (ejemplo: `motion-safe:animate-pulse-ring`).
- En MapLibre, si la persona tiene «reducir movimiento», usar `jumpTo` en vez de `flyTo` / `easeTo`. Se comprueba con
  `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.

**Otros:**
- Iconos decorativos con `aria-hidden="true"` (la palabra ya da el significado).
- La barra de parecido lleva `role="img"` y un `aria-label` con el porcentaje y la distancia
  (p. ej. «Parecido 77 por ciento, distancia 0,229»).
- Los conmutadores (Luna / Marte, ES / EN) son grupos de `<button>` con `aria-pressed`.
- Los mapas llevan un texto alternativo que diga qué muestran.

---

## 6. Componentes

Nombres en inglés, en `PascalCase` (así se nombran los componentes de React). La carpeta concreta se decide en la guía
de trabajo (Fase 4). Los textos que muestran salen de i18n (apartado 7), nunca escritos en el componente.

**Estados comunes.** El diseño final no dibuja los estados de carga, error y vacío, así que aquí se proponen con los
tokens que ya existen (ver 8 para confirmarlos):
- **Cargando:** bloque del tamaño final en `bg-surface-2`, sin texto inventado, con `aria-busy="true"`. Sin
  animación de brillo (o solo con `motion-safe:`).
- **Error:** texto en `foreground` (no en `verdict-fail`, para no confundirlo con un veredicto) con el mensaje traducido
  según el código de la API (`404` sitio o capa sin datos, `422` parámetros inválidos, `503` API sin datos) y un botón
  «Reintentar» con `accent`.
- **Vacío / dato pendiente:** texto `muted` en cursiva, como en la maqueta («Mejor pareja y distancias: llegan al
  conectar la API»). Nunca un número de relleno.
- **null:** el del chip de veredicto (5.2).

### 6.1 Componentes base (los primeros en programarse)

| Componente | Variantes (props) | Estados | Notas |
|---|---|---|---|
| `VerdictChip` | `value`: `true` / `false` / `null` · `short`: `boolean` (solo cambia «La capa no lo decide» por «No decide») | Los tres valores; no tiene carga propia | `rounded-chip`, `text-caption`, peso 600, borde 1 px. `null`: `border-dashed` + `stripes-null`. Icono 14 px `aria-hidden` |
| `VerificationChip` | `status`: `"verificada"` (sello, borde `foreground` continuo) / `"candidato"` (círculo discontinuo, borde `muted` discontinuo) | Si la API no trae verificación: no se muestra (ver 8) | Peso 500, fondo transparente. El valor viene de `detalles.verificacion` y se usa tal cual (en español) |
| `SiteTypeChip` | `tipo`: `region_aterrizaje_artemis`, `aterrizaje_tripulado`… | | Borde y texto `body-moon`, continuo. El texto visible sale de i18n con el `tipo` como clave |
| `Icon` | `name`: `check`, `cross`, `dash`, `seal`, `circle` | | Los 5 SVG de la maqueta, con `stroke="currentColor"` para heredar el color |
| `SimilarityBar` | `distancia`, `parecido` (si es `null`, relleno rayado) | Sin dato: no se pinta | 8 px de alto, `rounded-full`, fondo `background`, borde `border`. Relleno = `(1 − distancia) × 100 %`. **Es información extra, nunca el veredicto** · Relleno **neutro (`muted`)**, no verde: la barra no es el veredicto (decidido el 14 nov). `null` → rayado (`stripes-bar`) |
| `MetricsTable` | `detalles` | Sin `detalles`: no se pinta | `<dl>` en 3 columnas: campo de la API (tal cual, `font-mono`, `muted`), valor (`tabular-nums`), unidad o aclaración (`text-unit`, `muted`) |
| `SourceFooter` | con / sin nº de parejas | Fuente sin dato: «dato pendiente» | «Capa `x` · Fuente: … · N parejas · ver todas». Línea discontinua arriba (`border-dashed`) |
| `LinkButton` | | normal, foco | `horizon`, subrayado con separación de 3 px |
| `SegmentedToggle` | cuerpo (Luna / Marte), idioma (ES / EN) | seleccionado (`bg-surface-2`, `foreground`, peso 600), no seleccionado (`muted`), foco | Grupo de `<button aria-pressed>` con `rounded-chip` |
| `LoadingState`, `ErrorState`, `EmptyState` | | | Ver «Estados comunes» |

> **Por qué las props que vienen de la API conservan su nombre en español** (`distancia`, `parecido`, `detalles`,
> `tipo`): así se pasan directamente desde la respuesta de la API, sin traducirlas, como pide la regla 4 de
> `CONTEXTO_PATHFINDERS42.md`. Las props que son solo del componente (`short`, `name`, `status`) van en inglés.

### 6.2 Componentes compuestos

| Componente | Variantes | Estados | Notas |
|---|---|---|---|
| `LayerCard` | por veredicto del sitio: `true` (franja `stripe-pass`), `false` (franja `stripe-fail`), `null` (sin franja) | cargando, error, sin mejor pareja (dato pendiente) | `bg-surface-2`, `rounded-card`, `p-3.5`. Orden: nombre de capa + descripción + `VerdictChip` → frase llana → pareja (nombre, `VerificationChip`, «Parecido por pareja: » + `VerdictChip short`, `SimilarityBar`, `MetricsTable`) → «Funciona: … / Falla: …» con icono → `SourceFooter`. Datos de `resumen[]` |
| `LayerRow` | por veredicto | dato pendiente | `bg-surface`, `rounded-row`, `p-3`: `VerdictChip` + nombre de capa + una línea de detalle |
| `VerdictPanel` | | cargando, error, vacío | Título «Dónde funciona / dónde falla» + recuento («1 de 5 capas funcionan», contando los `true` de `parecidos`) + lista de `LayerRow` + `EarthLimitsBox` |
| `PlainSummary` | | sin datos suficientes: no se muestra | `font-display` 700, `text-lede`, `max-w-[40ch]`. Se construye con plantillas de i18n sobre datos de la API. Las palabras de «funciona» en `verdict-pass` y las de «falla» en `verdict-fail` (sin tachado) |
| `EarthLimitsBox` | | | «Límites de la Tierra como análogo · siempre fallan»: gravedad reducida, vacío lunar, radiación (en Marte, atmósfera). `bg-surface`, borde **discontinuo**, chips con borde `verdict-fail` e icono ✗. Texto fijo de i18n |
| `SiteHeader` | | cargando | `Breadcrumbs` + nombre del sitio (`text-site-title`, 800, `tracking-display`) + `SiteTypeChip` + datos (coordenadas, área, fuente con enlace, nº de capas) en `text-caption` |
| `Breadcrumbs` | | | `<nav aria-label>` (texto de i18n), separador «›», último con `aria-current="page"` |
| `AppHeader` | | | `header-gradient`, borde `header-border`, línea curva del horizonte con `shadow-horizon`. `Logo` + navegación (Explorar, Usos de misión, Límites de la Tierra, Fuentes) + `SegmentedToggle` de cuerpo + `SegmentedToggle` de idioma. «Usos de misión» y «Fuentes» son de S4: en el MVP, ocultos o deshabilitados |
| `Logo` | | | Estrella blanca + arco y punto naranjas + «Pathfinders**42**» (42 en `accent`). **Sin la insignia de la NASA** |

### 6.3 Mapas

| Componente | Variantes | Estados | Notas |
|---|---|---|---|
| `BodyMap` | `cuerpo`: `"luna"` / `"marte"` (valor de la API) | cargando (`bg-map`), error, sin geometría | SVG propio con la imagen de NASA Trek (pendiente 9). Etiqueta arriba a la izquierda («Luna · polo sur») con punto del color del cuerpo; pie con de dónde sale la geometría |
| `EarthMap` / `EarthGlobe` | | cargando (mapa fijo Blue Marble mientras llega MapLibre), **posición pendiente** (hasta que la API dé `lat`/`lon` de cada pareja, B1) | Desde el 15 nov (#74) es un globo 3D con zoom (MapLibre, imagen Sentinel-2 cloudless 2016 de EOX, CC BY 4.0, atribución en el pie). Gira hasta la pareja y la marca con su nombre y un punto `body-earth`. Sin posición: globo entero + marcador discontinuo + «posición pendiente» |
| `MapBridge` | horizontal / girado 90° (< 820 px) | | Arco y punto naranjas (64 × 40 px) + nombre de capa + distancia en `font-mono`, `accent` |
| `MapsRow` | | | `BodyMap` · `MapBridge` · `EarthMap`, misma altura |
| `SiteMarker` | región Artemis (polígono, borde `body-moon`, relleno al 18 %), aterrizaje (rombo `body-moon`), cueva / pozo (anillo + punto `body-moon`), **seleccionado** (`accent`, relleno al 25 %, pulso), pareja Tierra (círculo `body-earth`), candidato M1 · S4 (círculo `body-earth` discontinuo) | | La forma dice el tipo. En MapLibre se pintan como capas con los colores leídos de las variables CSS |

---

## 7. Textos e idiomas

- Interfaz **bilingüe desde el día 1** con **react-i18next**: `es.json` y `en.json`. Ningún texto de la interfaz se
  escribe directamente en un componente.
- Las **claves** de traducción van en inglés (`verdict.pass`, `verdict.fail`, `verdict.null`, `verdict.nullShort`); los
  **textos** en cada idioma («Funciona» / «Works»…).
- Los componentes se diseñan con el **texto en español**, que es el más largo («La capa no lo decide»).
- Números y coordenadas con `Intl.NumberFormat` según el idioma: `0,229` en español, `0.229` en inglés. El signo menos
  tipográfico (−) y las unidades (°C, km²) también salen del formateo, no se escriben a mano.
- Los **nombres de campos de la API** se muestran tal cual (`d_topo`, `brecha_ts_media`): son datos, no se traducen.
- Las 6 descripciones de capa y los nombres de `tipo` pueden ir en i18n con la `capa` / el `tipo` como clave, mientras
  la API no traiga textos en inglés (ver 8).

---

## 8. Pendiente de decidir

| # | Qué falta | Por qué importa | Quién decide | Propuesta |
|---|---|---|---|---|
| 1 | **Color de Marte** (`--color-body-mars`) | El diseño final solo define Luna y Tierra | Front | ✅ Decidido (15 nov, Adriana): **A · Arena dorada** (`#f2d27e`), ver 8.1 |
| 2 | **Borde de los controles** | `border` solo llega a 1,6:1 y WCAG pide 3:1 para el contorno de botones y campos | Front | Usar `muted` (7,22:1 sobre `surface-2`) como borde de controles, sin crear un color nuevo |
| 3 | **Estados de carga, error y vacío** | El diseño no los dibuja; en 6 hay una propuesta con los tokens existentes | Front | Validarla al hacer la primera vista con datos |
| 4 | **Signo de `brecha_*`** | Para escribir «es 121,7 °C más frío» sin equivocarnos de sentido | Back | ✅ Confirmado (15 nov, Max): **sitio − Tierra**, negativo = el sitio es más frío. Lo usa `PlainSummary` (#52) |
| 5 | **Fuente (dataset) por capa** en `resumen` | `SourceFooter` de cada tarjeta. Hoy solo hay `propiedades.fuente` a nivel de sitio | Back | Petición. `/fuentes` está previsto en S4 |
| 6 | **Verificación fuera de `anortosita`** | `VerificationChip`. Hoy solo aparece en `detalles.verificacion` de algunas capas | Back | Pregunta. Mientras tanto, no se muestra el chip si no hay dato |
| 7 | **Posición y geometría de las parejas** | `EarthMap` | Back | Ya planificado: `/analogos/{id}` en S3 |
| 8 | **Textos en inglés** de `nombre` y `descripcion` | Interfaz bilingüe | Back + Front | Las 6 descripciones en i18n del front; los nombres propios no se traducen |
| 9 | **Mapas base** de MapLibre (teselas o imágenes de Luna, Marte y Tierra) | El diseño usa esquemas, no cartografía | Front + Datos | ✅ Decidido (15 nov, F4.1): Luna y Marte en SVG propio con la imagen equirectangular de NASA Solar System Treks (LRO WAC y Viking MDIM), porque las teselas Web Mercator de MapLibre acaban en ±85,05° y dejan fuera los sitios de Artemis. La Tierra, con MapLibre (por decidir sus teselas en E5/E8). Ver `docs/plan/epicas.md`, supuesto S4b |
| 10 | **`body-earth` y `horizon` tienen el mismo valor** (`#7cc8ff`) | Un enlace y una pareja se ven del mismo color | Front | Se acepta en el MVP: se distinguen por forma (subrayado / marcador) |
| 11 | **Rutas (URL)** | La maqueta enseña `/luna/artemis-malapert-massif` solo como ejemplo | Front | ✅ Decidido (15 nov, #13): `/:cuerpo` y `/:cuerpo/:siteId`; ver `docs/arquitectura-pantallas.md` |
| 12 | **Ancho máximo del contenido** | La maqueta usa 1180 px, pero es el ancho del documento de propuesta, no de la app | Front | ✅ Decidido (12 nov, Adriana): **1200 px** (`--container-content: 75rem`, clase `max-w-content`), centrado |
| 13 | **Logo en SVG** sin la insignia de la NASA | Lo necesita `Logo` y el favicon | Front | Redibujarlo desde la maqueta (estrella + arco + «Pathfinders42») |
| 14 | **Corregir `CONTEXTO_PATHFINDERS42.md`** (código en inglés) | El apartado 2 aún dice que el código va en español, y era un error | Equipo | Ya avisado: lo corrige quien escribió el CONTEXTO |

### 8.1 Propuestas para el color de Marte

Requisitos que se han comprobado para cada propuesta:
- **Contraste AA** (≥ 4,5:1 como texto) sobre los tres fondos.
- Que **no se confunda con `accent` ni con `verdict-fail`**, ni a simple vista ni simulando daltonismo rojo-verde
  (deuteranopia y protanopia, con las matrices de Machado 2009). La diferencia se mide con ΔE (distancia de color en el
  espacio CIELAB): **por debajo de ~10 se confunden**, por encima de ~20 se distinguen sin esfuerzo.
- La comparación con `body-earth` importa menos, porque Marte y la Tierra nunca van en el mismo mapa.

| Propuesta | Valor | Contraste (background / surface / surface-2) | ΔE con `accent` (normal · deut. · prot.) | ΔE con `verdict-fail` (normal · deut. · prot.) | Comentario |
|---|---|---|---|---|---|
| **A · Arena dorada (recomendada)** | `#f2d27e` | 12,73 / 11,58 / 10,30 | 45 · 25 · 26 | 43 · 20 · 32 | Recuerda al polvo marciano y es la que mejor se separa del naranja y del salmón incluso con daltonismo |
| B · Ocre claro | `#e6c37a` | 11,09 / 10,09 / 8,97 | 43 · 26 · 26 | 37 · **14** · 25 | Más «marciana», pero con deuteranopia se acerca al salmón de «falla» |
| C · Lila | `#c9a7e0` | 8,99 / 8,17 / 7,27 | 90 · 89 · 89 | 50 · 52 · 45 | La más alejada del semáforo, pero no evoca Marte y con protanopia se acerca a `body-earth` (ΔE 9) |

> **Por qué no un rojo óxido**, que sería lo «natural» para Marte: estaría entre el naranja del `accent` y el salmón de
> `verdict-fail`, y con daltonismo rojo-verde los tres se verían casi iguales. Pasaría lo que la regla 5.3 quiere evitar.
>
> Sea cual sea el elegido, en el mapa el **tipo** lo sigue diciendo la forma del marcador y el veredicto siempre lleva
> icono y palabra, así que el color de Marte nunca tiene que cargar solo con el significado.
