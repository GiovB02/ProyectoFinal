// Importa las funciones necesarias desde el SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, orderBy, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// Muestra el formulario de agregar evento y oculta la lista de eventos
window.showEventForm = function() {
    document.getElementById("eventForm").style.display = "block";
    document.getElementById("eventList").style.display = "none";
}

// Muestra la lista de eventos y oculta el formulario
window.showEventList = function() {
    document.getElementById("eventForm").style.display = "none";
    document.getElementById("eventList").style.display = "block";
    loadEvents();
}

// Guarda el evento en Firebase
document.getElementById("eventForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const eventDate = document.getElementById("eventDate").value;
    const eventLocation = document.getElementById("eventLocation").value;
    const eventUrl = document.getElementById("eventUrl").value;

    try {
        await addDoc(collection(db, "calendario"), {
            fechaEvento: eventDate,
            ubicacionEvento: eventLocation,
            urlBoletos: eventUrl
        });

        alert("Evento guardado correctamente en Firebase");
        document.getElementById("eventForm").reset();
        showEventList();
    } catch (error) {
        console.error("Error al guardar el evento: ", error);
    }
});

// Carga la lista de eventos desde Firebase y los ordena por fecha
async function loadEvents() {
    const eventsQuery = query(collection(db, "calendario"), orderBy("fechaEvento"));
    const querySnapshot = await getDocs(eventsQuery);
    const eventListDiv = document.getElementById("eventList");
    eventListDiv.innerHTML = "<h2>Eventos Existentes</h2>";

    querySnapshot.forEach((docSnapshot) => {
        const event = docSnapshot.data();
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event-card");
        eventDiv.innerHTML = `
            <div class="event-info">
                <h3>${event.ubicacionEvento}</h3>
                <p>Fecha: ${event.fechaEvento}</p>
                <p><a href="${event.urlBoletos}" target="_blank">Comprar Boletos</a></p>
                <button onclick="openEditModal('${docSnapshot.id}')">Editar</button>
            </div>
        `;
        eventListDiv.appendChild(eventDiv);
    });
}

// Abre la ventana modal para editar un evento específico
window.openEditModal = async function(eventId) {
    try {
        const modal = document.getElementById("editModal");
        const eventDocRef = doc(db, "calendario", eventId);
        const eventSnapshot = await getDoc(eventDocRef);

        if (eventSnapshot.exists()) {
            const eventData = eventSnapshot.data();
            document.getElementById("editEventDate").value = eventData.fechaEvento;
            document.getElementById("editEventLocation").value = eventData.ubicacionEvento;
            document.getElementById("editEventUrl").value = eventData.urlBoletos;
            document.getElementById("editEventId").value = eventId;
            modal.style.display = "flex";
        } else {
            console.error("El evento no existe.");
        }
    } catch (error) {
        console.error("Error al abrir el modal de edición:", error);
    }
}

// Cierra la ventana modal
window.closeModal = function() {
    document.getElementById("editModal").style.display = "none";
}

// Guarda los cambios realizados en el modal
document.getElementById("editForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const eventId = document.getElementById("editEventId").value;
    const updatedDate = document.getElementById("editEventDate").value;
    const updatedLocation = document.getElementById("editEventLocation").value;
    const updatedUrl = document.getElementById("editEventUrl").value;

    try {
        await updateDoc(doc(db, "calendario", eventId), {
            fechaEvento: updatedDate,
            ubicacionEvento: updatedLocation,
            urlBoletos: updatedUrl
        });
        alert("Evento actualizado correctamente en Firebase");
        closeModal();
        showEventList();
    } catch (error) {
        console.error("Error al actualizar el evento: ", error);
    }
});
