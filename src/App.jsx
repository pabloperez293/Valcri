import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import CarritoLateral from "./components/CarritoLateral";
import { CarritoProvider } from "./context/CarritoContext";
import Home from "./pages/Home";
import ProductosPage from "./pages/ProductosPage";
import CheckoutPage from "./pages/CheckoutPage";

export default function App() {
  return (
    <CarritoProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <CarritoLateral />
    </CarritoProvider>
  );
}
