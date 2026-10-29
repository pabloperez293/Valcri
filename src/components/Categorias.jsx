import React from "react";
import { categorias } from "../data/productos";
import "../styles/Catalogo.css";

export default function Categorias({ onSeleccionar }) {
  return (
    <section className="valcri-categorias" aria-labelledby="titulo-categorias">
      <div className="valcri-section-heading">
        <h2 id="titulo-categorias">Nuestras categorías</h2>

        <a href="#productos" onClick={() => onSeleccionar("todos")}>
          Ver todas
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="valcri-categorias-grid">
        {categorias.map((categoria) => (
          <a
            href="#productos"
            className="valcri-categoria-card"
            key={categoria.id}
            onClick={() => onSeleccionar(categoria.id)}
          >
            <img
              src={categoria.imagen}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/hero-carne.jpg";
              }}
            />

            <span>{categoria.nombre}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
