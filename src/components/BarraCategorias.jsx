import React, { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { createPortal } from "react-dom";
import "../styles/BarraCategorias.css";

export default function BarraCategorias({
  categorias = [],
  categoriaActiva = "todos",
  onSeleccionar,
}) {
  const [abierto, setAbierto] = useState(false);
  const menuId = useId();

  const lista = [
    { id: "todos", nombre: "Todos" },
    ...categorias.filter((cat) => cat.id !== "todos"),
  ];

  const actual =
    lista.find((cat) => cat.id === categoriaActiva)?.nombre || "Todos";

  const seleccionar = (id) => {
    onSeleccionar?.(id);
    setAbierto(false);
  };

  useEffect(() => {
    if (!abierto) return;

    const scrollAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const cerrarEscape = (event) => {
      if (event.key === "Escape") setAbierto(false);
    };

    window.addEventListener("keydown", cerrarEscape);

    return () => {
      document.body.style.overflow = scrollAnterior;
      window.removeEventListener("keydown", cerrarEscape);
    };
  }, [abierto]);

  return (
    <>
      <nav
        className="valcri-categorias-nav"
        aria-label="Navegación de categorías"
      >
        <h3>Categorías</h3>

        <button
          type="button"
          className="valcri-categorias-toggle"
          aria-expanded={abierto}
          aria-controls={menuId}
          onClick={() => setAbierto(true)}
        >
          <span>{actual}</span>
          <Menu size={23} />
        </button>
      </nav>

      {createPortal(
        <div
          id={menuId}
          className={"valcri-categorias-pantalla " + (abierto ? "visible" : "")}
          aria-hidden={!abierto}
          inert={!abierto}
        >
          <div className="valcri-categorias-pantalla-header">
            <div className="valcri-categorias-marca">
              <img src="/images/logo-valcri.png" alt="Carnicería VALCRI" />
            </div>

            <button
              type="button"
              className="valcri-categorias-cerrar"
              aria-label="Cerrar categorías"
              onClick={() => setAbierto(false)}
            >
              <X size={33} />
            </button>
          </div>

          <div className="valcri-categorias-pantalla-centro">
            <div className="valcri-categorias-lista">
              {lista.map((categoria, index) => (
                <button
                  type="button"
                  key={categoria.id}
                  className={
                    "valcri-categorias-enlace " +
                    (categoriaActiva === categoria.id ? "activo" : "")
                  }
                  style={{
                    "--orden": index,
                  }}
                  aria-current={
                    categoriaActiva === categoria.id ? "true" : undefined
                  }
                  onClick={() => seleccionar(categoria.id)}
                >
                  {categoria.nombre}
                </button>
              ))}
            </div>
          </div>

          <div className="valcri-categorias-pantalla-footer">
            CARNICERÍA VALCRI
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
