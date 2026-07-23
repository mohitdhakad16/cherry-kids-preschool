import { db } from "@/utils/firebase"; // Make sure your db is exported here
import { collection, getDocs } from "firebase/firestore";

export const fetchGalleryCollections = async () => {

  const colRef = collection(db, "galleryCollections");
  const querySnapshot = await getDocs(colRef);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name
  }));
};

export interface GalleryCollection {
  id: string;
  name: string;
}

// Ensure this list is what your Gallery panel writes to!
export const getGalleryCollections = (): GalleryCollection[] => {
  const stored = localStorage.getItem("sunbeam_gallery_collections");
  return stored ? JSON.parse(stored) : [];
};