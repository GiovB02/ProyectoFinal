// Importa las funciones necesarias desde Firebase
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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mes_text = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const dia_text = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
const mesesMostrar = [10, 11]; 

crearEstructuraCalendario();
cargarEventos().then(eventDays => numerarCalendario(eventDays));

// Función para cargar eventos desde Firebase
async function cargarEventos() {
    const eventsSnapshot = await getDocs(collection(db, "calendario"));
    const events = {};

    eventsSnapshot.forEach(doc => {
        const data = doc.data();
        const [year, month, day] = data.fechaEvento.split("-").map(Number); 
        const fecha = new Date(Date.UTC(year, month - 1, day)); 
        const mes = fecha.getUTCMonth(); 
        const dia = fecha.getUTCDate(); 

        if (!events[mes]) {
            events[mes] = new Set();
        }
        events[mes].add(dia);
    });

    return events;
}


function crearEstructuraCalendario() {
    const calendarContent = document.getElementById("calendar-content");

    mesesMostrar.forEach(m => {
        let mes = document.createElement("DIV");
        mes.className = "mes";
        mes.id = `mes-${m}`;
        calendarContent.appendChild(mes);

        let tabla_mes = document.createElement("TABLE");
        tabla_mes.className = "tabla_mes";
        mes.appendChild(tabla_mes);

        let titulo = document.createElement("CAPTION");
        titulo.className = "titulo";
        titulo.innerText = mes_text[m];
        tabla_mes.appendChild(titulo);

        let cabecera = document.createElement("THEAD");
        tabla_mes.appendChild(cabecera);
        let fila = document.createElement("TR");
        cabecera.appendChild(fila);
        dia_text.forEach(d => {
            let dia = document.createElement("TH");
            dia.innerText = d;
            fila.appendChild(dia);
        });

        let cuerpo = document.createElement("TBODY");
        tabla_mes.appendChild(cuerpo);
        for (let f = 0; f < 6; f++) {
            let fila = document.createElement("TR");
            cuerpo.appendChild(fila);
            for (let d = 0; d < 7; d++) {
                let dia = document.createElement("TD");
                dia.innerText = "";
                fila.appendChild(dia);
            }
        }
    });

    document.getElementById("mes-10").style.display = "block";
}

function numerarCalendario(eventDays) {
    const year = 2024;
    mesesMostrar.forEach(mes => {
        const select_tabla = document.getElementById(`mes-${mes}`).querySelector(".tabla_mes");
        let sem = 0;

        for (let dia = 1; dia <= 31; dia++) {
            const fecha = new Date(Date.UTC(year, mes, dia)); 

            if (fecha.getUTCMonth() !== mes) break;

            const dia_semana = fecha.getUTCDay(); 
            const celda = select_tabla.children[2].children[sem].children[dia_semana];
            celda.innerText = dia;

            if (eventDays[mes] && eventDays[mes].has(dia)) {
                celda.classList.add("event-day");
            }

            if (dia_semana === 6) {
                sem += 1;
            }
        }
    });
}

// Manejadores para los botones de cambio de mes
document.getElementById("btn-noviembre").addEventListener("click", () => {
    document.getElementById("mes-10").style.display = "block";
    document.getElementById("mes-11").style.display = "none";
});

document.getElementById("btn-diciembre").addEventListener("click", () => {
    document.getElementById("mes-10").style.display = "none";
    document.getElementById("mes-11").style.display = "block";
});
