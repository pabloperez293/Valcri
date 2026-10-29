
import React, { useEffect, useState } from "react";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import "../styles/DetalleProducto.css";

const formatoPrecio = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

export default function DetalleProducto({
  producto,
  onCerrar,
  onAgregar,
}) {
  const [cantidad, setCantidad] = useState(0.5);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    setCantidad(0.5);
    setAgregado(false);
  }, [producto?.id]);

  useEffect(() => {
    if (!producto) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const cerrarConEscape = (event) => {
      if (event.key === "Escape") onCerrar();
    };

    window.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", cerrarConEscape);
    };
  }, [producto, onCerrar]);

  if (!producto) return null;

  const aumentar = () => {
    setCantidad((prev) =>
      Math.round((prev + 0.5) * 10) / 10
    );
    setAgregado(false);
  };

  const disminuir = () => {
    setCantidad((prev) =>
      Math.max(0.5, Math.round((prev - 0.5) * 10) / 10)
    );
    setAgregado(false);
  };

  const total = producto.precio * cantidad;

  const agregarProducto = () => {
    onAgregar({
      ...producto,
      cantidad,
      subtotal: total,
    });

    setAgregado(true);
  };

  return (
    <div
      className="valcri-detalle-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCerrar();
        }
      }}
    >
      <section
        className="valcri-detalle-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="valcri-detalle-titulo"
      >
        <button
          className="valcri-detalle-cerrar"
          onClick={onCerrar}
          aria-label="Cerrar detalle"
          type="button"
        >
          <X size={24} />
        </button>

        <div className="valcri-detalle-contenido">
          <div className="valcri-detalle-imagen">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "/images/hero-carne.jpg";
              }}
            />
          </div>

          <div className="valcri-detalle-info">
            <span className="valcri-detalle-etiqueta">
              CARNICERÍA VALCRI
            </span>

            <h2 id="valcri-detalle-titulo">
              {producto.nombre}
            </h2>

            <p className="valcri-detalle-precio">
              {formatoPrecio(producto.precio)}
              <span> / {producto.unidad}</span>
            </p>

            <p className="valcri-detalle-descripcion">
              Seleccioná la cantidad que necesitás
              y prepará tu pedido de manera rápida
              y sencilla.
            </p>

            <div className="valcri-detalle-cantidad">
              <span>Cantidad</span>

              <div className="valcri-detalle-controles">
                <button
                  type="button"
                  onClick={disminuir}
                  disabled={cantidad <= 0.5}
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={18} />
                </button>

                <strong>
                  {cantidad.toLocaleString("es-AR")}
                </strong>

                <button
                  type="button"
                  onClick={aumentar}
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={18} />
                </button>

                <span>{producto.unidad}</span>
              </div>
            </div>

            <div className="valcri-detalle-total">
              <span>Total estimado</span>
              <strong>{formatoPrecio(total)}</strong>
            </div>

            <button
              type="button"
              className="valcri-detalle-agregar"
              onClick={agregarProducto}
            >
              <ShoppingCart size={20} />
              {agregado
                ? "Producto seleccionado ✓"
                : "Agregar al carrito"}
            </button>

            {agregado && (
              <p
                className="valcri-detalle-confirmacion"
                role="status"
              >
                Selección registrada para esta prueba.
                El carrito se conectará en la fase 3.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
