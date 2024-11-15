// Importa las funciones necesarias desde el SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const auth = getAuth(app);

// Seleccionar el formulario de registro
const form = document.getElementById("registro-empleados");

// Escuchar el evento de envío del formulario
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const fechaNacimiento = document.getElementById("fecha-nacimiento").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, correo, password);
        const user = userCredential.user;

        await addDoc(collection(db, "empleados"), {
            uid: user.uid,
            nombre: nombre,
            fechaNacimiento: fechaNacimiento,
            telefono: telefono,
            correo: correo
        });

        alert("Empleado registrado correctamente.");
        form.reset();
        mostrarEmpleados();
    } catch (error) {
        console.error("Error al registrar el empleado:", error);
        alert("Error al registrar el empleado. Por favor, intenta nuevamente.");
    }
});

// Función para mostrar empleados registrados
async function mostrarEmpleados() {
    const empleadosContainer = document.getElementById("empleados-container");
    empleadosContainer.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "empleados"));
    querySnapshot.forEach((doc) => {
        const empleado = doc.data();
        const empleadoDiv = document.createElement("div");
        empleadoDiv.classList.add("empleado-card");

        empleadoDiv.innerHTML = `
            <h3>${empleado.nombre}</h3>
            <p>Fecha de Nacimiento: ${empleado.fechaNacimiento}</p>
            <p>Teléfono: ${empleado.telefono}</p>
            <p>Correo Electrónico: ${empleado.correo}</p>
            <button class="edit-button" onclick="openEditModal('${doc.id}')">Editar</button>
        `;

        empleadosContainer.appendChild(empleadoDiv);
    });
}

// Abre el modal para editar un empleado específico
window.openEditModal = async function (id) {
    try {
        const empleadoRef = doc(db, "empleados", id);
        const empleadoSnapshot = await getDoc(empleadoRef);

        if (empleadoSnapshot.exists()) {
            const empleadoData = empleadoSnapshot.data();
            document.getElementById("editEmployeeId").value = id;
            document.getElementById("editEmployeeName").value = empleadoData.nombre;
            document.getElementById("editEmployeeBirthDate").value = empleadoData.fechaNacimiento;
            document.getElementById("editEmployeePhone").value = empleadoData.telefono;
            document.getElementById("editEmployeeEmail").value = empleadoData.correo;
            document.getElementById("editModal").style.display = "flex";
        } else {
            console.error("El empleado no existe.");
        }
    } catch (error) {
        console.error("Error al abrir el modal de edición:", error);
    }
};

// Cierra la ventana modal
window.closeModal = function () {
    document.getElementById("editModal").style.display = "none";
};

// Guardar los cambios realizados en el modal
document.getElementById("editForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const employeeId = document.getElementById("editEmployeeId").value;
    const updatedName = document.getElementById("editEmployeeName").value;
    const updatedBirthDate = document.getElementById("editEmployeeBirthDate").value;
    const updatedPhone = document.getElementById("editEmployeePhone").value;
    const updatedEmail = document.getElementById("editEmployeeEmail").value;

    try {
        await updateDoc(doc(db, "empleados", employeeId), {
            nombre: updatedName,
            fechaNacimiento: updatedBirthDate,
            telefono: updatedPhone,
            correo: updatedEmail
        });
        alert("Empleado actualizado correctamente.");
        closeModal();
        mostrarEmpleados();
    } catch (error) {
        console.error("Error al actualizar el empleado:", error);
        alert("Error al actualizar el empleado. Por favor, intenta nuevamente.");
    }
});

// Función para eliminar empleado
window.eliminarEmpleado = async function (id) {
    if (confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
        try {
            await deleteDoc(doc(db, "empleados", id));
            alert("Empleado eliminado correctamente.");
            mostrarEmpleados();
        } catch (error) {
            console.error("Error al eliminar el empleado:", error);
            alert("Error al eliminar el empleado. Por favor, intenta nuevamente.");
        }
    }
};

// Cargar y mostrar empleados al cargar la página
mostrarEmpleados();