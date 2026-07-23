import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import activityArt from "@/assets/kids_color.webp";
import winterDay from "@/assets/winter_day.webp";
import musicDay from "@/assets/music_day.webp";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Activities — Cherry Kids Pre School" },
      { name: "description", content: "Art, music, outdoor play, yoga, gardening and more — Cherry Kids activities for happy little learners." },
      { property: "og:title", content: "Cherry Kids Activities" },
      { property: "og:description", content: "A day full of art, music, movement and outdoor discovery." },
    ],
  }),
  component: Activities,
});

const activities = [
  { title: "Art Studio", text: "Open-ended painting, sculpture and collage to spark imagination.", img: activityArt },
  { title: "Winter Play", text: "Climbing, running, and big-sky games on our sunny playground.", img: winterDay },
  { title: "Music Day", text: "Climbing, running, and big-sky games on our sunny playground.", img: musicDay },
];

const more = [
  ["🎵", "Music Circle", "Drums, ukuleles, songs and dance every single day."],
  ["🧘", "Mini Yoga", "Breathing, stretching and quiet — gentle bodies, calm minds."],
  ["🌱", "Garden Club", "Planting, watering, harvesting — kids love getting their hands dirty."],
  ["📚", "Story Time", "Cozy corners and big stories from around the world."],
  ["🔬", "Tiny Scientists", "Bubbles, ramps, magnets — discovery that feels like magic."],
  ["🍪", "Little Chefs", "Mixing, measuring, tasting — math and joy on a plate."],
];

function Activities() {
  return (
    <>
      <PageHero eyebrow="Activities" title="A day full of wonder" subtitle="Every Cherry Kids day is packed with hands-on adventures that build body, brain and friendships." />

      <section className="section-pad">
        <div className="container-x grid gap-8 md:grid-cols-3">
          {activities.map((a) => (
            <div key={a.title} className="overflow-hidden rounded-[2rem] border border-border bg-card">
              <img src={a.img} alt={a.title} width={800} height={800} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="p-7">
                <h3 className="text-2xl">{a.title}</h3>
                <p className="mt-2 text-muted-foreground">{a.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {more.map(([emoji, title, text]) => (
              <div key={title} className="rounded-3xl bg-card p-7 border border-border transition hover:-translate-y-1 hover:shadow-xl">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-sun/30 text-2xl">{emoji}</div>
                <h3 className="mt-5 text-xl">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
