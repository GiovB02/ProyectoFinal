// Importar módulos necesarios de Firebase (v9)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración de Firebase
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

// Referencia a los elementos del DOM donde se insertarán datos
const discografiaSection = document.getElementById('discografia');
const albumCancionesContainer = document.getElementById('albumCancionesContainer');

// Función para cargar los álbumes y canciones desde Firestore
async function loadAlbumsAndSongs() {
    try {
        const albumsQuery = query(collection(db, "discografia"), orderBy("year", "asc"));
        const querySnapshot = await getDocs(albumsQuery);
        const albums = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));

        // Verificar si existen álbumes en la base de datos
        if (albums.length === 0) {
            discografiaSection.innerHTML = "<p>No hay álbumes disponibles en este momento.</p>";
            return;
        }

        // Limpiar secciones antes de llenarlas
        discografiaSection.innerHTML = "";
        albumCancionesContainer.innerHTML = "";

        albums.forEach((album, index) => {
            // Crear elementos para la sección de álbumes
            const albumDiv = document.createElement("div");
            albumDiv.classList.add("album");

            // Generar un ID único para la sección de canciones del álbum
            const albumSongsId = `album${index + 1}Canciones`; 

            // Contenido del álbum
            albumDiv.innerHTML = `
                <a href="#${albumSongsId}">
                    <img src="${album.image}" alt="Imagen de ${album.title}">
                    <p>${album.title} (${album.year})</p>
                </a>
            `;

            // Agregar el álbum al contenedor principal
            discografiaSection.appendChild(albumDiv);

            // Crear la sección de canciones para cada álbum
            const cancionesDiv = document.createElement("div");
            cancionesDiv.id = albumSongsId;
            cancionesDiv.classList.add("canciones");

            // Generar la tabla con la lista de canciones
            const songsTable = document.createElement("table");
            const tableHead = `
                <thead>
                    <tr>
                        <th>N.º</th>
                        <th>Título</th>
                    </tr>
                </thead>
            `;
            
            // Generar filas para cada canción
            const tableBodyRows = album.songs.map((song, songIndex) => {
                return `
                    <tr>
                        <td>${songIndex + 1}</td>
                        <td>${song}</td>
                    </tr>
                `;
            }).join("");

            const tableBody = `<tbody>${tableBodyRows}</tbody>`;

            // Insertar contenido en la tabla
            songsTable.innerHTML = tableHead + tableBody;

            // Título del álbum en la sección de canciones
            const albumTitleHeader = document.createElement("h2");
            albumTitleHeader.textContent = `${album.title} (${album.year})`;

            // Agregar elementos al contenedor de canciones
            cancionesDiv.appendChild(albumTitleHeader);
            cancionesDiv.appendChild(songsTable);

            // Agregar la sección de canciones al contenedor principal
            albumCancionesContainer.appendChild(cancionesDiv);
        });
    } catch (error) {
        console.error("Error al cargar los álbumes desde Firestore:", error);
        discografiaSection.innerHTML = "<p>Error al cargar la discografía. Intenta de nuevo más tarde.</p>";
    }
}

// Llamar a la función para cargar y mostrar la discografía
loadAlbumsAndSongs();
