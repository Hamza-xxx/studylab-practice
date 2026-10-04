"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  completePracticeForUser,
  createPracticeForUser,
  updatePracticeForUser,
} from "@/app/lib/practice";
import { getCurrentUser } from "@/app/lib/session";
import { parsePracticeInput } from "@/src/lib/practice-input";

export type CreatePracticeState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createPractice(
  _previousState: CreatePracticeState,
  formData: FormData,
): Promise<CreatePracticeState> {
  const currentUser = await getCurrentUser();

  try {
    const input = parsePracticeInput({
      title: formData.get("title"),
      description: formData.get("description"),
    });

    createPracticeForUser(currentUser.id, input);

    revalidatePath("/");

    return {
      status: "success",
      message: "Practice added successfully.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        status: "error",
        message:
          "Check the title and description, then try again.",
      };
    }

    return {
      status: "error",
      message:
        "Something went wrong while adding the practice. Please try again.",
    };
  }
}

export async function completePractice(
  formData: FormData,
): Promise<void> {
  const currentUser = await getCurrentUser();

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return;
  }

  completePracticeForUser(id, currentUser.id);

  revalidatePath("/");
}

export async function updatePractice(
  formData: FormData,
): Promise<void> {
  const currentUser = await getCurrentUser();

  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    return;
  }

  const input = parsePracticeInput({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  const updated = updatePracticeForUser(
    id,
    currentUser.id,
    input,
  );

  if (!updated) {
    return;
  }

  revalidatePath("/");
  revalidatePath(`/practice/${id}`);
}