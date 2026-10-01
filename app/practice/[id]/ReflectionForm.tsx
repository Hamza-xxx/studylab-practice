"use client";

import { useState } from "react";

import {
  updateReflection,
  type ReflectionActionResult,
} from "@/app/lib/practice-actions";

type ReflectionFormProps = {
  practiceId: string;
  initialReflection: string;
};

export default function ReflectionForm({
  practiceId,
  initialReflection,
}: ReflectionFormProps) {
  const [reflection, setReflection] = useState(initialReflection);
  const [result, setResult] = useState<ReflectionActionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setResult(null);

    const response = await updateReflection({
      practiceId,
      reflection,
    });

    setResult(response);
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="filter">
      <label htmlFor="reflection">Your reflection</label>

      <textarea
        id="reflection"
        name="reflection"
        value={reflection}
        onChange={(event) => setReflection(event.target.value)}
        rows={6}
        maxLength={1000}
        aria-describedby="reflection-help reflection-result"
      />

      <p id="reflection-help">
        Write what you learned from this practice, up to 1000 characters.
      </p>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save reflection"}
      </button>

      <p
        id="reflection-result"
        role={result?.success ? "status" : "alert"}
        aria-live="polite"
      >
        {result?.message}
      </p>
    </form>
  );
}