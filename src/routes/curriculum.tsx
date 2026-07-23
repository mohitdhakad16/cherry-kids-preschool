import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionTitle } from "@/components/PageHero";
import { BookOpen, Calculator, Microscope, Palette, Globe, Music } from "lucide-react";

export const Route = createFileRoute("/curriculum")({
  head: () => ({
    meta: [
      { title: "Curriculum — Cherry Kids Preschool" },
      { name: "description", content: "A play-based, whole-child curriculum across literacy, numeracy, arts and discovery." },
      { property: "og:title", content: "Curriculum at Cherry Kids" },
      { property: "og:description", content: "A whole-child curriculum across six learning areas." },
    ],
  }),
  component: Curriculum,
});

const subjects = [
  { icon: BookOpen, title: "Language & Literacy", text: "Story time, phonics games, conversation circles and a print-rich classroom." },
  { icon: Calculator, title: "Early Numeracy", text: "Counting, patterns, shapes and real-world math through hands-on materials." },
  { icon: Microscope, title: "Discovery & STEM", text: "Nature walks, simple experiments, and questions that lead to bigger questions." },
  { icon: Palette, title: "Creative Arts", text: "Painting, sculpture, dramatic play — process over product, always." },
  { icon: Globe, title: "World & Community", text: "Cultures, kindness, neighbourhoods and how we belong to each other." },
  { icon: Music, title: "Music & Movement", text: "Songs, rhythm, dance and yoga — joyful coordination for body and brain." },
];

function Curriculum() {
  return (
    <>
      <PageHero eyebrow="Curriculum" title="What we teach" subtitle="A whole-child curriculum that blends play with purpose — across six rich learning areas." />

      <section className="section-pad">
        <div className="container-x">
          <SectionTitle center eyebrow="Learning areas" title="Six pillars of growth" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => (
              <div key={s.title} className="rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:shadow-xl">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><s.icon className="h-6 w-6" /></div>
                <h3 className="mt-5 text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-x">
          <SectionTitle center eyebrow="Approach" title="How we teach" />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["01", "Observe", "Teachers watch closely to see what each child is ready to explore next."],
              ["02", "Invite", "We design hands-on invitations — materials, questions, and gentle prompts."],
              ["03", "Reflect", "Children share their thinking and we document their growth with parents."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-3xl bg-card p-8 border border-border">
                <div className="font-display text-5xl font-bold text-primary">{n}</div>
                <h3 className="mt-3 text-xl">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
