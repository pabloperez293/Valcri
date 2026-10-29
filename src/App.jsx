
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductosPage from "./pages/ProductosPage";

export default function App() {
  return (
    <>
      {/* Navbar compartido entre las páginas */}
      <Navbar />

      <main>
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Home />} />

          {/* Catálogo completo */}
          <Route
            path="/productos"
            element={<ProductosPage />}
          />

          {/* Rutas inexistentes */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>
    </>
  );
}
