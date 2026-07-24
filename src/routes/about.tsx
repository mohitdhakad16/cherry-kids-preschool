
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, SectionTitle } from "@/components/PageHero";
import kidsColorImg from "@/assets/kids_color.webp";
import aboutAttentionImage from "@/assets/about-attention.webp"; // Placeholder for image_23f75b.jpg layout
import { Heart, Sparkles, Target, ShieldCheck, Plus, Minus } from "lucide-react";
import founderImg from "@/assets/Pallaivi_ma'am.jpg"; // Replace with the actual path to the founder's image

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Cherry Kids Preschool" },
      { name: "description", content: "Meet Cherry Kids Preschool: our story, philosophy, and the people who make every day bright." },
      { property: "og:title", content: "About Cherry Kids Preschool" },
      { property: "og:description", content: "A warm, modern preschool built on play, kindness, and big ideas." },
    ],
  }),
  component: About,
});

function About() {
  // Handles tracking which accordion item is currently expanded
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const accordionData = [
    { 
      title: "Learning Environment", 
      bg: "bg-[#8bc34a]",
      desc: "Our spaces are bright, safe, and thoughtfully structured with rich sensory centers to spark natural discovery, imagination, and independent play."
    },
    { 
      title: "Professional Teachers", 
      bg: "bg-[#7b1fa2]",
      desc: "Every classroom is guided by certified early childhood educators who specialize in patient observation, creative curriculum building, and loving mentorship."
    },
    { 
      title: "Programs for Everyone", 
      bg: "bg-[#ff5722]",
      desc: "From toddlers discovering routines to older children prepping for kindergarten, our child-led program tracks grow fluidly right along with them."
    }
  ];

  return (
    <>
      {/* PAGE HERO */}
      <PageHero eyebrow="About Us" title="About Cherry Kids" subtitle="We create a loving space for our cute little ones where they learn through play, build confidence, make friends, and uncover the joy of learning." />

       {/* Founder & Owner Section */}
      <section className="section-pad bg-muted/30">
        <div className="container-x">
          <div className="bg-background rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-border/40 grid gap-8 lg:grid-cols-12 items-center">
            
            {/* Left: Circular Profile Image */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-square rounded-full overflow-hidden border-[6px] border-background shadow-md">
                <img 
                  src={founderImg} 
                  alt="Dr. Sarah Jenkins" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right: Founder Details */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Pallavi Nakhawa</h2>
                <p className="text-sm font-semibold text-primary tracking-wider mt-1">Founder, Director & Early Childhood Educator</p>
              </div>

              <p className="mt-5 text-muted-foreground leading-relaxed">
                I am an ECCEd-qualified early childhood educator with over 12 years of experience in nurturing young minds. Throughout my journey, I have had the privilege of guiding countless children and helping families understand the importance of holistic early childhood development.
              </p>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-foreground">Personal Statement</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                 I strongly believe that “Learning Beyond Books” is the key to raising confident, creative, and compassionate children. My teaching philosophy focuses on hands-on experiences, play-based learning, life skills, sensory exploration, creativity, and real-world experiences that help children develop not only academically but also socially, emotionally, and physically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="section-pad">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <img src={kidsColorImg} alt="Cherry Kids classroom" width={1024} height={800} loading="lazy" className="rounded-[2rem] shadow-xl object-cover aspect-[5/4]" />
          <div>
            <span className="eyebrow">Our story</span>
            <h2 className="mt-4 text-3xl md:text-5xl">Started by parents, made for kids. </h2>
            <p className="mt-4 text-muted-foreground">
              Cherry Kids opened its doors in 2017 with one simple dream, to create a preschool where every child feels safe, happy, and excited to learn. 
            </p>
             <p className="mt-4 text-muted-foreground">
             From the very beginning, we have believed that early childhood learning is about more than just learning letters and numbers. It is about building confidence, encouraging creativity, and supporting them, as they grow through everyday experiences.
            </p>
            <p className="mt-4 text-muted-foreground">
             Today, Cherry Kids is proud to be a trusted preschool for 1,000+ happy learners across four age groups. With experienced educators, small class sizes, and a joyful learning environment, we help every child learn without hesitation, grow every day, and build a strong foundation for a bright future.
            </p>
          </div>
        </div>
      </section>

      {/* SPECIAL ATTENTION ACCORDION SECTION (image_23f75b.jpg Layout) */}
      <section className="section-pad bg-cream/50">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column: Graphic Illustration Image */}
          <div className="order-2 lg:order-1 flex justify-center">
            <img 
              src={aboutAttentionImage} 
              alt="Children playing layout" 
              className="w-full max-w-lg object-contain"
            />
          </div>

          {/* Right Column: Accordion System */}
          <div className="order-1 lg:order-2">
            <span className="eyebrow">About Our School</span>
            <h2 className="mt-2 text-3xl md:text-5xl font-bold text-secondary tracking-tight">
              Special Attention For Every Child
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We understand that every child learns at their own pace. Our focused teacher-to-child ratios ensure your little learner receives individualized care.
            </p>

            {/* Collapsible Content Trigger Fields */}
            <div className="mt-8 space-y-4">
              {accordionData.map((item, idx) => {
                const isOpen = openIdx === idx;
                
                return (
                  <div 
                    key={idx} 
                    className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left transition duration-200 hover:bg-muted/30 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${item.bg} text-white transition-transform duration-300`}>
                          {isOpen ? (
                            <Minus className="h-4 w-4 stroke-[3]" />
                          ) : (
                            <Plus className="h-4 w-4 stroke-[3]" />
                          )}
                        </div>
                        <span className="font-display font-bold text-secondary text-base md:text-lg">
                          {item.title}
                        </span>
                      </div>
                    </button>

                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-40 opacity-100 border-t border-border/40" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="p-5 text-sm text-muted-foreground leading-relaxed bg-muted/10">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="section-pad bg-cream">
        <div className="container-x">
          <SectionTitle center eyebrow="Our values" title="What we believe in" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Heart, title: "Kindness first", text: "Empathy is a skill — we model it and teach it every day." },
              { icon: Sparkles, title: "Joyful learning", text: "Curiosity blooms when learning feels like play." },
              { icon: Target, title: "Real growth", text: "Thoughtful goals, gentle pace, measurable progress." },
              { icon: ShieldCheck, title: "Safe & inclusive", text: "Every child belongs. Every family is welcome." },
            ].map((v) => (
              <div key={v.title} className="rounded-3xl bg-card p-7 border border-border">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><v.icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-lg">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STRIP FOR MISSION, VISION, & PROMISE */}
      <section className="section-pad">
        <div className="container-x grid gap-10 md:grid-cols-3">
          {[
            ["Mission", "Build a joyful foundation that helps every child grow into a confident, kind, lifelong learner."],
            ["Vision", "A world where early childhood is treated as the magical, formative season it truly is."],
            ["Promise", "Small classes, warm teachers, big ideas — and your child loved like family."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-3xl border border-border p-8">
              <div className="text-sm font-bold uppercase tracking-widest text-primary">Our {t}</div>
              <p className="mt-3 text-xl font-display text-secondary">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}