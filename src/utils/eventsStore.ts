
// export interface EventItem {
//   date: string;
//   title: string;
//   time: string;
//   place: string;
//   color: string;
//   audience?: string;
//   showGalleryButton?: boolean;
//   galleryCollectionId?: string;
// }

// const DEFAULT_EVENTS: EventItem[] = [];

// export const getEvents = (): EventItem[] => {
//   if (typeof window === "undefined") return DEFAULT_EVENTS;
//   const stored = localStorage.getItem("sunbeam_events");
//   return stored ? JSON.parse(stored) : DEFAULT_EVENTS;
// };

// export const saveEvents = (events: EventItem[]) => {
//   localStorage.setItem("sunbeam_events", JSON.stringify(events));
// };



import { db } from "./firebase"; // Adjust this import path to match where your firebase app/db is initialized
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

export interface EventItem {
  id?: string; // Unique ID for Firebase documents
  date: string;
  title: string;
  time: string;
  place: string;
  color: string;
  audience?: string;
  showGalleryButton?: boolean;
  galleryCollectionId?: string;
}

// Fetch all events from Firebase Firestore
export const getEvents = async (): Promise<EventItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    const events: EventItem[] = [];
    querySnapshot.forEach((document) => {
      events.push({ id: document.id, ...(document.data() as Omit<EventItem, "id">) });
    });
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// Save, update, AND delete events in Firebase Firestore
export const saveEvents = async (events: EventItem[]) => {
  try {
    // 1. Fetch all current events from the Firebase database
    const querySnapshot = await getDocs(collection(db, "events"));
    
    // 2. Get a list of IDs that are still active in your admin panel
    const activeIds = events.map((event) => event.id).filter(Boolean); 

    // 3. Loop through Firebase documents and DELETE the ones that were removed
    for (const document of querySnapshot.docs) {
      if (!activeIds.includes(document.id)) {
        await deleteDoc(doc(db, "events", document.id));
      }
    }

    // 4. Save or update the remaining events
    for (const event of events) {
      // If it's a new event, generate a new ID. Otherwise, use the existing one.
      const eventId = event.id || doc(collection(db, "events")).id;
      
      await setDoc(doc(db, "events", eventId), {
        date: event.date,
        title: event.title,
        time: event.time,
        place: event.place,
        color: event.color,
        audience: event.audience || "Open to families",
        showGalleryButton: event.showGalleryButton || false,
        galleryCollectionId: event.galleryCollectionId || "",
      });
      
      // Attach the ID back to the local item so React tracks it properly
      event.id = eventId; 
    }
  } catch (error) {
    console.error("Error saving events:", error);
  }
};