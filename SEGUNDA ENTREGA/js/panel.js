// Obtiene el tipo de usuario desde sessionStorage o localStorage
const userType = sessionStorage.getItem("userType") || localStorage.getItem("userRole");

// Función para configurar la interfaz según el rol del usuario
function configureUserInterface() {
    const userTypeElement = document.getElementById("user-type");
    const welcomeMessage = document.getElementById("welcome-message");
    const manageEmployeesLink = document.getElementById("manage-employees-link");

    if (userType === "empleado") {
        userTypeElement.innerText = "Empleado";
        if (welcomeMessage) welcomeMessage.innerText = "Has iniciado sesión como empleado";
        if (manageEmployeesLink) manageEmployeesLink.style.display = "none"; // Ocultar "Registrar Empleados"
    } else if (userType === "admin") {
        userTypeElement.innerText = "Administrador";
        if (welcomeMessage) welcomeMessage.innerText = "Has iniciado sesión como administrador";
        if (manageEmployeesLink) manageEmployeesLink.style.display = "block";
    } else {
        // Redirige al login si el rol no está definido
        window.location.href = "login.html";
    }
}

// Ejecuta la configuración de la interfaz al cargar la página
document.addEventListener("DOMContentLoaded", configureUserInterface);

// Función de logout para limpiar los datos de la sesión y redirigir al login
function logout() {
    sessionStorage.clear();
    localStorage.removeItem("userRole");
    window.location.href = 'login.html';
}

// Agrega el evento de clic al botón de cierre de sesión
document.querySelector('.logout').addEventListener('click', (event) => {
    event.preventDefault();
    logout();
});