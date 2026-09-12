// Modulo Tarjetas - Persona B

const CLAVE_STORAGE_TARJETAS = "tarjetas";

function generarIdTarjeta() {
  return "tarjeta-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

function obtenerTarjetas() {
  const datos = localStorage.getItem(CLAVE_STORAGE_TARJETAS);
  return datos ? JSON.parse(datos) : [];
}

function guardarTarjetas(tarjetas) {
  localStorage.setItem(CLAVE_STORAGE_TARJETAS, JSON.stringify(tarjetas));
}