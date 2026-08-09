import { practiceItems } from "@/src/data/practice-items";

export function getPracticeById(id: string) {
  return practiceItems.find((practice) => practice.id === id);
}