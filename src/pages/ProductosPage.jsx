
import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import SelectorPresentacion from "../components/SelectorPresentacion";
import BarraCategorias from "../components/BarraCategorias";

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

  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("popularidad");

  const [seleccionesPrueba, setSeleccionesPrueba] = useState([]);

  // ========================================
  // CATEGORÍAS
  // ========================================

  const categoriaURL = searchParams.get("categoria");

  const categoriaValida = (id) =>
    id === "todos" ||
    categorias.some((categoria) => categoria.id === id);

  const categoriaActiva =
    categoriaExterna !== undefined
      ? categoriaExterna
      : categoriaValida(categoriaURL)
        ? categoriaURL
        : "todos";

  const seleccionarCategoria = (id) => {
    if (!categoriaValida(id)) return;

    if (typeof onSeleccionar === "function") {
      onSeleccionar(id);
    }

    setSearchParams((anteriores) => {
      const nuevos = new URLSearchParams(anteriores);

      if (id === "todos") {
        nuevos.delete("categoria");
      } else {
        nuevos.set("categoria", id);
      }

      return nuevos;
    });
  };

  // ========================================
  // FILTRAR Y ORDENAR PRODUCTOS
  // ========================================

  const productosFiltrados = useMemo(() => {
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
        return (
          (a.precio ?? Infinity) -
          (b.precio ?? Infinity)
        );
      }

      if (orden === "precio-desc") {
        return (
          (b.precio ?? -Infinity) -
          (a.precio ?? -Infinity)
        );
      }

      if (orden === "nombre") {
        return a.nombre.localeCompare(
          b.nombre,
          "es"
        );
      }

      return (
        (b.popularidad ?? 0) -
        (a.popularidad ?? 0)
      );
    });
  }, [busqueda, categoriaActiva, orden]);

  // ========================================
  // SELECCIÓN DE PRODUCTOS
  // ========================================

  const guardarSeleccion = (seleccion) => {
    setSeleccionesPrueba((anteriores) => [
      ...anteriores,
      seleccion,
    ]);

    // Fase actual:
    // Selección temporal de prueba.
    // En fase 3 se conectará al carrito.
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <section
      id="productos"
      className="valcri-productos"
      aria-labelledby="titulo-productos"
    >
      {/* ENCABEZADO */}

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
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
            />

            <Search
              size={21}
              aria-hidden="true"
            />
          </label>
        </div>
      </div>

      {/* CUERPO DEL CATÁLOGO */}

      <div
        className="valcri-catalogo-body"
        style={{
          gridTemplateColumns: "minmax(0, 1fr)",
        }}
      >
        <div
          className="valcri-productos-contenido"
          style={{ minWidth: 0 }}
        >
          {/* NAVBAR HORIZONTAL DE CATEGORÍAS */}

          <BarraCategorias
            categorias={categorias}
            categoriaActiva={categoriaActiva}
            onSeleccionar={seleccionarCategoria}
          />

          {/* ORDENAMIENTO */}

          <div className="valcri-productos-toolbar">
            <span>
              {productosFiltrados.length} productos
            </span>

            <label>
              Ordenar por

              <select
                value={orden}
                onChange={(e) =>
                  setOrden(e.target.value)
                }
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

          {/* LISTADO DE PRODUCTOS */}

          {productosFiltrados.length === 0 ? (
            <p className="valcri-sin-resultados">
              No encontramos productos con esa búsqueda.
            </p>
          ) : (
            <div className="valcri-productos-grid">
              {productosFiltrados.map((producto) => (
                <article
                  className="valcri-producto-card"
                  key={producto.id}
                >
                  {/* IMAGEN */}

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

                  {/* NOMBRE */}

                  <h3>{producto.nombre}</h3>

                  {/* PRECIO */}

                  <p className="valcri-producto-precio">
                    {producto.precio == null
                      ? "A confirmar"
                      : moneda(producto.precio)}

                    {producto.precio != null && (
                      <span>
                        {" "}/ {producto.unidad}
                      </span>
                    )}
                  </p>

                  {/* PRESENTACIÓN Y CANTIDAD */}

                  <SelectorPresentacion
                    producto={producto}
                    onSeleccionPreparada={
                      guardarSeleccion
                    }
                  />
                </article>
              ))}
            </div>
          )}

          {/* AVISO DE PRECIOS */}

          <p className="valcri-demo-nota">
            Precios de referencia pendientes de
            confirmación por VALCRI. Las selecciones
            son pruebas y todavía no generan pedidos.
          </p>
        </div>
      </div>
    </section>
  );
}
