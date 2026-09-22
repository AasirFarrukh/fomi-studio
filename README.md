# Fomi Studio

A generation studio UI: describe an image or video, watch it develop, and browse everything you've made in one feed.

## Stack

- Next.js (App Router, JavaScript, `src/`)
- Tailwind CSS v4 (tokens via `@theme`)
- Mock API routes under `src/app/api` stand in for a real generation backend

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/            routes, layout, mock API handlers
  components/
    ui/           generic building blocks (Button, Select, Tabs, ...)
    layout/       header and navigation chrome
    studio/       the generation studio itself (composer, feed, history)
  hooks/          useGeneration and friends
  lib/            media resolution, in-memory store
  data/           static model/aspect-ratio catalogs
```

## Design system

The full "Darkroom" token spec — colors, type, radii, and motion — lives in the project's local, untracked notes.
