// Modulo Tableros - Persona A

const CLAVE_STORAGE_TABLEROS = "tableros";
const COLUMNAS_FIJAS = ["Por hacer", "En progreso", "Hecho"];

let idTableroSeleccionado = null;

function haySesionActiva() {
  // "usuarios" es la clave de localStorage del modulo Usuarios (Persona C).
  // Se usa el literal (no una constante compartida) para no chocar con la
  // declaracion global que ya existe en usuarios.js.
  return !!localStorage.getItem("usuarios");
}

function actualizarVisibilidadPorSesion() {
  const landing = document.getElementById("landing-tableros");
  const seccionTableros = document.getElementById("seccion-tableros");
  const seccionActivo = document.getElementById("seccion-tablero-activo");
  if (!landing || !seccionTableros || !seccionActivo) return;

  const sesionActiva = haySesionActiva();
  landing.hidden = sesionActiva;
  seccionTableros.hidden = !sesionActiva;
  seccionActivo.hidden = !sesionActiva;
}

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

    if (tablero.id === idTableroSeleccionado) {
      item.classList.add("tablero-activo");
    }

    const nombreSpan = document.createElement("span");
    nombreSpan.textContent = tablero.nombre;
    nombreSpan.classList.add("tablero-nombre");
    nombreSpan.addEventListener("click", () => seleccionarTablero(tablero.id));
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

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", () => {
      const confirmado = confirm(`¿Eliminar el tablero "${tablero.nombre}"?`);
      if (confirmado) {
        eliminarTablero(tablero.id);
      }
    });
    item.appendChild(botonEliminar);

    lista.appendChild(item);
  });
}

function eliminarTablero(id) {
  const tableros = obtenerTableros().filter((t) => t.id !== id);
  guardarTableros(tableros);

  if (idTableroSeleccionado === id) {
    idTableroSeleccionado = null;
  }

  renderizarListaTableros();
  renderizarColumnasTablero();
}

function seleccionarTablero(id) {
  idTableroSeleccionado = id;
  renderizarListaTableros();
  renderizarColumnasTablero();
}

function renderizarColumnasTablero() {
  const contenedor = document.getElementById("columnas-tablero");
  const titulo = document.getElementById("titulo-tablero-activo");
  if (!contenedor || !titulo) return;

  const tablero = obtenerTableros().find((t) => t.id === idTableroSeleccionado);
  contenedor.innerHTML = "";

  if (!tablero) {
    titulo.textContent = "";
    return;
  }

  titulo.textContent = tablero.nombre;

  tablero.columnas.forEach((columna) => {
    const columnaDiv = document.createElement("div");
    columnaDiv.classList.add("columna");

    const encabezado = document.createElement("h3");
    encabezado.textContent = columna.nombre;
    columnaDiv.appendChild(encabezado);

    contenedor.appendChild(columnaDiv);
  });

  renderizarTarjetas();
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
  renderizarColumnasTablero();
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
  idTableroSeleccionado = nuevoTablero.id;
  renderizarListaTableros();
  renderizarColumnasTablero();
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
  actualizarVisibilidadPorSesion();
  renderizarListaTableros();
  renderizarColumnasTablero();
  inicializarControlesCrearTablero();
});

// El modulo Usuarios dispara "notificar" al iniciar/cerrar sesion.
document.addEventListener("notificar", actualizarVisibilidadPorSesion);
