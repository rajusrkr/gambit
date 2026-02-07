import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import RequireAuth from "./components/require-auth.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <RequireAuth>
          <App />
        </RequireAuth>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
);
