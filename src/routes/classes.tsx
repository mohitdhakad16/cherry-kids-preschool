import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Clock, Users, Calendar } from "lucide-react";

export const Route = createFileRoute("/classes")({
  head: () => ({
    meta: [
      { title: "Classes — Cherry Kids Preschool" },
      { name: "description", content: "Programs for ages 2–6, from Pre-Nursery to Little Leaders." },
      { property: "og:title", content: "Classes at Cherry Kids" },
      { property: "og:description", content: "Programs for every age, built on play and care." },
    ],
  }),
  component: Classes,
});

const classes = [
  { age: "2–3 yrs", title: "Pre-Nursery", color: "bg-primary", emoji: "🧸", hours: "Half / Full day", text: "A warm, caring space where little ones play, explore, and feel at home." },
  { age: "3–4 yrs", title: "Nursery", color: "bg-accent", emoji: "🐰", hours: "Half / Full day", text: "Learning through stories, music, play, and joyful discovery every single day." },
  { age: "4–5 yrs", title: "Junior K.G", color: "bg-sun text-secondary", emoji: "⭐", hours: "Full day", text: "Children develop early skills while making friends and discovering new ideas." },
  { age: "5–6 yrs", title: "Senior K.G", color: "bg-secondary", emoji: "🚀", hours: "Full day", text: "Growing without hesitation, independent learners prepared for their next big adventure." },
];

function Classes() {
  return (
    <>
      <PageHero eyebrow="Programs" title="Our Classes" subtitle="Every program is designed to help children express their ideas confidently, learn, and grow with happiness!
" />
      <section className="section-pad">
        <div className="container-x grid gap-8 md:grid-cols-2">
          {classes.map((c) => (
            <div key={c.title} className="group rounded-[2rem] border border-border bg-card p-8 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center gap-5">
                <div className={`grid h-20 w-20 place-items-center rounded-3xl ${c.color} text-primary-foreground text-3xl shadow-md`}>{c.emoji}</div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-primary">{c.age}</div>
                  <h3 className="text-2xl">{c.title}</h3>
                </div>
              </div>
              <p className="mt-5 text-muted-foreground">{c.text}</p>
              <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{c.hours}</div>
                <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Mon–Fri</div>
              </div>
              <Link to="/contact" className="btn-outline mt-7">Enroll Now</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule */}
      <section className="section-pad bg-cream">
        <div className="container-x">
          <div className="mb-10 text-center">
            <span className="eyebrow">Class schedule</span>
            <h2 className="mt-4 text-3xl md:text-5xl">A bright day at Cherry Kids</h2>
          </div>
          <div className="overflow-x-auto rounded-3xl border border-border bg-card">
            <table className="w-full text-left">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  {["Time", "Pre-Nursery", "Nursery", "Junior K.G", "Senior K.G"].map((h) => (
                    <th key={h} className="p-4 text-sm font-display font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["10:00 AM", "Welcome circle", "Welcome circle", "Welcome circle", "Welcome circle"],
                  ["10:30 AM", "Sensory play", "Music & movement", "Phonics", "Reading workshop"],
                  ["11:00 AM", "Snack & story", "Snack & story", "Snack & story", "Snack & story"],
                  ["11:30 AM", "Outdoor play", "Outdoor play", "Literacy", "Math discovery"],
                  ["12:00 AM", "Lunch", "Lunch", "Lunch", "Lunch"],
                  ["12:20 AM", "Rest", "Quiet time", "Numeracy", "Numeracy"],
                  ["12:45 AM", "Free play", "Free play", "Movement", "Revision"],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-border">
                    {row.map((cell, i) => (
                      <td key={i} className={`p-4 text-sm ${i === 0 ? "font-display font-bold text-primary" : "text-secondary"}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
