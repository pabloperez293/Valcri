import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "../styles/CheckoutPage.css";

const WHATSAPP = "5491160553769"; // Número publicado por VALCRI: 11 6055-3769
const moneda = (n) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 }).format(n);
const inicio = { nombre: "", telefono: "", entrega: "retiro", direccion: "", localidad: "", referencia: "", pago: "coordinar" };

export default function CheckoutPage() {
  const { items, total, setAbierto } = useCarrito();
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState(inicio);
  const [error, setError] = useState("");
  const [enlacePreparado, setEnlacePreparado] = useState(false);
  const cambiar = (campo, valor) => { setDatos(d => ({ ...d, [campo]: valor })); setError(""); setEnlacePreparado(false); };
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [paso]);
  const mensaje = useMemo(() => {
    const lineas = items.map((item, i) => `${i + 1}. ${item.nombre} — ${item.cantidad.toLocaleString("es-AR", { maximumFractionDigits: 2 })} ${item.unidad}\n   Preparación: ${item.presentacion}\n   Subtotal: ${moneda(item.cantidad * item.precioUnitario)}`);
    return ["Hola VALCRI, quisiera consultar y confirmar este pedido:", "", ...lineas, "", `TOTAL: ${moneda(total)}`, "", `Nombre: ${datos.nombre.trim()}`, `Teléfono: ${datos.telefono.trim()}`, `Modalidad: ${datos.entrega === "retiro" ? "Retiro en Gabino Ezeiza 8902" : "Entrega a domicilio (a coordinar)"}`, ...(datos.entrega === "envio" ? [`Dirección: ${datos.direccion.trim()}`, `Localidad: ${datos.localidad.trim()}`] : []), ...(datos.referencia.trim() ? [`Referencia: ${datos.referencia.trim()}`] : []), `Pago: ${datos.pago === "local" ? "En el local (a confirmar)" : "A coordinar con VALCRI"}`, "", "Quedo a la espera de confirmación de disponibilidad, importe final y entrega. Gracias."].join("\n");
  }, [items, total, datos]);
  const avanzar = () => {
    if (paso === 1) {
      if (datos.nombre.trim().length < 2) return setError("Ingresá tu nombre.");
      if (datos.telefono.replace(/\D/g, "").length < 8) return setError("Ingresá un teléfono válido.");
    }
    if (paso === 2 && datos.entrega === "envio" && (!datos.direccion.trim() || !datos.localidad.trim())) return setError("Completá dirección y localidad para consultar el envío.");
    setError(""); setPaso(p => Math.min(4, p + 1));
  };
  const enviar = () => {
    if (!items.length) return;
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    // Abrir WhatsApp no equivale a que el pedido haya sido recibido o aceptado.
    const ventana = window.open(url, "_blank", "noopener,noreferrer");
    if (!ventana) window.location.href = url;
    setEnlacePreparado(true);
  };
  if (!items.length) return <section className="valcri-checkout valcri-checkout-vacio"><h1>Tu carrito está vacío</h1><p>Elegí tus productos para preparar un pedido.</p><Link to="/productos">Ver productos</Link></section>;
  return <section className="valcri-checkout">
    <div className="valcri-checkout-top"><button type="button" onClick={() => { if (paso > 1) setPaso(p => p - 1); else navigate("/productos"); }}>← Volver</button><span>Paso {paso} de 4</span></div>
    <h1>Finalizar pedido</h1><p className="valcri-checkout-intro">Completá tus datos y enviá tu pedido por WhatsApp para que VALCRI confirme disponibilidad y entrega.</p>
    <ol className="valcri-checkout-pasos">{["Tus datos", "Entrega", "Pago", "Revisar"].map((etapa, i) => <li key={etapa} className={paso === i + 1 ? "activo" : paso > i + 1 ? "listo" : ""}>{i + 1}. {etapa}</li>)}</ol>
    <div className="valcri-checkout-layout"><div className="valcri-checkout-formulario">
      {paso === 1 && <><h2>Tus datos</h2><label>Nombre y apellido <input required autoComplete="name" value={datos.nombre} onChange={e => cambiar("nombre", e.target.value)} placeholder="Nombre completo" /></label><label>Teléfono de contacto <input required type="tel" autoComplete="tel" value={datos.telefono} onChange={e => cambiar("telefono", e.target.value)} placeholder="Ej.: 11 1234 5678" /></label></>}
      {paso === 2 && <><h2>¿Cómo querés recibirlo?</h2><label className="valcri-checkout-radio"><input type="radio" name="entrega" checked={datos.entrega === "retiro"} onChange={() => cambiar("entrega", "retiro")} /><span><strong>Retiro en el local</strong><small>Gabino Ezeiza 8902. Horario a coordinar.</small></span></label><label className="valcri-checkout-radio"><input type="radio" name="entrega" checked={datos.entrega === "envio"} onChange={() => cambiar("entrega", "envio")} /><span><strong>Consultar entrega a domicilio</strong><small>Sujeto a cobertura, costo y confirmación de VALCRI.</small></span></label>{datos.entrega === "envio" && <><label>Dirección <input value={datos.direccion} onChange={e => cambiar("direccion", e.target.value)} placeholder="Calle, número, piso" /></label><label>Localidad <input value={datos.localidad} onChange={e => cambiar("localidad", e.target.value)} placeholder="Localidad" /></label></>}<label>Referencia de entrega o retiro (opcional) <textarea rows={2} maxLength={250} value={datos.referencia} onChange={e => cambiar("referencia", e.target.value)} placeholder="Ej.: prefiero retirar por la tarde" /></label></>}
      {paso === 3 && <><h2>Forma de pago</h2><p>VALCRI confirmará el medio de pago disponible antes de cobrarte.</p><label className="valcri-checkout-radio"><input type="radio" name="pago" checked={datos.pago === "coordinar"} onChange={() => cambiar("pago", "coordinar")} /><span><strong>Coordinar por WhatsApp</strong><small>Consultar medios de pago disponibles.</small></span></label><label className="valcri-checkout-radio"><input type="radio" name="pago" checked={datos.pago === "local"} onChange={() => cambiar("pago", "local")} /><span><strong>Consultar pago en el local</strong><small>Sujeto a confirmación del comercio.</small></span></label><p className="valcri-checkout-aclaracion">No se solicita información de tarjetas ni se procesa ningún cobro en esta página.</p></>}
      {paso === 4 && <><h2>Revisá tu pedido</h2><p><strong>Cliente:</strong> {datos.nombre} · {datos.telefono}</p><p><strong>Entrega:</strong> {datos.entrega === "retiro" ? "Retiro en local" : `Consultar envío a ${datos.direccion}, ${datos.localidad}`}</p><p><strong>Pago:</strong> {datos.pago === "local" ? "Consultar en el local" : "A coordinar"}</p>{datos.referencia && <p><strong>Referencia:</strong> {datos.referencia}</p>}<p className="valcri-checkout-aclaracion">Al continuar se abrirá WhatsApp con tu pedido redactado. Para enviarlo deberás presionar Enviar dentro de WhatsApp. VALCRI tendrá que confirmarlo.</p>}</>}
      {error && <p className="valcri-checkout-error" role="alert">{error}</p>}
      {paso < 4 ? <button className="valcri-checkout-principal" type="button" onClick={avanzar}>Continuar</button> : <button className="valcri-checkout-principal" type="button" onClick={enviar}>Enviar pedido por WhatsApp</button>}
      {enlacePreparado && <p className="valcri-checkout-aclaracion" role="status">Se intentó abrir WhatsApp. Tu pedido todavía no está confirmado: verificá que lo hayas enviado y esperá la respuesta de VALCRI. El carrito permanece guardado.</p>}
    </div><aside className="valcri-checkout-resumen"><h2>Resumen de compra</h2>{items.map(item => <div className="valcri-checkout-item" key={`${item.productoId}::${item.presentacion}`}><div><strong>{item.nombre}</strong><small>{item.presentacion}</small><small>{item.cantidad.toLocaleString("es-AR", { maximumFractionDigits: 2 })} {item.unidad} × {moneda(item.precioUnitario)}</small></div><b>{moneda(item.cantidad * item.precioUnitario)}</b></div>)}<div className="valcri-checkout-total"><span>Total productos</span><strong>{moneda(total)}</strong></div><p>El costo de envío, si corresponde, no está incluido. VALCRI confirmará el importe final.</p><button type="button" onClick={() => { navigate("/productos"); setAbierto(true); }}>Editar carrito</button></aside></div>
  </section>;
}
