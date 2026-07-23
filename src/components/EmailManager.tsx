import { useState, useEffect } from "react";
import { Trash2, Mail, CheckCircle2, Archive, Inbox, Star, ChevronLeft, ChevronRight, CornerUpLeft, Square, CheckSquare, ArrowLeft } from "lucide-react";
import { db } from "@/utils/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc, writeBatch } from "firebase/firestore";

interface InboxMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  interestedProgram: string;
  messageContent: string;
  createdAt: any;
  deletedAt?: any;
  isRead: boolean;
  folder?: "inbox" | "archive" | "bin";
}

// 🚀 Helper function to format Firebase timestamp into readable time
const formatMessageTime = (timestamp: any) => {
  if (!timestamp) return "";
  try {
    // Check if it's a Firestore Timestamp with a .toDate() method, or a standard string/number
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    return "";
  }
};

export function EmailManager() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [emailFolder, setEmailFolder] = useState<"inbox" | "unread" | "archive" | "bin">("inbox");
  const [selectedMessage, setSelectedMessage] = useState<InboxMessage | null>(null);
  
  // Bulk selection state (stores IDs of selected messages)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Select potential selectors for your WhatsApp floating button and Crisp/Zendesk/Tawk chat bubble
  useEffect(() => {
    const selectorsToHide = [
      ".whatsapp-floating-btn", 
      "[class*='whatsapp']", 
      "[id*='whatsapp']",
      ".crisp-client", 
      "#chat-widget-container", 
      "#hubspot-messages-iframe-container",
      "[id*='tawk']",
      "[class*='chat-widget']"
    ];

    const hiddenElements: HTMLElement[] = [];
    selectorsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.style.display !== "none") {
          htmlEl.style.setProperty("display", "none", "important");
          hiddenElements.push(htmlEl);
        }
      });
    });

    return () => {
      hiddenElements.forEach(el => {
        el.style.display = "";
      });
    };
  }, []);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const now = new Date().getTime();
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      const batch = writeBatch(db);
      let needsBatchDelete = false;

      const loadedMessages = snapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        const msgId = docSnapshot.id;

        if (data.folder === "bin" && data.deletedAt) {
          const deletionTime = data.deletedAt.toDate ? data.deletedAt.toDate().getTime() : new Date(data.deletedAt).getTime();
          if (now - deletionTime > thirtyDaysInMs) {
            batch.delete(doc(db, "messages", msgId));
            needsBatchDelete = true;
          }
        }

        return {
          id: msgId,
          senderName: data.senderName || "Unknown",
          senderEmail: data.senderEmail || "",
          senderPhone: data.senderPhone || "",
          interestedProgram: data.interestedProgram || "",
          messageContent: data.messageContent || "",
          createdAt: data.createdAt,
          isRead: data.isRead ?? false,
          folder: data.folder || "inbox",
        } as InboxMessage;
      });

      if (needsBatchDelete) {
        await batch.commit();
      }
      setMessages(loadedMessages);
    });
    return () => unsubscribe();
  }, []);

  const filteredMessages = messages.filter((msg) => {
    if (emailFolder === "unread") return !msg.isRead && msg.folder !== "bin" && msg.folder !== "archive";
    if (emailFolder === "archive") return msg.folder === "archive";
    if (emailFolder === "bin") return msg.folder === "bin";
    return msg.folder === "inbox" || !msg.folder;
  });

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setSelectedIds([]);
  }, [emailFolder, currentPage]);

  const handleSelectMessage = async (msg: InboxMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      await updateDoc(doc(db, "messages", msg.id), { isRead: true });
    }
  };

  const handleToggleRead = async (msg: InboxMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateDoc(doc(db, "messages", msg.id), { isRead: !msg.isRead });
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage(prev => prev ? { ...prev, isRead: !prev.isRead } : null);
    }
  };

  const handleMoveToInbox = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateDoc(doc(db, "messages", id), { folder: "inbox" });
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const handleMoveToArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateDoc(doc(db, "messages", id), { folder: "archive" });
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const handleMoveToBin = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await updateDoc(doc(db, "messages", id), { 
      folder: "bin",
      deletedAt: new Date().toISOString()
    });
    if (selectedMessage?.id === id) setSelectedMessage(null);
  };

  const handlePermanentDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Permanently wipe this message log record from database now?")) {
      await deleteDoc(doc(db, "messages", id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  };

  /* ================= BULK ACTIONS ================= */
  
  const handleToggleIndividualSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    const pageIds = paginatedMessages.map(m => m.id);
    const allAreSelected = pageIds.every(id => selectedIds.includes(id));

    if (allAreSelected) {
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedIds(prev => {
        const uniqueIds = new Set([...prev, ...pageIds]);
        return Array.from(uniqueIds);
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const isBinFolder = emailFolder === "bin";
    const confirmMessage = isBinFolder 
      ? `Are you sure you want to permanently delete these ${selectedIds.length} messages? This cannot be undone.`
      : `Move the ${selectedIds.length} selected messages to the Bin?`;

    if (window.confirm(confirmMessage)) {
      const batch = writeBatch(db);
      
      selectedIds.forEach((id) => {
        if (isBinFolder) {
          batch.delete(doc(db, "messages", id));
        } else {
          batch.update(doc(db, "messages", id), {
            folder: "bin",
            deletedAt: new Date().toISOString()
          });
        }
      });

      await batch.commit();
      
      if (selectedMessage && selectedIds.includes(selectedMessage.id)) {
        setSelectedMessage(null);
      }
      setSelectedIds([]);
    }
  };

  const allPageItemsSelected = paginatedMessages.length > 0 && paginatedMessages.map(m => m.id).every(id => selectedIds.includes(id));

  return (
    <div className="bg-card border border-border/70 rounded-2xl shadow-sm overflow-hidden min-h-[500px] lg:min-h-[600px] flex flex-col justify-between animate-in fade-in duration-200">
      <div>
        {/* Navigation Action Filters Bar */}
        <div className="p-3 md:p-4 border-b flex flex-col sm:flex-row justify-between items-center bg-muted/30 gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto shrink-0 scrollbar-none flex-nowrap">
            {[
              { id: "inbox", label: "Inbox", icon: Inbox },
              { id: "unread", label: "Unread Only", icon: Star },
              { id: "archive", label: "Archive", icon: Archive },
              { id: "bin", label: "Bin (Trash)", icon: Trash2 },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => { setEmailFolder(f.id as any); setCurrentPage(1); setSelectedMessage(null); }}
                className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold tracking-wide transition shrink-0 whitespace-nowrap ${
                  emailFolder === f.id ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground bg-background border"
                }`}
              >
                <f.icon className="h-4 w-4" /> {f.label}
              </button>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 text-xs text-muted-foreground border-t sm:border-t-0 pt-2 sm:pt-0">
            <span>
              {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredMessages.length)} of {filteredMessages.length}
            </span>
            <div className="flex gap-1">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-1.5 border rounded-lg bg-background hover:bg-muted transition disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-1.5 border rounded-lg bg-background hover:bg-muted transition disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* BULK SELECTION CONTROL SUB-BAR */}
        <div className={`px-4 py-2.5 border-b flex items-center justify-between bg-muted/10 text-sm text-muted-foreground ${selectedMessage ? "hidden lg:flex" : "flex"}`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleToggleSelectAll} 
              className="flex items-center gap-2 hover:text-foreground font-medium transition active:scale-95"
              title="Select all on this page"
            >
              {allPageItemsSelected ? (
                <CheckSquare className="h-5 w-5 text-primary shrink-0" />
              ) : (
                <Square className="h-5 w-5 shrink-0" />
              )}
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Select Page</span>
              <span className="text-xs font-bold uppercase tracking-wider sm:hidden">Select All</span>
            </button>

            {selectedIds.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-md">
                {selectedIds.length} Selected
              </span>
            )}
          </div>

          {selectedIds.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-destructive bg-background text-destructive hover:bg-destructive/10 text-xs font-bold transition shadow-xs active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Delete Selected</span> ({selectedIds.length})
            </button>
          )}
        </div>

        {/* Responsive Side-by-Side Split View Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x min-h-[450px] lg:min-h-[550px]">
          
          {/* LEFT EMAIL ITEMS COLUMN */}
          <div className={`lg:col-span-5 divide-y max-h-[500px] lg:max-h-[550px] overflow-y-auto ${selectedMessage ? "hidden lg:block" : "block"}`}>
            {paginatedMessages.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted-foreground bg-background/50">
                No messages found inside this directory view.
              </div>
            ) : (
              paginatedMessages.map((msg) => {
                const isSelected = selectedIds.includes(msg.id);
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`flex items-start p-4 gap-3.5 hover:bg-muted/40 transition cursor-pointer relative ${
                      selectedMessage?.id === msg.id ? "bg-primary/5 lg:border-l-4 lg:border-l-primary" : ""
                    } ${!msg.isRead ? "bg-blue-50/10 font-bold" : ""}`}
                  >
                    <button 
                      onClick={(e) => handleToggleIndividualSelect(msg.id, e)} 
                      className="mt-0.5 text-muted-foreground/75 hover:text-primary transition shrink-0 p-0.5"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2 truncate">
                           <span className="text-sm font-bold font-display text-secondary truncate max-w-[140px]">{msg.senderName}</span>
                           <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded shrink-0 max-w-[120px] truncate">
                             {!msg.isRead && <span className="inline-block h-2 w-2 rounded-full bg-blue-600 mr-1.5" />}
                             {msg.interestedProgram}
                           </span>
                        </div>
                        {/* 🚀 Added Time here for the list view */}
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                          {formatMessageTime(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 pr-4 leading-relaxed">
                        {msg.messageContent}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT PREVIEW / FULL PAGE MESSAGE DETAILS */}
          <div className={`lg:col-span-7 bg-muted/10 p-4 md:p-6 flex flex-col justify-between min-h-[400px] ${selectedMessage ? "block" : "hidden lg:flex"}`}>
            {selectedMessage ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-3 duration-200">
                
                <div className="flex flex-col justify-between items-start border-b pb-4 gap-4">
                  <div className="w-full">
                    <button 
                      onClick={() => setSelectedMessage(null)} 
                      className="lg:hidden text-xs text-primary mb-3 flex items-center gap-1.5 font-bold px-3 py-1.5 border border-primary/20 rounded-xl bg-background shadow-xs hover:bg-primary/5 active:scale-95 transition-all"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back to List
                    </button>
                    
                    <div className="flex items-start justify-between gap-2 mt-1">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold font-display text-secondary">
                          {selectedMessage.senderName}
                        </h3>
                        {/* 🚀 Added Time here for the detailed view */}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatMessageTime(selectedMessage.createdAt)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-xl whitespace-nowrap">
                          {selectedMessage.interestedProgram}
                        </span>
                        
                        <button 
                          onClick={(e) => handleToggleRead(selectedMessage, e)}
                          className="p-1.5 border rounded bg-background text-muted-foreground hover:bg-muted transition-all text-xs" 
                          title={selectedMessage.isRead ? "Mark Unread" : "Mark Read"}
                        >
                          <CheckCircle2 className={`h-4 w-4 ${selectedMessage.isRead ? "text-emerald-600" : ""}`} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-1.5 border-t pt-3 border-dashed">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground/80">Email:</span>{" "}
                        <a href={`mailto:${selectedMessage.senderEmail}`} className="text-primary hover:underline font-medium break-all">
                          {selectedMessage.senderEmail}
                        </a>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground/80">Phone:</span>{" "}
                        <span className="text-foreground font-medium">{selectedMessage.senderPhone}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-2xl p-4 md:p-5 text-sm md:text-base whitespace-pre-wrap leading-relaxed text-muted-foreground min-h-[180px] md:min-h-[220px] shadow-2xs">
                  {selectedMessage.messageContent}
                </div>

                <div className="border-t pt-4 flex flex-wrap gap-2 justify-end">
                  {(selectedMessage.folder === "archive" || selectedMessage.folder === "bin") && (
                    <button 
                      onClick={(e) => handleMoveToInbox(selectedMessage.id, e)} 
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/95 shadow-sm transition flex items-center gap-1.5 w-full sm:w-auto justify-center"
                    >
                      <CornerUpLeft className="h-3.5 w-3.5" /> Move to Inbox
                    </button>
                  )}

                  {selectedMessage.folder !== "archive" && selectedMessage.folder !== "bin" && (
                    <button 
                      onClick={(e) => handleMoveToArchive(selectedMessage.id, e)} 
                      className="cursor-pointer px-4 py-2 border bg-background text-muted-foreground hover:text-secondary hover:bg-muted rounded-xl text-xs font-semibold transition flex items-center gap-1.5 w-full sm:w-auto justify-center"
                    >
                      <Archive className="h-3.5 w-3.5" /> Archive Inquiry
                    </button>
                  )}

                  {selectedMessage.folder !== "bin" ? (
                    <button 
                      onClick={(e) => handleMoveToBin(selectedMessage.id, e)} 
                      className="cursor-pointer px-4 py-2 border bg-background text-destructive hover:bg-destructive/10 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 w-full sm:w-auto justify-center"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Move to Bin
                    </button>
                  ) : (
                    <button 
                      onClick={(e) => handlePermanentDelete(selectedMessage.id, e)} 
                      className="cursor-pointer px-4 py-2 border border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 w-full sm:w-auto justify-center"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete Permanently
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground/60 p-4">
                <Mail className="h-10 w-10 mb-2 opacity-40" />
                <p className="text-sm">Select an email row from the left pane to view its content in detail.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {emailFolder === "bin" && (
        <div className="p-3 bg-amber-500/10 text-amber-600 border-t text-xs text-center font-medium">
          ℹ️ Notice: Inquiries sitting in the Bin folder will be permanently purged after 30 days automatically.
        </div>
      )}
    </div>
  );
}