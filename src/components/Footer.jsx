import React from "react";
import { Link } from "react-router-dom";
import { Instagram, MapPin } from "lucide-react";
import { LOCAL } from "../config/local";
import "../styles/SeccionesHome.css";

export default function Footer() {
  return (
    <footer className="vc-footer" id="contacto">
      <div className="vc-contenedor vc-footer-grid">
        <div className="vc-footer-marca">
          <Link to="/" aria-label="VALCRI inicio">
            <img src="/images/logo-valcri.png" alt="VALCRI" />
          </Link>
          <p>Calidad en cada corte, comodidad en cada pedido.</p>
        </div>
        <div>
          <h3>Explorá</h3>
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/productos">Hacer un pedido</Link>
          {LOCAL.direccion && (
            <Link to="/#ubicacion">
              <MapPin size={14} /> Ubicación
            </Link>
          )}
        </div>
        <div>
          <h3>Tu compra</h3>
          <p>Elegí tus productos y armá tu carrito.</p>
          <p>Retiro y envíos: condiciones a confirmar.</p>
          <p>Pagos online: próximamente.</p>
        </div>
        <div>
          <h3>Contacto</h3>
          {LOCAL.direccion ? (
            <p>{LOCAL.direccion}</p>
          ) : (
            <p>Próximamente, datos del local.</p>
          )}
          {LOCAL.telefono && (
            <a href={`tel:${LOCAL.telefono.replace(/[^+\d]/g, "")}`}>
              {LOCAL.telefono}
            </a>
          )}
        </div>
      </div>
      <div className="vc-footer-inferior">
        <span>
          © {new Date().getFullYear()} VALCRI · Todos los derechos reservados.
        </span>
        <span>
          Desarrollado por{" "}
          <a
            href="https://www.instagram.com/pr.creativeagency/"
            target="_blank"
            rel="noopener noreferrer"
          >
            PR. Creative Agency <Instagram size={14} />
          </a>
        </span>
      </div>
    </footer>
  );
}
