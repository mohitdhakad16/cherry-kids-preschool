import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, SectionTitle } from "@/components/PageHero";
import { GraduationCap, Clock, Home, BookMarked } from "lucide-react";

export const Route = createFileRoute("/private-tutoring")({
  head: () => ({
    meta: [
      { title: "Private Tutoring — Cherry Kids Preschool" },
      { name: "description", content: "1:1 and small-group tutoring for early readers, math foundations and kindergarten prep." },
      { property: "og:title", content: "Private Tutoring at Cherry Kids" },
      { property: "og:description", content: "Personalized early-learning support, in school or at home." },
    ],
  }),
  component: Tutoring,
});

const plans = [
  {
    name: "Junior and Senior KG",
    features: ["1:1 weekly session", "Custom learning plan", "Parent updates"],
    color: "bg-card"
  },
  {
    name: "Primary (1st to 4th)",
    features: ["Academic support", "Subject reinforcement", "Study habit building", "Regular assessments"],
    featured: true,
    color: "bg-primary text-primary-foreground"
  },
  {
    name: "Secondary (5th to 8th)",
    features: ["Subject specialization", "Advanced concept clarity", "Exam preparation", "Academic mentoring"],
    color: "bg-card"
  },
];

function Tutoring() {
  return (
    <>
      <PageHero eyebrow="Private Tutoring" title="Learning That Grows With Your Child" subtitle="With individual attention and caring educators, we help children learn at their own pace, gain confidence, and enjoy every step of their learning journey.
" />

      <section className="section-pad">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: GraduationCap, title: "Certified tutors", text: "All our tutors are trained early-childhood educators." },
            { icon: Clock, title: "Flexible hours", text: "Mornings and afternoons — we fit your week." },
            { icon: BookMarked, title: "Custom plans", text: "Every child gets a plan built around their pace." },
          ].map((f) => (
            <div key={f.title} className="rounded-3xl border border-border bg-card p-7">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><f.icon className="h-5 w-5" /></div>
              <h3 className="mt-5 text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-x">
          <SectionTitle center eyebrow="Pricing" title="Simple, fair packages" />
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`rounded-3xl p-8 border border-border ${p.color} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-primary/20 ${p.featured ? "shadow-2xl" : ""}`}
              >
                <div className="font-display text-lg font-bold uppercase tracking-widest opacity-90">{p.name}</div>

                {/* Removed the price/per section */}

                <ul className="mt-8 space-y-3 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full text-xs ${p.featured ? "bg-white text-primary" : "bg-primary text-primary-foreground"}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`mt-8 inline-flex w-full justify-center items-center rounded-full px-6 py-3 font-display font-bold ${p.featured ? "bg-white text-primary" : "bg-primary text-primary-foreground"}`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
