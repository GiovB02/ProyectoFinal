// Muestra el formulario de agregar evento y oculta la lista de eventos
function showEventForm() {
    document.getElementById("eventForm").style.display = "block";
    document.getElementById("eventList").style.display = "none";
}

// Muestra la lista de eventos y oculta el formulario
function showEventList() {
    document.getElementById("eventForm").style.display = "none";
    document.getElementById("eventList").style.display = "block";
    loadEvents();
}

// Guarda el evento en Local Storage
document.getElementById("eventForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const eventDate = document.getElementById("eventDate").value;
    const eventLocation = document.getElementById("eventLocation").value;
    const eventUrl = document.getElementById("eventUrl").value;

    const eventData = {
        id: Date.now().toString(),
        date: eventDate,
        location: eventLocation,
        url: eventUrl
    };

    let events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(eventData);
    localStorage.setItem("events", JSON.stringify(events));

    alert("Evento guardado correctamente");
    document.getElementById("eventForm").reset();
    showEventList();
});

// Carga la lista de eventos desde Local Storage
function loadEvents() {
    let events = JSON.parse(localStorage.getItem("events")) || [];

    const eventListDiv = document.getElementById("eventList");
    eventListDiv.innerHTML = "<h2>Eventos Existentes</h2>";

    events.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event-card");
        eventDiv.innerHTML = `
            <div class="event-info">
                <h3>${event.location}</h3>
                <p>Fecha: ${event.date}</p>
                <p><a href="${event.url}" target="_blank">Comprar Boletos</a></p>
                <button onclick="openEditModal('${event.id}')">Editar</button>
            </div>
        `;
        eventListDiv.appendChild(eventDiv);
    });
}

// Abre la ventana modal para editar un evento específico
function openEditModal(eventId) {
    const modal = document.getElementById("editModal");
    const events = JSON.parse(localStorage.getItem("events")) || [];
    const event = events.find(e => e.id === eventId);

    if (event) {
        document.getElementById("editEventDate").value = event.date;
        document.getElementById("editEventLocation").value = event.location;
        document.getElementById("editEventUrl").value = event.url;
        document.getElementById("editEventId").value = event.id;
        modal.style.display = "flex";
    }
}

// Cierra la ventana modal
function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

// Guarda los cambios realizados en el modal
document.getElementById("editForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const eventId = document.getElementById("editEventId").value;
    const updatedDate = document.getElementById("editEventDate").value;
    const updatedLocation = document.getElementById("editEventLocation").value;
    const updatedUrl = document.getElementById("editEventUrl").value;

    let events = JSON.parse(localStorage.getItem("events")) || [];
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex !== -1) {
        events[eventIndex] = {
            id: eventId,
            date: updatedDate,
            location: updatedLocation,
            url: updatedUrl
        };
        localStorage.setItem("events", JSON.stringify(events));
        alert("Evento actualizado correctamente");
        closeModal();
        showEventList();
    }
});

// Cierra el modal si se hace clic fuera de su contenido
window.onclick = function(event) {
    const modal = document.getElementById("editModal");
    if (event.target == modal) {
        closeModal();
    }
};
