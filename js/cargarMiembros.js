// Importa las funciones necesarias desde el SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBMFBsHFbVRw4JGPSkRtikTLQ54E38VGBM",
    authDomain: "proyecto-final-desarrolloweb.firebaseapp.com",
    projectId: "proyecto-final-desarrolloweb",
    storageBucket: "proyecto-final-desarrolloweb.appspot.com",
    messagingSenderId: "351365660285",
    appId: "1:351365660285:web:9e33adcde884fcaec23b14"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Contenedor para mostrar los miembros
const miembrosContainer = document.getElementById("miembros-container");

// Función para mostrar los miembros
async function mostrarMiembros() {
    miembrosContainer.innerHTML = ""; // Limpiar el contenedor

    try {
        const querySnapshot = await getDocs(collection(db, "miembros"));
        querySnapshot.forEach((doc) => {
            const miembro = doc.data();
            const miembroDiv = document.createElement("div");
            miembroDiv.classList.add("bloque");

            miembroDiv.innerHTML = `
                <img src="${miembro.imagenUrl}" alt="Imagen de ${miembro.nombre}">
                <h3>${miembro.nombre}</h3>
                <p><strong>Rol:</strong> ${miembro.rol}</p>
                <p><strong>Dato curioso:</strong> ${miembro.datoCurioso}</p>
            `;

            miembrosContainer.appendChild(miembroDiv);
        });
    } catch (error) {
        console.error("Error al cargar los miembros:", error);
        alert("Error al cargar los miembros. Verifique la conexión a Firebase.");
    }
}

// Llama a la función para mostrar los miembros al cargar la página
mostrarMiembros();
