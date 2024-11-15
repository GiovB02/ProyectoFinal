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
const dia_text = ["Dom", "Lun", "Mar", "Mie", "Juv", "Vie", "Sab"];
const mesesMostrar = [10, 11]; // Solo noviembre (10) y diciembre (11)

crearEstructuraCalendario();
cargarEventos().then(eventDays => numerarCalendario(eventDays));

// Función para cargar eventos desde Firebase
async function cargarEventos() {
    const eventsSnapshot = await getDocs(collection(db, "calendario"));
    const events = {};

    eventsSnapshot.forEach(doc => {
        const data = doc.data();
        const fecha = new Date(data.fechaEvento);
        const mes = fecha.getMonth();
        const dia = fecha.getDate();

        if (!events[mes]) {
            events[mes] = new Set();
        }
        events[mes].add(dia);
    });

    return events;
}

// Función para crear la estructura del calendario
function crearEstructuraCalendario() {
  const calendarContent = document.getElementById("calendar-content");

  mesesMostrar.forEach(m => {
    let mes = document.createElement("DIV");
    mes.className = "mes";
    mes.id = `mes-${m}`; // Asigna un ID para identificar cada mes
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

  // Mostrar inicialmente el calendario de noviembre
  document.getElementById("mes-10").style.display = "block";
}

// Función para numerar los días y resaltar los días de eventos
function numerarCalendario(eventDays) {
  const year = 2024;
  for (let i = 1; i <= 366; i++) {
    let fecha = fechaPorDia(year, i);
    let mes = fecha.getMonth();

    if (!mesesMostrar.includes(mes)) continue;

    let select_tabla = document.getElementById(`mes-${mes}`).querySelector(".tabla_mes");
    let dia = fecha.getDate();
    let dia_semana = fecha.getDay();

    if (dia == 1) {
      var sem = 0;
    }
    const celda = select_tabla.children[2].children[sem].children[dia_semana];
    celda.innerText = dia;

    if (eventDays[mes] && eventDays[mes].has(dia)) {
      celda.classList.add("event-day");
    }

    if (dia_semana == 6) {
      sem = sem + 1;
    }
  }
}

// Función para obtener la fecha correspondiente al día del año
function fechaPorDia(año, dia) {
  var date = new Date(año, 0);
  return new Date(date.setDate(dia));
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
