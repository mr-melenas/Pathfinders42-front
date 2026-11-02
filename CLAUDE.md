# CLAUDE.md — Pathfinders42 (Frontend)

Reglas para la IA (Claude Code) en este repositorio. **Este archivo tiene prioridad**: si un CLAUDE.md de una carpeta superior o una skill sugiere algo que lo contradice, manda este archivo.

## Idioma

- Todo en **español**: comentarios del código, textos de la interfaz y documentación.
- Los nombres de variables, funciones, ramas y commits van en inglés (convención técnica); el resto, en español.

## Gestor de paquetes

- Se usa **siempre pnpm**. Nunca `npm` ni `yarn`.
- La versión de pnpm está fijada en `packageManager` (`package.json`) y se respeta vía Corepack.
- El único lockfile válido es `pnpm-lock.yaml`. No debe existir `package-lock.json` ni `yarn.lock`.

## Datos y API

- **No inventar datos científicos ni campos de la API.** Si un dato o un campo no se puede verificar, decirlo claramente.
- El **contrato de la API es su OpenAPI**. Es la fuente de verdad de la forma de los datos.
- Los tipos de TypeScript de la API **se generan con `openapi-typescript`** a partir de ese OpenAPI. No se escriben a mano ni se adivinan.
- **No traducir los nombres de los campos de la API**: se usan tal cual vienen en el contrato.

## Ramas y Pull Requests

- Ramas de trabajo desde `dev`: `feat/<descripcion>` o `fix/<descripcion>`.
- Nada de push directo a `main` ni a `dev`.
- Las PRs son **pequeñas y descriptivas**, dirigidas a `dev`. Cuando `dev` está probado, PR de `dev` a `main`.
- Commits en **Conventional Commits**, en español.
- **No pegar enlaces a conversaciones de IA** (ni a Claude ni a otras) en las PRs ni en los comentarios.

## Forma de trabajar

- **Claude escribe el código; Adriana lo revisa** en el diff antes de nada.
- Paso a paso: antes de cada comando o archivo, Claude explica en una o dos frases qué hace y por qué, y **espera el OK**.
- **Claude no hace `git add`, `commit`, `push`, merges ni Pull Requests** salvo que se le pida de forma explícita. Cuando toque, sugiere el mensaje de commit (Conventional Commits, en español) y Adriana lo ejecuta.
- No añadir dependencias nuevas sin justificarlas y confirmarlas antes.
- Seguir la documentación oficial **actual** de las herramientas (Vite, Tailwind, pnpm…); no usar configuraciones antiguas.

## Stack

- **Vite + React + TypeScript**, con **Tailwind CSS** (plugin `@tailwindcss/vite`, configuración desde el CSS, sin `tailwind.config.js`).
- Linter: **oxlint** (`pnpm lint`).
