# Arquitectura de pantallas · Pathfinders42 (front)

> Versión mínima de F0.1, escrita con la #13 (rutas). Cierra el pendiente 11 de `sistema-visual.md` §8.
> Las pantallas de S4 se añadirán aquí cuando se planifiquen.

## Rutas del MVP (S3)

| URL | Pantalla | Feature | Datos de la API |
|---|---|---|---|
| `/` | Redirige a `/luna` | — | — |
| `/:cuerpo` | Explorar: sitios del cuerpo | `explore` | `GET /sitios/geojson` (E4) |
| `/:cuerpo/:siteId` | Detalle del sitio | `site-detail` | `GET /sitios/{sitio_id}` |
| `/limites-tierra` | Límites de la Tierra | `earth-limits` | Ninguno: textos de i18n (E7) |
| Cualquier otra | Página no encontrada | `app` | — |

- `:cuerpo` solo admite `luna` o `marte`, los valores de la API tal cual. Cualquier otro valor muestra la página
  no encontrada.
- `:siteId` es el `id` del sitio en la API (p. ej. `artemis-malapert-massif`). Si la API responde `404`, la página
  de detalle muestra su error con «Reintentar».

## Decisiones

- **El cuerpo va en la URL**, no en el estado de React: así se puede compartir y sobrevive a una recarga. El
  conmutador Luna / Marte de la cabecera lee la URL y, al cambiar, lleva a Explorar del otro cuerpo (`/marte`),
  también desde un detalle, porque un sitio de la Luna no existe en Marte.
- **`/luna/artemis-malapert-massif`**: es la URL de ejemplo del diseño final; el cuerpo delante deja claro de qué
  mapa viene el sitio.
- **Un layout común** (`AppLayout`): contenedor, `AppHeader` y `<main>`. Cada página pone su propio `<h1>`.
- **Pantallas de S4** (Usos de misión, Fuentes, Asistente): sin ruta hasta que se planifiquen; en la cabecera no
  se muestran.

## Pendiente

- Al desplegar en Vercel, todas las rutas tienen que servir `index.html` (regla de *rewrite*): se hace en la #14.
