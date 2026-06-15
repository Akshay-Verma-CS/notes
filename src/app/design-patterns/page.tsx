import Link from "next/link";
import { Container, Paragraph } from "@/components/study";
import { categories, designPatterns, getCategoryPatterns } from "@/lib/notes";

export default function DesignPatternsIndexPage() {
  return (
    <div className="pb-20 pt-10 sm:pt-14">
      <Container>
        <section className="max-w-4xl space-y-6">
          <p className="accent-chip">Design patterns</p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            A study map for the patterns you actually want to remember.
          </h1>
          <Paragraph>
            This index is intentionally structured for deeper study. Each pattern page has a
            diagram, a summary, a quick reference table, and a set of prompts that help you
            think about why the pattern exists instead of just memorizing the name.
          </Paragraph>
        </section>

        <div className="mt-12 space-y-12">
          {categories.map((category) => {
            const items = getCategoryPatterns(category);
            return (
              <section key={category}>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="chip">{category}</p>
                    <h2 className="mt-4 text-3xl font-semibold">{category} patterns</h2>
                  </div>
                  <span className="text-sm text-ink-500">{items.length} patterns</span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((pattern) => (
                    <Link
                      key={pattern.slug}
                      href={`/design-patterns/${pattern.slug}/`}
                      className="pattern-link soft-card group block p-6"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="accent-chip">{pattern.category}</span>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
                          deep dive
                        </span>
                      </div>
                      <h3 className="mt-5 text-2xl font-semibold group-hover:text-accent-700">{pattern.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-ink-600">{pattern.summary}</p>
                      <p className="mt-5 text-sm font-semibold text-accent-700">Read the note</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-16 soft-card p-6">
          <p className="accent-chip">How to use this page</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Paragraph>
              Start with the pattern summary, then inspect the diagram and quick facts. That
              gives you the reason before you get lost in implementation details.
            </Paragraph>
            <Paragraph>
              When you revisit the page later, jump straight to the trade-offs and study
              questions. Those sections are meant to force recall, not passive rereading.
            </Paragraph>
            <Paragraph>
              When DSA, LLD, and HLD land here, they can reuse the same content blocks so the
              learning experience stays consistent across every subject.
            </Paragraph>
          </div>
        </section>

        <div className="mt-14 flex flex-wrap gap-3 text-sm font-semibold">
          <span className="chip">{designPatterns.length} total patterns</span>
          <span className="chip">Original notes, not copied text</span>
          <span className="chip">Static-host friendly</span>
        </div>
      </Container>
    </div>
  );
}
