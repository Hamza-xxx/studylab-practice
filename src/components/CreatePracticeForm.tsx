"use client";

import { useActionState } from "react";

import {
  createPractice,
  type CreatePracticeState,
} from "@/app/actions";

const initialState: CreatePracticeState = {
  status: "idle",
  message: "",
};

export function CreatePracticeForm() {
  const [state, formAction, isPending] = useActionState(
    createPractice,
    initialState,
  );

  return (
    <form action={formAction} className="practice-form">
      <div>
        <label htmlFor="practice-title">Title</label>
        <input
          disabled={isPending}
          id="practice-title"
          maxLength={80}
          minLength={3}
          name="title"
          required
          type="text"
        />
      </div>

      <div>
        <label htmlFor="practice-description">
          Description
        </label>

        <textarea
          disabled={isPending}
          id="practice-description"
          maxLength={500}
          minLength={10}
          name="description"
          required
        />
      </div>

      <button disabled={isPending} type="submit">
        {isPending ? "Adding..." : "Add practice"}
      </button>

      {state.message ? (
        <p
          aria-live="polite"
          className={
            state.status === "error"
              ? "form-message error"
              : "form-message success"
          }
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}