import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getEvents, saveEvents, EventItem } from "@/utils/eventsStore";
import { LogOut, Mail, Calendar, Image as ImageIcon } from "lucide-react";
import { CalendarManager } from "@/components/CalenderManager";
import { EmailManager } from "@/components/EmailManager";
import { AdminGalleryManager } from "@/components/Gallery/AdminGalleryManager";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

function AdminPanel() {
  const [authLoading, setAuthLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  
  // Persist tab state across refreshes
  const [activeTab, setActiveTab] = useState<"events" | "messages" | "gallery">(() => {
    return (localStorage.getItem("admin_active_tab") as "events" | "messages" | "gallery") || "events";
  });

  // Sync tab state to localStorage
  useEffect(() => {
    localStorage.setItem("admin_active_tab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const sessionActive = localStorage.getItem("sunbeam_session_active");
    if (sessionActive === "true") {
      setEvents(getEvents());
      setAuthLoading(false);
    } else {
      window.location.href = "/login";
    }
  }, []);

  const handleUpdateEvents = (updatedEvents: EventItem[]) => {
    saveEvents(updatedEvents);
    setEvents(updatedEvents);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("sunbeam_session_active");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user_role");
      localStorage.removeItem("admin_active_tab"); // Clear tab on logout
      window.location.href = "/login";
    }
  };

  if (authLoading) return <div className="p-10 text-center text-sm text-muted-foreground">Verifying security parameters...</div>;

  return (
    <div className="container-x py-12 max-w-7xl text-foreground">
      <div className="mb-6 pb-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-display">Preschool Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Control live notifications, email logs, and gallery media.</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="!cursor-pointer flex items-center gap-2 border px-4 py-2 bg-background hover:bg-destructive/10 rounded-xl text-sm font-medium self-start transition"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>

      {/* Nav Menu */}
      <div className="flex border-b mb-6 gap-2">
        <button 
          onClick={() => setActiveTab("events")} 
          className={`!cursor-pointer flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-medium transition ${activeTab === "events" ? "border-primary text-primary font-bold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <Calendar className="h-4 w-4" /> Calendar
        </button>
        <button 
          onClick={() => setActiveTab("messages")} 
          className={`!cursor-pointer flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-medium transition ${activeTab === "messages" ? "border-primary text-primary font-bold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <Mail className="h-4 w-4" /> Inquiries
        </button>
        <button 
          onClick={() => setActiveTab("gallery")} 
          className={`!cursor-pointer flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-medium transition ${activeTab === "gallery" ? "border-primary text-primary font-bold" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          <ImageIcon className="h-4 w-4" /> Gallery
        </button>
      </div>

      {/* Component Rendering */}
      {activeTab === "events" ? (
        <CalendarManager events={events} onSaveEvents={handleUpdateEvents} />
      ) : activeTab === "messages" ? (
        <EmailManager />
      ) : (
        <AdminGalleryManager />
      )}
    </div>
  );
}