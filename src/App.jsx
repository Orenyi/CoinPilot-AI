import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const App = () => {
  const location = useLocation();

  const authPages = ["/login", "/register", "/forgot-password"];

  const hideNavbar = authPages.includes(location.pathname);

  return (
    <section>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        {/* Future */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
      </Routes>
    </section>
  );
};

export default App;
