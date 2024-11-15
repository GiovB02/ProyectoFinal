// Importa las funciones necesarias desde el SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const auth = getAuth(app);

// Función para establecer el rol de usuario en localStorage y sessionStorage
function setUserRole(role) {
    localStorage.setItem("userRole", role); // Guarda el rol en localStorage
    sessionStorage.setItem("userType", role); // Guarda el rol en sessionStorage para la sesión actual
}

// inicio de sesión
document.getElementById('formularioLogin').addEventListener('submit', async function(event) {
    event.preventDefault();

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    try {
        const adminQuery = query(collection(db, "admin"), where("email", "==", correo), where("password", "==", contrasena));
        const adminSnapshot = await getDocs(adminQuery);

        if (!adminSnapshot.empty) {
            setUserRole("admin"); 
            alert("Inicio de sesión exitoso como administrador.");
            window.location.href = 'index.html';
            return;
        }

        
        const userCredential = await signInWithEmailAndPassword(auth, correo, contrasena);
        const user = userCredential.user;

        const empleadosQuery = query(collection(db, "empleados"), where("correo", "==", correo));
        const empleadosSnapshot = await getDocs(empleadosQuery);

        if (!empleadosSnapshot.empty) {
            
            setUserRole("empleado"); 
            alert("Inicio de sesión exitoso como empleado.");
            window.location.href = 'index.html';
        } else {
            alert("No se encontraron permisos suficientes. Contacte con el administrador.");
        }

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Ocurrió un error al intentar iniciar sesión. Por favor, ingrese credenciales válidas.");
    }
});