//VARIABLES================================================================
let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
  id: "",
  nombre: "",
  fecha: "",
  hora: "",
  servicios: [],
};

//==========================================================================
document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarSecion(paso);
  tabs(); //Cambia la seccion cuando se precionen los tabs
  botonesPaginador(); //agrega o quita los botones del paginador
  paginaSiguiente();
  paginaAnterior();

  consultarAPI(); // consulta api
  idCliente();
  nombreCliente(); //añade el nombre del cliente a la cita
  seleccionarFecha(); //añade la fecha de la cita en el objeto
  seleccionarHora();

  //mostrarResumen(); //muestra el resumend e las citas
}
//==========================================================================

function mostrarSecion() {
  //ocultar la seccion que tenga la clase mostrar
  const seccionAnterior = document.querySelector(".mostrar");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar");
  }

  //quita la clase del tab actual al anterior
  const tabAnterior = document.querySelector(".actual");
  if (tabAnterior) {
    tabAnterior.classList.remove("actual");
  }

  //seleccionar la seccion con el paso

  const seccion = document.querySelector(`#paso-${paso}`);
  seccion.classList.add("mostrar");

  //resalta el tab actual
  const tab = document.querySelector(`[data-paso="${paso}"]`);
  tab.classList.add("actual");
}

function tabs() {
  const botones = document.querySelectorAll(".tabs button");

  botones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      paso = parseInt(e.target.dataset.paso);
      mostrarSecion(paso);
      botonesPaginador();

      // if (paso === 3) {
      //   mostrarResumen();
      // }
    });
  });
}

function botonesPaginador() {
  const paginaAnterior = document.querySelector("#anterior");
  const paginaSiguiente = document.querySelector("#siguiente");

  if (paso === 1) {
    paginaAnterior.classList.add("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  } else if (paso === 3) {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.add("ocultar");
    mostrarResumen();
  } else {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  }
  mostrarSecion();
}

function paginaSiguiente() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", function () {
    if (paso <= pasoInicial) return;
    paso--;

    botonesPaginador();
  });
}
function paginaAnterior() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", function () {
    if (paso >= pasoFinal) return;
    paso++;

    botonesPaginador();
  });
}

async function consultarAPI() {
  try {
    const url = `${location.origin}/api/servicios`;
    const resultado = await fetch(url);
    const servicios = await resultado.json();

    mostrarServicios(servicios);
  } catch (error) {
    console.log(error);
  }
}

function mostrarServicios(servicios) {
  servicios.forEach((servicio) => {
    const { id, nombre, precio } = servicio;

    const nombreServicio = document.createElement("P");
    nombreServicio.classList.add("nombre-servicio");
    nombreServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.classList.add("precio-servicio");
    precioServicio.textContent = `$${precio}`;

    const servicioDiv = document.createElement("DIV");
    servicioDiv.classList.add("servicio");
    servicioDiv.dataset.idServicio = id;
    servicioDiv.onclick = function () {
      seleccionarServicio(servicio);
    };

    servicioDiv.append(nombreServicio, precioServicio);
    document.querySelector("#servicios").appendChild(servicioDiv);
  });
}

function seleccionarServicio(servicio) {
  const { id } = servicio;
  const { servicios } = cita;

  //identificar el elemento al que se le da click
  const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

  //comprobar si un servicio ya fue agregado
  if (servicios.some((agregado) => agregado.id === id)) {
    //eliminarlo
    cita.servicios = servicios.filter((agregado) => agregado.id !== id);
    divServicio.classList.remove("seleccionado");
  } else {
    //agregarlo
    cita.servicios = [...servicios, servicio];
    divServicio.classList.add("seleccionado");
  }
}
function idCliente() {
  cita.id = document.querySelector("#id").value;
}

function nombreCliente() {
  cita.nombre = document.querySelector("#nombre").value;
}

function seleccionarFecha() {
  const inputFecha = document.querySelector("#fecha");
  inputFecha.addEventListener("input", function (e) {
    const dia = new Date(e.target.value).getUTCDay();

    if ([0, 6].includes(dia)) {
      e.target.value = "";
      cita.fecha = "";

      //mostrarAlerta("Fines de semana no permitidos", "fecha", "error",'.formulario');
      mostrarAlerta(
        "Fines de semana no permitidos",
        "error",
        ".formulario",
        "fecha"
      );
    } else {
      cita.fecha = e.target.value;
      eliminarAlertas(".fecha-alerta");
    }
  });
}

function seleccionarHora() {
  const inputHora = document.querySelector("#hora");
  inputHora.addEventListener("input", function (e) {
    const horaCita = e.target.value;
    const hora = horaCita.split(":")[0];

    if (hora < 10 || hora > 18) {
      mostrarAlerta(
        "No trabajamos en este horario",
        "error",
        ".formulario",
        "hora"
      );
      //e.target.value = "";
      cita.hora = "";
    } else {
      cita.hora = e.target.value;
      eliminarAlertas(".hora-alerta");
    }
  });
}

function mostrarAlerta(mensaje, tipo, elemento, id, temporizador = true) {
  //Variables
  let alertaExistente = document.querySelector(`.${id}-alerta`);
  //validacion y limpieza
  if (alertaExistente) return;

  //generador de alertas
  const alerta = document.createElement("DIV");
  alerta.textContent = mensaje;
  alerta.classList.add("alerta");
  alerta.classList.add(tipo);
  alerta.classList.add(`${id}-alerta`);

  const referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  if (temporizador) {
    setTimeout(() => {
      alerta.remove();
    }, 5000);
  }
}

function eliminarAlertas(elemento = ".alerta") {
  const alertaPrevia = document.querySelectorAll(elemento);
  if (alertaPrevia) {
    alertaPrevia.forEach((alerta) => alerta.remove());
  }
}

function mostrarResumen() {
  const resumen = document.querySelector(".contenido-resumen");
  eliminarAlertas();
  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes("") || cita.servicios.length === 0) {
    mostrarAlerta(
      "Falta Datos de Servicios, Fecha u Hora",
      "error",
      ".contenido-resumen",
      "resumen",
      false
    );
    return;
  }

  //formatear  el div de resumen

  const { nombre, fecha, hora, servicios } = cita;

  const nombreCliente = document.createElement("P");
  nombreCliente.innerHTML = `<span>Nombre: </span> ${nombre}`;

  //formatear la fecha
  const fechaOBJ = new Date(fecha);
  const mes = fechaOBJ.getMonth();
  const dia = fechaOBJ.getDate() + 2;
  const year = fechaOBJ.getFullYear();

  const fechaUTC = new Date(Date.UTC(year, mes, dia));

  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const fechaFormateada = fechaUTC.toLocaleDateString("es-MX", opciones);

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Fecha: </span> ${fechaFormateada}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Hora: </span> ${hora} Horas`;

  // Heading para servicios
  const headingServicios = document.createElement("H3");
  headingServicios.textContent = "Resumen de Servicios";
  resumen.appendChild(headingServicios);

  //iterando y mostrando los servicios
  servicios.forEach((servicio) => {
    const { id, precio, nombre } = servicio;

    const contenedorServicio = document.createElement("DIV");
    contenedorServicio.classList.add("contenedor-servicio");

    const textoServicio = document.createElement("P");
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.innerHTML = `<span>Precio:</span> $${precio}`;

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    resumen.appendChild(contenedorServicio);
  });

  // Heading para cita
  const headingCita = document.createElement("H3");
  headingCita.textContent = "Resumen de la Cita";
  resumen.appendChild(headingCita);

  const botonReservar = document.createElement("BUTTON");
  botonReservar.classList.add("boton");
  botonReservar.textContent = "Reservar Cita";
  botonReservar.onclick = reservarCita;

  resumen.appendChild(nombreCliente);
  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);

  resumen.appendChild(botonReservar);
}

async function reservarCita() {
  const { nombre, fecha, hora, servicios, id } = cita;

  const idServicios = servicios.map((servicio) => servicio.id);

  const datos = new FormData();
  datos.append("fecha", fecha);
  datos.append("hora", hora);
  datos.append("usuarioId", id);
  datos.append("servicios", idServicios);

  try {
    //Peticion a la api
    const url = `${location.origin}/api/citas`;

    const respuesta = await fetch(url, {
      method: "POST",
      body: datos,
    });

    //console.log("primer cc:",respuesta.json());    

    const resultado = await respuesta.json();

    //console.log(respuesta.json()); 
    console.log("segundo cc",resultado);
    

    console.log(resultado.resultado);
    console.log(resultado);
    

    if (resultado.resultado) {
      Swal.fire({
        icon: "success",
        title: "Cita Creada",
        text: "Tu cita fue creada correctamente",
        button: "OK",
      }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al guardar la cita",
    });
  }
}


