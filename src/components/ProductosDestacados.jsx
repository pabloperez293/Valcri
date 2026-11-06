import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { productos } from "../data/productos";
import "../styles/SeccionesHome.css";
const moneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);
export function ProductosDestacados() {
  const destacados = [...productos]
    .filter((p) => p.popularidad != null)
    .sort((a, b) => b.popularidad - a.popularidad)
    .slice(0, 4);
  return (
    <section className="vc-destacados" aria-labelledby="vc-destacados-titulo">
      <div className="vc-contenedor">
        <div className="vc-seccion-encabezado">
          <div>
            <h2 id="vc-destacados-titulo">Productos destacados</h2>
          </div>
          <Link to="/productos" className="vc-ver-todos">
            Ver todos <ArrowRight size={18} />
          </Link>
        </div>
        <div className="vc-productos-grid">
          {destacados.map((producto) => (
            <article className="vc-producto" key={producto.id}>
              <Link
                to={`/productos?buscar=${encodeURIComponent(producto.nombre)}`}
                className="vc-producto-imagen"
                aria-label={`Elegir ${producto.nombre}`}
              >
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/hero-carne.jpg";
                  }}
                />
              </Link>
              <div className="vc-producto-datos">
                <div>
                  <h3>{producto.nombre}</h3>
                  <p>
                    {producto.precio == null ? (
                      "Precio a confirmar"
                    ) : (
                      <>
                        {moneda(producto.precio)}{" "}
                        <span>/ {producto.unidad}</span>
                      </>
                    )}
                  </p>
                </div>
                <Link
                  to={`/productos?buscar=${encodeURIComponent(producto.nombre)}`}
                  className="vc-producto-accion"
                  aria-label={`Elegir presentación de ${producto.nombre}`}
                  title="Elegir presentación y agregar al carrito"
                >
                  <ShoppingCart size={20} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
