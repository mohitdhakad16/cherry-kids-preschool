import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Calendar, MapPin, Clock } from "lucide-react";
import { getEvents, EventItem } from "@/utils/eventsStore";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Cherry Kids Preschool" },
      { name: "description", content: "Family days, sports day, art exhibitions and more upcoming events." },
    ],
  }),
  component: Events,
});

const colorMap: Record<string, string> = {
  blue: "bg-blue-600 text-white",
  purple: "bg-purple-600 text-white",
  yellow: "bg-amber-400 text-amber-950",
  green: "bg-emerald-500 text-white",
  orange: "bg-orange-500 text-white",
};

function Events() {
  const [eventList, setEventList] = useState<EventItem[]>([]);
  const navigate = useNavigate();

useEffect(() => {
  const loadEvents = async () => {
    const data = await getEvents();
    setEventList(data);
  };
  loadEvents();
}, []);

  return (
    <>
      <PageHero eyebrow="Events" title="Explore Our Events" subtitle="Celebrations, family days and learning showcases." />
      <section className="section-pad">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {eventList.map((e, index) => (
            <article key={index} className="overflow-hidden rounded-3xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl">
              <div className={`${colorMap[e.color] || colorMap.blue} p-6`}>
                <div className="font-display text-3xl font-bold">{e.date}</div>
                <div className="text-xs mt-3 uppercase tracking-widest opacity-80">{new Date().getFullYear()}</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground">{e.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{e.time}</li>
                  <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{e.place}</li>
                  {/* DYNAMIC AUDIENCE VALUE FROM ADMINISTRATIVE STORAGE */}
                  <li className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{e.audience || "Open to families"}</li>
                </ul>
                {e.showGalleryButton && e.galleryCollectionId && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <button
                      onClick={() =>
                        navigate({
                          to: "/gallery",
                          search: { category: e.galleryCollectionId },
                        })
                      }
                      className="group flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-95 cursor-pointer"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">View Gallery</span>
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}