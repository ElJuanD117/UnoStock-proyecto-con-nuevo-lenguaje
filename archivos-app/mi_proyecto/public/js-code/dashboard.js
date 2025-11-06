function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const error = document.getElementById("loginError");

    if (user === "admin" && pass === "1234") {
        document.getElementById("loginSection").classList.add("hidden");
        document.getElementById("dashboardSection").classList.remove("hidden");
        document.body.classList.remove('fondo-on');
        error.textContent = "";
    } else {
        error.textContent = "Usuario o contraseña incorrectos";
    }
}

function logout() {
    document.getElementById("dashboardSection").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.body.classList.add('fondo-on');
}

function abrirModal() {
    // Asegurarse de que el formulario esté listo (limpio) y luego mostrar el overlay
    if (typeof mostrarFormulario === 'function') mostrarFormulario();
    document.getElementById("modal").style.display = "block";
}

function cerrarModal() {
    // Oculta el overlay completamente y vuelve a mostrar el formulario internamente
    document.getElementById("modal").style.display = "none";
    // Asegurarse de que el formulario esté visible la próxima vez que se abra
    const formulario = document.getElementById('formulario');
    if (formulario) formulario.style.display = 'block';
}

