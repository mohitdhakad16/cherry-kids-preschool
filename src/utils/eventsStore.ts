
export interface EventItem {
  date: string;
  title: string;
  time: string;
  place: string;
  color: string;
  audience?: string;
  showGalleryButton?: boolean;
  galleryCollectionId?: string;
}

const DEFAULT_EVENTS: EventItem[] = [];

export const getEvents = (): EventItem[] => {
  if (typeof window === "undefined") return DEFAULT_EVENTS;
  const stored = localStorage.getItem("sunbeam_events");
  return stored ? JSON.parse(stored) : DEFAULT_EVENTS;
};

export const saveEvents = (events: EventItem[]) => {
  localStorage.setItem("sunbeam_events", JSON.stringify(events));
};