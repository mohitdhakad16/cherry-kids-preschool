import { Link } from "@tanstack/react-router";
import Logo from "../assets/cherry kids pre school logo.webp"
import { useState } from "react";
import {
  Menu,
  X,
  Sparkles,
  ChevronDown,
  House,
  CircleUserRound,
  GraduationCap,
  Image,
  Phone,
} from "lucide-react";

const navLinks = [
  { to: "/", label: "Home", icon: House },
  {
    label: "About",
    icon: CircleUserRound,
    children: [
      { to: "/about", label: "About Us" },
      // { to: "/faculty", label: "Faculty" },
      { to: "/events", label: "Events" },
    ],
  },
  {
    label: "Programs",
    icon: GraduationCap,
    children: [
      { to: "/classes", label: "Classes" },
      { to: "/curriculum", label: "Curriculum" },
      { to: "/activities", label: "Activities" },
      { to: "/private-tutoring", label: "Tutoring" },
    ],
  },
  { to: "/gallery", label: "Gallery", icon: Image },
  { to: "/contact", label: "Contact", icon: Phone },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur shadow-lg">
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold text-secondary">
          <img src={Logo} alt="Cherry Kids Pre School" className="h-16 w-auto object-contain" />
        </Link>

        <nav className="hidden xl:flex items-center gap-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            if ("children" in item) {
              return (
                <div key={item.label} className="group relative">
                  <button className="flex items-center gap-2 rounded-full px-3 py-2 text-base font-semibold text-secondary/80 hover:text-primary">
                    <Icon className="h-5 w-5 text-primary" />
                    {item.label}
                    <ChevronDown className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  <div className="invisible absolute left-0 top-full mt-2 w-60 rounded-2xl border border-border bg-background shadow-xl opacity-0 translate-y-3 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="p-2">
                      {item.children.map((child) => (
                        <Link key={child.to} to={child.to} className="block rounded-xl px-4 py-3 text-base font-medium text-secondary hover:bg-primary/10 hover:text-primary">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link key={item.to} to={item.to} activeOptions={{ exact: item.to === "/" }} activeProps={{ className: "text-primary" }} className="flex items-center gap-2 rounded-full px-3 py-2 text-base font-semibold text-secondary/80 hover:text-primary">
                <Icon className="h-4 w-4 text-primary" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden xl:block">
          <Link to="/contact" className="btn-primary">Enroll Now</Link>
        </div>

        <button onClick={() => setOpen(!open)} className="xl:hidden grid h-11 w-11 place-items-center rounded-full border border-border">
          {open ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
        </button>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-background">
          <div className="container-x flex flex-col gap-1 py-4">
            {navLinks.map((item)=>{
              const Icon=item.icon;
              if("children" in item){
                return <div key={item.label}>
                  <button onClick={()=>setMobileDropdown(mobileDropdown===item.label?null:item.label)} className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-semibold">
                    <div className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary"/>{item.label}</div>
                    <ChevronDown className={`h-4 w-4 ${mobileDropdown===item.label?"rotate-180":""}`}/>
                  </button>
                  {mobileDropdown===item.label && <div className="ml-4 flex flex-col gap-1">
                    {item.children.map(child=><Link key={child.to} to={child.to} onClick={()=>setOpen(false)} className="rounded-lg px-4 py-2 text-sm hover:bg-primary/10">{child.label}</Link>)}
                  </div>}
                </div>
              }
              return <Link key={item.to} to={item.to} onClick={()=>setOpen(false)} className="flex items-center gap-2 rounded-xl px-4 py-3 font-semibold"><Icon className="h-4 w-4 text-primary"/>{item.label}</Link>
            })}
            <Link to="/contact" onClick={()=>setOpen(false)} className="btn-primary mt-4 justify-center">Enroll Now</Link>
          </div>
        </div>
      )}
    </header>
  );
}

