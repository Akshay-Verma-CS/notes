import Link from "next/link";
import { Container } from "@/components/study";
import {
  categories,
  categorySummary,
  designPatterns,
  getCategoryPatterns
} from "@/lib/notes";

const difficultyByCategory = {
  Creational: "Start here",
  Structural: "Next layer",
  Behavioral: "Interview heavy"
} as const;

export default function DesignPatternsIndexPage() {
  return (
    <div className="pb-16">
      <section className="border-b border-slate-200 bg-white">
        <Container className="grid gap-8 py-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden border-r border-slate-200 pr-5 lg:block">
            <p className="section-title">Topic index</p>
            <nav className="mt-3 space-y-1">
              {categories.map((category) => (
                <a key={category} href={`#${category.toLowerCase()}`} className="prep-link">
                  <span>{category}</span>
                  <span className="text-xs text-slate-500">
                    {getCategoryPatterns(category).length}
                  </span>
                </a>
              ))}
            </nav>

            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="section-title">Quick route</p>
              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <p>Short on time: Factory, Adapter, Observer, Strategy.</p>
                <p>LLD prep: Builder, Composite, Decorator, State.</p>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap gap-2">
              <span className="accent-chip">Design patterns</span>
              <span className="chip">{designPatterns.length} notes</span>
              <span className="chip">Creational / Structural / Behavioral</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              Design patterns syllabus for deep revision.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Use this page like a preparation directory. Pick a category, scan the pattern
              signal, then open the note for the mental model, trade-offs, example, and
              recall questions.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {categories.map((category) => (
            <article key={category} className="soft-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="accent-chip">{difficultyByCategory[category]}</p>
                  <h2 className="mt-4 text-2xl font-bold text-slate-950">{category}</h2>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-sm font-bold text-slate-700">
                  {getCategoryPatterns(category).length}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {categorySummary[category]}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 space-y-8">
          {categories.map((category) => {
            const items = getCategoryPatterns(category);
            return (
              <section key={category} id={category.toLowerCase()} className="scroll-mt-24">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="section-title">{difficultyByCategory[category]}</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-950">
                      {category} patterns
                    </h2>
                  </div>
                  <span className="chip">{items.length} notes</span>
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="grid grid-cols-[minmax(0,1fr)_120px_120px] border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 max-md:hidden">
                    <span>Pattern</span>
                    <span>Category</span>
                    <span>Open</span>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {items.map((pattern) => (
                      <Link
                        key={pattern.slug}
                        href={`/design-patterns/${pattern.slug}/`}
                        className="grid gap-3 px-4 py-4 transition hover:bg-emerald-50 md:grid-cols-[minmax(0,1fr)_120px_120px]"
                      >
                        <span>
                          <span className="block text-base font-bold text-slate-950">
                            {pattern.title}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-slate-600">
                            {pattern.summary}
                          </span>
                        </span>
                        <span className="text-sm font-semibold text-slate-600">
                          {pattern.category}
                        </span>
                        <span className="text-sm font-bold text-emerald-700">Read note</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
