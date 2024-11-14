const Agregar = document.querySelector("#add");
const Eliminar = document.querySelector("#delete");
const Editar = document.querySelector("#edit");

Agregar.onclick = function() {
    const contenedor = document.querySelector("#idDivPage");
    const menu = document.querySelectorAll("#idDivPage > header");

    let nombre = prompt("Agregue el nombre del nuevo integrante");
    let rol = prompt("Agregue el rol del nuevo integrante");
    let descripcion = prompt("Agregue el dato curioso del nuevo integrante");

    if (titulo && nombre && rol && descripcion) {
        const h1 = document.createElement("h1");
        h1.setAttribute("class", "display-5 text-center fw-bold py-4 my-4");
        h1.innerHTML = titulo;

        const pNombre = document.createElement("p");
        pNombre.innerHTML = `<strong>Nombre:</strong> ${nombre}`;

        const pRol = document.createElement("p");
        pRol.innerHTML = `<strong>Rol:</strong> ${rol}`;

        const pDescripcion = document.createElement("p");
        pDescripcion.innerHTML = `<strong>Descripción:</strong> ${descripcion}`;

        contenedor.appendChild(h1);
        contenedor.appendChild(pNombre);
        contenedor.appendChild(pRol);
        contenedor.appendChild(pDescripcion);
    } else {
        alert("No se ha registrado toda la información, por favor ingrese todos los datos.");
    }
};
