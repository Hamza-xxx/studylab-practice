import { getPracticesForUser } from "@/app/lib/practice";
import { getCurrentUser } from "@/app/lib/session";
import { PracticeList } from "@/src/components/PracticeList";
import { CreatePracticeForm } from "@/src/components/CreatePracticeForm";
export default async function HomePage() {
  const currentUser = await getCurrentUser();
  const practices = getPracticesForUser(currentUser.id);

  return (
    <main>
      <header className="hero">
        <p className="eyebrow">Personal practice planner</p>

        <h1>Plan your practice and track your progress.</h1>

        <p className="lede">
          Create, manage, and complete focused practice tasks in one place.
        </p>
      </header>

      <section aria-labelledby="practice-heading" className="panel">
  <div className="section-heading">
    <div>
      <p className="eyebrow">Your planner</p>
      <h2 id="practice-heading">Practice backlog</h2>
    </div>
  </div>

  <CreatePracticeForm />

  <PracticeList initialItems={practices} />
</section>
    </main>
  );
}