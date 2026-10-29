import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CLAVE = "valcri-carrito-v1";
const CarritoContext = createContext(null);
const redondear = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const claveItem = (item) => `${item.productoId}::${item.presentacion}`;

function cargarCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE) || "[]");
    if (!Array.isArray(guardado)) return [];
    return guardado.filter(
      (item) =>
        item &&
        item.productoId != null &&
        typeof item.nombre === "string" &&
        typeof item.presentacion === "string" &&
        Number.isFinite(item.cantidad) &&
        item.cantidad > 0 &&
        Number.isFinite(item.precioUnitario) &&
        item.precioUnitario >= 0,
    );
  } catch {
    return [];
  }
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(cargarCarrito);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(items));
    } catch {
      /* Almacenamiento no disponible */
    }
  }, [items]);

  const agregar = useCallback((seleccion) => {
    const precio = Number(seleccion.precioReferencia);
    const cantidad = Number(seleccion.cantidad);
    if (
      seleccion.precioReferencia == null ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      !Number.isFinite(cantidad) ||
      cantidad <= 0 ||
      !seleccion.presentacion
    )
      return false;
    const nuevo = {
      productoId: seleccion.productoId,
      nombre: seleccion.nombre,
      imagen: seleccion.imagen,
      presentacion: seleccion.presentacion,
      unidad: seleccion.unidad,
      cantidad: redondear(cantidad),
      precioUnitario: precio,
      paso: seleccion.unidad === "kg" ? 0.25 : 1,
    };
    setItems((actuales) => {
      const clave = claveItem(nuevo);
      const existe = actuales.some((item) => claveItem(item) === clave);
      return existe
        ? actuales.map((item) =>
            claveItem(item) === clave
              ? {
                  ...item,
                  cantidad: redondear(item.cantidad + nuevo.cantidad),
                  precioUnitario: precio,
                }
              : item,
          )
        : [...actuales, nuevo];
    });
    setAbierto(true);
    return true;
  }, []);

  const cambiarCantidad = useCallback((clave, direccion) => {
    setItems((actuales) =>
      actuales.map((item) => {
        if (claveItem(item) !== clave) return item;
        const paso = item.unidad === "kg" ? 0.25 : 1;
        return {
          ...item,
          paso,
          cantidad: Math.max(paso, redondear(item.cantidad + direccion * paso)),
        };
      }),
    );
  }, []);
  const eliminar = useCallback(
    (clave) =>
      setItems((actuales) =>
        actuales.filter((item) => claveItem(item) !== clave),
      ),
    [],
  );
  const vaciar = useCallback(() => setItems([]), []);
  const total = useMemo(
    () =>
      redondear(
        items.reduce((s, item) => s + item.precioUnitario * item.cantidad, 0),
      ),
    [items],
  );
  const cantidadArticulos = items.length;
  const valor = useMemo(
    () => ({
      items,
      abierto,
      setAbierto,
      agregar,
      cambiarCantidad,
      eliminar,
      vaciar,
      total,
      cantidadArticulos,
      claveItem,
    }),
    [
      items,
      abierto,
      agregar,
      cambiarCantidad,
      eliminar,
      vaciar,
      total,
      cantidadArticulos,
    ],
  );
  return (
    <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
  );
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);
  if (!contexto)
    throw new Error("useCarrito debe utilizarse dentro de CarritoProvider");
  return contexto;
}
