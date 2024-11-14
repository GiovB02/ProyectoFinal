import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBMFBsHFbVRw4JGPSkRtikTLQ54E38VGBM",
    authDomain: "proyecto-final-desarrolloweb.firebaseapp.com",
    projectId: "proyecto-final-desarrolloweb",
    storageBucket: "proyecto-final-desarrolloweb.appspot.com",
    messagingSenderId: "351365660285",
    appId: "1:351365660285:web:9e33adcde884fcaec23b14"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lógica de inicio de sesión
document.getElementById('formularioLogin').addEventListener('submit', async function(event) {
    event.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    try {
        // Consulta Firestore para verificar el correo y la contraseña
        const adminRef = collection(db, "admin");
        const q = query(adminRef, where("email", "==", correo), where("password", "==", contrasena));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert("Inicio de sesión exitoso.");
            window.location.href = 'Index.html';
        } else {
            alert("Credenciales inválidas. Por favor, intenta de nuevo.");
        }
    } catch (error) {
        console.error("Error al verificar el administrador:", error); // Detalle de error en consola
        alert("Ocurrió un error al intentar iniciar sesión. Por favor, intenta más tarde.");
    }
});
