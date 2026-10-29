import React, { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import {
  esPorPeso,
  opcionesPresentacion,
} from "../data/SelectorPresentaciones";
import "../styles/SelectorPresentacion.css";

const formato = (n) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 2,
  }).format(n);

export default function SelectorPresentacion({
  producto,
  onSeleccionPreparada,
}) {
  const porPeso = esPorPeso(producto);
  const paso = porPeso ? 0.25 : 1;
  const opciones = opcionesPresentacion(producto);
  const [presentacion, setPresentacion] = useState("");
  const [cantidad, setCantidad] = useState(paso);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    setPresentacion("");
    setCantidad(paso);
    setMensaje("");
  }, [producto.id, paso]);

  const cambiarCantidad = (direccion) => {
    setCantidad((actual) =>
      Math.max(paso, Math.round((actual + direccion * paso) * 100) / 100),
    );
    setMensaje("");
  };

  const preparar = () => {
    if (!presentacion) {
      setMensaje("Elegí cómo querés que preparemos el producto.");
      return;
    }
    if (producto.precio == null) {
      setMensaje("Este producto todavía no tiene precio disponible.");
      return;
    }
    const seleccion = {
      productoId: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen,
      presentacion,
      cantidad,
      unidad: producto.unidad,
      precioReferencia: producto.precio,
      subtotalReferencia: Math.round(producto.precio * cantidad * 100) / 100,
      pendienteConfirmacion: false,
    };
    const resultado = onSeleccionPreparada?.(seleccion);
    setMensaje(
      resultado === false
        ? "No se pudo agregar este producto."
        : "¡Agregado al carrito!",
    );
  };

  return (
    <div className="valcri-preparacion" onClick={(e) => e.stopPropagation()}>
      <label
        className="valcri-preparacion-label"
        htmlFor={`preparacion-${producto.id}`}
      >
        Presentación
      </label>
      <select
        id={`preparacion-${producto.id}`}
        value={presentacion}
        onChange={(e) => {
          setPresentacion(e.target.value);
          setMensaje("");
        }}
        required
      >
        <option value="">Seleccionar preparación</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
      <span className="valcri-preparacion-label">
        Cantidad ({porPeso ? "kg" : producto.unidad})
      </span>
      <div className="valcri-preparacion-cantidad">
        <button
          type="button"
          aria-label={`Quitar ${paso} ${producto.unidad}`}
          disabled={cantidad <= paso}
          onClick={() => cambiarCantidad(-1)}
        >
          <Minus size={17} />
        </button>
        <output>
          {cantidad.toLocaleString("es-AR", { maximumFractionDigits: 2 })}
        </output>
        <button
          type="button"
          aria-label={`Agregar ${paso} ${producto.unidad}`}
          onClick={() => cambiarCantidad(1)}
        >
          <Plus size={17} />
        </button>
      </div>
      <small>
        Mínimo: {paso.toLocaleString("es-AR")} {producto.unidad}
      </small>
      <div className="valcri-preparacion-total">
        Total:{" "}
        <strong>
          {producto.precio == null
            ? "A confirmar"
            : formato(producto.precio * cantidad)}
        </strong>
      </div>
      <button
        type="button"
        className="valcri-preparacion-agregar"
        disabled={producto.precio == null}
        onClick={preparar}
      >
        Agregar al carrito
      </button>
      {mensaje && (
        <p role="status" className="valcri-preparacion-mensaje">
          {mensaje}
        </p>
      )}
    </div>
  );
}
