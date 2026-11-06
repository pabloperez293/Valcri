import React from "react";
import { MapPin, Navigation, Clock } from "lucide-react";
import { LOCAL } from "../config/local";
import "../styles/SeccionesHome.css";

export default function UbicacionLocal() {
  const direccion = LOCAL.direccion.trim();
  // Sin dirección real, no se muestra un mapa que pueda confundir al cliente.
  if (!direccion) return null;
  const busqueda = encodeURIComponent(direccion);
  return (
    <section
      className="vc-ubicacion"
      id="ubicacion"
      aria-labelledby="vc-ubicacion-titulo"
    >
      <div className="vc-contenedor vc-ubicacion-grid">
        <div className="vc-ubicacion-info">
          <span className="vc-eyebrow">Vení a visitarnos</span>
          <h2 id="vc-ubicacion-titulo">Encontranos en VALCRI</h2>
          <p>Hacé tu pedido online y pasá a retirarlo por nuestro local.</p>
          <div className="vc-ubicacion-dato">
            <MapPin size={22} />
            <span>{direccion}</span>
          </div>
          {LOCAL.horario && (
            <div className="vc-ubicacion-dato">
              <Clock size={22} />
              <span>{LOCAL.horario}</span>
            </div>
          )}
          <a
            className="vc-ubicacion-boton"
            href={`https://www.google.com/maps/search/?api=1&query=${busqueda}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Navigation size={18} /> Cómo llegar
          </a>
        </div>
        <div className="vc-ubicacion-mapa">
          <iframe
            title="Mapa de ubicación de VALCRI"
            src={`https://maps.google.com/maps?q=${busqueda}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
