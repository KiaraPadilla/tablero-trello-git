// Modulo Tarjetas - Persona B

const CLAVE_STORAGE_TARJETAS = "tarjetas";

// Categorias disponibles para clasificar las tarjetas
const CATEGORIAS = [
  { nombre: "Trabajo", clase: "cat-trabajo" },
  { nombre: "Estudio", clase: "cat-estudio" },
  { nombre: "Personal", clase: "cat-personal" },
];

let filtroCategoriaActivo = "todas";

function claseCategoria(nombre) {
  const encontrada = CATEGORIAS.find((c) => c.nombre === nombre);
  return encontrada ? encontrada.clase : "";
}

function esCategoriaValida(nombre) {
  return CATEGORIAS.some((c) => c.nombre === nombre);
}

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

function crearTarjeta(idTablero, nombreColumna, texto, categoria) {
  const textoLimpio = texto.trim();
  if (!textoLimpio || !idTablero || !nombreColumna) return;

  const tarjetas = obtenerTarjetas();
  const nuevaTarjeta = {
    id: generarIdTarjeta(),
    idTablero: idTablero,
    nombreColumna: nombreColumna,
    texto: textoLimpio,
    categoria: esCategoriaValida(categoria) ? categoria : "",
  };

  tarjetas.push(nuevaTarjeta);
  guardarTarjetas(tarjetas);
  renderizarTarjetas();
}

function editarTarjeta(id, nuevoTexto) {
  const textoLimpio = nuevoTexto.trim();
  if (!textoLimpio) return;

  const tarjetas = obtenerTarjetas();
  const tarjeta = tarjetas.find((t) => t.id === id);
  if (!tarjeta) return;

  tarjeta.texto = textoLimpio;
  guardarTarjetas(tarjetas);
  renderizarTarjetas();
}

function cambiarCategoriaTarjeta(id, categoria) {
  if (categoria && !esCategoriaValida(categoria)) return;

  const tarjetas = obtenerTarjetas();
  const tarjeta = tarjetas.find((t) => t.id === id);
  if (!tarjeta) return;

  tarjeta.categoria = categoria || "";
  guardarTarjetas(tarjetas);
  renderizarTarjetas();
}

function eliminarTarjeta(id) {
  const tarjetas = obtenerTarjetas().filter((t) => t.id !== id);
  guardarTarjetas(tarjetas);
  renderizarTarjetas();
}

function moverTarjeta(id, nuevaColumna) {
  if (!COLUMNAS_FIJAS.includes(nuevaColumna)) return;

  const tarjetas = obtenerTarjetas();
  const tarjeta = tarjetas.find((t) => t.id === id);
  if (!tarjeta) return;

  tarjeta.nombreColumna = nuevaColumna;
  guardarTarjetas(tarjetas);
  renderizarTarjetas();
}

function inicializarFiltroCategorias() {
  const seccion = document.getElementById("seccion-tablero-activo");
  const columnas = document.getElementById("columnas-tablero");
  if (!seccion || !columnas) return;
  if (document.getElementById("filtro-categorias")) return;

  const barra = document.createElement("div");
  barra.id = "filtro-categorias";
  barra.classList.add("filtro-categorias");

  const label = document.createElement("label");
  label.setAttribute("for", "select-filtro-categoria");
  label.textContent = "Filtrar por categoría:";
  barra.appendChild(label);

  const select = document.createElement("select");
  select.id = "select-filtro-categoria";

  const opcionTodas = document.createElement("option");
  opcionTodas.value = "todas";
  opcionTodas.textContent = "Todas";
  select.appendChild(opcionTodas);

  CATEGORIAS.forEach((categoria) => {
    const opcion = document.createElement("option");
    opcion.value = categoria.nombre;
    opcion.textContent = categoria.nombre;
    select.appendChild(opcion);
  });

  select.value = filtroCategoriaActivo;
  select.addEventListener("change", () => {
    filtroCategoriaActivo = select.value;
    renderizarTarjetas();
  });
  barra.appendChild(select);

  seccion.insertBefore(barra, columnas);
}

function renderizarTarjetas() {
  inicializarFiltroCategorias();

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

  let tarjetas = obtenerTarjetas().filter(
    (t) => t.idTablero === idTableroSeleccionado
  );

  if (filtroCategoriaActivo !== "todas") {
    tarjetas = tarjetas.filter(
      (t) => (t.categoria || "") === filtroCategoriaActivo
    );
  }

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

      const categoriaActual = tarjeta.categoria || "";
      const selectCategoria = document.createElement("select");
      selectCategoria.classList.add("tarjeta-select-categoria");
      if (categoriaActual) selectCategoria.classList.add(claseCategoria(categoriaActual));

      const opcionSinCategoria = document.createElement("option");
      opcionSinCategoria.value = "";
      opcionSinCategoria.textContent = "Sin categoría";
      selectCategoria.appendChild(opcionSinCategoria);

      CATEGORIAS.forEach((categoria) => {
        const opcion = document.createElement("option");
        opcion.value = categoria.nombre;
        opcion.textContent = categoria.nombre;
        selectCategoria.appendChild(opcion);
      });

      selectCategoria.value = categoriaActual;
      selectCategoria.addEventListener("change", () => {
        cambiarCategoriaTarjeta(tarjeta.id, selectCategoria.value);
      });
      tarjetaDiv.appendChild(selectCategoria);

      const textoP = document.createElement("p");
      textoP.classList.add("tarjeta-texto");
      textoP.textContent = tarjeta.texto;
      tarjetaDiv.appendChild(textoP);

      const controles = document.createElement("div");
      controles.classList.add("tarjeta-controles");

      const botonEditar = document.createElement("button");
      botonEditar.textContent = "Editar";
      botonEditar.addEventListener("click", () => {
        const nuevoTexto = prompt("Editar tarjeta:", tarjeta.texto);
        if (nuevoTexto !== null) {
          editarTarjeta(tarjeta.id, nuevoTexto);
        }
      });
      controles.appendChild(botonEditar);

      const botonEliminar = document.createElement("button");
      botonEliminar.textContent = "Eliminar";
      botonEliminar.addEventListener("click", () => {
        const confirmado = confirm(`¿Eliminar la tarjeta "${tarjeta.texto}"?`);
        if (confirmado) {
          eliminarTarjeta(tarjeta.id);
        }
      });
      controles.appendChild(botonEliminar);

      const indiceColumna = COLUMNAS_FIJAS.indexOf(nombreColumna);
      if (indiceColumna > 0) {
        const botonAnterior = document.createElement("button");
        botonAnterior.textContent = "Columna anterior";
        botonAnterior.addEventListener("click", () => {
          moverTarjeta(tarjeta.id, COLUMNAS_FIJAS[indiceColumna - 1]);
        });
        controles.appendChild(botonAnterior);
      }

      if (indiceColumna >= 0 && indiceColumna < COLUMNAS_FIJAS.length - 1) {
        const botonSiguiente = document.createElement("button");
        botonSiguiente.textContent = "Columna siguiente";
        botonSiguiente.addEventListener("click", () => {
          moverTarjeta(tarjeta.id, COLUMNAS_FIJAS[indiceColumna + 1]);
        });
        controles.appendChild(botonSiguiente);
      }

      tarjetaDiv.appendChild(controles);

      contenedorTarjetas.appendChild(tarjetaDiv);
    });

    const selectNuevaCategoria = document.createElement("select");
    selectNuevaCategoria.classList.add("selector-nueva-categoria");
    CATEGORIAS.forEach((categoria) => {
      const opcion = document.createElement("option");
      opcion.value = categoria.nombre;
      opcion.textContent = categoria.nombre;
      selectNuevaCategoria.appendChild(opcion);
    });

    const botonNueva = document.createElement("button");
    botonNueva.textContent = "+ Nueva tarjeta";
    botonNueva.addEventListener("click", () => {
      const texto = prompt(`Nueva tarjeta en "${nombreColumna}":`);
      if (texto !== null) {
        crearTarjeta(
          idTableroSeleccionado,
          nombreColumna,
          texto,
          selectNuevaCategoria.value
        );
      }
    });

    const nuevaTarjetaControles = document.createElement("div");
    nuevaTarjetaControles.classList.add("nueva-tarjeta");
    nuevaTarjetaControles.appendChild(selectNuevaCategoria);
    nuevaTarjetaControles.appendChild(botonNueva);
    contenedorTarjetas.appendChild(nuevaTarjetaControles);

    columna.appendChild(contenedorTarjetas);
  });
}