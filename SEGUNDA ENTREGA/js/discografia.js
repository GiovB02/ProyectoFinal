// Muestra el formulario de agregar álbum y oculta la lista de álbumes
function showForm() {
    document.getElementById("albumForm").style.display = "block";
    document.getElementById("albumList").style.display = "none";
}

// Muestra la lista de álbumes y oculta el formulario
function showAlbumList() {
    document.getElementById("albumForm").style.display = "none";
    document.getElementById("albumList").style.display = "block";
    loadAlbums(); // Cargar álbumes desde el servidor
}

// Envía los datos del formulario al backend
document.getElementById("albumForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const albumTitle = document.getElementById("albumTitle").value;
    const albumYear = document.getElementById("albumYear").value;
    const albumImage = document.getElementById("albumImage").value;  // Nuevo campo
    const songList = document.getElementById("songList").value.split("\n");

    const albumData = {
        title: albumTitle,
        year: albumYear,
        image: albumImage,  // Incluimos la URL de la imagen
        songs: songList
    };

    try {
        const response = await fetch("/api/discografia", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(albumData)
        });

        if (response.ok) {
            alert("Álbum guardado correctamente");
            document.getElementById("albumForm").reset();
            showAlbumList(); // Volver a mostrar la lista después de guardar
        } else {
            alert("Error al guardar el álbum");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

// Carga la lista de álbumes desde el servidor
async function loadAlbums() {
    const response = await fetch("/api/discografia");
    let albums = await response.json();

    albums.sort((a, b) => a.year - b.year);

    const albumListDiv = document.getElementById("albumList");
    albumListDiv.innerHTML = "<h2>Álbumes Existentes</h2>";

    albums.forEach(album => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album-card");
        albumDiv.innerHTML = `
            <img src="${album.image}" alt="Imagen de ${album.title}" class="album-image">
            <div class="album-info">
                <h3>${album.title} (${album.year})</h3>
                <ul>${album.songs.map(song => `<li>${song}</li>`).join('')}</ul>
            </div>
        `;
        albumListDiv.appendChild(albumDiv);
    });
}
