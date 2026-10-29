import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CarritoProvider } from "./context/CarritoContext";
import Navbar from "./components/Navbar";
import CarritoLateral from "./components/CarritoLateral";
import Home from "./pages/Home";
import ProductosPage from "./pages/ProductosPage";

export default function App() {
  return (
    <CarritoProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <CarritoLateral />
    </CarritoProvider>
  );
}
