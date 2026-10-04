import Link from "next/link";
import { notFound } from "next/navigation";

import { updatePractice } from "@/app/actions";
import { getPracticeByIdForUser } from "@/app/lib/practice";
import { getCurrentUser } from "@/app/lib/session";

type PracticePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PracticePage({
  params,
}: PracticePageProps) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  const item = getPracticeByIdForUser(id, currentUser.id);

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

      <p>
        <strong>Completed:</strong> {item.completed ? "Yes" : "No"}
      </p>

      <section aria-labelledby="edit-practice-heading">
        <h2 id="edit-practice-heading">Edit practice</h2>

        <form action={updatePractice} className="practice-form">
          <input name="id" type="hidden" value={item.id} />

          <div>
            <label htmlFor="practice-title">Title</label>
            <input
              defaultValue={item.title}
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
              defaultValue={item.description}
              id="practice-description"
              maxLength={500}
              minLength={10}
              name="description"
              required
            />
          </div>

          <button type="submit">Save changes</button>
        </form>
      </section>

      <Link href="/">← Back to planner</Link>
    </main>
  );
}