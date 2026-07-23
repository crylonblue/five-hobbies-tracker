import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { registerAutoUpdate } from "./lib/autoUpdate.ts";
import "./styles.css";

// Block pinch-zoom gestures (iOS Safari honours the viewport flag only in
// standalone mode) for a more native, app-like feel.
for (const evt of ["gesturestart", "gesturechange", "gestureend"]) {
  document.addEventListener(evt, (e) => e.preventDefault(), { passive: false });
}

// Reload to the latest build when the app is reopened / refocused.
registerAutoUpdate();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
