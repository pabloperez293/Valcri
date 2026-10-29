
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../styles/Navbar.css";

const links = [
  { label: "Inicio", href: "/" },
  { label: "Productos", href: "/productos" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Contacto", href: "/#contacto" },
];

export default function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const navegar = (href) => {
    closeMenu();
    setSearchOpen(false);

    if (href.includes("#")) {
      const [ruta, hash] = href.split("#");

      navigate(ruta || "/");

      // Secciones pendientes de próximas fases
      window.requestAnimationFrame(() => {
        document
          .getElementById(hash)
          ?.scrollIntoView({ behavior: "smooth" });
      });
    }
  };

  const buscar = (event) => {
    event.preventDefault();

    setSearchOpen(false);
    setMenuOpen(false);

    navigate("/productos");

    // La búsqueda global se conectará al catálogo
    // en una fase posterior.
  };

  return (
    <header className="valcri-navbar">
      <div className="valcri-navbar-inner">
        {/* LOGO */}

        <Link
          to="/"
          className="valcri-brand"
          onClick={closeMenu}
          aria-label="VALCRI - Inicio"
        >
          <img
            src="/images/logo-valcri.png"
            alt="Carnicería VALCRI"
          />
        </Link>

        {/* MENÚ DESKTOP */}

        <nav
          className="valcri-desktop-nav"
          aria-label="Menú principal"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => navegar(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ICONOS */}

        <div className="valcri-navbar-actions">
          <button
            type="button"
            className="valcri-icon-button valcri-search-button"
            aria-label="Buscar productos"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
          </button>

          <button
            type="button"
            className="valcri-icon-button valcri-user-button"
            aria-label="Mi cuenta - Próximamente"
            title="Mi cuenta - Próximamente"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4.5 21c0-4.1 3.2-7 7.5-7s7.5 2.9 7.5 7" />
            </svg>
          </button>

          <button
            type="button"
            className="valcri-icon-button valcri-cart-button"
            aria-label="Carrito - Próximamente"
            title="Carrito - Próximamente"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 4h2l2.5 11.5h11L21 8H6" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
          </button>

          {/* BOTÓN MOBILE */}

          <button
            type="button"
            className={`valcri-menu-toggle ${
              menuOpen ? "active" : ""
            }`}
            onClick={() => {
              setMenuOpen(!menuOpen);
              setSearchOpen(false);
            }}
            aria-label={
              menuOpen ? "Cerrar menú" : "Abrir menú"
            }
            aria-expanded={menuOpen}
            aria-controls="valcri-mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* BUSCADOR */}

      {searchOpen && !menuOpen && (
        <form
          className="valcri-search-panel"
          onSubmit={buscar}
        >
          <input
            type="search"
            placeholder="Buscar cortes y productos..."
            aria-label="Buscar cortes y productos"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            autoFocus
          />

          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Cerrar búsqueda"
          >
            ✕
          </button>
        </form>
      )}

      {/* MENÚ MOBILE */}

      <div
        id="valcri-mobile-menu"
        className={`valcri-mobile-menu ${
          menuOpen ? "is-open" : ""
        }`}
        aria-hidden={!menuOpen}
        {...(!menuOpen ? { inert: "" } : {})}
      >
        <nav
          className="valcri-mobile-links"
          aria-label="Menú móvil"
        >
          {links.map((link, index) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => navegar(link.href)}
              style={{ "--link-index": index }}
              tabIndex={menuOpen ? 0 : -1}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="valcri-mobile-footer">
          CARNICERÍA VALCRI
        </div>
      </div>
    </header>
  );
}
