import { useState, useEffect } from "react";
import { Trash2, Edit3, PlusCircle, ChevronDown } from "lucide-react";
import { EventItem } from "@/utils/eventsStore";
import { getGalleryCollections, fetchGalleryCollections, GalleryCollection } from "@/utils/galleryStore";

const colorMap: Record<string, string> = {
    blue: "bg-blue-600 text-white",
    purple: "bg-purple-600 text-white",
    yellow: "bg-amber-400 text-amber-950",
    green: "bg-emerald-500 text-white",
    orange: "bg-orange-500 text-white",
};

interface CalendarManagerProps {
    events: EventItem[];
    onSaveEvents: (updated: EventItem[]) => void;
}

const initialFormState: EventItem = {
    date: "",
    title: "",
    time: "",
    place: "",
    audience: "Open to families",
    color: "blue",
};

export function CalendarManager({ events, onSaveEvents }: CalendarManagerProps) {
    const [formData, setFormData] = useState<EventItem>(initialFormState);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [collections, setCollections] = useState<GalleryCollection[]>([]);

    useEffect(() => {
        const loadCollections = async () => {
            const data = await fetchGalleryCollections();
            setCollections(data);
        };
        loadCollections();
    }, []);

    const startEdit = (index: number) => {
        setFormData({ ...initialFormState, ...events[index] });
        setEditingIndex(index);
    };

    const handleDelete = (index: number) => {
        if (window.confirm("Are you sure you want to permanently delete this event?")) {
            const updatedEvents = events.filter((_, i) => i !== index);
            onSaveEvents(updatedEvents);
            if (editingIndex === index) {
                setFormData(initialFormState);
                setEditingIndex(null);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let updatedEvents = [...events];
        if (editingIndex !== null) {
            updatedEvents[editingIndex] = formData;
        } else {
            updatedEvents = [formData, ...updatedEvents];
        }
        onSaveEvents(updatedEvents);
        setFormData(initialFormState);
        setEditingIndex(null);
    };

    return (
        <div className="grid gap-8 lg:grid-cols-5 items-start animate-in fade-in duration-200">
            {/* Event Customization Form Panel */}
            <section className="lg:col-span-2 bg-card border border-border/60 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xl font-bold tracking-tight mb-4 text-secondary font-display">
                    {editingIndex !== null ? "Modify Event Entry" : "Create Event Entry"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Date Stamp</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Jul 18 or Every Monday"
                            className="w-full mt-1 border border-border/80 rounded-xl px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Title</label>
                        <input
                            type="text"
                            required
                            placeholder="Event Name"
                            className="w-full mt-1 border border-border/80 rounded-xl px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Time Schedule</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., 9:00 AM"
                                className="w-full mt-1 border border-border/80 rounded-xl px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Location Venue</label>
                            <input
                                type="text"
                                required
                                placeholder="Room / Field"
                                className="w-full mt-1 border border-border/80 rounded-xl px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                value={formData.place}
                                onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Target Audience</label>
                        <input
                            type="text"
                            placeholder="e.g., Open to families"
                            className="w-full mt-1 border border-border/80 rounded-xl px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                            value={formData.audience || ""}
                            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                        />
                    </div>

                    <div className="relative w-full">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Theme Color Code</label>
                        <select
                            className="w-full rounded-2xl border border-border bg-background pl-4 pr-12 py-3 outline-none focus:border-primary cursor-pointer appearance-none"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        >
                            <option value="blue">Blue Tone</option>
                            <option value="purple">Purple Tone</option>
                            <option value="yellow">Amber Yellow</option>
                            <option value="green">Emerald Green</option>
                            <option value="orange">Orange Accent</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 top-6 right-4 flex items-center text-muted-foreground">
                            <ChevronDown className="h-4 w-4" />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.showGalleryButton || false}
                                onChange={(e) => setFormData({ ...formData, showGalleryButton: e.target.checked })}
                            />
                            <span>Show "View Gallery" button</span>
                        </label>
                    </div>

                    {formData.showGalleryButton && (
                        <div>
                            <label>Link to Gallery Collection</label>
                            <select
                                value={formData.galleryCollectionId || ""}
                                onChange={(e) => setFormData({ ...formData, galleryCollectionId: e.target.value })}
                                className="w-full mt-1 appearance-none border border-border/80 rounded-xl px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition cursor-pointer"
                            >
                                <option value="">-- Select a Collection --</option>
                                {collections.map((col) => (
                                    <option key={col.id} value={col.id}>
                                        {col.name}
                                    </option>
                                ))}
                            </select>
                            {/* Custom Dropdown Icon */}
                            <div className="pointer-events-none absolute inset-y-0 right-4 top-7 flex items-center text-muted-foreground">
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </div>
                    )}


                    <button
                        type="submit"
                        className="w-full btn-primary bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl text-sm mt-2 active:scale-98 transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                        <PlusCircle className="h-4 w-4" />
                        {editingIndex !== null ? "Save Update Modifications" : "Publish Live Event"}
                    </button>

                    {editingIndex !== null && (
                        <button
                            type="button"
                            onClick={() => { setEditingIndex(null); setFormData(initialFormState); }}
                            className="w-full border border-border bg-background text-muted-foreground py-2 rounded-xl text-sm font-medium hover:bg-muted transition"
                        >
                            Cancel Edit Mode
                        </button>
                    )}
                </form>
            </section>

            {/* Interactive Active Database List View Dashboard */}
            <section className="lg:col-span-3 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80 mb-1 ml-1">
                    Currently Posted Events ({events.length})
                </h3>
                {events.length === 0 ? (
                    <div className="p-8 border border-dashed rounded-3xl text-center text-muted-foreground text-sm bg-muted/10">
                        No dynamic calendar schedule listings found in storage.
                    </div>
                ) : (
                    events.map((e, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-5 border border-border/70 rounded-2xl bg-card shadow-sm hover:shadow transition"
                        >
                            <div className="flex items-start gap-5 min-w-0">
                                {/* 📂 Increased font size for Date badge layout */}
                                <div className={`h-12 w-18 rounded-xl shrink-0 flex flex-row items-center justify-center text-center font-bold text-sm p-1.5 shadow-sm ${colorMap[e.color || "blue"] || colorMap.blue}`}>
                                    <span className="leading-tight font-display tracking-tight break-words max-w-full block">
                                        {e.date}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    {/* 📂 Increased text size from text-sm to text-base for title */}
                                    <h4 className="font-bold text-lg text-foreground truncate max-w-[200px] md:max-w-[320px] font-display">
                                        {e.title}
                                    </h4>
                                    {/* 📂 Increased text size from text-xs to text-sm for schedule parameters */}
                                    <p className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-x-2 gap-y-2 items-center">
                                        <span>🕒 {e.time}</span>

                                        {/* Optional: You can hide the bullets on smaller screens if they look awkward when wrapped by adding max-sm:hidden */}
                                        <span className="text-muted-foreground/40 max-sm:hidden">•</span>

                                        <span>📍 {e.place}</span>

                                        {e.audience && (
                                            <>
                                                <span className="text-muted-foreground/40 max-sm:hidden">•</span>
                                                <span className="bg-muted text-muted-foreground font-medium text-[14px] px-2 py-0.5 rounded-md">
                                                    👥 {e.audience}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* 💡 FIXED: Changed from hidden hover opacity classes to standard flex display so it's ALWAYS visible */}
                            <div className="flex items-center gap-2 shrink-0 ml-4">
                                <button
                                    onClick={() => startEdit(index)}
                                    className="p-2 border bg-background text-muted-foreground hover:text-secondary hover:bg-muted rounded-xl shadow-sm transition"
                                    title="Edit parameters"
                                >
                                    <Edit3 className="h-4.5 w-4.5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="p-2 border bg-background text-destructive hover:bg-destructive/10 rounded-xl shadow-sm transition"
                                    title="Remove document record"
                                >
                                    <Trash2 className="h-4.5 w-4.5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}

