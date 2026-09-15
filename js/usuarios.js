const CLAVE_STORAGE_USUARIOS = "usuarios";

document.addEventListener('DOMContentLoaded', () => {
    const contenedorUsuario = document.getElementById('usuario-actual');
    const usuarioGuardado = localStorage.getItem(CLAVE_STORAGE_USUARIOS);

    function renderizarUI(usuario) {
        if (usuario) {
            // Diseño cuando hay sesión iniciada
            contenedorUsuario.innerHTML = `
                <span class="usuario-nombre">👤 Hola, ${usuario}</span>
                <button id="btn-logout" class="btn-usuario">Cerrar Sesión</button>
            `;
            document.getElementById('btn-logout').addEventListener('click', cerrarSesion);
        } else {
            // Diseño del formulario de Login
            contenedorUsuario.innerHTML = `
                <input type="text" id="input-usuario" class="input-usuario" placeholder="Tu nombre...">
                <button id="btn-login" class="btn-usuario">Entrar</button>
            `;
            document.getElementById('btn-login').addEventListener('click', iniciarSesion);
        }
    }

    function iniciarSesion() {
        const nombreInput = document.getElementById('input-usuario').value.trim();
        
        if (nombreInput !== "") {
            localStorage.setItem(CLAVE_STORAGE_USUARIOS, nombreInput);
            renderizarUI(nombreInput);
            
            // Avisar al módulo de notificaciones
            document.dispatchEvent(new CustomEvent("notificar", { 
                detail: { mensaje: `Sesión iniciada: ${nombreInput}` } 
            }));
        } else {
            alert("Por favor, ingresa tu nombre.");
        }
    }

    function cerrarSesion() {
        localStorage.removeItem(CLAVE_STORAGE_USUARIOS);
        renderizarUI(null);
        
        // Avisar al módulo de notificaciones
        document.dispatchEvent(new CustomEvent("notificar", { 
            detail: { mensaje: `Sesión cerrada` } 
        }));
    }

    // Dibujar la interfaz inicial
    renderizarUI(usuarioGuardado);
});