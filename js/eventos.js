// Importa las funciones necesarias de Firebase
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

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para cargar y mostrar los eventos desde Firebase
async function loadEvents() {
    const eventsContainer = document.getElementById('lista-conciertos');
    eventsContainer.innerHTML = "<h2>Próximos Eventos</h2>"; // Agrega un título básico para ver si funciona

    try {
        // Obtener los documentos de la colección "calendario"
        const querySnapshot = await getDocs(collection(db, "calendario"));

        // Iterar sobre cada documento y crear un elemento en HTML para mostrarlo
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const eventDiv = document.createElement("div");
            eventDiv.classList.add("concierto");

            eventDiv.innerHTML = `
                <h3>${data.fechaEvento} - ${data.ubicacionEvento}</h3>
                <h4><a href="${data.urlBoletos}" target="_blank">Comprar boletos</a></h4>
            `;
            eventsContainer.appendChild(eventDiv);
        });
    } catch (error) {
        console.error("Error al cargar los eventos:", error);
        eventsContainer.innerHTML = "<p>Error al cargar los eventos. Revisa la consola para más detalles.</p>";
    }
}

// Llama a la función para cargar los eventos cuando se cargue la página
window.addEventListener("DOMContentLoaded", loadEvents);
