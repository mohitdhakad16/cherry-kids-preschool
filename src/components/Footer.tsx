import { Link } from "@tanstack/react-router";
import FooterBg from "../assets/footer-bg.jpg";
import Logo from "../assets/cherry kids pre school logo.webp";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Send } from "lucide-react";
import winterPlay from "../assets/winter_day.webp";
import musicDay from "../assets/music_day.webp";
import artDay from "../assets/kids_color.webp"; 
import kidsPlay from "../assets/activity-craft.jpg";

export function Footer() {
  return (
    <footer className="mt-20 relative bg-[#051A36] text-white/80 lg:bg-[#e3f2fd] lg:text-slate-600 lg:bg-[position:35%_48%] lg:bg-no-repeat lg:bg-auto pt-16 pb-12 lg:pb-24">
      <div
        className="absolute inset-0 hidden lg:block bg-no-repeat bg-auto pointer-events-none"
        style={{ backgroundImage: `url(${FooterBg})`, backgroundPosition: "35% 48%" }}
      />

      {/* Main Footer Content */}
      <div className="relative z-10 container-x grid gap-12 pb-16 md:grid-cols-2 lg:grid-cols-3">

        {/* Column 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-2xl font-display font-bold text-white lg:text-[#003366]">
            <img src={Logo} alt="Cherry Kids Preschool Logo" className="h-22 w-auto object-cover" />
          </div>
          <p className="text-sm leading-relaxed max-w-xs text-white/80 lg:text-inherit">
            A bright, modern preschool where curiosity is celebrated and every child shines a little brighter every day.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="h-5 w-5 mt-0.5 text-white lg:text-[#003366] shrink-0" />
              <span className="text-white/80 lg:text-inherit">Shop no 3,4 & 6 Shivsagar CHS Nagoan Road, Uran 400-702</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-white lg:text-[#003366] shrink-0" />
              <span className="text-white/80 lg:text-inherit">+91 7715034191</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-white lg:text-[#003366] shrink-0" />
              <span className="text-white/80 lg:text-inherit">cherrykidspreprimaryschool@gmail.com</span>
            </li>
          </ul>
          <div className="pt-2 flex gap-2">
            {[
              { Icon: Facebook, url: "https://www.facebook.com/pallunakhawa/", label: "Facebook" },
              { Icon: Instagram, url: "https://www.instagram.com/cherrykidspreschool", label: "Instagram" },
              { Icon: Youtube, url: "https://www.youtube.com/@Cherrykidspreschooluran", label: "YouTube" }
            ].map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${social.label}`}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 lg:bg-[#003366] text-white lg:text-white hover:bg-primary transition-colors"
              >
                <social.Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-white lg:text-[#003366] font-display font-bold text-lg mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ["/about", "About Us"],
                ["/classes", "Our Classes"],
                ["/curriculum", "Curriculum"],
                ["/faculty", "Our Faculty"],
                ["/events", "Events"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-white/80 lg:text-inherit hover:text-primary lg:hover:text-primary transition-colors font-medium">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white lg:text-[#003366] font-display font-bold text-lg mb-4">Programs</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ["/activities", "Activities"],
                ["/private-tutoring", "Private Tutoring"],
                ["/gallery", "Gallery"],
                ["/contact", "Admissions"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-white/80 lg:text-inherit hover:text-primary lg:hover:text-primary transition-colors font-medium">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Column 3: Gallery Grid Preview */}
        <div className="space-y-4">
          <h4 className="text-white lg:text-[#003366] font-display font-bold text-lg">Our Gallery</h4>

          <Link
            to="/gallery"
            className="group block grid grid-cols-2 gap-2 max-w-[200px] cursor-pointer"
          >
            {[
              winterPlay,
              musicDay,
              artDay,
              kidsPlay
            ].map((src, idx) => (
              <div
                key={idx}
                className="overflow-hidden bg-slate-100 aspect-square border border-white/10 shadow-sm group-hover:border-primary/30 transition-all duration-300"
              >
                <img
                  src={src}
                  alt={`Gallery preview snippet ${idx + 1}`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </Link>
        </div>

      </div>

      {/* Separated Bottom Copyright Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#fffdf4] border-t border-slate-100 z-20">
        <div className="container-x text-center py-4 text-xs font-medium text-slate-800">
          <p className="text-base text-slate-800">
            © {new Date().getFullYear()} <b><a href="/" className="text-slate-900 hover:text-primary transition-colors">Cherry Kids Preschool</a></b>. All rights reserved. Designed & Developed by <a href="http://advibemarketingsolution.com/" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-primary transition-colors"><b>AdVibe Marketing Solutions</b></a>.
          </p>
        </div>
      </div>
    </footer>
  );
}