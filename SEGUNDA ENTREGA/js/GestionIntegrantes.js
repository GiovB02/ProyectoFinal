// Importa las funciones necesarias desde el SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBMFBsHFbVRw4JGPSkRtikTLQ54E38VGBM",
    authDomain: "proyecto-final-desarrolloweb.firebaseapp.com",
    projectId: "proyecto-final-desarrolloweb",
    storageBucket: "proyecto-final-desarrolloweb.firebasestorage.app",
    messagingSenderId: "351365660285",
    appId: "1:351365660285:web:9e33adcde884fcaec23b14"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("miembro-form");
const miembrosContainer = document.getElementById("miembros-container");

// Variables globales
let miembroIdActual = null;

// Función para agregar un miembro
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const rol = document.getElementById("rol").value;
    const datoCurioso = document.getElementById("dato-curioso").value;
    const imagenUrl = document.getElementById("imagen-url").value;

    try {
        await addDoc(collection(db, "miembros"), {
            nombre,
            rol,
            datoCurioso,
            imagenUrl
        });
        alert("Miembro agregado correctamente.");
        form.reset();
        mostrarMiembros();
    } catch (error) {
        console.error("Error al agregar el miembro:", error);
        alert("Error al agregar el miembro. Verifique la conexión a Firebase.");
    }
});

// Función para mostrar los miembros
async function mostrarMiembros() {
    miembrosContainer.innerHTML = "";
    try {
        const querySnapshot = await getDocs(collection(db, "miembros"));
        querySnapshot.forEach((doc) => {
            const miembro = doc.data();
            const miembroDiv = document.createElement("div");
            miembroDiv.classList.add("miembro-card");

            miembroDiv.innerHTML = `
                <h3>${miembro.nombre}</h3>
                <p><strong>Rol:</strong> ${miembro.rol}</p>
                <p><strong>Dato Curioso:</strong> ${miembro.datoCurioso}</p>
                <img src="${miembro.imagenUrl}" alt="Imagen de ${miembro.nombre}">
                <button class="edit-button" onclick="editarMiembro('${doc.id}')">Editar</button>
            `;

            miembrosContainer.appendChild(miembroDiv);
        });
    } catch (error) {
        console.error("Error al mostrar los miembros:", error);
        alert("Error al cargar los miembros. Verifique la conexión a Firebase.");
    }
}

// Función para eliminar un miembro desde el modal
window.eliminarMiembroModal = async function () {
    if (miembroIdActual && confirm("¿Estás seguro de que deseas eliminar este miembro?")) {
        try {
            await deleteDoc(doc(db, "miembros", miembroIdActual));
            alert("Miembro eliminado correctamente.");
            cerrarModal();
            mostrarMiembros();
        } catch (error) {
            console.error("Error al eliminar el miembro:", error);
            alert("Error al eliminar el miembro. Verifique la conexión a Firebase.");
        }
    }
};

// Función para abrir el modal y cargar los datos del miembro
window.editarMiembro = async function (id) {
    miembroIdActual = id;
    const miembroRef = doc(db, "miembros", id);
    const miembroSnap = await getDoc(miembroRef);

    if (miembroSnap.exists()) {
        const miembro = miembroSnap.data();
        document.getElementById("edit-nombre").value = miembro.nombre;
        document.getElementById("edit-rol").value = miembro.rol;
        document.getElementById("edit-dato-curioso").value = miembro.datoCurioso;
        document.getElementById("edit-imagen-url").value = miembro.imagenUrl;

        document.getElementById("edit-modal").style.display = "flex";
    }
};

// Función para cerrar el modal
window.cerrarModal = function () {
    document.getElementById("edit-modal").style.display = "none";
    miembroIdActual = null;
};

// Función para actualizar el miembro en Firebase
document.getElementById("edit-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const nuevoNombre = document.getElementById("edit-nombre").value;
    const nuevoRol = document.getElementById("edit-rol").value;
    const nuevoDatoCurioso = document.getElementById("edit-dato-curioso").value;
    const nuevaImagenUrl = document.getElementById("edit-imagen-url").value;

    if (miembroIdActual) {
        try {
            const miembroRef = doc(db, "miembros", miembroIdActual);
            await updateDoc(miembroRef, {
                nombre: nuevoNombre,
                rol: nuevoRol,
                datoCurioso: nuevoDatoCurioso,
                imagenUrl: nuevaImagenUrl
            });

            alert("Miembro actualizado correctamente.");
            cerrarModal();
            mostrarMiembros();
        } catch (error) {
            console.error("Error al editar el miembro:", error);
            alert("Error al editar el miembro. Verifique la conexión a Firebase.");
        }
    }
});

// Mostrar los miembros al cargar la página
mostrarMiembros();