import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <span className="blob bg-sun -top-20 -left-20 h-72 w-72" />
      <span className="blob bg-primary/40 -bottom-24 -right-10 h-72 w-72" />
      <div className="container-x relative py-20 md:py-28 text-center">
        {eyebrow && <span className="eyebrow mb-5">{eyebrow}</span>}
        <h1 className="text-4xl md:text-6xl font-bold animate-fade-up">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">{subtitle}</p>}
        <nav className="mt-6 flex items-center justify-center gap-2 text-sm text-secondary/70">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-primary font-semibold">{title}</span>
        </nav>
        {children}
      </div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, subtitle, center }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "max-w-3xl mx-auto text-center mb-12" : "max-w-2xl mb-12"}>
      {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
      <h2 className="text-3xl md:text-5xl font-bold">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
