const reflections = new Map<string, string>();

export function getReflection(practiceId: string): string {
  return reflections.get(practiceId) ?? "";
}

export function saveReflection(
  practiceId: string,
  reflection: string,
): void {
  reflections.set(practiceId, reflection);
}