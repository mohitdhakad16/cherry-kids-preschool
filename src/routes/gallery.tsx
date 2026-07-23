import { useState, useEffect, useRef } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/utils/firebase"; 
import { PageHero } from "@/components/PageHero";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ChevronDown } from "lucide-react";

// 1. Add the InlineCherryLoader component
export function InlineCherryLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        const increment = prev < 50 ? 5 : prev < 80 ? 3 : 2;
        return Math.min(prev + increment, 100);
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full py-20 col-span-full">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="cherry-fill-mask-inline">
              <rect x="0" y={100 - progress} width="100" height={progress} className="transition-all duration-75" />
            </clipPath>
          </defs>
          <g fill="none" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M50,15 Q60,25 65,45" />
            <path d="M50,15 Q35,25 25,48" />
            <path d="M55,18 Q70,12 75,22 Q63,25 55,18 Z" />
            <circle cx="28" cy="65" r="18" />
            <circle cx="68" cy="62" r="18" />
          </g>
          <g clipPath="url(#cherry-fill-mask-inline)">
            <path d="M50,15 Q60,25 65,45" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M50,15 Q35,25 25,48" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M55,18 Q70,12 75,22 Q63,25 55,18 Z" fill="#4ade80" stroke="#22c55e" strokeWidth="1.5" />
            <circle cx="28" cy="65" r="18" fill="#ff4d6d" />
            <circle cx="68" cy="62" r="18" fill="#ff4d6d" />
            <circle cx="22" cy="57" r="4" fill="#ffffff" opacity="0.6" />
            <circle cx="62" cy="54" r="4" fill="#ffffff" opacity="0.6" />
          </g>
        </svg>
      </div>
      <div className="mt-4 text-center">
        <h3 className="font-display font-semibold text-lg text-primary tracking-wide animate-pulse">
          Loading Photos...
        </h3>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/gallery")({
 validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
  component: Gallery,
});

function Gallery() {
  const search = useSearch({ from: "/gallery" });
  const [photos, setPhotos] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState(search.category || "All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 2. Add loading state for the images
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

useEffect(() => {
    // Fetch Dynamic Event Categories
    const qCols = query(collection(db, "galleryCollections"), orderBy("createdAt", "desc"));
    const unsubCols = onSnapshot(qCols, (snap) => {
      setCollections(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Fetch Photos
    const qPhotos = query(collection(db, "galleryImages"), orderBy("createdAt", "desc"));
    const unsubPhotos = onSnapshot(qPhotos, (snap) => {
      setPhotos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      // 3. Set loading to false once photos are fetched
      setIsLoadingImages(false);
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => { unsubCols(); unsubPhotos(); document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  // Filter logic: "All" shows everything, otherwise filter by collectionId
  const filteredPhotos = activeCategoryId === "All" 
    ? photos 
    : photos.filter(p => p.collectionId === activeCategoryId);

  // Lightbox Controls
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsZoomed(false);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsZoomed(false);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredPhotos.length);
      setIsZoomed(false);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
      setIsZoomed(false);
    }
  };

  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return (
    <>
      <PageHero 
        eyebrow="Gallery" 
        title="Moments from Cherry Kids" 
        subtitle="A peek inside the bright, joyful world we build for our kids every day." 
      />
      
      <section className="section-pad">
     {/* Filter Section */}
        <div className="flex justify-center mb-10">
          
          {/* Mobile: Custom Dropdown */}
          <div className="md:hidden relative w-full max-w-[280px]" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-6 py-3 rounded-full bg-secondary/10 hover:bg-secondary/20 font-bold transition border border-secondary/10"
            >
              <span className="truncate">
                {activeCategoryId === "All" ? "All Moments" : collections.find(c => c.id === activeCategoryId)?.name}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white border border-border shadow-xl rounded-2xl overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-200">
                <button
                  className="block w-full text-left px-6 py-3 hover:bg-muted font-medium transition"
                  onClick={() => { setActiveCategoryId("All"); setIsDropdownOpen(false); setLightboxIndex(null); }}
                >
                  All Moments
                </button>
                {collections.map((cat) => (
                  <button
                    key={cat.id}
                    className="block w-full text-left px-6 py-3 hover:bg-muted font-medium transition"
                    onClick={() => { setActiveCategoryId(cat.id); setIsDropdownOpen(false); setLightboxIndex(null); }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop: Original Tabs */}
          <div className="hidden md:flex flex-wrap justify-center gap-2">
            <button
              onClick={() => { setActiveCategoryId("All"); setLightboxIndex(null); }}
              className={`px-6 py-2 rounded-full font-bold transition ${
                activeCategoryId === "All" ? "bg-primary text-white" : "bg-secondary/10 hover:bg-secondary/20"
              }`}
            >
              All
            </button>
            {collections.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategoryId(cat.id); setLightboxIndex(null); }}
                className={`px-6 py-2 rounded-full font-bold transition whitespace-nowrap ${
                  activeCategoryId === cat.id ? "bg-primary text-white" : "bg-secondary/10 hover:bg-secondary/20"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="container-x">
          {/* 4. Implement conditional rendering for loading, empty, and data states */}
          {isLoadingImages ? (
            <InlineCherryLoader />
          ) : filteredPhotos.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No photos available in this event yet.
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filteredPhotos.map((p, index) => (
                <figure 
                  key={p.id} 
                  className="break-inside-avoid group relative overflow-hidden rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                  onClick={() => openLightbox(index)}
                >
                  <img 
                    src={p.imageUrl} 
                    alt={p.alt} 
                    loading="lazy" 
                    className="w-full h-auto block transition duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-4 font-display font-bold text-white opacity-0 group-hover:opacity-100 transition">
                    {p.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200 p-4"
          onClick={closeLightbox}
        >
          {/* Top Bar Controls */}
          <div className="absolute top-6 right-6 flex gap-4 z-50">
            <button 
              onClick={toggleZoom}
              className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition shadow-lg"
              title={isZoomed ? "Zoom Out" : "Zoom In"}
            >
              {isZoomed ? <ZoomOut className="w-6 h-6" /> : <ZoomIn className="w-6 h-6" />}
            </button>
            <button 
              onClick={closeLightbox}
              className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition shadow-lg"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Previous Button */}
          <button 
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition z-50 shadow-lg"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Main Image Container */}
          <div 
            className={`relative flex items-center justify-center transition-all duration-300 ${
              isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={toggleZoom}
          >
            <img 
              src={filteredPhotos[lightboxIndex].imageUrl} 
              alt={filteredPhotos[lightboxIndex].alt}
              className={`object-contain rounded-xl shadow-2xl transition-all duration-300 ${
                isZoomed ? "max-w-[95vw] max-h-[95vh] scale-105" : "max-w-[80vw] max-h-[80vh] scale-100"
              }`}
            />
          </div>

          {/* Next Button */}
          <button 
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition z-50 shadow-lg"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  );
} 