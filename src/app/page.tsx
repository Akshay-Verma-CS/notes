import Link from "next/link";
import { Container, Highlight, Paragraph } from "@/components/study";
import { categorySummary, categories, designPatterns, roadmapTracks } from "@/lib/notes";

export default function HomePage() {
  const featured = designPatterns.slice(0, 6);

  return (
    <div className="pb-20 pt-10 sm:pt-14">
      <Container>
        <section className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div className="space-y-7">
            <div className="flex flex-wrap gap-2">
              <span className="accent-chip">Study system</span>
              <span className="chip">Static export ready</span>
              <span className="chip">Reusable content blocks</span>
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-6xl">
                Build a study site that rewards depth, not skim-reading.
              </h1>
              <Paragraph className="text-lg text-ink-600">
                This project is set up as a personal knowledge base for your next switch:
                design patterns now, then DSA, LLD, and HLD later. The content is driven by
                reusable blocks so tables, paragraphs, highlights, and diagrams can be shared
                across every future topic.
              </Paragraph>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/design-patterns/" className="inline-flex items-center justify-center rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-800">
                Explore design patterns
              </Link>
              <a href="#roadmap" className="inline-flex items-center justify-center rounded-full border border-ink-300 bg-white px-6 py-3 text-sm font-semibold text-ink-800 transition hover:border-accent-300 hover:text-accent-700">
                See the study roadmap
              </a>
            </div>
          </div>

          <Highlight tone="blue" title="Why this site exists">
            <p>
              You said you like studying things in depth. That means the site should behave
              like a notebook with structure: each topic gets a mental model, a quick
              reference table, a diagram, and a place for trade-offs.
            </p>
            <p>
              The first live topic is design patterns, but the architecture is ready for
              algorithm notes, system design, and low-level design without a rewrite.
            </p>
          </Highlight>
        </section>

        <section className="mt-16 grid gap-4 lg:grid-cols-3">
          {categories.map((category) => (
            <article key={category} className="soft-card p-6">
              <p className="accent-chip">{category}</p>
              <h2 className="mt-4 text-2xl font-semibold">{category}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-600">{categorySummary[category]}</p>
            </article>
          ))}
        </section>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="accent-chip">Featured notes</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Design patterns with room to breathe</h2>
            </div>
            <Link href="/design-patterns/" className="text-sm font-semibold text-accent-700 hover:text-accent-800">
              Open all patterns
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((pattern) => (
              <Link key={pattern.slug} href={`/design-patterns/${pattern.slug}/`} className="pattern-link soft-card group block p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="chip">{pattern.category}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
                    {pattern.diagram.replace(/-/g, " ")}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold group-hover:text-accent-700">{pattern.title}</h3>
                <p className="mt-3 text-sm leading-7 text-ink-600">{pattern.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="roadmap" className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="accent-chip">Roadmap</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Built for future expansion</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            {roadmapTracks.map((track) => (
              <article key={track.title} className="soft-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold">{track.title}</h3>
                  <span className={track.status === "Live" ? "accent-chip" : "chip"}>{track.status}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-ink-600">{track.description}</p>
                {track.status === "Live" ? (
                  <Link href={track.href} className="mt-5 inline-flex text-sm font-semibold text-accent-700 hover:text-accent-800">
                    Open now
                  </Link>
                ) : (
                  <p className="mt-5 text-sm font-semibold text-ink-400">Planned next</p>
                )}
              </article>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
