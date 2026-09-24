// In-memory only: resets on server restart. Good enough for a mock backend;
// swap for a real database once generation actually persists.
//
// Held on globalThis because the page and the route handlers are separate
// server bundles, each with its own copy of this module — a module-level array
// would give the server-rendered page a different, empty history.
const store = (globalThis.__fomiStore ??= { generations: [] });

export function addGeneration(generation) {
  store.generations = [generation, ...store.generations];
  return generation;
}

export function getGenerations() {
  return store.generations;
}
