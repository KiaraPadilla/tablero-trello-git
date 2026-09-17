const CLAVE_SESION_KIARA = "usuarios";
const CLAVE_BASE_DATOS = "db_usuarios_registrados";

document.addEventListener('DOMContentLoaded', () => {
    const vistaLogin = document.getElementById('vista-login');
    const vistaRegistro = document.getElementById('vista-registro');

    // Cambiar entre Login y Registro
    document.getElementById('link-ir-registro').addEventListener('click', (e) => {
        e.preventDefault();
        vistaLogin.classList.add('oculto');
        vistaRegistro.classList.remove('oculto');
    });

    document.getElementById('link-ir-login').addEventListener('click', (e) => {
        e.preventDefault();
        vistaRegistro.classList.add('oculto');
        vistaLogin.classList.remove('oculto');
    });

    // Lógica de Registro
    document.getElementById('btn-registrar').addEventListener('click', () => {
        const nombre = document.getElementById('reg-nombre').value.trim();
        const correo = document.getElementById('reg-correo').value.trim();
        const password = document.getElementById('reg-password').value.trim();

        if (!nombre || !correo || !password) {
            return alert(" Completa todos los campos.");
        }

        let usuariosDB = JSON.parse(localStorage.getItem(CLAVE_BASE_DATOS)) || [];
        if (usuariosDB.find(u => u.correo === correo)) {
            return alert(" Este correo ya está registrado.");
        }

        usuariosDB.push({ nombre, correo, password });
        localStorage.setItem(CLAVE_BASE_DATOS, JSON.stringify(usuariosDB));
        
        alert(" Registro exitoso. Ahora inicia sesión.");
        vistaRegistro.classList.add('oculto');
        vistaLogin.classList.remove('oculto');
    });

    // Lógica de Login y Redirección
    document.getElementById('btn-ingresar').addEventListener('click', () => {
        const correo = document.getElementById('login-correo').value.trim();
        const password = document.getElementById('login-password').value.trim();

        let usuariosDB = JSON.parse(localStorage.getItem(CLAVE_BASE_DATOS)) || [];
        const usuarioValido = usuariosDB.find(u => u.correo === correo && u.password === password);

        if (usuarioValido) {
            // Guardar sesión cumpliendo el contrato del equipo
            localStorage.setItem(CLAVE_SESION_KIARA, usuarioValido.nombre);
            localStorage.setItem("correo_sesion_activa", usuarioValido.correo);
            
            // REDIRIGIR AL SISTEMA PRINCIPAL
            window.location.href = 'index.html';
        } else {
            alert("❌ Correo o contraseña incorrectos.");
        }
    });
});
