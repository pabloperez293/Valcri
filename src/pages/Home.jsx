import React from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import Categorias from "../components/Categorias";
import { ProductosDestacados } from "../components/ProductosDestacados";
import { BannerCompra } from "../components/BannerCompra";
import UbicacionLocal from "../components/UbicacionLocal";

export default function Home() {
  const navigate = useNavigate();
  const seleccionarCategoria = (categoria) =>
    navigate(
      categoria === "todos"
        ? "/productos"
        : `/productos?categoria=${encodeURIComponent(categoria)}`,
    );
  return (
    <>
      <Hero />
      <Categorias onSeleccionar={seleccionarCategoria} />
      <ProductosDestacados />
      <BannerCompra />
      <UbicacionLocal />
    </>
  );
}
