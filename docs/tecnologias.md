# Tecnologías de Pathfinders42

Resumen para la presentación (15 nov 2026). Frontend: `package.json` del repo del front. Backend: `pyproject.toml` del
repo del back y la «Guía de la API para el front» de Max.

## Frontend

| Qué | Tecnología |
|---|---|
| Base | **React 19** + **TypeScript** (modo estricto) |
| Desarrollo y build | **Vite 8** |
| Estilos | **Tailwind CSS 4**, con los colores, tamaños y espaciados del diseño como tokens |
| Rutas | **React Router 8** |
| Datos de la API | **TanStack Query** (caché, estados de carga y error, reintentos) |
| Cliente de la API con tipos | **openapi-fetch** + **openapi-typescript**: los tipos se generan desde el contrato OpenAPI de la API, no se escriben a mano |
| Idiomas | **i18next** + **react-i18next** (español e inglés) |
| Globo 3D de la Tierra | **MapLibre GL JS 6** en modo globo |
| Mapas de la Luna y Marte | **SVG propio** con las imágenes de **NASA Solar System Treks** (proyección equirectangular, también en los polos) |
| Tipografía | **Red Hat Display, Text y Mono**, servidas con **Fontsource** |
| Calidad de código | **oxlint** |
| Gestor de paquetes | **pnpm** |
| Despliegue | **Vercel** |

## Backend (repo de Max)

| Qué | Tecnología |
|---|---|
| API | **Python 3.11+** con **FastAPI**, **Pydantic** y **Uvicorn** |
| Datos | **pandas** y **pyarrow** |
| Modelo para descubrir análogos nuevos (M1) | **LightGBM** con aprendizaje PU, explicado con **SHAP** |
| Asistente (LLM) | **Groq** con `openai/gpt-oss-120b`, búsqueda **BM25** + embeddings **BGE-M3** y *reranker* `bge-reranker-v2-m3`; las cifras se validan contra los datos |
| Nombres de lugares | **reverse_geocoder** (GeoNames) |
| Tests y calidad | **pytest** y **ruff** |
| Despliegue | **Render** (y **Docker**) |

## Imágenes y datos

- **Imágenes de los mapas:**
  - **NASA Solar System Treks**: mosaicos LRO WAC (Luna) y Viking MDIM 2.1 (Marte).
  - **NASA GIBS**: Blue Marble (Tierra).
  - **EOX Sentinel-2 cloudless 2016** (CC BY 4.0) en el globo de la Tierra.
- **Datos de las capas:**
  - Topografía: Copernicus DEM, LRO LOLA, MGS MOLA.
  - Clima: MODIS, LRO Diviner, MACDA.
  - Geología: GLiM, USGS (Luna 1:5M, Marte SIM 3292).
  - Hielo: Diviner PRP, SWIM, Obu et al.
  - Cuevas: LROC Pit Atlas, MGC³.
  - Anortosita: ficha de análogos del equipo.
- **Límites de la Tierra:** NASA NSSDC Fact Sheets, Hassler et al. (2014) y Zhang et al. (2020).

## Accesibilidad y buenas prácticas

- **WCAG 2.2 AA:**
  - contraste comprobado;
  - todo se puede usar con teclado;
  - los veredictos siempre llevan **color + icono + palabra**;
  - se respeta la opción «reducir movimiento».
- **Arquitectura por funcionalidades** (`features/` y `shared/`), con los tipos de la API generados desde su contrato.
- **Sin datos inventados:** el front pinta lo que da la API, y lo que no se sabe se muestra como «dato pendiente».

> Vitest estaba previsto (#23), pero todavía no está instalado: no lo pongas en la presentación hasta que exista.
