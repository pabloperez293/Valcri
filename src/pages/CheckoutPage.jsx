import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "../styles/Checkout.css";

const WHATSAPP = "5491160553769"; // Número publicado por VALCRI: 11 6055-3769
const moneda = (n) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 }).format(n);
// FRANJAS DE EJEMPLO: validar horarios reales con VALCRI antes de publicar.
const FRANJAS = ["09:00 a 11:00", "11:00 a 13:00", "16:00 a 18:00", "18:00 a 20:00"];
const fechaLocal = (fecha) => `${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2,"0")}-${String(fecha.getDate()).padStart(2,"0")}`;
const hoyLocal = () => fechaLocal(new Date());
const maxFecha = () => { const f = new Date(); f.setDate(f.getDate()+14); return fechaLocal(f); };
const fechaLegible = (valor) => valor ? new Date(`${valor}T12:00:00`).toLocaleDateString("es-AR", { weekday:"long", day:"numeric", month:"long", year:"numeric" }) : "";
const generarOrden = () => {
  const fecha = hoyLocal().replaceAll("-", "");
  const aleatorio = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()
    : Math.random().toString(36).slice(2, 10).toUpperCase();
  return `VAL-${fecha}-${aleatorio}`;
};
const inicio = { nombre: "", telefono: "", entrega: "retiro", direccion: "", localidad: "", referencia: "", pago: "coordinar", fecha: "", franja: "" };

export default function CheckoutPage() {
  const { items, total, setAbierto } = useCarrito();
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState(inicio);
  const [error, setError] = useState("");
  const [enlacePreparado, setEnlacePreparado] = useState(false);
  // Identificador estable para este intento de pedido. Se mantiene al actualizar.
  const [numeroOrden, setNumeroOrden] = useState(() => {
    try {
      const anterior = sessionStorage.getItem("valcri_orden_borrador");
      if (anterior) return anterior;
      const nuevo = generarOrden();
      sessionStorage.setItem("valcri_orden_borrador", nuevo);
      return nuevo;
    } catch { return generarOrden(); }
  });
  const cambiar = (campo, valor) => { setDatos(d => ({ ...d, [campo]: valor })); setError(""); setEnlacePreparado(false); };
  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, [paso]);
  const mensaje = useMemo(() => {
    const lineas = items.map((item, i) => `${i + 1}. ${item.nombre} — ${item.cantidad.toLocaleString("es-AR", { maximumFractionDigits: 2 })} ${item.unidad}\n   Preparación: ${item.presentacion}\n   Subtotal: ${moneda(item.cantidad * item.precioUnitario)}`);
    return ["Hola VALCRI, quisiera consultar y confirmar este pedido:", `Orden de referencia: ${numeroOrden}`, "", ...lineas, "", `TOTAL: ${moneda(total)}`, "", `Nombre: ${datos.nombre.trim()}`, `Teléfono: ${datos.telefono.trim()}`, `Modalidad: ${datos.entrega === "retiro" ? "Retiro en Gabino Ezeiza 8902" : "Entrega a domicilio (a coordinar)"}`, ...(datos.entrega === "envio" ? [`Dirección: ${datos.direccion.trim()}`, `Localidad: ${datos.localidad.trim()}`] : []), ...(datos.referencia.trim() ? [`Referencia: ${datos.referencia.trim()}`] : []), `Fecha solicitada: ${fechaLegible(datos.fecha)}`, `Franja solicitada: ${datos.franja}`, `Pago: ${datos.pago === "local" ? "En el local (a confirmar)" : "A coordinar con VALCRI"}`, "", "Quedo a la espera de confirmación de disponibilidad, importe final y entrega. Gracias."].join("\n");
  }, [items, total, datos, numeroOrden]);
  const avanzar = () => {
    if (paso === 1) {
      if (datos.nombre.trim().length < 2) return setError("Ingresá tu nombre.");
      if (datos.telefono.replace(/\D/g, "").length < 8) return setError("Ingresá un teléfono válido.");
    }
    if (paso === 2) {
      if (datos.entrega === "envio" && (!datos.direccion.trim() || !datos.localidad.trim())) return setError("Completá dirección y localidad para consultar el envío.");
      if (!datos.fecha || datos.fecha < hoyLocal() || datos.fecha > maxFecha()) return setError("Elegí una fecha válida dentro de los próximos 15 días.");
      if (!FRANJAS.includes(datos.franja)) return setError("Elegí una franja horaria.");
    }
    setError(""); setPaso(p => Math.min(4, p + 1));
  };
  const enviar = () => {
    if (!items.length) return;
    // Registro LOCAL para pruebas: NO se comparte con el administrador ni confirma recepción.
    try {
      const anteriores = JSON.parse(localStorage.getItem("valcri_pedidos_locales") || "[]");
      const orden = { numeroOrden, fechaRegistro: new Date().toISOString(), estado: "Borrador enviado a WhatsApp (sin confirmar)", datos, items, total };
      const sinDuplicado = Array.isArray(anteriores) ? anteriores.filter(p => p.numeroOrden !== numeroOrden) : [];
      localStorage.setItem("valcri_pedidos_locales", JSON.stringify([...sinDuplicado, orden]));
    } catch (error) { console.warn("No se pudo guardar el borrador local", error); }
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
      {paso === 2 && <><h2>¿Cómo querés recibirlo?</h2><label className="valcri-checkout-radio"><input type="radio" name="entrega" checked={datos.entrega === "retiro"} onChange={() => cambiar("entrega", "retiro")} /><span><strong>Retiro en el local</strong><small>Gabino Ezeiza 8902. Horario a coordinar.</small></span></label><label className="valcri-checkout-radio"><input type="radio" name="entrega" checked={datos.entrega === "envio"} onChange={() => cambiar("entrega", "envio")} /><span><strong>Consultar entrega a domicilio</strong><small>Sujeto a cobertura, costo y confirmación de VALCRI.</small></span></label>{datos.entrega === "envio" && <><label>Dirección <input value={datos.direccion} onChange={e => cambiar("direccion", e.target.value)} placeholder="Calle, número, piso" /></label><label>Localidad <input value={datos.localidad} onChange={e => cambiar("localidad", e.target.value)} placeholder="Localidad" /></label></>}
        <div className="valcri-checkout-agenda">
          <h3>Elegí cuándo lo necesitás</h3>
          <p>Fecha y horario solicitados, sujetos a confirmación por VALCRI.</p>
          <label>Fecha de {datos.entrega === "retiro" ? "retiro" : "entrega"}
            <input type="date" min={hoyLocal()} max={maxFecha()} value={datos.fecha} onChange={e => { cambiar("fecha", e.target.value); cambiar("franja", ""); }} />
          </label>
          <span className="valcri-checkout-agenda-etiqueta">Franja horaria</span>
          <div className="valcri-checkout-franjas">
            {FRANJAS.map(franja => <button type="button" key={franja} className={datos.franja === franja ? "seleccionada" : ""} onClick={() => cambiar("franja", franja)}>{franja}</button>)}
          </div>
          <small>Los horarios son de ejemplo y deben validarse con el comercio. No se bloquean turnos todavía.</small>
        </div>
        <label>Referencia de entrega o retiro (opcional) <textarea rows={2} maxLength={250} value={datos.referencia} onChange={e => cambiar("referencia", e.target.value)} placeholder="Ej.: prefiero retirar por la tarde" /></label></>}
      {paso === 3 && <><h2>Forma de pago</h2><p>VALCRI confirmará el medio de pago disponible antes de cobrarte.</p><label className="valcri-checkout-radio"><input type="radio" name="pago" checked={datos.pago === "coordinar"} onChange={() => cambiar("pago", "coordinar")} /><span><strong>Coordinar por WhatsApp</strong><small>Consultar medios de pago disponibles.</small></span></label><label className="valcri-checkout-radio"><input type="radio" name="pago" checked={datos.pago === "local"} onChange={() => cambiar("pago", "local")} /><span><strong>Consultar pago en el local</strong><small>Sujeto a confirmación del comercio.</small></span></label><p className="valcri-checkout-aclaracion">No se solicita información de tarjetas ni se procesa ningún cobro en esta página.</p></>}
      {paso === 4 && <><h2>Revisá tu pedido</h2><p className="valcri-checkout-orden"><strong>Número de referencia:</strong> {numeroOrden}</p><p><strong>Cliente:</strong> {datos.nombre} · {datos.telefono}</p><p><strong>Entrega:</strong> {datos.entrega === "retiro" ? "Retiro en local" : `Consultar envío a ${datos.direccion}, ${datos.localidad}`}</p><p><strong>Fecha solicitada:</strong> {fechaLegible(datos.fecha)} · {datos.franja}</p><p><strong>Pago:</strong> {datos.pago === "local" ? "Consultar en el local" : "A coordinar"}</p>{datos.referencia && <p><strong>Referencia:</strong> {datos.referencia}</p>}<p className="valcri-checkout-aclaracion">Al continuar se abrirá WhatsApp con tu pedido redactado. Para enviarlo deberás presionar Enviar dentro de WhatsApp. VALCRI tendrá que confirmarlo.</p></>}
      {error && <p className="valcri-checkout-error" role="alert">{error}</p>}
      {paso < 4 ? <button className="valcri-checkout-principal" type="button" onClick={avanzar}>Continuar</button> : <button className="valcri-checkout-principal" type="button" onClick={enviar}>Enviar pedido por WhatsApp</button>}
      {enlacePreparado && <p className="valcri-checkout-aclaracion" role="status">Se intentó abrir WhatsApp. La referencia quedó guardada en este navegador. Tu pedido todavía no está confirmado: verificá que lo hayas enviado y esperá la respuesta de VALCRI. El carrito permanece guardado.</p>}
    </div><aside className="valcri-checkout-resumen"><h2>Resumen de compra</h2>{items.map(item => <div className="valcri-checkout-item" key={`${item.productoId}::${item.presentacion}`}><div><strong>{item.nombre}</strong><small>{item.presentacion}</small><small>{item.cantidad.toLocaleString("es-AR", { maximumFractionDigits: 2 })} {item.unidad} × {moneda(item.precioUnitario)}</small></div><b>{moneda(item.cantidad * item.precioUnitario)}</b></div>)}<div className="valcri-checkout-total"><span>Total productos</span><strong>{moneda(total)}</strong></div><p>El costo de envío, si corresponde, no está incluido. VALCRI confirmará el importe final.</p><button type="button" onClick={() => { navigate("/productos"); setAbierto(true); }}>Editar carrito</button></aside></div>
  </section>;
}
