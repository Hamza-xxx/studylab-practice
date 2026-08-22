import Link from "next/link";
import { notFound } from "next/navigation";

import { getPracticeById } from "@/app/lib/practice";

type PracticePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PracticePage({
  params,
}: PracticePageProps) {
  const { id } = await params;

  const item = getPracticeById(id);

  if (!item) {
    notFound();
  }

  return (
    <main className="panel">
      <h1>{item.title}</h1>

      <p>{item.description}</p>

      <p>
        <strong>Status:</strong> {item.status}
      </p>

      <Link href="/">← Back to backlog</Link>
    </main>
  );
}