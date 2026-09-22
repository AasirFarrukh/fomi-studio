// In-memory only: resets on server restart. Good enough for a mock backend;
// swap for a real database once generation actually persists.
let generations = [];

export function addGeneration(generation) {
  generations = [generation, ...generations];
  return generation;
}

export function getGenerations() {
  return generations;
}
