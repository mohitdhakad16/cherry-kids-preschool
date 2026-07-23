// types.ts
export interface GalleryCollection {
    id: string;
    name: string;
    imageCount: number;
    createdAt: any;
}

export interface GalleryImage {
    id: string;
    collectionId: string;
    imageUrl: string;
    label: string;
    alt: string;
    createdAt: any;
}

export interface ToastMessage {
    id: number;
    message: string;
    type: "success" | "error";
}