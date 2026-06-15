import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Container,
  DataTable,
  Highlight,
  Paragraph,
  PatternDiagram
} from "@/components/study";
import {
  designPatterns,
  getPatternBySlug,
  getPatternIndex
} from "@/lib/notes";

export const dynamicParams = false;

export function generateStaticParams() {
  return designPatterns.map((pattern) => ({ slug: pattern.slug }));
}

export function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then((resolved) => {
    const pattern = getPatternBySlug(resolved.slug);

    if (!pattern) {
      return {
        title: "Pattern not found"
      };
    }

    return {
      title: `${pattern.title} - Design Patterns`,
      description: pattern.summary
    };
  });
}

export default async function PatternDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = getPatternBySlug(slug);

  if (!pattern) {
    notFound();
  }

  const index = getPatternIndex(pattern.slug);
  const previous = index > 0 ? designPatterns[index - 1] : null;
  const next = index < designPatterns.length - 1 ? designPatterns[index + 1] : null;

  return (
    <div className="pb-20 pt-10 sm:pt-14">
      <Container>
        <nav className="text-sm text-ink-500">
          <Link href="/" className="hover:text-accent-700">
            Home
          </Link>
          <span className="mx-2 text-ink-300">/</span>
          <Link href="/design-patterns/" className="hover:text-accent-700">
            Design Patterns
          </Link>
          <span className="mx-2 text-ink-300">/</span>
          <span className="text-ink-700">{pattern.title}</span>
        </nav>

        <section className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="accent-chip">{pattern.category}</span>
              <span className="chip">deep study</span>
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
              {pattern.title}
            </h1>
            <Paragraph className="text-lg text-ink-600">{pattern.summary}</Paragraph>
          </div>
          <PatternDiagram kind={pattern.diagram} title={pattern.title} />
        </section>

        <div className="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
          <article className="space-y-10">
            <section id="quick-facts" className="space-y-4 scroll-mt-24">
              <p className="accent-chip">Quick facts</p>
              <DataTable rows={pattern.quickFacts} />
            </section>

            <section id="why-it-exists" className="space-y-4 scroll-mt-24">
              <p className="accent-chip">Why it exists</p>
              <Paragraph>{pattern.problem}</Paragraph>
            </section>

            <section id="mental-model" className="space-y-4 scroll-mt-24">
              <p className="accent-chip">Mental model</p>
              <Highlight tone="blue" title="How to remember it">
                <p>{pattern.mentalModel}</p>
                <p>{pattern.recognize}</p>
              </Highlight>
            </section>

            <section id="when-to-use-it" className="space-y-4 scroll-mt-24">
              <p className="accent-chip">When to use it</p>
              <div className="grid gap-4 md:grid-cols-3">
                {pattern.useWhen.map((item) => (
                  <div key={item} className="soft-card p-5">
                    <p className="text-sm leading-7 text-ink-700">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="trade-offs" className="space-y-4 scroll-mt-24">
              <p className="accent-chip">Trade-offs</p>
              <Highlight tone="amber" title="Costs to watch">
                <ul className="list-disc space-y-2 pl-5">
                  {pattern.tradeoffs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Highlight>
            </section>

            <section id="common-misconceptions" className="space-y-4 scroll-mt-24">
              <p className="accent-chip">Common misconceptions</p>
              <div className="grid gap-4 md:grid-cols-3">
                {pattern.misconceptions.map((item) => (
                  <div key={item} className="soft-card p-5">
                    <p className="text-sm leading-7 text-ink-700">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="example" className="space-y-4 scroll-mt-24">
              <p className="accent-chip">Example</p>
              <Paragraph>{pattern.example}</Paragraph>
            </section>

            <section className="space-y-4">
              <p className="accent-chip">Study questions</p>
              <Highlight tone="ink" title="Ask yourself">
                <ul className="list-disc space-y-2 pl-5">
                  {pattern.studyQuestions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Highlight>
            </section>
          </article>

          <aside className="space-y-6 xl:sticky xl:top-24 xl:h-fit">
            <div className="soft-card p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ink-500">
                Table of contents
              </p>
              <ul className="mt-4 space-y-3 text-sm font-medium text-ink-600">
                <li><a href="#main" className="hover:text-accent-700">Top of page</a></li>
                <li><a href="#quick-facts" className="hover:text-accent-700">Quick facts</a></li>
                <li><a href="#why-it-exists" className="hover:text-accent-700">Why it exists</a></li>
                <li><a href="#mental-model" className="hover:text-accent-700">Mental model</a></li>
                <li><a href="#when-to-use-it" className="hover:text-accent-700">When to use it</a></li>
                <li><a href="#trade-offs" className="hover:text-accent-700">Trade-offs</a></li>
                <li><a href="#common-misconceptions" className="hover:text-accent-700">Common misconceptions</a></li>
                <li><a href="#example" className="hover:text-accent-700">Example</a></li>
              </ul>
            </div>

            <Highlight tone="blue" title="Study rhythm">
              <p>
                Read the diagram first, then the why section, then the trade-offs. That
                order mirrors how you should explain the pattern in an interview: concept,
                signal, and cost.
              </p>
            </Highlight>
          </aside>
        </div>

        <section className="mt-14 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3">
            {previous ? (
              <Link href={`/design-patterns/${previous.slug}/`} className="inline-flex items-center rounded-full border border-ink-300 bg-white px-5 py-3 text-sm font-semibold text-ink-800 transition hover:border-accent-300 hover:text-accent-700">
                Previous: {previous.title}
              </Link>
            ) : null}
            {next ? (
              <Link href={`/design-patterns/${next.slug}/`} className="inline-flex items-center rounded-full border border-ink-300 bg-white px-5 py-3 text-sm font-semibold text-ink-800 transition hover:border-accent-300 hover:text-accent-700">
                Next: {next.title}
              </Link>
            ) : null}
          </div>
          <Link href="/design-patterns/" className="text-sm font-semibold text-accent-700 hover:text-accent-800">
            Back to all patterns
          </Link>
        </section>
      </Container>
    </div>
  );
}
