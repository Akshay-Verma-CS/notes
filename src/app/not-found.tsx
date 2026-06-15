import Link from "next/link";
import { Container } from "@/components/study";

export default function NotFoundPage() {
  return (
    <div className="py-20">
      <Container className="max-w-3xl">
        <div className="soft-card p-8">
          <p className="accent-chip">404</p>
          <h1 className="mt-5 text-4xl font-semibold">That note does not exist yet.</h1>
          <p className="mt-4 text-base leading-7 text-ink-600">
            This site is still growing. If you meant one of the design patterns, go back to
            the index and choose a topic to study.
          </p>
          <Link href="/design-patterns/" className="mt-6 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-800">
            Open design patterns
          </Link>
        </div>
      </Container>
    </div>
  );
}
