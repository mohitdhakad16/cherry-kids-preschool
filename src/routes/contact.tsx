import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { db } from "@/utils/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Cherry Kids Preschool" },
      { name: "description", content: "Book a tour, ask a question, or start your enrollment at Cherry Kids Preschool." },
      { property: "og:title", content: "Contact Cherry Kids Preschool" },
      { property: "og:description", content: "Book a tour or start enrollment." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // 1. Send to Web3Forms for email notification
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // 2. Save to Firebase database
        await addDoc(collection(db, "messages"), {
          senderName: formData.get("Name"),
          senderEmail: formData.get("Email"),
          senderPhone: formData.get("Phone"),
          interestedProgram: formData.get("Program"),
          messageContent: formData.get("Message"),
          createdAt: serverTimestamp(),
          isRead: false,
        });

        setSent(true);
        form.reset();
      } else {
        throw new Error(data.message || "Failed to send email");
      }
    } catch (err) {
      setError("Failed to send message. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="Contact" title="Let's get in touch" subtitle="Book a tour, ask a question, or start your enrollment — we'd love to meet you." />
      <section className="section-pad">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {[
              { icon: MapPin, t: "Visit us", d: "Shop no 3,4 & 6 Shivsagar CHS Nagoan Road, Uran 400-702" },
              { icon: Phone, t: "Call us", d: "+91 7715034191" },
              { icon: Mail, t: "Email", d: "cherrykidspreprimaryschool@gmail.com" },
              { icon: Clock, t: "Hours", d: "Mon – Fri  ·  7:30am – 6:00pm" },
            ].map((c) => (
              <div key={c.t} className="flex gap-4 rounded-3xl border border-border bg-card p-6">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><c.icon className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <div className="font-display text-lg font-bold text-secondary">{c.t}</div>
                  <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{c.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-8 md:p-10 flex flex-col justify-center">
            {sent ? (
              <div className="flex flex-col items-center text-center space-y-4 py-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-secondary">Thank you for reaching out!</h2>
                <p className="text-muted-foreground max-w-md">
                  We have received your details safely and our admissions team will contact you shortly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 text-sm text-primary underline underline-offset-4 hover:text-primary/80 cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="access_key" value={import.meta.env.VITE_WEB3FORMS_KEY} />
                
                <h2 className="text-2xl md:text-3xl">Send us a message</h2>
                <p className="mt-2 text-sm text-muted-foreground">We usually reply within one school day.</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <input required name="Name" placeholder="Your name" minLength={2} className="rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
                  <input required name="Email" type="email" placeholder="Email address" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
                  <input required name="Phone" type="tel" pattern="[0-9]{10,12}" title="Valid phone number (10-12 digits)" placeholder="Phone number" className="rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
                  
                  <div className="relative w-full">
                    <select required name="Program" className="w-full rounded-2xl border border-border bg-background pl-4 pr-12 py-3 outline-none focus:border-primary cursor-pointer appearance-none">
                      <option value="">Select interested program</option>
                      <option value="Pre-Nursery (2–3)">Pre-Nursery (2–3)</option>
                      <option value="Nursery (3–4)">Nursery (3–4)</option>
                      <option value="Junior K.G (4–5)">Junior K.G (4–5)</option>
                      <option value="Senior K.G (5–6)">Senior K.G (5–6)</option>
                      <option value="Private Tutoring">Private Tutoring</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                <textarea required name="Message" rows={5} minLength={10} placeholder="Tell us a bit about your child…" className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />

                {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

                <button type="submit" disabled={loading} className="btn-primary mt-6 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">
                  {loading ? <>Sending... <Loader2 className="h-4 w-4 animate-spin" /></> : <>Send Message <Send className="h-4 w-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="container-x pb-10">
        <div className="overflow-hidden rounded-[2rem] border border-border h-[360px]">
          <iframe title="Cherry Kids location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.2153164824617!2d72.93158017466043!3d18.877526758174415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7db481f274e77%3A0x9d0ca66624c8503a!2sCHERRY%20KIDS%20Pre-school!5e0!3m2!1sen!2sin!4v1782584584912!5m2!1sen!2sin" className="w-full h-full" loading="lazy" />
        </div>
      </section>
    </>
  );
}