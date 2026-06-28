import Link from "next/link";
import { Container } from "@/components/study";

export default function NotFoundPage() {
  return (
    <div className="py-20">
      <Container className="max-w-3xl">
        <div className="soft-card p-8">
          <p className="accent-chip">404</p>
          <h1 className="mt-5 text-4xl font-bold text-slate-950">That note does not exist yet.</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            This site is still growing. If you meant one of the live notes sections,
            go back to the relevant index and choose a topic to study.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/design-patterns/"
              className="inline-flex rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              Open design patterns
            </Link>
            <Link
              href="/hld-notes/"
              className="inline-flex rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              Open HLD notes
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
