import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import SelectorPresentacion from "../components/SelectorPresentacion";
import { categorias, productos, preciosConfirmados } from "../data/productos";
import "../styles/Catalogo.css";

const moneda = (valor) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);

export default function Productos({
  categoriaActiva: categoriaExterna,
  onSeleccionar,
} = {}) {
  const [categoriaLocal, setCategoriaLocal] = useState("todos");
  const categoriaActiva = categoriaExterna ?? categoriaLocal;
  const seleccionarCategoria = (id) => {
    setCategoriaLocal(id);
    if (typeof onSeleccionar === "function") onSeleccionar(id);
  };
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("popularidad");
  const [seleccionesPrueba, setSeleccionesPrueba] = useState([]);

  const filtrados = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase("es-AR");

    const lista = productos.filter((producto) => {
      const coincideCategoria =
        categoriaActiva === "todos" || producto.categoria === categoriaActiva;

      const coincideBusqueda = producto.nombre
        .toLocaleLowerCase("es-AR")
        .includes(consulta);

      return coincideCategoria && coincideBusqueda;
    });

    return [...lista].sort((a, b) => {
      if (orden === "precio-asc") {
        return (a.precio ?? Infinity) - (b.precio ?? Infinity);
      }

      if (orden === "precio-desc") {
        return (b.precio ?? -Infinity) - (a.precio ?? -Infinity);
      }

      if (orden === "nombre") {
        return a.nombre.localeCompare(b.nombre, "es");
      }

      return b.popularidad - a.popularidad;
    });
  }, [busqueda, categoriaActiva, orden]);

  const guardarSeleccion = (seleccion) => {
    setSeleccionesPrueba((actuales) => [...actuales, seleccion]);
    // Solo estado temporal: el carrito real será una fase independiente.
  };

  return (
    <section
      id="productos"
      className="valcri-productos"
      aria-labelledby="titulo-productos"
    >
      <div className="valcri-catalogo-hero">
        <div className="valcri-catalogo-hero-inner">
          <h2 id="titulo-productos">Nuestros productos</h2>

          <p>Elegí tus cortes favoritos y hacé tu pedido online.</p>

          <label className="valcri-busqueda">
            <span className="sr-only">Buscar productos</span>

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

      <div className="valcri-catalogo-body">
        <aside className="valcri-filtros" aria-label="Filtrar por categoría">
          <h3>Categorías</h3>

          <div className="valcri-filtros-lista">
            {[{ id: "todos", nombre: "Todos" }, ...categorias].map(
              (categoria) => (
                <button
                  type="button"
                  key={categoria.id}
                  className={
                    categoriaActiva === categoria.id ? "seleccionada" : ""
                  }
                  onClick={() => seleccionarCategoria(categoria.id)}
                >
                  {categoria.nombre}
                </button>
              ),
            )}
          </div>
        </aside>

        <div className="valcri-productos-contenido">
          <div className="valcri-productos-toolbar">
            <span>{filtrados.length} productos</span>

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

          {filtrados.length === 0 ? (
            <p className="valcri-sin-resultados">
              No encontramos productos con esa búsqueda.
            </p>
          ) : (
            <div className="valcri-productos-grid">
              {filtrados.map((producto) => (
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
                    onSeleccionPreparada={guardarSeleccion}
                  />
                </article>
              ))}
            </div>
          )}

          <p className="valcri-demo-nota">
            Precios de referencia pendientes de confirmación por VALCRI. Las
            selecciones son pruebas y no generan pedidos. Confirmaremos los
            precios y las preparaciones con VALCRI antes de habilitar las
            compras.
          </p>
        </div>
      </div>
    </section>
  );
}
