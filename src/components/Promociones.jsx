import React from "react";
import { promociones, preciosConfirmados } from "../data/productos";
import "../styles/Promociones.css";

const moneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

export default function Promociones() {
  return (
    <section className="valcri-promos" aria-labelledby="titulo-promos">
      <div className="valcri-section-heading">
        <h2 id="titulo-promos">Promociones VALCRI</h2>
        <span className="valcri-promos-aviso">Precios a confirmar</span>
      </div>
      <div className="valcri-promos-grid">
        {promociones.map((promo) => (
          <article className="valcri-promo-card" key={promo.id}>
            <img
              src={promo.imagen}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/hero-carne.jpg";
              }}
            />
            <div className="valcri-promo-info">
              <span className="valcri-promo-etiqueta">PROMO</span>
              <h3>{promo.nombre}</h3>
              <p>
                {promo.cantidadIncluida
                  ? `${promo.cantidadIncluida} ${promo.unidad} por pack`
                  : promo.detalle}
              </p>
              <strong>
                {moneda(promo.precio)} <small>/ pack</small>
              </strong>
              <button type="button" disabled={!preciosConfirmados}>
                {preciosConfirmados
                  ? "Agregar promoción"
                  : "Pendiente de confirmación"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
