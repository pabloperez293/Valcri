
import React from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import Categorias from "../components/Categorias";

export default function Home() {
  const navigate = useNavigate();

  const seleccionarCategoria = (categoria) => {
    if (categoria === "todos") {
      navigate("/productos");
      return;
    }

    navigate(
      `/productos?categoria=${encodeURIComponent(categoria)}`
    );
  };

  return (
    <>
      {/* FASE 1 - Portada original */}
      <Hero />

      {/* FASE 2 - Categorías */}
      <Categorias
        onSeleccionar={seleccionarCategoria}
      />
    </>
  );
}
