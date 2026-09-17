const CLAVE_STORAGE = "usuarios";
const contenedorUsuario = document.getElementById('usuario-actual');

document.addEventListener('DOMContentLoaded', () => {

    // Función principal que decide qué mostrar en la pantalla
    function renderizarDashboard() {
        const usuarioGuardado = localStorage.getItem(CLAVE_STORAGE);

        if (!usuarioGuardado) {
            // 1. Mostrar el mensaje de bienvenida y ocultar los tableros
            document.getElementById('landing-tableros').classList.remove('oculto');
            document.getElementById('seccion-tableros').hidden = true;

            // 2. Poner el botón "Iniciar Sesión" en la barra morada
            contenedorUsuario.innerHTML = `
                <button id="btn-ir-login" class="btn-usuario">Iniciar Sesión</button>
            `;
            
            // 3. Darle la orden de viajar al login al hacer clic
            document.getElementById('btn-ir-login').addEventListener('click', () => {
                window.location.href = 'login.html';
            });

        } else {
            
            // 1. Ocultar el mensaje y mostrar los tableros de trabajo
            document.getElementById('landing-tableros').classList.add('oculto');
            document.getElementById('seccion-tableros').hidden = false;

            // 2. Poner el avatar y el botón "Cerrar Sesión" en la barra morada
            const inicial = usuarioGuardado.charAt(0).toUpperCase();
            contenedorUsuario.innerHTML = `
                <div class="avatar-usuario">${inicial}</div>
                <span class="usuario-nombre">Hola, ${usuarioGuardado}</span>
                <button id="btn-logout" class="btn-usuario">Cerrar Sesión</button>
            `;

            // 3. Lógica para Cerrar Sesión
            document.getElementById('btn-logout').addEventListener('click', () => {
                // Borramos los datos
                localStorage.removeItem(CLAVE_STORAGE);
                localStorage.removeItem("correo_sesion_activa"); 
                
                // Avisamos al sistema
                document.dispatchEvent(new CustomEvent("notificar", { 
                    detail: { mensaje: `Sesión cerrada` } 
                }));

                // Volvemos a dibujar la pantalla como Visitante (sin salir de index.html)
                renderizarDashboard();
            });
        }
    }

    // Ejecutamos la revisión apenas carga la página
    renderizarDashboard();
});