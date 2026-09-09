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
    item.dataset.id = tablero.id;

    const nombreSpan = document.createElement("span");
    nombreSpan.textContent = tablero.nombre;
    item.appendChild(nombreSpan);

    const botonRenombrar = document.createElement("button");
    botonRenombrar.textContent = "Renombrar";
    botonRenombrar.addEventListener("click", () => {
      const nuevoNombre = prompt("Nuevo nombre del tablero:", tablero.nombre);
      if (nuevoNombre !== null) {
        renombrarTablero(tablero.id, nuevoNombre);
      }
    });
    item.appendChild(botonRenombrar);

    lista.appendChild(item);
  });
}

function renombrarTablero(id, nuevoNombre) {
  const nombreLimpio = nuevoNombre.trim();
  if (!nombreLimpio) return;

  const tableros = obtenerTableros();
  const tablero = tableros.find((t) => t.id === id);
  if (!tablero) return;

  tablero.nombre = nombreLimpio;
  guardarTableros(tableros);
  renderizarListaTableros();
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
