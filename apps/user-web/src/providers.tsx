import type React from "react";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WebSocketProvider } from "./components/web-socket-provider";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <>
      <ThemeProvider defaultTheme="system">
        <WebSocketProvider url="ws://localhost:8000">
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster />
          </QueryClientProvider>
        </WebSocketProvider>
      </ThemeProvider>
    </>
  );
}
