(function () {
  const contenedor = document.getElementById("notificaciones");

  function mostrar(mensaje) {
    if (!contenedor) return;

    const item = document.createElement("div");
    item.className = "notificacion";
    item.textContent = mensaje;

    contenedor.appendChild(item);

    setTimeout(() => {
      item.classList.add("notificacion-ocultar");
      setTimeout(() => item.remove(), 400);
    }, 3000);
  }

  document.addEventListener("notificar", function (evento) {
    if (evento.detail && evento.detail.mensaje) {
      mostrar(evento.detail.mensaje);
    }
  });
})();