import Link from "next/link";

export default function NotFound() {
  return (
    <main className="panel">
      <h1>Practice not found</h1>

      <p>
        The practice item you requested does not exist.
      </p>

      <Link href="/">
        ← Back to backlog
      </Link>
    </main>
  );
}