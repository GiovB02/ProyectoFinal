// Obtener el tipo de usuario desde sessionStorage
const userType = sessionStorage.getItem("userType");

// Actualizar el título y la bienvenida dependiendo del tipo de usuario
if (userType === "empleado") {
    document.getElementById("user-type").innerText = "Empleado";
    document.getElementById("welcome-message").innerText = "Has iniciado sesión como empleado";
    document.getElementById("manage-employees-link").style.display = "none"; // Ocultar "Registrar Empleados"
} else if (userType === "admin") {
    document.getElementById("user-type").innerText = "Administrador";
    document.getElementById("welcome-message").innerText = "Has iniciado sesión como administrador";
}

// Añadir un evento de cierre de sesión para limpiar sessionStorage
document.querySelector(".logout").addEventListener("click", () => {
    sessionStorage.removeItem("userType");
});
