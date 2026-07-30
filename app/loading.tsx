export default function Loading() {
  return (
    <main
      className="mx-auto min-h-[70vh] max-w-6xl animate-pulse px-5 pb-24 pt-32 sm:px-8"
      aria-label="Loading page"
    >
      <div className="h-3 w-24 rounded-sm bg-surface" />
      <div className="mt-5 h-11 w-full max-w-lg rounded-sm bg-surface" />
      <div className="mt-4 h-4 w-full max-w-md rounded-sm bg-surface" />
      <div className="mt-12 grid gap-3 md:grid-cols-3">
        <div className="h-40 rounded-md border border-border bg-card" />
        <div className="h-40 rounded-md border border-border bg-card" />
        <div className="h-40 rounded-md border border-border bg-card" />
      </div>
    </main>
  );
}
