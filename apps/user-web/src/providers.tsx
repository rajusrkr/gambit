import type React from "react";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WebSocketProvider } from "./components/web-socket-provider";
import { useLocation } from "react-router-dom";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  const path= useLocation()

  return (
    <>
      <ThemeProvider defaultTheme="system">
        <WebSocketProvider url="ws://localhost:8000" currentPath={path.pathname}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WebSocketProvider>
      </ThemeProvider>
    </>
  );
}
