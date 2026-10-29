
import React from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CatalogoFase2 from "./components/CatalogoFase2";

export default function App() {
  return (
    <>
      {/* FASE 1 - SIN CAMBIOS */}
      <Navbar />
      <Hero />

      {/* FASE 2 - NUEVO */}
      <CatalogoFase2 />
    </>
  );
}
