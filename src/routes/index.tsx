import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Palette, Music, BookOpen, Smile, Users, Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import activityArt from "@/assets/activity-craft.jpg";
import activityPlay from "@/assets/activity-fishing.jpg";
import aboutSection from "@/assets/about-section.webp";
import { SectionTitle } from "@/components/PageHero";
import homeBanner from "@/assets/home_banner.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cherry Kids Preschool — Where Little Minds Grow" },
      { name: "description", content: "Searching for a preschool and daycare near me? Cherry Kids offers quality early childhood education, experienced educators, and a positive environment. Visit us today!" },
      { keywords: "Early childhood education, nursery school, nursery school near me, Early childhood learning, Best Preschool in Uran, Preschool in Uran, Preschool Near Me, Daycare and Preschool in Uran " },
      { property: "og:title", content: "Cherry Kids Preschool" },
      { property: "og:description", content: "Play-based early learning for ages 2–6." },
      { property: "og:image", content: homeBanner },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Palette, color: "bg-primary/10 text-primary", title: "Creative Arts", text: "Paint, craft, learn, laugh, and begin with a young mind's imagination." },
  { icon: Music, color: "bg-accent/10 text-accent", title: "Music & Movement", text: "A place where little feet dance, and happy hearts sing."},
  { icon: BookOpen, color: "bg-sun/20 text-secondary", title: "Early Literacy", text: "We build strong language skills with stories, phonics, and meaningful conversations." },
  { icon: Smile, color: "bg-primary/10 text-primary", title: "Social Skills", text: "Growing kind, confident children through friendship, empathy, and teamwork." },
];

const classes = [
  { age: "2–3 yrs", title: "Pre-Nursery", color: "bg-primary", emoji: "🧸", text: "A warm, caring space where little ones play, explore, and feel at home." },
  { age: "3–4 yrs", title: "Nursery", color: "bg-accent", emoji: "🐰", text: "Learning through stories, music, play, and joyful discovery every single day." },
  { age: "4–5 yrs", title: "Junior K.G", color: "bg-sun text-secondary", emoji: "⭐", text: "Children develop early skills while making friends and discovering new ideas." },
  { age: "5–6 yrs", title: "Senior K.G", color: "bg-secondary", emoji: "🚀", text: "Growing without hesitation, independent learners prepared for their next big adventure." },
];

const baseShortsData = [
  { id: "peF5qlhLsJc", title: "Janmashtami Celebration 🎉" },
  { id: "Z3pMc1byWkk", title: "Rainy Day Fun 🌧️" }, 
  { id: "aqdNMT9ZB3g", title: "Guru Poornima 🏫" },
  { id: "vigWZvVcoGg", title: "Ashadhi Ekadashi 🕉️" },
  { id: "DJtUiVqcMWw", title: "Colors Day 🎨" },
  { id: "gC7v11o4uJQ", title: "Hey Cuties👋" },
  { id: "3Zx_nj5j2wU", title: "Yoga Day 🧘" },
  { id: "xDiB-SQZ3bY", title: "First Day of School! 📚" },
  { id: "BmMSuYbUhKc", title: "Fun, Learning & Happy Moments 🌟" },
];

const extendedShortsData = [...baseShortsData, ...baseShortsData, ...baseShortsData];

function Home() {
  const [currentIndex, setCurrentIndex] = useState(baseShortsData.length);
  const [withTransition, setWithTransition] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMoving = useRef(false);

  // Track loading status individually per unique iframe index clone instance
  const [loadedIframes, setLoadedIframes] = useState<Record<string, boolean>>({});

  const handleSlide = (direction: "left" | "right") => {
    if (isMoving.current) return;
    isMoving.current = true;
    setWithTransition(true);

    setCurrentIndex((prev) => (direction === "right" ? prev + 1 : prev - 1));
  };

  useEffect(() => {
    const totalItems = baseShortsData.length;
    
    if (currentIndex >= totalItems * 2) {
      const timer = setTimeout(() => {
        setWithTransition(false);
        setCurrentIndex(currentIndex - totalItems);
        isMoving.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
    
    if (currentIndex < totalItems) {
      const timer = setTimeout(() => {
        setWithTransition(false);
        setCurrentIndex(currentIndex + totalItems);
        isMoving.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      isMoving.current = false;
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (carouselRef.current) {
      const firstCard = carouselRef.current.firstElementChild as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.getBoundingClientRect().width;
        const styles = window.getComputedStyle(carouselRef.current);
        const gap = parseFloat(styles.gap) || 0;
        const totalShiftWidth = cardWidth + gap;

        carouselRef.current.style.transform = `translateX(-${currentIndex * totalShiftWidth}px)`;
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const autoplayTimer = setInterval(() => {
      handleSlide("right");
    }, 4000);

    return () => clearInterval(autoplayTimer);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-cream">
        <span className="blob bg-sun -top-20 -left-20 h-80 w-80" />
        <span className="blob bg-accent/40 top-40 -right-20 h-80 w-80" />
        <span className="blob bg-primary/40 -bottom-24 left-1/3 h-72 w-72" />
        <div className="container-x relative grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
          <div className="animate-fade-up">
            <span className="eyebrow"><Heart className="h-3.5 w-3.5" /> Ages 2 – 6</span>
            <h1 className="mt-5 text-5xl md:text-7xl font-bold leading-[1.05]">
              Where little <span className="text-primary">minds grow</span> bright.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Cherry Kids are here to build confidence, friendships, and a lifelong love for learning from day one, because every child deserves a happy beginning! 
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">Book a Tour <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/classes" className="btn-outline">Explore Classes</Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[["10+", "Years"], ["1000+", "Happy kids"], ["7", "Teachers"]].map(([n, l]) => (
                <div key={l}>
                  <div className="text-3xl md:text-4xl font-display font-bold text-primary">{n}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-3xl bg-sun rotate-12 animate-float" />
            <div className="absolute -bottom-6 -right-4 h-20 w-20 rounded-full bg-accent animate-float" style={{ animationDelay: "1.5s" }} />
            <img
              src={homeBanner}
              alt="Joyful preschool children playing"
              width={1280}
              height={1024}
              className="relative rounded-[2.5rem] shadow-2xl object-cover aspect-[5/4]"
            />
            <div className="absolute -left-6 bottom-10 hidden md:flex items-center gap-3 rounded-2xl bg-background p-4 shadow-xl">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><Users /></div>
              <div>
                <div className="font-display font-bold text-secondary">7:1 ratio</div>
                <div className="text-xs text-muted-foreground">Small, focused classes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section-pad">
        <div className="container-x">
          <SectionTitle center eyebrow="What we do" title="A bright start for your little one" subtitle="We ensure every child feels safe, happy, and free to express their thoughts and ideas. Also, we guide, support, and help them grow, preparing them for a bright and successful future." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="group rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:shadow-xl">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl ${f.color}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section-pad bg-cream">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <img src={aboutSection} alt="Teacher reading to children" width={1024} height={800} loading="lazy" className="rounded-[2rem] shadow-xl object-cover aspect-[5/4]" />
            <div className="absolute -bottom-6 -right-6 hidden md:block rounded-3xl bg-primary p-6 text-primary-foreground shadow-xl max-w-[240px]">
              <div className="text-4xl font-display font-bold">10+</div>
              <div className="text-sm opacity-90">Years of nurturing happy little learners</div>
            </div>
          </div>
          <div>
            <span className="eyebrow">About Cherry Kids</span>
            <h2 className="mt-4 text-3xl md:text-5xl">A second home, full of light and laughter.</h2>
            <p className="mt-4 text-muted-foreground">
              At Cherry Kids, every child is welcomed with love, care, and encouragement. We create a happy and safe place where children learn through play, make new friends, ask questions, and grow with confidence.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Fun activities that spark curiosity and creativity for early childhood learning.",
                "Experienced educators who understand and support every child.",
                "Bright, child-friendly spaces where children can explore, learn, and enjoy.",
                "Helping children become kind, independent, and grow more every day.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground text-xs">✓</span>
                  <span className="text-secondary">{t}</span>
                </li>
              ))}
            </ul>
            <Link to="/about" className="btn-primary mt-8">More About Us</Link>
          </div>
        </div>
      </section>

      {/* CLASSES */}
      <section className="section-pad">
        <div className="container-x">
          <SectionTitle center eyebrow="Our Classes" title="Programs for every age" subtitle="Creating a strong foundation for lifelong learning while guiding your child through every stage of their early childhood learning journey. " />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {classes.map((c) => (
              <div key={c.title} className="rounded-3xl border border-border bg-card p-7 text-center transition hover:-translate-y-1 hover:shadow-xl">
                <div className={`mx-auto grid h-20 w-20 place-items-center rounded-3xl ${c.color} text-3xl text-primary-foreground shadow-md`}>
                  <span>{c.emoji}</span>
                </div>
                <div className="mt-5 text-xs font-bold tracking-widest text-primary uppercase">{c.age}</div>
                <h3 className="mt-1 text-xl">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVITIES STRIP */}
      <section className="section-pad bg-secondary text-secondary-foreground relative overflow-hidden">
        <span className="blob bg-primary/40 top-10 left-10 h-72 w-72" />
        <span className="blob bg-accent/40 -bottom-10 right-10 h-72 w-72" />
        <div className="container-x relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow bg-white/10 text-sun">Activities</span>
            <h2 className="mt-4 text-3xl md:text-5xl text-white">Big imaginations need bigger adventures.</h2>
            <p className="mt-4 text-white/70 max-w-lg">
              Art, music, storytelling, fun activities, and exciting outdoor games create joyful experiences that make every day memorable and full of new discoveries.
            </p>
            <Link to="/activities" className="btn-primary mt-8">See Our Activities</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={activityArt} alt="Art class" width={800} height={800} loading="lazy" className="rounded-3xl object-cover aspect-square" />
            <img src={activityPlay} alt="Playground" width={800} height={800} loading="lazy" className="rounded-3xl object-cover aspect-square mt-10" />
          </div>
        </div>
      </section>

      {/* 🎬 NO-BLANK, NO-RELOAD TRUE INFINITE CAROUSEL WITH IMMEDIATE THUMBNAIL COVERS */}
      <section className="section-pad bg-cream overflow-hidden">
        <div className="container-x">
          <SectionTitle 
            center 
            eyebrow="Life at Cherry Kids" 
            title="Fun moments in short clips" 
            subtitle="Our latest classroom memories and milestones, updated automatically straight from YouTube." 
          />
          
          <div className="mt-10 overflow-hidden">
            <div 
              ref={carouselRef}
              className={`flex gap-6 pb-4 ${withTransition ? "transition-transform duration-500 ease-in-out" : ""}`}
            >
              {extendedShortsData.map((video, idx) => {
                const instanceKey = `${video.id}-${idx}`;
                const isLoaded = loadedIframes[instanceKey];

                return (
                  <div 
                    key={instanceKey} 
                    className="w-full md:w-[calc(100%/3-16px)] lg:w-[calc(100%/4-18px)] shrink-0 flex flex-col space-y-3"
                  >
                    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2.5rem] border border-border bg-slate-900 shadow-md">
                      
                      {/* 🖼️ Instant high-quality fallback image wrapper */}
                      {!isLoaded && (
                        <img 
                          src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                          alt={video.title}
                          className="absolute inset-0 h-full w-full object-cover z-10"
                        />
                      )}

                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=1&modestbranding=1&rel=0`}
                        title={video.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        onLoad={() => {
                          setLoadedIframes((prev) => ({ ...prev, [instanceKey]: true }));
                        }}
                      />
                    </div>
                    <p className="font-display font-bold text-secondary text-center text-sm px-2 line-clamp-1">
                      {video.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🔘 Navigation Controls */}
          <div className="mt-8 flex justify-center gap-4">
            <button 
              onClick={() => handleSlide("left")} 
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-secondary shadow-md hover:bg-slate-50 hover:text-primary active:scale-95 transition-all cursor-pointer select-none"
              aria-label="Previous clips"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={() => handleSlide("right")} 
              className="grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-secondary shadow-md hover:bg-slate-50 hover:text-primary active:scale-95 transition-all cursor-pointer select-none"
              aria-label="Next clips"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad">
        <div className="container-x">
          <SectionTitle center eyebrow="Parents say" title="Loved by families across the neighbourhood" />
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { name: "Amit Verma", role: "", quote: "This preschool offers a nurturing environment for young learners to flourish. The curriculum is thoughtfully designed to engage two-year-olds through play-based activities. Teachers demonstrate a genuine passion for early childhood education, fostering a love of learning. Parents consistently report positive experiences and remarkable progress in their children's development. This establishment provides a strong foundation for a successful academic journey. Keep it pallavi mam, best for kids in uran" },
              { name: "Dipali Bhoir", role: "", quote: "Dear All Cherry Kids Mam🍒, Firstly, thank you to all the Cherry Kids Preschool teachers. Your love, support, and care have been so genuine for my son. Thank you for all that you’ve done for him this year. I truly appreciate the way you go above and beyond to create a supportive and encouraging environment. I can see how much my child has improved his skills at his age. It’s clear that you care deeply about your all students, and my child has been lucky to have you as his first teachers. I’m grateful for the positive influence you’ve had on his life. Thank you for your love and support. 😍" },
              { name: "Snigdha Koli", role: "", quote: "We are happy with the academic standards at the Cherry Kids preschool. The teachers are knowledgeable, approachable, and care about our child's progress. The curriculum is well-structured and encourages both academic excellence and overall development. Our child has shown great improvement and enjoys learning every day. Regular assessments and feedback keep us well-informed. We appreciate the school’s commitment to quality education and continuous growth." },
            ].map((t) => (
              <div key={t.name} className="rounded-3xl border border-border bg-card p-7">
                <Quote className="h-8 w-8 text-primary" />
                <p className="mt-4 text-secondary">{t.quote}</p>
                <div className="mt-6 flex items-center gap-1 text-sun">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <div className="mt-4 font-display font-bold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-10 md:p-16 text-primary-foreground">
          <span className="blob bg-sun/60 -top-10 -left-10 h-60 w-60" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl md:text-5xl text-white">Ready for your child's brightest year?</h2>
              <p className="mt-3 text-white/85 max-w-xl">Tour our campus, meet the teachers, and see why families love Cherry Kids.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-display font-bold text-primary hover:bg-sun transition">Book a Tour <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/classes" className="inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-3 font-display font-bold text-white hover:bg-white hover:text-primary transition">View Classes</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}