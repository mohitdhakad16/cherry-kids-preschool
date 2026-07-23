// useGalleryLogic.ts
import { useState, useEffect, useMemo } from "react";
import { db } from "@/utils/firebase";
import {
    collection, addDoc, updateDoc, deleteDoc, doc, getDocs,
    query, where, serverTimestamp, writeBatch, increment
} from "firebase/firestore";
import { GalleryCollection, GalleryImage, ToastMessage } from "./types";

// Helper function at the top of the file which you can use to convert base64 images to webp
const convertToWebP = (base64: string, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/webp", quality));
    };
  });
};

export function useGalleryLogic() {
    // ---- Global State ----
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // ---- Collection State ----
    const [collections, setCollections] = useState<GalleryCollection[]>([]);
    const [isLoadingCollections, setIsLoadingCollections] = useState(true);
    const [activeCollection, setActiveCollection] = useState<GalleryCollection | null>(null);

    // ---- Image State ----
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isLoadingImages, setIsLoadingImages] = useState(false);

    // ---- Modals & Forms State ----
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState<GalleryCollection | null>(null);
    const [collectionNameInput, setCollectionNameInput] = useState("");
    const [isSavingCollection, setIsSavingCollection] = useState(false);

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    // Initialize as empty array to await multiple uploads
    const [newImages, setNewImages] = useState<{url: string, alt: string, label: string}[]>([]);
    const [isSavingImages, setIsSavingImages] = useState(false);

    // ---- Search, Sort & Pagination State ----
    const [searchQuery, setSearchQuery] = useState("");
    const [sortMode, setSortMode] = useState<"newest" | "oldest" | "az" | "za">("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 20;

    // ==================================================
    // UTILS & TOASTS
    // ==================================================
    const showToast = (message: string, type: "success" | "error" = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    // ==================================================
    // FIRESTORE: COLLECTIONS
    // ==================================================
    const fetchCollections = async () => {
        setIsLoadingCollections(true);
        try {
            const q = query(collection(db, "galleryCollections"));
            const snap = await getDocs(q);
            const cols = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GalleryCollection[];

            cols.sort((a, b) => {
                const timeA = a.createdAt?.seconds || 0;
                const timeB = b.createdAt?.seconds || 0;
                return timeB - timeA;
            });

            setCollections(cols);
        } catch (error) {
            showToast("Failed to load collections.", "error");
        } finally {
            setIsLoadingCollections(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleSaveCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = collectionNameInput.trim();

        if (!trimmedName) {
            showToast("Please enter collection name.", "error");
            return;
        }

        const isDuplicate = collections.some(
            (c) => c.name.toLowerCase() === trimmedName.toLowerCase() && c.id !== editingCollection?.id
        );

        if (isDuplicate) {
            showToast("Collection name already exists.", "error");
            return;
        }

        setIsSavingCollection(true);
        try {
            if (editingCollection) {
                const docRef = doc(db, "galleryCollections", editingCollection.id);
                await updateDoc(docRef, { name: trimmedName });
                showToast("Collection Updated", "success");

                if (activeCollection?.id === editingCollection.id) {
                    setActiveCollection({ ...activeCollection, name: trimmedName });
                }
            } else {
                await addDoc(collection(db, "galleryCollections"), {
                    name: trimmedName,
                    imageCount: 0,
                    createdAt: serverTimestamp(),
                });
                showToast("Collection Created", "success");
            }

            setCollectionNameInput("");
            setEditingCollection(null);
            setIsCollectionModalOpen(false);
            await fetchCollections();
        } catch (error) {
            showToast("Failed to save collection.", "error");
        } finally {
            setIsSavingCollection(false);
        }
    };

    const handleDeleteCollection = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this collection and all its images?")) return;

        try {
            const batch = writeBatch(db);

            const q = query(collection(db, "galleryImages"), where("collectionId", "==", id));
            const snap = await getDocs(q);
            snap.docs.forEach(d => batch.delete(d.ref));

            batch.delete(doc(db, "galleryCollections", id));

            await batch.commit();
            showToast("Collection Deleted", "success");

            if (activeCollection?.id === id) {
                setActiveCollection(null);
            }
            await fetchCollections();
        } catch (error) {
            showToast("Failed to delete collection.", "error");
        }
    };

    // ==================================================
    // FIRESTORE: IMAGES
    // ==================================================
    const fetchImages = async (collectionId: string) => {
        setIsLoadingImages(true);
        try {
            const q = query(collection(db, "galleryImages"), where("collectionId", "==", collectionId));
            const snap = await getDocs(q);
            const imgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as GalleryImage[];
            setImages(imgs);
            setCurrentPage(1);
        } catch (error) {
            showToast("Failed to load images.", "error");
        } finally {
            setIsLoadingImages(false);
        }
    };

    const openCollection = (col: GalleryCollection) => {
        setActiveCollection(col);
        setSearchQuery("");
        setSortMode("newest");
        fetchImages(col.id);
    };

    const handleUpdateImageRow = (index: number, field: string, value: string) => {
        setNewImages((prevImages) => {
            const updated = [...prevImages];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // --- Block 1: Editing a single existing image ---
    if (editingImage) {
        const file = files[0];
        if (file.size > 800 * 1024) {
            showToast("Image too large! Must be under 800KB.", "error");
            e.target.value = "";
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            const webpBase64 = await convertToWebP(reader.result as string);
            handleUpdateImageRow(0, "url", webpBase64);
        };
        reader.readAsDataURL(file);
        e.target.value = "";
        return;
    }

    // --- Block 2: Multi-upload loop ---
    const newEntries: { url: string; alt: string; label: string }[] = [];
    let oversizedCount = 0;

    for (const file of files) {
        if (file.size > 800 * 1024) {
            oversizedCount++;
            continue;
        }

        const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        });

        // Convert to WebP here
        const webpBase64 = await convertToWebP(base64);

        const defaultName = file.name.split('.').slice(0, -1).join(' ');
        newEntries.push({ url: webpBase64, alt: defaultName, label: defaultName });
    }

    if (oversizedCount > 0) {
        showToast(`${oversizedCount} image(s) skipped (exceeded 800KB limit).`, "error");
    }

    if (newEntries.length > 0) {
        setNewImages((prev) => [...prev, ...newEntries]);
    }

    e.target.value = "";
};

    const handleRemoveImageRow = (index: number) => {
        const updated = newImages.filter((_, i) => i !== index);
        setNewImages(updated);
    };

    const handleSaveImages = async () => {
        if (!activeCollection) return;

        if (editingImage) {
            const { url, alt, label } = newImages[0];
            if (!url.trim() || !alt.trim()) {
                showToast("All fields are required.", "error");
                return;
            }

            setIsSavingImages(true);
            try {
                await updateDoc(doc(db, "galleryImages", editingImage.id), {
                    imageUrl: url.trim(),
                    alt: alt.trim(),
                    label: label.trim(),
                });
                showToast("Image Updated", "success");
                setIsImageModalOpen(false);
                await fetchImages(activeCollection.id);
            } catch (error) {
                showToast("Failed to update image.", "error");
            } finally {
                setIsSavingImages(false);
            }
            return;
        }

        const validImages = newImages.filter(img => img.url.trim() && img.alt.trim());

        if (validImages.length === 0) {
            showToast("Please ensure all items have images and ALT tags.", "error");
            return;
        }

        setIsSavingImages(true);
        try {
            const batch = writeBatch(db);

            validImages.forEach(img => {
                const imgRef = doc(collection(db, "galleryImages"));
                batch.set(imgRef, {
                    collectionId: activeCollection.id,
                    imageUrl: img.url.trim(),
                    alt: img.alt.trim(),
                    label: img.label.trim(),
                    createdAt: serverTimestamp()
                });
            });

            const colRef = doc(db, "galleryCollections", activeCollection.id);
            batch.update(colRef, { imageCount: increment(validImages.length) });

            await batch.commit();
            showToast("Images Added", "success");

            const updatedCollection = { ...activeCollection, imageCount: activeCollection.imageCount + validImages.length };
            setActiveCollection(updatedCollection);
            setCollections(collections.map(c => c.id === updatedCollection.id ? updatedCollection : c));

            setIsImageModalOpen(false);
            setNewImages([]);
            await fetchImages(activeCollection.id);
        } catch (error) {
            showToast("Failed to add images.", "error");
        } finally {
            setIsSavingImages(false);
        }
    };

    const handleDeleteImage = async (img: GalleryImage) => {
        if (!activeCollection) return;
        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            const batch = writeBatch(db);
            batch.delete(doc(db, "galleryImages", img.id));

            const colRef = doc(db, "galleryCollections", activeCollection.id);
            batch.update(colRef, { imageCount: increment(-1) });

            await batch.commit();

            showToast("Image Deleted", "success");

            setImages(images.filter(i => i.id !== img.id));
            const updatedCollection = { ...activeCollection, imageCount: Math.max(0, activeCollection.imageCount - 1) };
            setActiveCollection(updatedCollection);
            setCollections(collections.map(c => c.id === updatedCollection.id ? updatedCollection : c));
        } catch (error) {
            showToast("Failed to delete image.", "error");
        }
    };

    // ==================================================
    // DATA PROCESSING
    // ==================================================
    const processedImages = useMemo(() => {
        let filtered = images;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = images.filter(img =>
                img.label.toLowerCase().includes(q) ||
                img.alt.toLowerCase().includes(q)
            );
        }

        filtered.sort((a, b) => {
            if (sortMode === "az") return a.label.localeCompare(b.label);
            if (sortMode === "za") return b.label.localeCompare(a.label);

            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;

            if (sortMode === "newest") return timeB - timeA;
            if (sortMode === "oldest") return timeA - timeB;
            return 0;
        });

        return filtered;
    }, [images, searchQuery, sortMode]);

    const totalPages = Math.ceil(processedImages.length / ITEMS_PER_PAGE) || 1;
    const paginatedImages = processedImages.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return {
        toasts, collections, isLoadingCollections, activeCollection, setActiveCollection, images, isLoadingImages,
        isCollectionModalOpen, setIsCollectionModalOpen, editingCollection, setEditingCollection, collectionNameInput,
        setCollectionNameInput, isSavingCollection, isImageModalOpen, setIsImageModalOpen, editingImage, setEditingImage,
        newImages, setNewImages, isSavingImages, searchQuery, setSearchQuery, sortMode, setSortMode, currentPage,
        setCurrentPage, ITEMS_PER_PAGE, processedImages, totalPages, paginatedImages, handleSaveCollection,
        handleDeleteCollection, openCollection, handleUpdateImageRow, handleFileUpload,
        handleRemoveImageRow, handleSaveImages, handleDeleteImage
    };
}