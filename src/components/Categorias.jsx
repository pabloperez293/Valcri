
import React from "react";
import { Link } from "react-router-dom";

import { categorias } from "../data/productos";
import "../styles/Catalogo.css";

export default function Categorias() {
  return (
    <section
      className="valcri-categorias"
      aria-labelledby="titulo-categorias"
    >
      <div className="valcri-section-heading">
        <h2 id="titulo-categorias">
          Nuestras categorías
        </h2>

        <Link to="/productos">
          Ver todas
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="valcri-categorias-grid">
        {categorias.map((categoria) => (
          <Link
            to={`/productos?categoria=${encodeURIComponent(
              categoria.id
            )}`}
            className="valcri-categoria-card"
            key={categoria.id}
          >
            <img
              src={categoria.imagen}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "/images/hero-carne.jpg";
              }}
            />

            <span>{categoria.nombre}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
