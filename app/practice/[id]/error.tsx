"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  void error;

  return (
    <main className="panel">
      <h1>Something went wrong</h1>

      <p>We couldn&apos;t load this practice. Please try again.</p>

      <button onClick={() => reset()}>
        Try again
      </button>

      <br />
      <br />

      <Link href="/">← Back to backlog</Link>
    </main>
  );
}