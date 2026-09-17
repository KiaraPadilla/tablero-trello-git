(function () {
  let modalActual = null;

  function crearOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-dialogo" role="dialog" aria-modal="true">
        <h3 class="modal-titulo"></h3>
        <p class="modal-mensaje"></p>
        <div class="modal-campo">
          <input type="text" class="modal-input" autocomplete="off" />
        </div>
        <div class="modal-acciones">
          <button type="button" class="modal-boton modal-boton-cancelar">Cancelar</button>
          <button type="button" class="modal-boton modal-boton-aceptar">Aceptar</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function abrir({ titulo, mensaje, valorInicial, textoAceptar, textoCancelar, tipo }) {
    const esPrompt = tipo === "prompt";
    let resolverFinal = null;

    const promise = new Promise((resolve) => {
      resolverFinal = resolve;
    });

    const overlay = crearOverlay();
    const tituloEl = overlay.querySelector(".modal-titulo");
    const mensajeEl = overlay.querySelector(".modal-mensaje");
    const campo = overlay.querySelector(".modal-campo");
    const input = overlay.querySelector(".modal-input");
    const botonAceptar = overlay.querySelector(".modal-boton-aceptar");
    const botonCancelar = overlay.querySelector(".modal-boton-cancelar");
    const elementoAnterior = document.activeElement;

    tituloEl.textContent = titulo || (esPrompt ? "Ingresa un dato" : "Confirmación");
    mensajeEl.textContent = mensaje || "";
    mensajeEl.hidden = !mensaje;

    if (esPrompt) {
      input.value = typeof valorInicial === "string" ? valorInicial : "";
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          resolver(true);
        }
      });
    } else {
      campo.hidden = true;
    }

    botonAceptar.textContent = textoAceptar || "Aceptar";
    botonCancelar.textContent = textoCancelar || "Cancelar";

    function cerrar() {
      if (!modalActual) return;
      modalActual = null;
      document.removeEventListener("keydown", manejarTecla);
      overlay.classList.remove("modal-entra");
      overlay.addEventListener("transitionend", () => overlay.remove(), { once: true });
      setTimeout(() => overlay.remove(), 400);
      if (elementoAnterior && typeof elementoAnterior.focus === "function") {
        elementoAnterior.focus();
      }
    }

    function resolver(aceptar) {
      if (!modalActual) return;

      if (esPrompt && aceptar && !input.value.trim()) {
        input.classList.add("modal-input-error");
        setTimeout(() => input.classList.remove("modal-input-error"), 600);
        input.focus();
        return;
      }

      const resultado = esPrompt ? (aceptar ? input.value.trim() : null) : aceptar;
      cerrar();
      resolverFinal(resultado);
    }

    function manejarTecla(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        resolver(false);
      }
    }

    botonAceptar.addEventListener("click", () => resolver(true));
    botonCancelar.addEventListener("click", () => resolver(false));
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) resolver(false);
    });
    document.addEventListener("keydown", manejarTecla);

    modalActual = overlay;
    requestAnimationFrame(() => {
      overlay.classList.add("modal-entra");
      if (esPrompt) input.select();
      input.focus();
    });

    return promise;
  }

  window.mostrarPrompt = function (opciones) {
    if (modalActual) return Promise.resolve(null);
    return abrir({ tipo: "prompt", ...(opciones || {}) });
  };

  window.mostrarConfirmacion = function (opciones) {
    if (modalActual) return Promise.resolve(false);
    return abrir({ tipo: "confirm", ...(opciones || {}) });
  };
})();