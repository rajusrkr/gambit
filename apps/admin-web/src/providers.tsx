import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import RequireAuth from "@/components/require-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <TooltipProvider>
        <RequireAuth>
          <div>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </div>
        </RequireAuth>
      </TooltipProvider>
    </ThemeProvider>
  );
}
