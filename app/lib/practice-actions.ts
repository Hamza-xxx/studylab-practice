"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getPracticeById } from "@/app/lib/practice";
import { saveReflection } from "@/app/lib/practice-reflections";

const reflectionInputSchema = z.object({
  practiceId: z.string().trim().min(1),
  reflection: z.string().trim().min(1).max(1000),
});

export type ReflectionActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: {
        reflection?: string[];
      };
    };

export async function updateReflection(
  input: unknown,
): Promise<ReflectionActionResult> {
  const result = reflectionInputSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: "Please correct the reflection and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { practiceId, reflection } = result.data;

  const practice = getPracticeById(practiceId);

  if (!practice) {
    return {
      success: false,
      message: "The requested practice does not exist.",
    };
  }

  saveReflection(practice.id, reflection);

  revalidatePath(`/practice/${practice.id}`);

  return {
    success: true,
    message: "Reflection updated successfully.",
  };
}