import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const auth = getAuth();

document.getElementById("cerrarSesion").addEventListener("click", (e) => {
    e.preventDefault();
    
    // Muestra la ventana de confirmación
    const confirmar = confirm("¿Está seguro de que desea cerrar sesión?");
    
    // Si el usuario confirma, cierra la sesión y redirige a la página de inicio de sesión
    if (confirmar) {
        signOut(auth).then(() => {
            // Redirige a la pantalla de inicio de sesión después de cerrar sesión
            window.location.href = "login.html";
        }).catch((error) => {
            console.error("Error al cerrar sesión:", error);
            alert("Hubo un error al intentar cerrar sesión.");
        });
    }
});
