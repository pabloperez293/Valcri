import React, { useEffect, useRef } from "react";
import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";
import { useCarrito } from "../context/CarritoContext";
import "../styles/CarritoLateral.css";

const moneda = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(n);

export default function CarritoLateral() {
  const {
    items,
    abierto,
    setAbierto,
    cambiarCantidad,
    eliminar,
    vaciar,
    total,
    claveItem,
  } = useCarrito();
  const cerrarRef = useRef(null);
  useEffect(() => {
    if (!abierto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cerrarRef.current?.focus();
    const escape = (e) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("keydown", escape);
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", escape);
    };
  }, [abierto, setAbierto]);

  if (!abierto) return null;
  return (
    <div
      className="valcri-carrito-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setAbierto(false);
      }}
    >
      <aside
        className="valcri-carrito-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="valcri-carrito-titulo"
      >
        <header className="valcri-carrito-header">
          <div>
            <h2 id="valcri-carrito-titulo">Tu carrito</h2>
            <p>
              {items.length} {items.length === 1 ? "producto" : "productos"}
            </p>
          </div>
          <button
            ref={cerrarRef}
            type="button"
            className="valcri-carrito-cerrar"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar carrito"
          >
            <X size={25} />
          </button>
        </header>
        <div className="valcri-carrito-lista">
          {items.length === 0 ? (
            <div className="valcri-carrito-vacio">
              <ShoppingBag size={45} />
              <p>Tu carrito está vacío.</p>
              <button type="button" onClick={() => setAbierto(false)}>
                Seguir comprando
              </button>
            </div>
          ) : (
            items.map((item) => {
              const clave = claveItem(item);
              const paso = item.unidad === "kg" ? 0.25 : 1;
              return (
                <article className="valcri-carrito-item" key={clave}>
                  <img src={item.imagen} alt="" loading="lazy" />
                  <div className="valcri-carrito-item-info">
                    <strong>{item.nombre}</strong>
                    <span>Preparación: {item.presentacion}</span>
                    <span>
                      {moneda(item.precioUnitario)} / {item.unidad}
                    </span>
                    <div className="valcri-carrito-item-controles">
                      <button
                        type="button"
                        disabled={item.cantidad <= paso}
                        onClick={() => cambiarCantidad(clave, -1)}
                        aria-label={`Disminuir ${item.nombre}`}
                      >
                        <Minus size={15} />
                      </button>
                      <output>
                        {item.cantidad.toLocaleString("es-AR", {
                          maximumFractionDigits: 2,
                        })}{" "}
                        {item.unidad}
                      </output>
                      <button
                        type="button"
                        onClick={() => cambiarCantidad(clave, 1)}
                        aria-label={`Aumentar ${item.nombre}`}
                      >
                        <Plus size={15} />
                      </button>
                      <button
                        type="button"
                        className="valcri-carrito-eliminar"
                        onClick={() => eliminar(clave)}
                        aria-label={`Eliminar ${item.nombre}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <b>{moneda(item.precioUnitario * item.cantidad)}</b>
                  </div>
                </article>
              );
            })
          )}
        </div>
        <footer className="valcri-carrito-footer">
          <div className="valcri-carrito-total">
            <span>Total</span>
            <strong>{moneda(total)}</strong>
          </div>
          <p>
            Los productos se preparan según la presentación elegida. El pago y
            el envío del pedido se habilitarán en la próxima fase.
          </p>
          <button
            className="valcri-carrito-continuar"
            type="button"
            onClick={() => setAbierto(false)}
          >
            Seguir comprando
          </button>
          {items.length > 0 && (
            <button
              className="valcri-carrito-vaciar"
              type="button"
              onClick={vaciar}
            >
              Vaciar carrito
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
}
