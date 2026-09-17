(function () {
  const contenedor = document.getElementById("notificaciones");

  function detectarTipo(mensaje) {
    if (/sesi[oó]n/i.test(mensaje)) return "sesion";
    if (/movid/i.test(mensaje)) return "tarjeta";
    return "info";
  }

  function mostrar(mensaje) {
    if (!contenedor) return;

    const item = document.createElement("div");
    item.className = "notificacion notificacion--" + detectarTipo(mensaje);
    item.textContent = mensaje;

    contenedor.appendChild(item);

    setTimeout(() => {
      item.classList.add("notificacion-ocultar");
      setTimeout(() => item.remove(), 400);
    }, 3000);
  }

  function envolverAccion(nombre, obtenerMensaje) {
    const original = globalThis[nombre];
    if (typeof original !== "function") return;

    globalThis[nombre] = function (...args) {
      const resultado = original.apply(this, args);
      const mensaje = obtenerMensaje ? obtenerMensaje(...args) : null;
      if (mensaje) mostrar(mensaje);
      return resultado;
    };
  }

  function observarModuloTarjetas() {
    envolverAccion("crearTarjeta", (id, nombreColumna, texto) =>
      typeof texto === "string" && texto.trim() && id && nombreColumna
        ? `Tarjeta creada en ${nombreColumna}`
        : null
    );
    envolverAccion("editarTarjeta", (id, nuevoTexto) =>
      typeof nuevoTexto === "string" && nuevoTexto.trim()
        ? "Tarjeta editada"
        : null
    );
    envolverAccion("eliminarTarjeta", () => "Tarjeta eliminada");
    envolverAccion("moverTarjeta", (id, nuevaColumna) =>
      typeof nuevaColumna === "string" &&
      typeof COLUMNAS_FIJAS !== "undefined" &&
      COLUMNAS_FIJAS.includes(nuevaColumna)
        ? `Tarjeta movida a ${nuevaColumna}`
        : null
    );
  }

  document.addEventListener("notificar", function (evento) {
    if (evento.detail && evento.detail.mensaje) {
      mostrar(evento.detail.mensaje);
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observarModuloTarjetas);
  } else {
    observarModuloTarjetas();
  }
})();