export function createId(prefix) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return prefix ? `${prefix}_${id}` : id;
}

export function createSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}
