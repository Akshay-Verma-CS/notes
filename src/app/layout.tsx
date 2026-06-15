import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Container } from "@/components/study";

export const metadata: Metadata = {
  title: "Notes for the next switch",
  description:
    "A statically hostable study site for design patterns today, with space for DSA, LLD, and HLD tomorrow."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="sticky top-0 z-30 border-b border-ink-200/80 bg-[rgba(248,241,232,0.84)] backdrop-blur">
            <Container className="flex h-16 items-center justify-between gap-4">
              <Link href="/" className="font-serif text-lg font-semibold tracking-wide text-ink-900">
                Notes for the next switch
              </Link>
              <nav className="flex items-center gap-4 text-sm font-medium text-ink-600">
                <Link href="/design-patterns/" className="transition hover:text-accent-700">
                  Design Patterns
                </Link>
                <span className="hidden sm:inline text-ink-300">/</span>
                <span className="hidden sm:inline text-ink-500">
                  DSA, LLD, HLD coming soon
                </span>
              </nav>
            </Container>
          </header>
          <main id="main">{children}</main>
          <footer className="border-t border-ink-200/80 bg-white/50">
            <Container className="py-8 text-sm leading-7 text-ink-500">
              Built as a personal study space that can grow from design patterns into DSA, LLD, and HLD notes without changing the structure.
            </Container>
          </footer>
        </div>
      </body>
    </html>
  );
}
