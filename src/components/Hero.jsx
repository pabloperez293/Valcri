import React from "react";

import "../styles/Hero.css";


export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero-content">
        <h1>
          La mejor carne,
          <br />
          <span>todos los días.</span>
        </h1>
        <p>
          Cortes seleccionados, frescura garantizada
          <br className="desktop-break" /> y la calidad que nos distingue.
        </p>
        <a href="#productos" className="hero-button">
          Ver productos <span aria-hidden="true">→</span>
        </a>
      </div>
      <div
        className="hero-visual"
        role="img"
        aria-label="Cortes de carne fresca sobre una tabla de madera"
      />
    </section>
  );
}
