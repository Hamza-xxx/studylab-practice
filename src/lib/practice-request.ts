import { practiceItems } from "@/src/data/practice-items";
import {
  parsePracticeItems,
  type PracticeItem,
} from "@/src/lib/practice-items";

export type PracticeRequest = () => Promise<PracticeItem[]>;

export async function requestPracticeItems(): Promise<PracticeItem[]> {
  const result = parsePracticeItems(practiceItems);

  if (!result.success) {
    throw new Error("Practice items validation failed.");
  }

  return result.data;
}