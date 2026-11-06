import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingCart,
  Store,
  Truck,
  CreditCard,
} from "lucide-react";
import "../styles/SeccionesHome.css";
export function BannerCompra() {
  return (
    <section className="vc-compra" aria-labelledby="vc-compra-titulo">
      <div className="vc-compra-foto">
        <img
          src="/images/hero-carne.jpg"
          alt="Cortes frescos seleccionados de VALCRI"
          loading="lazy"
        />
      </div>
      <div className="vc-compra-contenido">
        <Store size={34} strokeWidth={1.5} />
        <h2 id="vc-compra-titulo">
          Encargá online
          <br />y retirá en el local
        </h2>
        <p>
          Elegí tus cortes, armá tu pedido y preparate para retirar sin hacer
          fila. También estamos preparando la opción de envío a domicilio.
        </p>
        <Link to="/productos" className="vc-compra-boton">
          Empezar mi pedido <ArrowRight size={18} />
        </Link>
        <div className="vc-compra-beneficios">
          <span>
            <ShoppingCart size={17} /> Armá tu carrito
          </span>
          <span>
            <Truck size={17} /> Envíos próximamente
          </span>
          <span>
            <CreditCard size={17} /> Pagos online próximamente
          </span>
        </div>
      </div>
    </section>
  );
}
