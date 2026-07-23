// AdminGalleryManager.tsx
import React from "react";
import {
    Folder, Image as ImageIcon, PlusCircle, Trash2, Edit3,
    ChevronDown, ChevronLeft, ChevronRight, Search, X,
    Loader2, ArrowLeft, Save
} from "lucide-react";
import { useGalleryLogic } from "./useGalleryLogic";

export function AdminGalleryManager() {
    const {
        toasts, collections, isLoadingCollections, activeCollection, setActiveCollection, images, isLoadingImages,
        isCollectionModalOpen, setIsCollectionModalOpen, editingCollection, setEditingCollection, collectionNameInput,
        setCollectionNameInput, isSavingCollection, isImageModalOpen, setIsImageModalOpen, editingImage, setEditingImage,
        newImages, setNewImages, isSavingImages, searchQuery, setSearchQuery, sortMode, setSortMode, currentPage,
        setCurrentPage, ITEMS_PER_PAGE, processedImages, totalPages, paginatedImages, handleSaveCollection,
        handleDeleteCollection, openCollection, handleUpdateImageRow, handleFileUpload,
        handleRemoveImageRow, handleSaveImages, handleDeleteImage
    } = useGalleryLogic();

    const renderToasts = () => (
        <>
            <style>{`
                @keyframes shrink-line {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-shrink {
                    animation: shrink-line 3s linear forwards;
                }
            `}</style>
            <div className="fixed bottom-8 right-6 z-[100] flex flex-col-reverse gap-3 pointer-events-none">
                {toasts.map((t, index) => (
                    <div
                        key={index}
                        className="relative bg-background border border-border/60 shadow-xl px-5 py-3.5 rounded-[5px] overflow-hidden pointer-events-auto min-w-[280px]"
                    >
                        <div className="text-sm font-medium text-foreground relative z-10">
                            {typeof t === 'string' ? t : t.message}
                        </div>
                        <div
                            className={`absolute bottom-0 left-0 h-[3px] animate-shrink ${t.type === 'error' ? 'bg-red-500' :
                                    t.type === 'success' ? 'bg-green-500' :
                                        'bg-primary'
                                }`}
                        />
                    </div>
                ))}
            </div>
        </>
    );

    if (!activeCollection) {
        return (
            <div className="w-full animate-in fade-in duration-200">
                {renderToasts()}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-secondary font-display">Gallery Collections</h2>
                        <p className="text-sm text-muted-foreground mt-1">Manage image categories and albums.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingCollection(null);
                            setCollectionNameInput("");
                            setIsCollectionModalOpen(true);
                        }}
                        className="cursor-pointer btn-primary bg-primary text-primary-foreground font-semibold py-2.5 px-5 rounded-xl text-sm active:scale-98 transition flex items-center gap-2 shadow-sm"
                    >
                        <PlusCircle className="h-4.5 w-4.5" />
                        Add Collection
                    </button>
                </div>

                {isLoadingCollections ? (
                    <div className="flex justify-center items-center py-20 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : collections.length === 0 ? (
                    <div className="p-12 border border-dashed rounded-3xl text-center text-muted-foreground text-sm bg-muted/10">
                        No gallery collections found. Create one to get started.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {collections.map((col) => (
                            <div
                                key={col.id}
                                onClick={() => openCollection(col)}
                                className="group flex items-center justify-between p-4 border border-border rounded-2xl bg-card hover:bg-muted/30 transition cursor-pointer"
                            >
                                {/* Left */}
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                        <Folder className="h-6 w-6" />
                                    </div>

                                    <div className="min-w-0">
                                        <h4 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                            {col.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {col.imageCount} {col.imageCount === 1 ? "Image" : "Images"}
                                        </p>
                                    </div>
                                </div>

                                {/* Right */}
                                <div
                                    className="flex items-center gap-2"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => {
                                            setEditingCollection(col);
                                            setCollectionNameInput(col.name);
                                            setIsCollectionModalOpen(true);
                                        }}
                                        className="p-2 rounded-lg hover:bg-muted"
                                        title="Rename Collection"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </button>

                                    <button
                                        onClick={() => handleDeleteCollection(col.id)}
                                        className="p-2 rounded-lg text-destructive hover:bg-destructive/10"
                                        title="Delete Collection"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isCollectionModalOpen && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-xl w-full max-w-md animate-in zoom-in-95 duration-200">
                            <h3 className="text-xl font-bold tracking-tight mb-4 text-secondary font-display">
                                {editingCollection ? "Rename Collection" : "Create Collection"}
                            </h3>
                            <form onSubmit={handleSaveCollection} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Collection Name</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="e.g., Summer Event 2024"
                                        className="w-full mt-1 border border-border/80 rounded-xl px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                        value={collectionNameInput}
                                        onChange={(e) => setCollectionNameInput(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCollectionModalOpen(false)}
                                        className="flex-1 border border-border bg-background text-muted-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingCollection}
                                        className="flex-1 btn-primary bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl text-sm active:scale-98 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                                    >
                                        {isSavingCollection ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {isSavingCollection ? "Saving..." : "Save Collection"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full animate-in slide-in-from-right-4 duration-300">
            {renderToasts()}

            <div className="mb-8">
                <button
                    onClick={() => setActiveCollection(null)}
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Collections
                </button>
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-secondary font-display flex items-center gap-3">
                            <Folder className="h-6 w-6 text-primary" />
                            {activeCollection.name}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {images.length} {images.length === 1 ? 'Image' : 'Images'} total in this collection.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search images..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="pl-9 pr-4 py-2 border border-border/80 rounded-xl text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition w-full sm:w-64"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={sortMode}
                                onChange={(e) => setSortMode(e.target.value as any)}
                                className="pl-4 pr-10 py-2 border border-border/80 rounded-xl text-sm bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="az">A-Z by Label</option>
                                <option value="za">Z-A by Label</option>
                            </select>
                            <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        </div>

                        <button
                            onClick={() => {
                                setEditingImage(null);
                                setNewImages([]); // Start with empty array for multiple uploads
                                setIsImageModalOpen(true);
                            }}
                            className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-xl text-sm active:scale-98 transition flex items-center gap-2 shadow-sm shrink-0"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Add Images
                        </button>
                    </div>
                </div>
            </div>

            {isLoadingImages ? (
                <div className="flex justify-center items-center py-32 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : images.length === 0 ? (
                <div className="p-16 border border-dashed rounded-3xl text-center text-muted-foreground text-sm bg-muted/10 flex flex-col items-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/40 mb-4" />
                    <p>No images in this collection yet.</p>
                </div>
            ) : paginatedImages.length === 0 ? (
                <div className="p-16 border border-dashed rounded-3xl text-center text-muted-foreground text-sm bg-muted/10">
                    No images match your search.
                </div>
            ) : (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {paginatedImages.map(img => (
                            <div key={img.id} className="group relative bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col">
                                <div className="relative w-full pt-[100%] bg-muted overflow-hidden shrink-0">
                                    <img
                                        src={img.imageUrl}
                                        alt={img.alt}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400/eee/999?text=Image+Error" }}
                                    />
                                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button
                                            onClick={() => {
                                                setEditingImage(img);
                                                setNewImages([{ url: img.imageUrl, alt: img.alt, label: img.label }]);
                                                setIsImageModalOpen(true);
                                            }}
                                            className="p-2 bg-background/90 backdrop-blur-sm text-foreground hover:text-primary rounded-xl shadow-sm transition"
                                            title="Edit Image Data"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteImage(img)}
                                            className="p-2 bg-background/90 backdrop-blur-sm text-destructive hover:bg-destructive hover:text-white rounded-xl shadow-sm transition"
                                            title="Delete Image"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h4 className="font-bold text-sm text-foreground truncate font-display">{img.label}</h4>
                                    <p className="text-xs text-muted-foreground mt-1 truncate" title={img.alt}>Alt: {img.alt}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
                            <p className="text-sm text-muted-foreground">
                                Showing <span className="font-medium text-foreground">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * ITEMS_PER_PAGE, processedImages.length)}</span> of <span className="font-medium text-foreground">{processedImages.length}</span> images
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-border bg-background rounded-xl disabled:opacity-50 hover:bg-muted transition"
                                >
                                    <ChevronLeft className="h-4.5 w-4.5" />
                                </button>
                                <div className="text-sm font-medium px-4">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-border bg-background rounded-xl disabled:opacity-50 hover:bg-muted transition"
                                >
                                    <ChevronRight className="h-4.5 w-4.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Add / Edit Image Modal */}
            {isImageModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold tracking-tight text-secondary font-display">
                                {editingImage ? "Edit Image Details" : "Add Images"}
                            </h3>
                            <button onClick={() => setIsImageModalOpen(false)} className="text-muted-foreground hover:bg-muted p-1 rounded-lg transition">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Global Upload Input Box */}
                        <div className="mb-6 p-5 border border-dashed border-border/80 rounded-2xl bg-muted/30">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">
                                {editingImage ? "Replace Image (Max 800KB)" : "Upload Images (Max 800KB each) *"}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple={!editingImage}
                                onChange={handleFileUpload}
                                className="w-full mt-2 border border-border/80 rounded-xl px-3 py-2.5 text-sm bg-background file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition cursor-pointer"
                            />
                        </div>

                        {/* List View of Selected Images */}
                        <div className="space-y-4">
                            {newImages.length === 0 && !editingImage && (
                                <div className="text-center p-8 text-muted-foreground text-sm">
                                    No images selected. Use the upload input above to select files.
                                </div>
                            )}

                            {newImages.map((img, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-5 items-start md:items-center p-4 border border-border/70 rounded-2xl bg-background shadow-sm relative group">

                                    {!editingImage && (
                                        <button
                                            onClick={() => handleRemoveImageRow(index)}
                                            className="absolute -top-2 -right-2 p-1.5 bg-destructive text-white rounded-full shadow-md hover:bg-red-600 transition z-10"
                                            title="Remove Image"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}

                                    {/* 1. Image Thumbnail */}
                                    <div className="shrink-0 w-16 h-16 bg-muted rounded-lg overflow-hidden border border-border/60 flex items-center justify-center">
                                        {img.url ? (
                                            <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                                        )}
                                    </div>

                                    {/* 2 & 3. Label & Alt Tags */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <div className="w-full">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Label / Title</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Main Stage Crowd"
                                                className="w-full mt-1 border border-border/80 rounded-xl px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                                value={img.label || ""}
                                                onChange={(e) => handleUpdateImageRow(index, "label", e.target.value)}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Alt Tag (SEO) *</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., A large crowd cheering"
                                                className="w-full mt-1 border border-border/80 rounded-xl px-3 py-2.5 text-sm bg-background placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                                                value={img.alt || ""}
                                                onChange={(e) => handleUpdateImageRow(index, "alt", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 pt-6 mt-4 border-t border-border/40">
                            <button
                                type="button"
                                onClick={() => setIsImageModalOpen(false)}
                                className="flex-1 border border-border bg-background text-muted-foreground py-2.5 rounded-xl text-sm font-medium hover:bg-muted transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveImages}
                                disabled={isSavingImages || (newImages.length === 0 && !editingImage)}
                                className="flex-1 btn-primary bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl text-sm active:scale-98 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                            >
                                {isSavingImages ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {isSavingImages ? "Saving..." : "Save Images"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}