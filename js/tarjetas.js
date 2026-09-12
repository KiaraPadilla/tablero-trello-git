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

function crearTarjeta(idTablero, nombreColumna, texto) {
  const textoLimpio = texto.trim();
  if (!textoLimpio || !idTablero || !nombreColumna) return;

  const tarjetas = obtenerTarjetas();
  const nuevaTarjeta = {
    id: generarIdTarjeta(),
    idTablero: idTablero,
    nombreColumna: nombreColumna,
    texto: textoLimpio,
  };

  tarjetas.push(nuevaTarjeta);
  guardarTarjetas(tarjetas);
  renderizarTarjetas();
}

function renderizarTarjetas() {
  const contenedor = document.getElementById("columnas-tablero");
  if (!contenedor) return;

  const columnas = contenedor.querySelectorAll(".columna");

  columnas.forEach((columna) => {
    const contenedorExistente = columna.querySelector(".tarjetas-container");
    if (contenedorExistente) {
      contenedorExistente.remove();
    }
  });

  if (!idTableroSeleccionado) return;

  const tarjetas = obtenerTarjetas().filter(
    (t) => t.idTablero === idTableroSeleccionado
  );

  columnas.forEach((columna) => {
    const nombreColumna = columna.querySelector("h3").textContent;
    const tarjetasColumna = tarjetas.filter(
      (t) => t.nombreColumna === nombreColumna
    );

    const contenedorTarjetas = document.createElement("div");
    contenedorTarjetas.classList.add("tarjetas-container");

    tarjetasColumna.forEach((tarjeta) => {
      const tarjetaDiv = document.createElement("div");
      tarjetaDiv.classList.add("tarjeta");

      const textoP = document.createElement("p");
      textoP.classList.add("tarjeta-texto");
      textoP.textContent = tarjeta.texto;
      tarjetaDiv.appendChild(textoP);

      contenedorTarjetas.appendChild(tarjetaDiv);
    });

    const botonNueva = document.createElement("button");
    botonNueva.textContent = "+ Nueva tarjeta";
    botonNueva.addEventListener("click", () => {
      const texto = prompt(`Nueva tarjeta en "${nombreColumna}":`);
      if (texto !== null) {
        crearTarjeta(idTableroSeleccionado, nombreColumna, texto);
      }
    });
    contenedorTarjetas.appendChild(botonNueva);

    columna.appendChild(contenedorTarjetas);
  });
}