// Modulo Tableros - Persona A

const CLAVE_STORAGE_TABLEROS = "tableros";

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

document.addEventListener("DOMContentLoaded", renderizarListaTableros);
