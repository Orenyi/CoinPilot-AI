import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/layout/Navbar";

const App = () => {
  return (
    <section className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] transition-colors duration-300">
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </section>
  );
};

export default App;
