// Importar módulos necesarios de Firebase (v9)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración de Firebase para tu proyecto
const firebaseConfig = {
    apiKey: "AIzaSyBMFBsHFbVRw4JGPSkRtikTLQ54E38VGBM",
    authDomain: "proyecto-final-desarrolloweb.firebaseapp.com",
    projectId: "proyecto-final-desarrolloweb",
    storageBucket: "proyecto-final-desarrolloweb.appspot.com",
    messagingSenderId: "351365660285",
    appId: "1:351365660285:web:9e33adcde884fcaec23b14"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Referencias a elementos del DOM
const buttonAgregarAlbum = document.getElementById('buttonAgregarAlbum');
const buttonEditarAlbum = document.getElementById('buttonEditarAlbum');
const albumForm = document.getElementById("albumForm");
const albumList = document.getElementById("albumList");
const formButton = albumForm.querySelector('button[type="submit"]');

// Variable global para determinar si estamos agregando o editando un álbum
let editingAlbumId = null;

// Muestra el formulario de agregar álbum y oculta la lista de álbumes
function showForm() {
    albumForm.style.display = "block";
    albumList.style.display = "none";
    editingAlbumId = null; // Establece el modo para agregar nuevo álbum
    formButton.textContent = "Guardar Álbum";
    albumForm.reset();
}

// Muestra la lista de álbumes y oculta el formulario
function showAlbumList() {
    albumForm.style.display = "none";
    albumList.style.display = "block";
    loadAlbums(); // Cargar álbumes desde Firestore
}

// Asignar eventos a los botones principales
buttonAgregarAlbum.addEventListener('click', showForm);
buttonEditarAlbum.addEventListener('click', showAlbumList);

// Envía los datos del formulario al hacer submit (agregar o editar)
albumForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const albumTitle = document.getElementById("albumTitle").value;
    const albumYear = document.getElementById("albumYear").value;
    const albumImage = document.getElementById("albumImage").value; // Campo para la imagen
    const songList = document.getElementById("songList").value.split("\n");

    const albumData = {
        title: albumTitle,
        year: parseInt(albumYear),
        image: albumImage,
        songs: songList
    };

    try {
        if (editingAlbumId === null) {
            // Agregar un nuevo álbum
            await addDoc(collection(db, "discografia"), albumData);
            alert("Álbum agregado correctamente a Firestore");
        } else {
            // Actualizar álbum existente
            const albumDocRef = doc(db, "discografia", editingAlbumId);
            await updateDoc(albumDocRef, albumData);
            alert("Álbum actualizado correctamente en Firestore");
            editingAlbumId = null; // Salimos del modo edición
            formButton.textContent = "Guardar Álbum";
        }

        albumForm.reset();
        showAlbumList(); // Volver a mostrar la lista después de guardar
    } catch (error) {
        console.error("Error al guardar el álbum en Firestore:", error);
        alert("Error al guardar el álbum");
    }
});

// Carga la lista de álbumes desde Firestore
async function loadAlbums() {
    try {
        const albumsQuery = query(collection(db, "discografia"), orderBy("year", "asc"));
        const querySnapshot = await getDocs(albumsQuery);
        const albums = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

        albumList.innerHTML = "<h2>Álbumes Existentes</h2>";

        if (albums.length === 0) {
            albumList.innerHTML += "<p>No hay álbumes registrados.</p>";
            return;
        }

        albums.forEach(album => {
            const albumDiv = document.createElement("div");
            albumDiv.classList.add("album-card");
            albumDiv.innerHTML = `
                <img src="${album.image}" alt="Imagen de ${album.title}" class="album-image">
                <div class="album-info">
                    <h3>${album.title} (${album.year})</h3>
                    <ul>${album.songs.map(song => `<li>${song}</li>`).join('')}</ul>
                    <button class="edit-button" data-id="${album.id}">Editar</button>
                    <button class="delete-button" data-id="${album.id}">Eliminar</button>
                </div>
            `;
            albumList.appendChild(albumDiv);
        });

        // Agrega oyentes de eventos a los botones Editar y Eliminar después de crear los elementos
        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", () => editAlbum(button.getAttribute("data-id")));
        });
        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", () => deleteAlbum(button.getAttribute("data-id")));
        });
    } catch (error) {
        console.error("Error al cargar los álbumes desde Firestore:", error);
    }
}

// Función para editar un álbum existente
async function editAlbum(albumId) {
    const albumDocRef = doc(db, "discografia", albumId);
    const albumDocSnap = await getDoc(albumDocRef);

    if (albumDocSnap.exists()) {
        const albumData = albumDocSnap.data();
        // Muestra el formulario con los datos del álbum para editar
        albumForm.style.display = "block";
        albumList.style.display = "none";

        document.getElementById("albumTitle").value = albumData.title;
        document.getElementById("albumYear").value = albumData.year;
        document.getElementById("albumImage").value = albumData.image;
        document.getElementById("songList").value = albumData.songs.join("\n");

        // Actualiza el botón del formulario para guardar los cambios
        formButton.textContent = "Actualizar Álbum";

        // Establece la variable global con el ID del álbum que se está editando
        editingAlbumId = albumId;
    } else {
        alert("El álbum no existe en la base de datos.");
    }
}

// Función para eliminar un álbum
async function deleteAlbum(albumId) {
    const confirmation = confirm("¿Estás seguro de que deseas eliminar este álbum?");
    if (confirmation) {
        const albumDocRef = doc(db, "discografia", albumId);
        try {
            await deleteDoc(albumDocRef);
            alert("Álbum eliminado correctamente de Firestore");
            showAlbumList();
        } catch (error) {
            console.error("Error al eliminar el álbum de Firestore:", error);
            alert("Error al eliminar el álbum");
        }
    }
}
