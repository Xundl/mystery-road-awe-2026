interface StubPageProps {
  title: string;
}

export function StubPage({ title }: StubPageProps) {
  return (
    <section className="view active">
      <h2>{title}</h2>
      <p>This view is not migrated to React yet (planned for Exercises 4/5).</p>
    </section>
  );
}
