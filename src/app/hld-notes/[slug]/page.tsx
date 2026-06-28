import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { HldSection } from "@/lib/hld-notes";
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
      return { title: "Note not found" };
    }

    return {
      title: `${note.title} - HLD Notes`,
      description: note.summary
    };
  });
}

function SectionTable({ section }: { section: HldSection }) {
  if (!section.table) {
    return null;
  }

  return (
    <div className="article-table-wrap">
      <table className="article-table">
        <thead>
          <tr>
            {section.table.headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.table.rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="article-code">
      <code>{children}</code>
    </pre>
  );
}

function ArticleSection({
  section,
  number
}: {
  section: HldSection;
  number: number;
}) {
  return (
    <section id={section.id} className="article-section scroll-mt-24">
      <div className="article-section-heading">
        <span className="article-section-number">{String(number).padStart(2, "0")}</span>
        <div>
          <p className="article-eyebrow">{section.eyebrow}</p>
          <h2>{section.title}</h2>
        </div>
      </div>

      <p className="article-lead">{section.lead}</p>

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="article-copy">
          {paragraph}
        </p>
      ))}

      {section.bullets ? (
        <ul className="article-list">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}

      {section.code ? <CodeBlock>{section.code}</CodeBlock> : null}

      <SectionTable section={section} />

      {section.subsections ? (
        <div className="article-subsection-grid">
          {section.subsections.map((subsection) => (
            <section key={subsection.title} className="article-panel">
              <h3>{subsection.title}</h3>
              {subsection.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {subsection.bullets ? (
                <ul>
                  {subsection.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
              {subsection.code ? <CodeBlock>{subsection.code}</CodeBlock> : null}
            </section>
          ))}
        </div>
      ) : null}

      {section.callout ? (
        <aside className={`article-callout article-callout-${section.callout.tone}`}>
          <p className="article-callout-title">{section.callout.title}</p>
          <p>{section.callout.body}</p>
        </aside>
      ) : null}
    </section>
  );
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
    <div className="hld-workspace pb-16">
      <div className="w-full px-4 py-6 sm:px-6 xl:px-8 2xl:px-10">
        <div className="mx-auto grid max-w-[1800px] gap-7 xl:grid-cols-[230px_minmax(0,1fr)_250px] 2xl:grid-cols-[260px_minmax(0,1fr)_280px]">
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <Link href="/hld-notes/" className="article-back-link">
                <span aria-hidden="true">←</span>
                All HLD notes
              </Link>
              <p className="mt-8 section-title">Library</p>
              <nav className="mt-3 space-y-2" aria-label="HLD note library">
                {hldNotes.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/hld-notes/${item.slug}/`}
                    className={`article-library-link ${
                      item.slug === note.slug ? "article-library-link-active" : ""
                    }`}
                    aria-current={item.slug === note.slug ? "page" : undefined}
                  >
                    <span className="article-library-category">{item.category}</span>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>

              <div className="article-sidebar-note">
                <p className="section-title">Reading lens</p>
                <p>
                  Follow the invariant, failure mode, and operational signal. Architecture
                  is the trade-off between all three.
                </p>
              </div>
            </div>
          </aside>

          <article className="min-w-0">
            <nav className="article-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/hld-notes/">HLD Notes</Link>
              <span>/</span>
              <span aria-current="page">{note.title}</span>
            </nav>

            <header className="article-hero">
              <div className="flex flex-wrap items-center gap-2">
                <span className="article-topic-chip">{note.category}</span>
                <span className="article-meta-chip">{note.level}</span>
                <span className="article-meta-chip">{note.readingTime}</span>
              </div>
              <h1>{note.title}</h1>
              <p>{note.summary}</p>
            </header>

            <details className="article-mobile-toc xl:hidden">
              <summary>On this note</summary>
              <nav>
                {note.sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`}>
                    {section.title}
                  </a>
                ))}
              </nav>
            </details>

            <section className="article-facts" aria-label="Quick facts">
              {note.quickFacts.map((fact) => (
                <div key={fact.label}>
                  <p>{fact.label}</p>
                  <strong>{fact.value}</strong>
                </div>
              ))}
            </section>

            {note.image ? (
              <figure className="article-figure">
                <div className="article-figure-canvas">
                  <Image
                    src={note.image.src}
                    width={2000}
                    height={1167}
                    sizes="(min-width: 1536px) 1000px, (min-width: 1280px) 720px, 100vw"
                    alt={note.image.alt}
                    priority
                  />
                </div>
                <figcaption>
                  <span>{note.image.caption}</span>
                  <span>
                    Diagram:{" "}
                    <a href={note.image.sourceUrl} target="_blank" rel="noreferrer">
                      {note.image.sourceLabel}
                    </a>{" "}
                    ·{" "}
                    <a href={note.image.licenseUrl} target="_blank" rel="noreferrer">
                      {note.image.licenseLabel}
                    </a>
                  </span>
                </figcaption>
              </figure>
            ) : null}

            <div className="article-body">
              {note.sections.map((section, sectionIndex) => (
                <ArticleSection
                  key={section.id}
                  section={section}
                  number={sectionIndex + 1}
                />
              ))}
            </div>

            <section className="article-review">
              <p className="article-eyebrow">Revision / Ask yourself</p>
              <h2>Senior-level review questions</h2>
              <ol>
                {note.studyQuestions.map((question, questionIndex) => (
                  <li key={question}>
                    <span>{String(questionIndex + 1).padStart(2, "0")}</span>
                    {question}
                  </li>
                ))}
              </ol>
            </section>

            <section className="article-sources">
              <p className="article-eyebrow">References</p>
              <h2>Sources and further reading</h2>
              <div>
                {note.sources.map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                    <span>{source.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </section>

            <nav className="article-pagination" aria-label="Adjacent notes">
              {previous ? (
                <Link href={`/hld-notes/${previous.slug}/`}>
                  <span>Previous note</span>
                  <strong>{previous.title}</strong>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link href={`/hld-notes/${next.slug}/`}>
                  <span>Next note</span>
                  <strong>{next.title}</strong>
                </Link>
              ) : (
                <Link href="/hld-notes/">
                  <span>Back to</span>
                  <strong>All HLD notes</strong>
                </Link>
              )}
            </nav>
          </article>

          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <p className="section-title">On this note</p>
              <nav className="article-toc" aria-label="Table of contents">
                {note.sections.map((section, sectionIndex) => (
                  <a key={section.id} href={`#${section.id}`}>
                    <span>{String(sectionIndex + 1).padStart(2, "0")}</span>
                    {section.title}
                  </a>
                ))}
              </nav>

              <div className="article-sidebar-note article-sidebar-note-accent">
                <p className="section-title">Interview mode</p>
                <p>
                  State the workload and invariant first. Then compare failure semantics,
                  scaling behavior, and operational cost.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
