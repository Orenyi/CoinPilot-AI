import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import MarketsPage from "./pages/MarketsPage";
import WatchlistPage from "./pages/WatchlistPage";

import ProtectedRoute from "./components/auth/ProtectedRoute";

const App = () => {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/dashboard",
    "/markets",
    "/watchlist",
    "/portfolio",
    "/ai-assistant",
    "/news",
    "/alerts",
    "/settings",
  ];

  const hideNavbar = hideNavbarRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/markets" element={<MarketsPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/watchlist" element={<WatchlistPage />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex h-screen items-center justify-center bg-[var(--app-bg)] text-[var(--app-text)]">
              <h1 className="text-3xl font-bold">404 | Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default App;
