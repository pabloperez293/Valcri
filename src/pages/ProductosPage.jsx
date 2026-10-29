
import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";

import { categorias, productos } from "../data/productos";
import "../styles/Catalogo.css";

const moneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

export default function ProductosPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoriaURL = searchParams.get("categoria");

  const categoriaActiva = categorias.some(
    (categoria) => categoria.id === categoriaURL
  )
    ? categoriaURL
    : "todos";

  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("popularidad");
  const [agregados, setAgregados] = useState([]);

  // Cambiar categoría y actualizar URL
  const seleccionarCategoria = (categoria) => {
    if (categoria === "todos") {
      setSearchParams({});
    } else {
      setSearchParams({ categoria });
    }
  };

  // Filtrado y ordenamiento
  const filtrados = useMemo(() => {
    const consulta = busqueda
      .trim()
      .toLocaleLowerCase("es-AR");

    const lista = productos.filter((producto) => {
      const coincideCategoria =
        categoriaActiva === "todos" ||
        producto.categoria === categoriaActiva;

      const coincideBusqueda = producto.nombre
        .toLocaleLowerCase("es-AR")
        .includes(consulta);

      return coincideCategoria && coincideBusqueda;
    });

    return [...lista].sort((a, b) => {
      if (orden === "precio-asc") {
        return a.precio - b.precio;
      }

      if (orden === "precio-desc") {
        return b.precio - a.precio;
      }

      if (orden === "nombre") {
        return a.nombre.localeCompare(b.nombre, "es");
      }

      return b.popularidad - a.popularidad;
    });
  }, [busqueda, categoriaActiva, orden]);

  // Confirmación visual temporal
  // Carrito real: fase 3
  const agregar = (producto) => {
    setAgregados((prev) =>
      prev.includes(producto.id)
        ? prev
        : [...prev, producto.id]
    );
  };

  return (
    <section
      id="productos"
      className="valcri-productos"
      aria-labelledby="titulo-productos"
    >
      {/* ENCABEZADO DEL CATÁLOGO */}

      <div className="valcri-catalogo-hero">
        <div className="valcri-catalogo-hero-inner">
          <h2 id="titulo-productos">
            Nuestros productos
          </h2>

          <p>
            Elegí tus cortes favoritos y hacé tu pedido online.
          </p>

          <label className="valcri-busqueda">
            <span className="sr-only">
              Buscar productos
            </span>

            <input
              type="search"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <Search size={21} aria-hidden="true" />
          </label>
        </div>
      </div>

      {/* CONTENIDO DEL CATÁLOGO */}

      <div className="valcri-catalogo-body">
        <aside
          className="valcri-filtros"
          aria-label="Filtrar por categoría"
        >
          <h3>Categorías</h3>

          <div className="valcri-filtros-lista">
            {[
              { id: "todos", nombre: "Todos" },
              ...categorias,
            ].map((categoria) => (
              <button
                type="button"
                key={categoria.id}
                className={
                  categoriaActiva === categoria.id
                    ? "seleccionada"
                    : ""
                }
                onClick={() =>
                  seleccionarCategoria(categoria.id)
                }
              >
                {categoria.nombre}
              </button>
            ))}
          </div>
        </aside>

        {/* PRODUCTOS */}

        <div className="valcri-productos-contenido">
          <div className="valcri-productos-toolbar">
            <span>{filtrados.length} productos</span>

            <label>
              Ordenar por

              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="popularidad">
                  Más populares
                </option>

                <option value="precio-asc">
                  Menor precio
                </option>

                <option value="precio-desc">
                  Mayor precio
                </option>

                <option value="nombre">
                  Nombre A-Z
                </option>
              </select>
            </label>
          </div>

          {filtrados.length === 0 ? (
            <p className="valcri-sin-resultados">
              No encontramos productos con esa búsqueda.
            </p>
          ) : (
            <div className="valcri-productos-grid">
              {filtrados.map((producto) => (
                <article
                  className="valcri-producto-card"
                  key={producto.id}
                >
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "/images/hero-carne.jpg";
                    }}
                  />

                  <h3>{producto.nombre}</h3>

                  <p className="valcri-producto-precio">
                    {moneda(producto.precio)}

                    <span>
                      {" "}/ {producto.unidad}
                    </span>
                  </p>

                  <button
                    type="button"
                    onClick={() => agregar(producto)}
                  >
                    <ShoppingCart size={17} />

                    {agregados.includes(producto.id)
                      ? "Agregado ✓"
                      : "Agregar"}
                  </button>
                </article>
              ))}
            </div>
          )}

          <p className="valcri-demo-nota">
            Productos y precios ilustrativos.
            El carrito y los pagos se conectarán
            en próximas fases.
          </p>
        </div>
      </div>
    </section>
  );
}
