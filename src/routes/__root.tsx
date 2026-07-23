import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";


import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { WhatsAppButton } from "../components/WhatsappIcon";
import { Preloader } from "../components/Preloader";
import { ChatbotBubble } from "@/components/ChatbotBubble"; 

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-primary">Go home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-primary"
          >Try again</button>
          <a href="/" className="btn-outline">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({


  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cherry Kids Pre School Uran — Where Little Minds Grow" },
      { name: "description", content: "A joyful, modern preschool nurturing curious kids ages 2–6 with play-based learning, expert teachers, and a vibrant community." },
      { property: "og:title", content: "Cherry Kids Pre School Uran — Where Little Minds Grow" },
      { property: "og:description", content: "A joyful, modern preschool nurturing curious kids ages 2–6 with play-based learning, expert teachers, and a vibrant community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Cherry Kids Pre School Uran — Where Little Minds Grow" },
      { name: "twitter:description", content: "A joyful, modern preschool nurturing curious kids ages 2–6 with play-based learning, expert teachers, and a vibrant community." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/315d8b95-c470-4a0c-b67e-19e9da462b45/id-preview-350afe5a--5ef1ab23-dd04-4aff-8548-24ff100ea330.lovable.app-1782549642577.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/315d8b95-c470-4a0c-b67e-19e9da462b45/id-preview-350afe5a--5ef1ab23-dd04-4aff-8548-24ff100ea330.lovable.app-1782549642577.png" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700;800&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  
  // 🌟 Hook into the current active path location
  const location = useLocation();
  
  // 🌟 Check if the path belongs to the administration layout
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Preloader />
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        
        {/* 🌟 Hide interactive bubbles globally when on an active Admin panel url path */}
        {!isAdminRoute && (
          <>
            <ChatbotBubble />
            <WhatsAppButton />
          </>
        )}
      </div>
    </QueryClientProvider>
  );
}