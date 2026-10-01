import Link from "next/link";
import { notFound } from "next/navigation";

import { getReflection } from "@/app/lib/practice-reflections";
import { getPracticeById } from "@/app/lib/practice";
import ReflectionForm from "./ReflectionForm";

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

  const reflection = getReflection(item.id);

  return (
    <main className="panel">
      <h1>{item.title}</h1>

      <p>{item.description}</p>

      <p>
        <strong>Status:</strong> {item.status}
      </p>

      <ReflectionForm
        practiceId={item.id}
        initialReflection={reflection}
      />

      <Link href="/">← Back to backlog</Link>
    </main>
  );
}