// import { useState, useRef, useEffect } from "react";
// import { MessageSquare, Send, Bot, X, LoaderCircle } from "lucide-react";
// import { GoogleGenAI } from "@google/genai";

// // Swap with your active working key
// const GEMINI_API_KEY = "AQ.Ab8RN6Kc5hh2l287hElPfvdEo7528M-k2ILcYK6OtuYrGktjJA";

// const ai = new GoogleGenAI({
//   apiKey: GEMINI_API_KEY,
// });

// interface ChatMessage {
//   role: "user" | "model";
//   parts: [{ text: string }];
// }

// export function ChatbotBubble() {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
//     {
//       role: "model",
//       parts: [{ text: "Hello from Cherry Kids! 🍒 How can I help you learn about where little minds grow today?" }]
//     }
//   ]);

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatHistory, isLoading]);

//   const handleSend = async () => {
//     if (!input.trim() || isLoading) return;

//     const userText = input.trim();
//     setInput("");
//     setIsLoading(true);

//     const updatedHistory: ChatMessage[] = [
//       ...chatHistory,
//       { role: "user", parts: [{ text: userText }] }
//     ];
//     setChatHistory(updatedHistory);

//     try {
//       const systemInstruction = `
//   You are "Cherry Assistant", a friendly, helpful, and caring AI chatbot for Cherry Kids Preschool located in Uran.
  
//   CRITICAL FORMATTING RULE: Break down your lists into clean, short Markdown bullet points using asterisks (*). Do not combine text into walls of paragraphs. Keep your responses concise, warm, and easy to read.

//   Always use the following knowledge base to answer parent inquiries. If a question is not covered by this information, politely invite the parent to contact the administration office or schedule a campus visit.

//   --- CHERRY KIDS PRESCHOOL KNOWLEDGE BASE ---

//   * ABOUT US & CORE BENEFITS:
//     - Founder/Owner: Pallavi Nakhawa
//     - Contact: +91 7715034191
//     - Email Address: cherrykidspreprimaryschool@gmail.com
//     - School Address: Cherry Kids Preschool, Shop no 3,4 & 6 Shivsagar CHS Nagoan Road, Uran 400-702
//     - Over 10+ years of experience in early childhood education.
//     - 90% of a child's thinking develops in the first six years; we focus on laying a strong foundation for life.
//     - We provide a safe, happy, and nurturing environment where learning feels like play.
  
//   * AGE & PROGRAMS:
//     - Right age to enroll: 2 to 6 years old.
//     - Programs offered: Pre-Nursery, Nursery, Junior KG, and Senior KG.
//     - Learning outcomes: Cognitive, emotional, and social development, creativity, communication, and school readiness.
  
//   * ADMISSIONS & FEES:
//     - Fee Structure: Transparent and aligns with the exceptional quality of care. Parents should contact the administration office for exact details.
//     - Admission Process: Simple and hassle-free. 1) Visit the campus. 2) Fill out the "Contact Us" form on the website. 3) Meet educators and submit required documents. The team guides parents through every step.
  
//   * CLASSROOM EXPERIENCE:
//     - Student-to-Teacher Ratio: 7:1, ensuring individual attention and personalized support.
//     - Settling In: Caring teachers help children adjust through engaging activities, positive interactions, and consistent routines to build trust.
  
//   * SAFETY & PARENT COMMUNICATION:
//     - Safety Measures: Secure campus, child-friendly classrooms, trained staff, regular supervision, and strict safety protocols.
//     - Parent Involvement: Viewed as a partnership. We provide regular updates, host parent-teacher meetings, and hold progress discussions.
  
//   * VISITS & ENROLLMENT:
//     - Parents are highly encouraged to contact us to schedule a campus tour, meet our educators, and experience the learning environment firsthand.
// `;

//       const apiContents = updatedHistory.map(msg => ({
//         role: msg.role,
//         parts: msg.parts
//       }));

//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             contents: apiContents,
//             systemInstruction: { parts: [{ text: systemInstruction }] }
//           })
//         }
//       );

//       const data = await response.json();
//       const botResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Please head over to our Contact page!";

//       setChatHistory(prev => [...prev, { role: "model", parts: [{ text: botResponseText }] }]);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const cleanText = (text: string) => {
//     return text.replace(/\*\*/g, "");
//   };

//   // Reusable Message Area component to avoid duplicating code between mobile & desktop views
//   const RenderMessages = () => (
//     <div className="space-y-1.5 text-left">
//       {chatHistory.map((m, i) => (
//         <div key={i} className={`flex gap-3 my-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
//           <div
//             className={`max-w-[80%] rounded-2xl p-4 text-sm ${m.role === "user" ? "bg-blue-500 text-white rounded-br-none" : "bg-white border text-gray-800 rounded-bl-none"
//               }`}
//           >
//             {m.role === "user" ? (
//               m.parts[0].text
//             ) : (
//               <div className="space-y-1.5 text-left">
//                 {m.parts[0].text.split("\n").map((line, index) => {
//                   const trimmedLine = line.trim();
//                   if (trimmedLine.startsWith("*") || trimmedLine.startsWith("-")) {
//                     return (
//                       <div key={index} className="flex items-start gap-2"> {/* Removed pl-2 */}
//                         <span className="text-blue-500 mt-1 shrink-0">•</span>
//                         <span className="leading-relaxed break-all">{cleanText(trimmedLine.replace(/^[\*\-]\s*/, ""))}</span>
//                       </div>
//                     );
//                   }
//                   return trimmedLine === "" ? <div key={index} className="h-2" /> : <p key={index}>{cleanText(line)}</p>;
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//       {isLoading && <LoaderCircle className="animate-spin text-gray-400 mx-auto my-2" />}
//       <div ref={messagesEndRef} />
//     </div>
//   );

//   return (
//     <>
//       {/* ========================================== */}
//       {/* 📱 MOBILE VERSION: Full-screen overlay      */}
//       {/* ========================================== */}
//       {isChatOpen && (
//         <div className="fixed inset-0 z-[9999] flex flex-col bg-white sm:hidden">
//           {/* Header */}
//           <div className="flex items-center justify-between bg-[#0B2240] px-5 py-4 text-white shrink-0">
//             <div className="flex items-center gap-3">
//               <Bot className="text-rose-400" />
//               <div>
//                 <div className="font-bold text-base">Cherry Assistant</div>
//                 <div className="text-xs text-white/70">Ages 2 – 6 Helper</div>
//               </div>
//             </div>
//             <button
//               onClick={() => setIsChatOpen(false)}
//               className="grid h-9 w-9 place-items-center rounded-full bg-rose-500 text-white"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Messages Container */}
//           <div className="flex-1 overflow-y-auto bg-[#FAF8F5] p-5">
//             <RenderMessages />
//           </div>

//           {/* Input Footer */}
//           <div className="flex gap-2 border-t p-4 bg-white pb-safe shrink-0">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//               className="flex-1 border rounded-full px-5 py-3 text-base outline-none"
//               placeholder="Ask about classes..."
//             />
//             <button onClick={handleSend} className="bg-rose-500 text-white px-[15px] py-[10px] rounded-full shrink-0">
//               <Send className="h-5 w-5" />
//             </button>
//           </div>
//         </div>
//       )}


//       {/* ========================================== */}
//       {/* 💻 DESKTOP VERSION: Intact original layout */}
//       {/* ========================================== */}
//       <div className="fixed bottom-6 right-6 z-50 hidden sm:flex flex-col items-end gap-3">
//         {isChatOpen && (
//           <div className="flex h-[480px] w-[360px] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
//             {/* Header */}
//             <div className="flex items-center justify-between bg-[#0B2240] px-5 py-4 text-white">
//               <div className="flex items-center gap-3">
//                 <Bot className="text-rose-400" />
//                 <div>
//                   <div className="font-bold text-sm">Cherry Assistant</div>
//                   <div className="text-xs text-white/70">Ages 2 – 6 Helper</div>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsChatOpen(false)}
//                 className="grid h-8 w-8 place-items-center rounded-full bg-rose-500 text-white transition-colors hover:bg-rose-600 cursor-pointer"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 space-y-4 overflow-y-auto bg-[#FAF8F5] p-5">
//               <RenderMessages />
//             </div>

//             {/* Input Area */}
//             <div className="flex gap-2 border-t p-3 bg-white">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                 className="flex-1 border rounded-full px-4 text-sm outline-none"
//                 placeholder="Ask about classes..."
//               />
//               <button onClick={handleSend} className="bg-rose-500 text-white p-2 rounded-full"><Send className="h-4 w-4" /></button>
//             </div>
//           </div>
//         )}

//         {/* Floating Action Launcher with custom Hover Tooltip and Ping Ripple */}
//         <div className="relative group">
//           <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 hidden group-hover:block whitespace-nowrap bg-gray-900 text-white text-xs rounded-md px-2.5 py-1.5 shadow-md">
//             Your Cherry AI Agent
//             <div className="absolute top-1/2 left-full -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
//           </div>

//           <button
//             onClick={() => setIsChatOpen(!isChatOpen)}
//             className="relative flex h-16 w-16 items-center justify-center rounded-full text-white bg-rose-500 shadow-lg transition-transform hover:scale-105 cursor-pointer"
//           >
//             {!isChatOpen && (
//               <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-rose-500/40 opacity-75" style={{ animationDuration: '1000ms' }} />
//             )}
//             {isChatOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Floating Action Launcher (Visible only when chat is closed on mobile) */}
//       {!isChatOpen && (
//         <button
//           onClick={() => setIsChatOpen(true)}
//           className="fixed bottom-6 right-6 z-50 sm:hidden flex h-16 w-16 items-center justify-center rounded-full text-white bg-rose-500 shadow-lg cursor-pointer"
//         >
//           <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-rose-500/40 opacity-75" style={{ animationDuration: '1000ms' }} />
//           <MessageSquare className="h-7 w-7" />
//         </button>
//       )}
//     </>
//   );
// }














import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, X, LoaderCircle } from "lucide-react";

interface ChatMessage {
  role: "user" | "model";
  parts: [{ text: string }];
}

export function ChatbotBubble() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "model",
      parts: [
        {
          text: "Hello from Cherry Kids! 🍒 How can I help you learn about where little minds grow today?",
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  // Knowledge Base Engine - Instant, smart, offline responses
  const getBotResponse = (userInput: string): string => {
    const q = userInput.toLowerCase().trim();

    // 1. Greetings
    if (
      q.includes("hi") ||
      q.includes("hello") ||
      q.includes("hey") ||
      q.includes("good morning") ||
      q.includes("good afternoon")
    ) {
      return "Hello! Welcome to Cherry Kids Preschool! 🍒 How can I help you today? You can ask me about:\n* Admissions & Fees\n* Age Criteria & Programs\n* School Location & Contact Info\n* Student-to-Teacher Ratio";
    }

    // 2. Fees / Pricing (Handles typos like 'fess')
    if (
      q.includes("fee") ||
      q.includes("fess") ||
      q.includes("cost") ||
      q.includes("price") ||
      q.includes("charge") ||
      q.includes("pay")
    ) {
      return "Here is information regarding our Fee Structure:\n* Our fee structure is transparent and aligns with the exceptional quality of care we provide.\n* For exact fee details and payment options, please contact our administration office at +91 7715034191.";
    }

    // 3. Admission Process
    if (
      q.includes("admis") ||
      q.includes("enroll") ||
      q.includes("join") ||
      q.includes("apply") ||
      q.includes("register") ||
      q.includes("process")
    ) {
      return "Our Admission Process is simple and hassle-free:\n* 1) Visit our campus or schedule a tour.\n* 2) Fill out the 'Contact Us' form on our website.\n* 3) Meet our educators and submit required documents.\nOur team will guide you through every step!";
    }

    // 4. Age & Programs
    if (
      q.includes("age") ||
      q.includes("program") ||
      q.includes("class") ||
      q.includes("nursery") ||
      q.includes("kg") ||
      q.includes("course") ||
      q.includes("eligible")
    ) {
      return "Programs & Age Criteria at Cherry Kids:\n* Right Age Group: 2 to 6 years old\n* Programs Offered: Pre-Nursery, Nursery, Junior KG, and Senior KG\n* Learning Focus: Cognitive, emotional, and social development, creativity, and school readiness.";
    }

    // 5. Address / Location
    if (
      q.includes("address") ||
      q.includes("location") ||
      q.includes("where") ||
      q.includes("uran") ||
      q.includes("place") ||
      q.includes("map") ||
      q.includes("direction")
    ) {
      return "Here is our school address:\n* Cherry Kids Preschool, Shop no 3, 4 & 6, Shivsagar CHS, Nagoan Road, Uran 400-702.";
    }

    // 6. Contact / Phone / Email
    if (
      q.includes("contact") ||
      q.includes("phone") ||
      q.includes("call") ||
      q.includes("number") ||
      q.includes("email") ||
      q.includes("mail") ||
      q.includes("mobile")
    ) {
      return "You can reach our team directly:\n* Contact Number: +91 7715034191\n* Email: cherrykidspreprimaryschool@gmail.com\n* Founder/Owner: Pallavi Nakhawa";
    }

    // 7. Student-to-Teacher Ratio & Settling In
    if (
      q.includes("ratio") ||
      q.includes("teacher") ||
      q.includes("staff") ||
      q.includes("student") ||
      q.includes("care") ||
      q.includes("settle")
    ) {
      return "Classroom Experience:\n* Student-to-Teacher Ratio: 7:1, ensuring individual attention and personalized support.\n* Settling In: Our caring teachers help children adjust through engaging activities, positive interactions, and consistent routines.";
    }

    // 8. Safety & Parent Communication
    if (
      q.includes("safe") ||
      q.includes("security") ||
      q.includes("parent") ||
      q.includes("ptm") ||
      q.includes("update")
    ) {
      return "Safety & Parent Partnership:\n* Safety Measures: Secure campus, child-friendly classrooms, trained staff, and strict safety protocols.\n* Parent Involvement: We provide regular progress updates, host PTMs, and maintain open communication.";
    }

    // 9. About Us / Founder
    if (
      q.includes("about") ||
      q.includes("founder") ||
      q.includes("owner") ||
      q.includes("pallavi") ||
      q.includes("history") ||
      q.includes("who")
    ) {
      return "About Cherry Kids Preschool:\n* Founder & Owner: Pallavi Nakhawa\n* Experience: Over 10+ years in early childhood education.\n* Our Philosophy: We focus on laying a strong foundation for life in a safe, happy, and nurturing environment where learning feels like play!";
    }

    // 10. Visit / Tour
    if (
      q.includes("visit") ||
      q.includes("tour") ||
      q.includes("time") ||
      q.includes("timing") ||
      q.includes("see")
    ) {
      return "Campus Visits:\n* Parents are highly encouraged to schedule a campus tour, meet our educators, and experience the learning environment firsthand.\n* Please call +91 7715034191 to book your tour!";
    }

    // Default Fallback Response
    return "I am happy to assist! You can ask me about our programs (Ages 2-6), fee structure, admissions process, location in Uran, or contact details.\n* You can also reach our main office directly at +91 7715034191!";
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");

    // Add user message to history
    setChatHistory((prev) => [
      ...prev,
      { role: "user", parts: [{ text: userText }] },
    ]);
    setIsLoading(true);

    // Simulate realistic typing delay (400ms) for natural feel
    setTimeout(() => {
      const responseText = getBotResponse(userText);
      setChatHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: responseText }] },
      ]);
      setIsLoading(false);
    }, 400);
  };

  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, "");
  };

  // Reusable Message Area component
  const RenderMessages = () => (
    <div className="space-y-1.5 text-left">
      {chatHistory.map((m, i) => (
        <div
          key={i}
          className={`flex gap-3 my-4 ${
            m.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-2xl p-4 text-sm ${
              m.role === "user"
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-white border text-gray-800 rounded-bl-none"
            }`}
          >
            {m.role === "user" ? (
              m.parts[0].text
            ) : (
              <div className="space-y-1.5 text-left">
                {m.parts[0].text.split("\n").map((line, index) => {
                  const trimmedLine = line.trim();
                  if (
                    trimmedLine.startsWith("*") ||
                    trimmedLine.startsWith("-")
                  ) {
                    return (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1 shrink-0">•</span>
                        <span className="leading-relaxed break-all">
                          {cleanText(trimmedLine.replace(/^[\*\-]\s*/, ""))}
                        </span>
                      </div>
                    );
                  }
                  return trimmedLine === "" ? (
                    <div key={index} className="h-2" />
                  ) : (
                    <p key={index}>{cleanText(line)}</p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <LoaderCircle className="animate-spin text-gray-400 mx-auto my-2" />
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <>
      {/* ========================================== */}
      {/* 📱 MOBILE VERSION: Full-screen overlay      */}
      {/* ========================================== */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col bg-white sm:hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#0B2240] px-5 py-4 text-white shrink-0">
            <div className="flex items-center gap-3">
              <Bot className="text-rose-400" />
              <div>
                <div className="font-bold text-base">Cherry Assistant</div>
                <div className="text-xs text-white/70">Ages 2 – 6 Helper</div>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full bg-rose-500 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto bg-[#FAF8F5] p-5">
            <RenderMessages />
          </div>

          {/* Input Footer */}
          <div className="flex gap-2 border-t p-4 bg-white pb-safe shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border rounded-full px-5 py-3 text-base outline-none"
              placeholder="Ask about classes..."
            />
            <button
              onClick={handleSend}
              className="bg-rose-500 text-white px-[15px] py-[10px] rounded-full shrink-0"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 💻 DESKTOP VERSION: Intact original layout */}
      {/* ========================================== */}
      <div className="fixed bottom-6 right-6 z-50 hidden sm:flex flex-col items-end gap-3">
        {isChatOpen && (
          <div className="flex h-[480px] w-[360px] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#0B2240] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <Bot className="text-rose-400" />
                <div>
                  <div className="font-bold text-sm">Cherry Assistant</div>
                  <div className="text-xs text-white/70">Ages 2 – 6 Helper</div>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-rose-500 text-white transition-colors hover:bg-rose-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 overflow-y-auto bg-[#FAF8F5] p-5">
              <RenderMessages />
            </div>

            {/* Input Area */}
            <div className="flex gap-2 border-t p-3 bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border rounded-full px-4 text-sm outline-none"
                placeholder="Ask about classes..."
              />
              <button
                onClick={handleSend}
                className="bg-rose-500 text-white p-2 rounded-full cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Floating Action Launcher */}
        <div className="relative group">
          <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 hidden group-hover:block whitespace-nowrap bg-gray-900 text-white text-xs rounded-md px-2.5 py-1.5 shadow-md">
            Your Cherry AI Agent
            <div className="absolute top-1/2 left-full -translate-y-1/2 border-4 border-transparent border-l-gray-900" />
          </div>

          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="relative flex h-16 w-16 items-center justify-center rounded-full text-white bg-rose-500 shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            {!isChatOpen && (
              <span
                className="absolute inset-0 -z-10 animate-ping rounded-full bg-rose-500/40 opacity-75"
                style={{ animationDuration: "1000ms" }}
              />
            )}
            {isChatOpen ? <X className="h-7 w-7" /> : <MessageSquare className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Floating Action Launcher */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 sm:hidden flex h-16 w-16 items-center justify-center rounded-full text-white bg-rose-500 shadow-lg cursor-pointer"
        >
          <span
            className="absolute inset-0 -z-10 animate-ping rounded-full bg-rose-500/40 opacity-75"
            style={{ animationDuration: "1000ms" }}
          />
          <MessageSquare className="h-7 w-7" />
        </button>
      )}
    </>
  );
}