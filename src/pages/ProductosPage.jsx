import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import SelectorPresentacion from "../components/SelectorPresentacion";
import BarraCategorias from "../components/BarraCategorias";
import { useCarrito } from "../context/CarritoContext";
import { categorias, productos } from "../data/productos";
import "../styles/Catalogo.css";

const moneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

export default function ProductosPage({
  categoriaActiva: categoriaExterna,
  onSeleccionar,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { agregar } = useCarrito();
  const [orden, setOrden] = useState("popularidad");
  const busqueda = searchParams.get("buscar") || "";
  const categoriaURL = searchParams.get("categoria");
  const categoriaValida = (id) =>
    id === "todos" || categorias.some((categoria) => categoria.id === id);
  const categoriaActiva =
    categoriaExterna !== undefined
      ? categoriaExterna
      : categoriaValida(categoriaURL)
        ? categoriaURL
        : "todos";

  const seleccionarCategoria = (id) => {
    if (!categoriaValida(id)) return;
    if (typeof onSeleccionar === "function") onSeleccionar(id);
    setSearchParams((anteriores) => {
      const nuevos = new URLSearchParams(anteriores);
      if (id === "todos") nuevos.delete("categoria");
      else nuevos.set("categoria", id);
      return nuevos;
    });
  };
  const actualizarBusqueda = (texto) =>
    setSearchParams(
      (anteriores) => {
        const nuevos = new URLSearchParams(anteriores);
        if (texto) nuevos.set("buscar", texto);
        else nuevos.delete("buscar");
        return nuevos;
      },
      { replace: true },
    );

  const productosFiltrados = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase("es-AR");
    const lista = productos.filter(
      (producto) =>
        (categoriaActiva === "todos" ||
          producto.categoria === categoriaActiva) &&
        producto.nombre.toLocaleLowerCase("es-AR").includes(consulta),
    );
    return [...lista].sort((a, b) => {
      if (orden === "precio-asc")
        return (a.precio ?? Infinity) - (b.precio ?? Infinity);
      if (orden === "precio-desc")
        return (b.precio ?? -Infinity) - (a.precio ?? -Infinity);
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre, "es");
      return (b.popularidad ?? 0) - (a.popularidad ?? 0);
    });
  }, [busqueda, categoriaActiva, orden]);

  return (
    <section
      id="productos"
      className="valcri-productos"
      aria-labelledby="titulo-productos"
    >
      <div className="valcri-catalogo-hero">
        <div className="valcri-catalogo-hero-inner">
          <h2 id="titulo-productos">Nuestros productos</h2>
          <p>Elegí tus cortes favoritos y armá tu pedido online.</p>
          <label className="valcri-busqueda">
            <span className="sr-only">Buscar productos</span>
            <input
              type="search"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => actualizarBusqueda(e.target.value)}
            />
            <Search size={21} aria-hidden="true" />
          </label>
        </div>
      </div>
      <div
        className="valcri-catalogo-body"
        style={{ gridTemplateColumns: "minmax(0, 1fr)" }}
      >
        <div className="valcri-productos-contenido" style={{ minWidth: 0 }}>
          <BarraCategorias
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            onSeleccionar={seleccionarCategoria}
          />
          <div className="valcri-productos-toolbar">
            <span>{productosFiltrados.length} productos</span>
            <label>
              Ordenar por
              <select value={orden} onChange={(e) => setOrden(e.target.value)}>
                <option value="popularidad">Más populares</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
                <option value="nombre">Nombre A-Z</option>
              </select>
            </label>
          </div>
          {productosFiltrados.length === 0 ? (
            <p className="valcri-sin-resultados">
              No encontramos productos con esa búsqueda.
            </p>
          ) : (
            <div className="valcri-productos-grid">
              {productosFiltrados.map((producto) => (
                <article className="valcri-producto-card" key={producto.id}>
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/hero-carne.jpg";
                    }}
                  />
                  <h3>{producto.nombre}</h3>
                  <p className="valcri-producto-precio">
                    {producto.precio == null
                      ? "A confirmar"
                      : moneda(producto.precio)}
                    {producto.precio != null && (
                      <span> / {producto.unidad}</span>
                    )}
                  </p>
                  <SelectorPresentacion
                    producto={producto}
                    onSeleccionPreparada={agregar}
                  />
                </article>
              ))}
            </div>
          )}
          <p className="valcri-demo-nota">
            Precios proporcionados por VALCRI. Podés armar y modificar tu
            carrito; el envío de pedidos y los pagos estarán disponibles
            próximamente.
          </p>
        </div>
      </div>
    </section>
  );
}
