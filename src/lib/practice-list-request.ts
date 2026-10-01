import type { PracticeItem } from "@/src/data/practice-items";
import { practiceItems } from "@/src/data/practice-items";

export type PracticeListRequest = () => Promise<PracticeItem[]>;

export function requestPracticeItems(): Promise<PracticeItem[]> {
  return Promise.resolve(practiceItems);
}