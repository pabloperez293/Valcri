import React, { useState } from "react";
import Categorias from "./Categorias";
import Productos from "../pages/ProductosPage";

export default function CatalogoFase2() {
  const [categoriaActiva, setCategoriaActiva] = useState("todos");

  return (
    <>
      <Categorias onSeleccionar={setCategoriaActiva} />

      <Productos
        categoriaActiva={categoriaActiva}
        onSeleccionar={setCategoriaActiva}
      />
    </>
  );
}
