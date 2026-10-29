// Opciones de preparación sugeridas. VALCRI debe validar cuáles ofrece.
const opciones = {
  enteros: [
    "En un trozo",
    "Cortado fino",
    "Cortado mediano",
    "Cortado grueso",
    "Pieza entera",
  ],
  picada: ["Picado 1 vez", "Picado 2 veces"],
  asado: ["Tira fina", "Tira mediana", "Tira gruesa", "En trozos"],
  matambre: ["Entero", "Cortado en porciones", "Desgrasado"],
  pollo: ["Entero", "Trozado", "Sin piel"],
  milanesa: ["Finas", "Medianas", "Gruesas"],
  chorizo: ["Sin preparación especial"],
  otros: ["Sin preparación especial"],
};
const porNombre = {
  Picada: "picada",
  Asado: "asado",
  Falda: "asado",
  Matambre: "matambre",
  "Pata y muslo": "pollo",
  "Milanesas de carne": "milanesa",
  "Milanesa de cerdo": "milanesa",
  "Milanesa de pollo": "milanesa",
  Chorizo: "chorizo",
};
export function opcionesPresentacion(producto) {
  if (producto.unidad !== "kg") return opciones.otros;
  if (porNombre[producto.nombre]) return opciones[porNombre[producto.nombre]];
  if (/hamburguesa/i.test(producto.nombre)) return opciones.otros;
  return opciones.enteros;
}
export function esPorPeso(producto) {
  return producto.unidad === "kg";
}
