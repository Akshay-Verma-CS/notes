import Link from "next/link";
import { Container } from "@/components/study";
import {
  categories,
  categorySummary,
  designPatterns,
  getCategoryPatterns,
  roadmapTracks
} from "@/lib/notes";

const highYield = [
  "Singleton",
  "Factory",
  "Adapter",
  "Decorator",
  "Observer",
  "Strategy"
];

const prepStats = [
  { label: "Live notes", value: designPatterns.length.toString() },
  { label: "Active track", value: "Design Patterns" },
  { label: "Next tracks", value: "HLD / DSA / LLD" }
];

export default function HomePage() {
  const highYieldPatterns = designPatterns.filter((pattern) =>
    highYield.includes(pattern.title)
  );

  return (
    <div className="pb-16">
      <section className="border-b border-slate-200 bg-white">
        <Container className="grid gap-8 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden border-r border-slate-200 pr-5 lg:block">
            <p className="section-title">Preparation tracks</p>
            <nav className="mt-3 space-y-1">
              {roadmapTracks.map((track) => (
                <Link
                  key={track.title}
                  href={track.href}
                  className={`prep-link ${track.status === "Live" ? "prep-link-active" : ""}`}
                >
                  <span>{track.title}</span>
                  <span className="text-xs">{track.status}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="section-title">Study method</p>
              <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <li>1. Read the mental model.</li>
                <li>2. Compare trade-offs.</li>
                <li>3. Explain from memory.</li>
                <li>4. Revisit examples.</li>
              </ol>
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="accent-chip">Interview preparation</span>
              <span className="chip">Static notes</span>
              <span className="chip">Deep revision</span>
            </div>

            <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div>
                <h1 className="max-w-4xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                  Prep notes organized like a learning portal.
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
                  Start with design patterns, then expand into HLD, DSA, and low-level design.
                  Each note is shaped for depth: problem,
                  mental model, use cases, trade-offs, misconceptions, and recall prompts.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/design-patterns/"
                    className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    Continue Design Patterns
                  </Link>
                  <a
                    href="#high-yield"
                    className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Open high-yield list
                  </a>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {prepStats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-950">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        <section className="grid gap-4 lg:grid-cols-4">
          {roadmapTracks.map((track) => (
            <article key={track.title} className="soft-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={track.status === "Live" ? "accent-chip" : "chip"}>
                    {track.status}
                  </p>
                  <h2 className="mt-4 text-xl font-bold text-slate-950">{track.title}</h2>
                </div>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{track.description}</p>
              {track.status === "Live" ? (
                <Link
                  href={track.href}
                  className="mt-5 inline-flex rounded-md border border-emerald-200 px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50"
                >
                  Study now
                </Link>
              ) : (
                <span className="mt-5 inline-flex rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-400">
                  Planned
                </span>
              )}
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="soft-card overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <p className="section-title">Design patterns syllabus</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Learn by category, revise by signal.
              </h2>
            </div>
            <div className="divide-y divide-slate-200">
              {categories.map((category) => (
                <div key={category} className="grid gap-4 p-5 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{category}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {categorySummary[category]}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {getCategoryPatterns(category).map((pattern) => (
                      <Link
                        key={pattern.slug}
                        href={`/design-patterns/${pattern.slug}/`}
                        className="rounded-md border border-slate-200 bg-white p-3 text-sm transition hover:border-emerald-300 hover:bg-emerald-50"
                      >
                        <span className="font-bold text-slate-900">{pattern.title}</span>
                        <span className="mt-1 block leading-6 text-slate-600">
                          {pattern.summary}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside id="high-yield" className="space-y-4">
            <div className="soft-card p-5">
              <p className="section-title">High-yield revision</p>
              <div className="mt-4 space-y-2">
                {highYieldPatterns.map((pattern) => (
                  <Link
                    key={pattern.slug}
                    href={`/design-patterns/${pattern.slug}/`}
                    className="prep-link"
                  >
                    <span>{pattern.title}</span>
                    <span className="text-xs text-slate-500">{pattern.category}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="soft-card p-5">
              <p className="section-title">Depth checklist</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <li>Can I identify the pain that created the pattern?</li>
                <li>Can I explain the trade-off without using jargon?</li>
                <li>Can I compare it with a neighboring pattern?</li>
                <li>Can I name one practical interview example?</li>
              </ul>
            </div>
          </aside>
        </section>
      </Container>
    </div>
  );
}
