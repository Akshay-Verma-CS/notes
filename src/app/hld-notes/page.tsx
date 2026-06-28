import Link from "next/link";
import { Container } from "@/components/study";
import { hldNotes } from "@/lib/hld-notes";

export default function HldNotesIndexPage() {
  const categories = Array.from(new Set(hldNotes.map((note) => note.category)));
  const noteCount = hldNotes.length;
  const sectionSummary: Record<string, string> = {
    Concurrency:
      "Protect shared mutable state, reduce wait time, and keep the critical path short.",
    Storage:
      "Partition data and traffic so the system can scale beyond one database node.",
    Caching:
      "Keep ultra-hot reads and ephemeral state in memory with clear durability and eviction rules."
  };

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
                    {hldNotes.filter((note) => note.category === category).length}
                  </span>
                </a>
              ))}
            </nav>

            <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="section-title">Quick route</p>
              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                <p>Start with the failure mode, then study the architecture choice and trade-offs.</p>
                <p>Interview angle: correctness first, then scale-out, then operational safety.</p>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap gap-2">
              <span className="accent-chip">High-level design</span>
              <span className="chip">{noteCount} note</span>
              <span className="chip">Concurrency / storage / caching</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              Systems notes for the hot paths that fight each other.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Use this section for HLD-style topics where coordination, latency, and
              failure semantics matter. The notes are written to sound like a senior
              engineer explaining trade-offs, not a glossary entry.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        <div className="space-y-8">
          {categories.map((category) => {
            const items = hldNotes.filter((note) => note.category === category);
            return (
              <section key={category} id={category.toLowerCase()} className="scroll-mt-24">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="section-title">HLD notes</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-950">{category}</h2>
                  </div>
                  <span className="chip">{items.length} notes</span>
                </div>
                <div className="soft-card overflow-hidden">
                  <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                    <h3 className="text-lg font-bold text-slate-950">{category} track</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {sectionSummary[category]}
                    </p>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {items.map((note) => (
                      <Link
                        key={note.slug}
                        href={`/hld-notes/${note.slug}/`}
                        className="grid gap-3 px-5 py-5 transition hover:bg-emerald-50 md:grid-cols-[minmax(0,1fr)_140px_120px]"
                      >
                        <span>
                          <span className="block text-base font-bold text-slate-950">
                            {note.title}
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-slate-600">
                            {note.summary}
                          </span>
                        </span>
                        <span className="text-sm font-semibold text-slate-600">
                          {note.category}
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
