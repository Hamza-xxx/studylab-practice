import { z } from "zod";

export const practiceStatusSchema = z.enum([
  "ready",
  "in-progress",
  "review",
]);

export const practiceItemSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: practiceStatusSchema,
  })
  .strict();

export const practiceItemsSchema = z.array(practiceItemSchema);

export type PracticeStatus = z.infer<typeof practiceStatusSchema>;
export type PracticeItem = z.infer<typeof practiceItemSchema>;

export type ParsePracticeItemsResult =
  | {
      success: true;
      data: PracticeItem[];
    }
  | {
      success: false;
      error: z.ZodError;
    };

export function parsePracticeItems(
  input: unknown,
): ParsePracticeItemsResult {
  const result = practiceItemsSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      error: result.error,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}