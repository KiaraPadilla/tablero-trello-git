// Modulo Tableros - Persona A

const CLAVE_STORAGE_TABLEROS = "tableros";
const COLUMNAS_FIJAS = ["Por hacer", "En progreso", "Hecho"];

function generarIdTablero() {
  return "tablero-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

function obtenerTableros() {
  const datos = localStorage.getItem(CLAVE_STORAGE_TABLEROS);
  return datos ? JSON.parse(datos) : [];
}

function guardarTableros(tableros) {
  localStorage.setItem(CLAVE_STORAGE_TABLEROS, JSON.stringify(tableros));
}

function renderizarListaTableros() {
  const lista = document.getElementById("lista-tableros");
  if (!lista) return;

  const tableros = obtenerTableros();
  lista.innerHTML = "";

  tableros.forEach((tablero) => {
    const item = document.createElement("li");
    item.textContent = tablero.nombre;
    item.dataset.id = tablero.id;
    lista.appendChild(item);
  });
}

function crearTablero(nombre) {
  const nombreLimpio = nombre.trim();
  if (!nombreLimpio) return;

  const tableros = obtenerTableros();
  const nuevoTablero = {
    id: generarIdTablero(),
    nombre: nombreLimpio,
    columnas: COLUMNAS_FIJAS.map((nombreColumna) => ({
      nombre: nombreColumna,
      tarjetas: [],
    })),
  };

  tableros.push(nuevoTablero);
  guardarTableros(tableros);
  renderizarListaTableros();
}

function inicializarControlesCrearTablero() {
  const boton = document.getElementById("btn-crear-tablero");
  const input = document.getElementById("input-nombre-tablero");
  if (!boton || !input) return;

  boton.addEventListener("click", () => {
    crearTablero(input.value);
    input.value = "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarListaTableros();
  inicializarControlesCrearTablero();
});
