import {
  practiceItems,
  type PracticeItem,
} from "@/src/data/practice-items";
import type { PracticeInput } from "@/src/lib/practice-input";

export function getPracticesForUser(userId: string) {
  return practiceItems.filter((practice) => practice.userId === userId);
}

export function getPracticeByIdForUser(id: string, userId: string) {
  return practiceItems.find(
    (practice) => practice.id === id && practice.userId === userId,
  );
}

export function createPracticeForUser(
  userId: string,
  input: PracticeInput,
): PracticeItem {
  const practice: PracticeItem = {
    id: crypto.randomUUID(),
    userId,
    title: input.title,
    description: input.description,
    status: "ready",
    completed: false,
  };

  practiceItems.push(practice);

  return practice;
}

export function completePracticeForUser(
  id: string,
  userId: string,
): PracticeItem | undefined {
  const practice = getPracticeByIdForUser(id, userId);

  if (!practice) {
    return undefined;
  }

  practice.completed = true;

  return practice;
}

export function updatePracticeForUser(
  id: string,
  userId: string,
  input: PracticeInput,
): PracticeItem | undefined {
  const practice = getPracticeByIdForUser(id, userId);

  if (!practice) {
    return undefined;
  }

  practice.title = input.title;
  practice.description = input.description;

  return practice;
}