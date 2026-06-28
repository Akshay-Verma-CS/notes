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
import { getHldNoteBySlug, getHldNoteIndex, hldNotes } from "@/lib/hld-notes";

export const dynamicParams = false;

export function generateStaticParams() {
  return hldNotes.map((note) => ({ slug: note.slug }));
}

export function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then((resolved) => {
    const note = getHldNoteBySlug(resolved.slug);

    if (!note) {
      return {
        title: "Note not found"
      };
    }

    return {
      title: `${note.title} - HLD Notes`,
      description: note.summary
    };
  });
}

export default async function HldNoteDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getHldNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  const index = getHldNoteIndex(note.slug);
  const previous = index > 0 ? hldNotes[index - 1] : null;
  const next = index < hldNotes.length - 1 ? hldNotes[index + 1] : null;

  return (
    <div className="pb-16">
      <Container className="grid gap-8 py-8 xl:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside className="hidden border-r border-slate-200 pr-5 xl:block">
          <p className="section-title">HLD notes</p>
          <nav className="mt-3 space-y-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                {note.category}
              </p>
              <div className="space-y-1">
                {hldNotes.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/hld-notes/${item.slug}/`}
                    className={`prep-link ${item.slug === note.slug ? "prep-link-active" : ""}`}
                  >
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        <article className="min-w-0">
          <nav className="text-sm text-slate-500">
            <Link href="/" className="hover:text-emerald-700">
              Home
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <Link href="/hld-notes/" className="hover:text-emerald-700">
              HLD Notes
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-700">{note.title}</span>
          </nav>

          <section className="mt-6 grid gap-6">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="accent-chip">{note.category}</span>
                <span className="chip">Senior-level</span>
              </div>
              <h1 className="max-w-4xl text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
                {note.title}
              </h1>
              <Paragraph className="text-lg text-slate-600">{note.summary}</Paragraph>
            </div>
            <PatternDiagram kind={note.diagram} title={note.title} />
          </section>

          <div className="mt-10">
            <div className="space-y-10">
              <section id="quick-facts" className="space-y-4 scroll-mt-24">
                <p className="accent-chip">Quick facts</p>
                <DataTable rows={note.quickFacts} />
              </section>

              <section id="why-it-exists" className="space-y-4 scroll-mt-24">
                <p className="accent-chip">Why it exists</p>
                <Paragraph>{note.problem}</Paragraph>
              </section>

              <section id="mental-model" className="space-y-4 scroll-mt-24">
                <p className="accent-chip">Mental model</p>
                <Highlight tone="blue" title="How to remember it">
                  <p>{note.mentalModel}</p>
                  <p>{note.recognize}</p>
                </Highlight>
              </section>

              <section id="when-to-use-it" className="space-y-4 scroll-mt-24">
                <p className="accent-chip">When to use it</p>
                <div className="grid gap-4 md:grid-cols-3">
                  {note.useWhen.map((item) => (
                    <div key={item} className="soft-card p-5">
                      <p className="text-sm leading-7 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="trade-offs" className="space-y-4 scroll-mt-24">
                <p className="accent-chip">Trade-offs</p>
                <Highlight tone="amber" title="Costs to watch">
                  <ul className="list-disc space-y-2 pl-5">
                    {note.tradeoffs.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Highlight>
              </section>

              <section id="reduce-contention" className="space-y-4 scroll-mt-24">
                <p className="accent-chip">Reduce contention</p>
                <div className="grid gap-4 md:grid-cols-2">
                  {note.reduceContention.map((item) => (
                    <div key={item} className="soft-card p-5">
                      <p className="text-sm leading-7 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="common-misconceptions" className="space-y-4 scroll-mt-24">
                <p className="accent-chip">Common misconceptions</p>
                <div className="grid gap-4 md:grid-cols-3">
                  {note.misconceptions.map((item) => (
                    <div key={item} className="soft-card p-5">
                      <p className="text-sm leading-7 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="example" className="space-y-4 scroll-mt-24">
                <p className="accent-chip">Example</p>
                <Paragraph>{note.example}</Paragraph>
              </section>

              <section className="space-y-4">
                <p className="accent-chip">Study questions</p>
                <Highlight tone="ink" title="Ask yourself">
                  <ul className="list-disc space-y-2 pl-5">
                    {note.studyQuestions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Highlight>
              </section>
            </div>
          </div>

          <section className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <div className="flex flex-wrap gap-3">
              {previous ? (
                <Link
                  href={`/hld-notes/${previous.slug}/`}
                  className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  Previous: {previous.title}
                </Link>
              ) : null}
              {next ? (
                <Link
                  href={`/hld-notes/${next.slug}/`}
                  className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  Next: {next.title}
                </Link>
              ) : null}
            </div>
            <Link href="/hld-notes/" className="text-sm font-bold text-emerald-700 hover:text-emerald-800">
              Back to all HLD notes
            </Link>
          </section>
        </article>

        <aside className="hidden space-y-6 xl:sticky xl:top-24 xl:block xl:h-fit">
          <div className="soft-card p-5">
            <p className="section-title">On this note</p>
            <ul className="mt-4 space-y-1 text-sm font-medium text-slate-600">
              <li>
                <a href="#quick-facts" className="prep-link">
                  Quick facts
                </a>
              </li>
              <li>
                <a href="#why-it-exists" className="prep-link">
                  Why it exists
                </a>
              </li>
              <li>
                <a href="#mental-model" className="prep-link">
                  Mental model
                </a>
              </li>
              <li>
                <a href="#when-to-use-it" className="prep-link">
                  When to use it
                </a>
              </li>
              <li>
                <a href="#trade-offs" className="prep-link">
                  Trade-offs
                </a>
              </li>
              <li>
                <a href="#reduce-contention" className="prep-link">
                  Reduce contention
                </a>
              </li>
              <li>
                <a href="#common-misconceptions" className="prep-link">
                  Misconceptions
                </a>
              </li>
              <li>
                <a href="#example" className="prep-link">
                  Example
                </a>
              </li>
            </ul>
          </div>

          <Highlight tone="blue" title="Senior signal">
            <p>
              Good concurrency design is usually about not sharing the hot thing at all.
              If you can shard, version, or make the write idempotent, you often need
              less locking than you first think.
            </p>
          </Highlight>
        </aside>
      </Container>
    </div>
  );
}
