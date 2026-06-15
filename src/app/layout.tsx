import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { Container } from "@/components/study";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Prep Notes",
  description:
    "A statically hostable preparation site for design patterns, DSA, LLD, and HLD notes."
};

const themeScript = `
  try {
    const savedTheme = localStorage.getItem("prep-notes-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme || (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.style.colorScheme = "light";
  }
`;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script
          id="prep-notes-theme"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body>
        <div className="min-h-screen">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
            <Container className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-950">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600 text-sm text-white">
                  PN
                </span>
                Prep Notes
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <nav className="flex flex-wrap items-center gap-1 text-sm font-semibold text-slate-600">
                  <Link href="/design-patterns/" className="rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-950">
                    Design Patterns
                  </Link>
                  <span className="rounded-md px-3 py-2 text-slate-400">DSA</span>
                  <span className="rounded-md px-3 py-2 text-slate-400">LLD</span>
                  <span className="rounded-md px-3 py-2 text-slate-400">HLD</span>
                </nav>
                <ThemeToggle />
              </div>
            </Container>
          </header>
          <main id="main">{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <Container className="py-8 text-sm leading-7 text-slate-500">
              Prep Notes is organized for interview preparation: learn the idea, compare trade-offs, revise quickly, then deepen when needed.
            </Container>
          </footer>
        </div>
      </body>
    </html>
  );
}
