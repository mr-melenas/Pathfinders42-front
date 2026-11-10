# Pathfinders42 · Contexto del proyecto para el equipo y sus IA

> **Para la IA que lea esto:** este documento es el contexto compartido del equipo Pathfinders42 en el NASA Space Apps
> Challenge 2026. Úsalo como fuente de verdad sobre decisiones, datos, API y forma de trabajar. Si algo de lo que te pidan
> contradice este documento, avisa antes de cambiarlo. No inventes datos científicos ni campos de la API: si no está aquí,
> en el OpenAPI (`/openapi.json`) o en los archivos de datos, pregunta. Responde y escribe código, comentarios, commits y PR
> en **español**.
>
> Actualizado: 2 nov 2026 · API v0.2.0

---

## 1. El proyecto

**Reto:** «Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars» (NASA Space Apps 2026,
dificultad avanzada). Hay que usar datos abiertos de la Tierra, la Luna y Marte para **identificar y caracterizar análogos
terrestres** de lugares de aterrizaje y bases de la Luna (sobre todo Artemis, polo sur) y de Marte.

Lo que valora el reto (ficha oficial y vídeo del autor, NASA Earth Science Division):
- Explicar **qué hace análogo** a un lugar (terreno, geología, temperatura, hielo/permafrost, cuevas, operaciones),
  **cuánto de bien funciona** y **dónde falla** la analogía.
- Ir más allá del parecido visual; no quedarse en los análogos muy estudiados (Atacama, Islandia, Hawái, Antártida):
  proponer **análogos nuevos**.
- Reconocer los **límites de la Tierra** como análogo: gravedad, vacío lunar, atmósfera marciana, radiación.
- Pensar en usos de misión: aterrizaje, navegación, movilidad, robótica, construcción, recursos in situ (ISRU).
- Formatos válidos: mapa interactivo, app, sistema de clasificación de similitudes, herramienta de IA/ML. **Nosotros: app
  web con mapa/globo + API + métrica de similitud por capas + modelo ML para encontrar análogos nuevos.**

**Enfoque decidido (29 oct):**
- **A · Explorador por sitio:** eliges un sitio de la Luna o Marte y ves sus parejas de la Tierra, capa por capa, con
  «funciona / falla».
- **D · Según el uso de la misión:** las mismas distancias ponderadas por uso (aterrizaje, movilidad, ISRU, pruebas
  térmicas, agua/hielo, cuevas). Se juntan las dos en el mismo front.

**Objetivo del equipo:** dejarlo **desplegado** y usable como portafolio.

## 2. Equipo, fechas y forma de trabajar

- 6 personas: 2 front, 2 datos, 2 modelos; el backend entre todos. Coordina Max (`mr-melenas`).
- **Fechas:**
  | Sprint | Fechas | Objetivo |
  |---|---|---|
  | S3 | 2–8 nov | MVP de punta a punta: API desplegada en prueba, front conectado (globo, detalle, «funciona / falla») |
  | S4 | 9–13 nov | Funciones (usos, ranking, candidatos ML, asistente). **Congelación de datos jueves 12 nov**. Despliegue definitivo viernes 13 |
  | Hackathon | 14–15 nov | Pitch, vídeo de demo y entrega |
- Los «Recursos» oficiales del reto se publican el **13 nov**: hasta entonces trabajamos con nuestros datos.
- **Tablero:** GitHub Project (vista **«Sprint actual»**). Campos: Status (Todo → In Progress → In Review → Done;
  Descartado), Prioridad (P0 imprescindible, P1 importante, P2 si sobra tiempo), Sprint, Área.
  Si una tarea no tiene sprint, no se hace esta semana. Máximo 2 tareas en curso por persona.
- **Ramas (en los dos repos):** `feat/…` o `fix/…` salen de `dev` → PR a `dev` → cuando `dev` está probado, PR
  `dev → main`. Nada de push directo a `main` ni a `dev`. PR pequeño, una revisión, CI en verde.
- **Hecho** = fusionado, desplegado y comprobado en la web.
- **Idioma:** todo en español (código incluido: nombres de variables y campos de la API están en español).
- En PR y comentarios **no** pegar enlaces a conversaciones de IA.

## 3. Enlaces

| Qué | Dónde |
|---|---|
| Repo backend (API) | https://github.com/mr-melenas/Pathfinders42 |
| Repo frontend | https://github.com/mr-melenas/Pathfinders42-front |
| Tablero | https://github.com/users/mr-melenas/projects/5 |
| Hoja de ruta (incluye el plan de desarrollo) | https://docs.google.com/document/d/1B0VIDzl0PQneeqjYt1tBp9RR9AFrrnMKfViPaL14Py8/edit |
| Bibliografía y fuentes de datos | https://docs.google.com/document/d/1h5fswjn6weWsRytt7sW_H2qe0BXqoiKU3Zw8I-uBcCY/edit |
| Ficha de análogos (Google Sheet) | https://docs.google.com/spreadsheets/d/1XXjus4ina29U1R6pS_ibGJoiPccqayCP8uUSIPNkfAI/edit |
| Carpeta de Drive «Hackathon Nasa» | https://drive.google.com/drive/folders/1Jo9pD3eqqBhZDZOB2kr-TqwitgLumlZ9 |

En Drive: `02_notebooks/` (Colab), `04_resultados/` (tablas), `06_web/` (lo que consume la web, con `manifest.json`).

## 4. Arquitectura

```
Colab (procesado pesado, ya hecho) ──▶ Drive 06_web/ ──sync──▶ repo back data/06_web/ ──▶ API FastAPI ──▶ Front React+TS
```

- **Todo lo pesado ya está calculado** en Colab. La API solo **sirve resultados precalculados** (JSON/GeoJSON, ~5 MB,
  versionados en el repo back). No hay modelos ni cálculos pesados en el servidor.
- **Back:** FastAPI (Python), prefijo `/api/v1`, documentación en `/docs`, contrato en `/openapi.json`.
  Despliegue previsto: Render o Fly.io (Docker). *Aún no hay URL pública* (tarea del S3).
- **Front:** React + TypeScript (decisión del equipo). Despliegue previsto: Vercel. Mapa con MapLibre (globo/mapa).
- **Contrato:** el OpenAPI de la API es la única fuente de verdad. El front genera sus tipos con
  [`openapi-typescript`](https://github.com/openapi-ts/openapi-typescript) (`npx openapi-typescript <url>/openapi.json -o src/api/schema.d.ts`).
  Si el front necesita algo que la API no da, se pide en el repo back (issue o PR), no se reconstruye en el front.
- **Supabase** (Postgres + pgvector) solo para el futuro asistente (RAG). Los datos científicos no van a base de datos.
- **CORS:** la API permite por defecto `http://localhost:5173` y `http://localhost:3000` (variable `CORS_ORIGINS`).

### Levantar la API en local (para desarrollar el front)

```bash
git clone https://github.com/mr-melenas/Pathfinders42 && cd Pathfinders42 && git checkout dev
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
uvicorn app.main:app --reload                         # http://localhost:8000/docs
```

Los datos ya vienen en el repo (`data/06_web`), no hace falta Drive.

## 5. Conceptos clave (glosario)

- **Sitio:** lugar de la Luna o Marte que comparamos. 160 en total:
  - Luna: 9 regiones Artemis III (polígonos, polo sur), 6 aterrizajes tripulados (Apollo), 22 robóticos, 1 planificado,
    29 sitios-cueva (pozos del LROC Lunar Pit Atlas).
  - Marte: 47 Exploration Zones, 11 aterrizajes robóticos, 1 planificado, 34 sitios-cueva (catálogo MGC³).
  - `tipo`: `region_aterrizaje_artemis`, `aterrizaje_tripulado`, `aterrizaje_robotico`, `aterrizaje_planificado`,
    `exploration_zone`, `cueva_luna`, `cueva_marte`.
- **Región / lugar de la Tierra:** candidato a análogo. Pueden ser regiones candidatas del índice (`luna-14`,
  `marte_polar-5`…), análogos conocidos de la ficha (`analogo-marte-lanzarote-esa-pangaea`…) o lugares concretos
  (cuevas, afloramientos de anortosita: `lofoten_flakstadoy`…).
- **Capa:** una dimensión de la comparación. Cada capa da, para cada sitio, una lista de **parejas** de la Tierra.
- **Distancia:** 0 = igual, 1 = nada parecido. Cada capa tiene su regla:

| Capa (`capa`) | Qué compara | Distancia principal | Umbral / veredicto |
|---|---|---|---|
| `topografia` | Pendiente y relieve a ~240 m (Copernicus en la Tierra, LOLA/MOLA) | Media de KS de pendiente y relieve | Parecido si ≤ 0,2 |
| `clima` | Temperatura de superficie (percentiles; MODIS, Diviner, MACDA) + topografía | `dist_total` | Veredicto por sitio; **brechas en °C** dicen dónde falla |
| `geologia` | Tipo de roca (GLiM en la Tierra; mapas geológicos) + topografía | `distancia_total` | Análogo completo si topo ≤ 0,2 y geo ≤ 0,4 |
| `hielo` | Hielo cerca de la superficie (Diviner PRP, Luna) vs permafrost (Tierra) + topografía | `d_hielo_topo` | Veredicto por sitio |
| `cuevas` | Cuevas del mismo tipo (tubo de lava, pozo, fractura, karst…): forma d/D y terreno | `d_combinada` | Veredicto por sitio (`Sí` / mismo tipo terreno distinto / sin cueva del mismo tipo) |
| `anortosita` | Roca de las tierras altas lunares (16 sitios Artemis y similares): roca + terreno | `d_total` | Análogo completo si topo ≤ 0,2 y geo ≤ 0,4 |

- **`parecido`** (por pareja) y **`hay_parecido` / `parecidos`** (por sitio): veredicto de la capa. `null` = la capa no
  decide por pareja.
- **Brecha:** diferencia en °C entre el sitio y su pareja (p. ej. `brecha_ts_media: -76`). Es el «dónde falla» del clima.
- **Verificación:** en la ficha, un análogo es «verificada» solo si una fuente lo presenta explícitamente como análogo de
  la Luna/Marte; si no, «candidato».

Resultados destacados (útiles para el pitch y para probar la UI):
- Malapert Massif, Peak Near Cabeus B, Nobile Rim 1 ↔ **Lofoten (Noruega)**, análogo completo de anortosita.
- Mons Mouton, Nobile Rim 2, de Gerlache Rim 2, IM-1 ↔ **White Mountain (Groenlandia)**.
- Jezero ↔ Lanzarote (clima 0,124) y Atacama (topografía 0,06).
- Marius Hills Pit ↔ tubos de Undara (Australia), misma clase de cueva y terreno parecido.
- Pozos lunares bajo saliente ~17 °C (Horvath 2022) ≈ superficie media junto a los tubos del Mauna Loa (+0,5 °C).

## 6. API v0.2.0 (rama `main`)

| Método y ruta | Devuelve |
|---|---|
| `GET /api/v1/health` | `{estado, version_api, datos_cargados}` |
| `GET /api/v1/meta` | Versión de los datos, cuerpos y capas disponibles |
| `GET /api/v1/capas` | Capas del manifest y si su archivo está disponible |
| `GET /api/v1/capas/{capa}` | Archivo completo de una capa tal cual (JSON/GeoJSON): `clima`, `topografia`, `topografia_sitios`, `geologia`, `hielo`, `cuevas`, `cuevas_sitios`, `cuevas_v2`, `anortosita`, `sitios` |
| `GET /api/v1/sitios?cuerpo=&tipo=&capa=` | Lista de sitios con el veredicto de cada capa |
| `GET /api/v1/sitios/geojson` | Los 160 sitios como FeatureCollection (properties = el resumen de arriba) → para el mapa |
| `GET /api/v1/sitios/{id}` | Ficha del sitio: propiedades, geometría, mejor pareja por capa y datos de cada capa |
| `GET /api/v1/sitios/{id}/parejas?capa=&n=` | Parejas de la Tierra en una capa (primero las marcadas como análogo, luego por distancia) |

Errores: `404` con `{"detail": "..."}` (sitio desconocido o capa sin datos para ese sitio); `422` parámetros inválidos;
`503` si la API no tiene datos cargados.

### Ejemplos reales (recortados)

`GET /api/v1/sitios?cuerpo=luna` → lista de:
```json
{
  "id": "artemis-malapert-massif", "nombre": "Malapert Massif", "cuerpo": "luna",
  "tipo": "region_aterrizaje_artemis", "lat": -85.9948, "lon": -0.2358,
  "capas": ["topografia", "clima", "geologia", "hielo", "anortosita"],
  "parecidos": {"topografia": false, "clima": false, "geologia": false, "hielo": false, "anortosita": true}
}
```

`GET /api/v1/sitios/artemis-malapert-massif` →
```json
{
  "id": "artemis-malapert-massif", "nombre": "Malapert Massif", "cuerpo": "luna", "...": "mismos campos que la lista",
  "propiedades": {"area_km2": 441.0, "fuente": "USGS ScienceBase, Artemis III…", "url_fuente": "https://www.sciencebase.gov/…"},
  "geometria": {"type": "Polygon", "coordinates": [[[-0.2, -86.1], "…"]]},
  "resumen": [
    {
      "capa": "anortosita", "descripcion": "Afloramientos de anortosita (tierras altas lunares): roca + topografía.",
      "hay_parecido": true, "n_parejas": 3,
      "mejor": {"id": "lofoten_flakstadoy", "nombre": "Lofoten (macizo de Flakstadøy), Noruega",
                "distancia": 0.229, "parecido": true,
                "detalles": {"verificacion": "verificada", "d_geo": 0.3, "d_topo": 0.158}}
    },
    {
      "capa": "clima", "hay_parecido": false, "n_parejas": 5,
      "mejor": {"id": "analogo-luna-askja-islandia", "nombre": "Askja, Islandia", "distancia": 0.37, "parecido": null,
                "detalles": {"dist_clima": 0.082, "brecha_ts_media": -121.7, "brecha_ts_min": -188.2}}
    }
  ],
  "datos_capas": {
    "clima": {"ts_media": -127.0, "ts_min": -202.0, "ts_max": -87.2, "...": "…"},
    "hielo": {"f_hielo": 0.21, "...": "…"},
    "geologia": {"clase_dominante": "anortosita", "f_anortosita": 1.0, "...": "…"}
  }
}
```

`GET /api/v1/sitios/ez-jezero-isidis-syrtis/parejas?capa=clima&n=2` →
```json
[
  {"id": "analogo-marte-lanzarote-esa-pangaea", "nombre": "Lanzarote (ESA PANGAEA)", "distancia": 0.124, "parecido": null,
   "detalles": {"dist_clima": 0.124, "brecha_ts_media": -76.0, "brecha_ts_min": -101.3, "dist_topo": 0.124}},
  {"id": "analogo-marte-desierto-de-atacama-nucleo-hiperarido-ar", "nombre": "Desierto de Atacama, núcleo hiperárido (ARADS)",
   "distancia": 0.126, "parecido": null, "detalles": {"dist_clima": 0.192, "dist_topo": 0.06}}
]
```

`detalles` y `datos_capas` llevan los campos propios de cada capa (nombres en español, unidades en °C, metros, grados o
fracciones 0–1). Para tipos exactos, mirar `/openapi.json` o `/docs`.

### Lo que la API todavía NO tiene (planificado)

| Endpoint | Para qué | Sprint |
|---|---|---|
| `GET /analogos`, `/analogos/{id}` | Regiones y lugares de la Tierra con su ficha y geometría | S3 |
| `GET /usos`, `GET /ranking?uso=` y `?uso=` en `/parejas` | Enfoque D (pesos por uso de misión) | S3–S4 |
| `GET /candidatos?uso=`, `/mapas/{uso}.png` | Análogos nuevos que propone el modelo M1 | S4 |
| `POST /asistente` | Chat con fuentes citadas (RAG) | S4 |
| `GET /fuentes` | Bibliografía y licencias | S4 |

Mientras no existan, el front puede maquetar con datos falsos **con la forma esperada** y conectarlos cuando lleguen.

## 7. Front: qué construir

Tareas del tablero (Área Front):

| Prioridad | Sprint | Tarea |
|---|---|---|
| P0 | S3 | Cliente API con tipos generados del OpenAPI; datos falsos hasta que la API esté desplegada |
| P0 | S3 | Globo/mapa con los sitios reales (`/sitios/geojson`), coloreado por cuerpo/tipo o por veredicto |
| P0 | S3 | Vista de detalle del sitio (`/sitios/{id}`) |
| P0 | S3 | Panel «dónde funciona / dónde falla» con la puntuación por capa (usar `resumen`, `parecido`, brechas) |
| P1 | S3 | Comparación de variables entre sitio y análogo (`/parejas` + `detalles`) |
| P1 | S3 | Capas del índice (PNG) y regiones en MapLibre |
| P1 | S3 | Sección «Límites de la Tierra como análogo»: gravedad, vacío, atmósfera y radiación |
| P2 | S3 | Imágenes de NASA Worldview enlazadas en el detalle |
| P0 | S4 | Selector de uso de misión y ranking (enfoque D) |
| P1 | S4 | Candidatos nuevos de M1 en el mapa, con explicación (SHAP) |
| P1 | S4 | Asistente en la web: chat con fuentes citadas |
| P1 | S4 | Pulir interfaz |
| P0 | S4 | Integración final del front |

Recomendaciones:
- Variables de entorno: `VITE_API_URL` (por defecto `http://localhost:8000/api/v1`).
- Mostrar siempre **de dónde sale** cada dato (capa, fuente) y **dónde falla**: es lo que puntúa el reto.
- Los sitios de la Luna y Marte se pintan con lat/lon de su cuerpo (no mezclar con el mapa de la Tierra): un mapa/globo
  por cuerpo o un selector Luna/Marte/Tierra.
- Distancias: mostrar como «parecido» (1 − distancia) o con semáforo usando los umbrales de la tabla del apartado 5.
- `parecido: null` ≠ `false`: «la capa no lo decide» ≠ «no es análogo».

## 8. IA en el proyecto (resumen)

- **M1 (obligatorio, Modelos):** buscador de análogos nuevos sobre una rejilla de la Tierra con LightGBM + aprendizaje
  PU (positivos = análogos verificados), explicado con SHAP. Se entrena en Colab y exporta resultados; la API los sirve.
- **Asistente (P1):** RAG + herramientas: el LLM consulta la API (sitio, parejas, ficha) y cita la fuente; los números
  salen de la API, nunca del modelo. LLM por API, caché y límite de uso.
- **M2/M3 (opcional):** embeddings de Clay («más lugares como este») y detectores de cráteres. Solo inferencia offline.
- Regla: la comparación entre cuerpos se hace con **medidas físicas**, no con embeddings de imagen.

## 9. Reglas para la IA que ayude a cualquiera del equipo

1. No cambies el contrato de la API desde el front. Si falta algo, propón el cambio en el repo back.
2. No inventes valores científicos, umbrales ni análogos. Todo dato sale de la API, de `data/06_web` o de la ficha.
3. Ramas desde `dev`, PR a `dev`, PR pequeños y descritos en español; sin enlaces a conversaciones de IA.
4. Mantén los nombres de campos tal como vienen de la API (en español): no los traduzcas en los tipos.
5. Si una tarea no está en el tablero o no tiene sprint, pregúntalo antes de hacerla.
6. Antes de dar algo por hecho: tests/lint en verde, probado contra la API real (local o desplegada).
