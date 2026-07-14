import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import { CurrencyProvider } from "./context/CurrencyContext";

import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SidebarProvider>
        <CurrencyProvider>
          <BrowserRouter>
            <App />

            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={12}
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#111827",
                  color: "#fff",
                  border: "1px solid rgba(124,58,237,.25)",
                  borderRadius: "16px",
                  padding: "16px",
                  fontSize: "14px",
                },
                success: {
                  iconTheme: {
                    primary: "#22c55e",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </BrowserRouter>
        </CurrencyProvider>
      </SidebarProvider>
    </AuthProvider>
  </React.StrictMode>,
);
