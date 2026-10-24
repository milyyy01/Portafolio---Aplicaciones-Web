var habitaciones = document.querySelectorAll('.habitacion');
var textoSeleccion = document.getElementById('textoSeleccion');
var selectorBloque = document.getElementById('selectorBloque');
var textoBloque = document.getElementById('textoBloque');
var capacidad = 2;
var habitacionActual = document.querySelector('.habitacion.seleccionada');

var modal = document.getElementById('modal');
var detalleModal = document.getElementById('detalleModal');
var buscador = document.getElementById('buscador');
var estudiantes = document.querySelectorAll('.estudiante');
var sinResultados = document.getElementById('sinResultados');
var errorModal = document.getElementById('errorModal');
var mensajeModal = document.getElementById('mensajeModal');
var estudianteElegido = null;

/* ---------- Habitaciones ---------- */
habitaciones.forEach(function (habitacion) {
  habitacion.addEventListener('click', function () {
    habitaciones.forEach(function (otra) { otra.classList.remove('seleccionada'); });
    habitacion.classList.add('seleccionada');
    habitacionActual = habitacion;
    textoSeleccion.textContent = habitacion.dataset.numero;
  });
});

selectorBloque.addEventListener('change', function () {
  textoBloque.textContent = selectorBloque.value + ' - Piso 2';
});

/* ---------- Ventana de asignación ---------- */
function abrirModal() {
  estudianteElegido = null;
  buscador.value = '';
  estudiantes.forEach(function (estudiante) {
    estudiante.classList.remove('elegido');
    estudiante.parentElement.hidden = false;
  });
  sinResultados.hidden = true;
  errorModal.textContent = '';
  mensajeModal.hidden = true;
  detalleModal.textContent = 'Habitación ' + habitacionActual.dataset.numero + ' · ' +
    selectorBloque.value + ', piso 2 · ' + habitacionActual.dataset.ocupantes +
    ' de ' + capacidad + ' cupos ocupados';
  modal.hidden = false;
  buscador.focus();
}

function cerrarModal() { modal.hidden = true; }

document.getElementById('botonAsignar').addEventListener('click', abrirModal);
document.getElementById('botonCerrar').addEventListener('click', cerrarModal);
document.getElementById('botonCancelar').addEventListener('click', cerrarModal);
modal.addEventListener('click', function (evento) { if (evento.target === modal) { cerrarModal(); } });
document.addEventListener('keydown', function (evento) {
  if (evento.key === 'Escape' && !modal.hidden) { cerrarModal(); }
});

// Búsqueda por nombre o cédula
buscador.addEventListener('input', function () {
  var texto = buscador.value.trim().toLowerCase();
  var visibles = 0;
  estudiantes.forEach(function (estudiante) {
    var coincide = estudiante.dataset.nombre.toLowerCase().indexOf(texto) !== -1 ||
      estudiante.dataset.cedula.indexOf(texto) !== -1;
    estudiante.parentElement.hidden = !coincide;
    if (coincide) { visibles++; }
  });
  sinResultados.hidden = visibles > 0;
});

// Elegir un estudiante de la lista
estudiantes.forEach(function (estudiante) {
  estudiante.addEventListener('click', function () {
    estudiantes.forEach(function (otro) { otro.classList.remove('elegido'); });
    estudiante.classList.add('elegido');
    estudianteElegido = estudiante;
    errorModal.textContent = '';
    mensajeModal.hidden = true;
  });
});

document.getElementById('botonConfirmar').addEventListener('click', function () {
  errorModal.textContent = '';
  mensajeModal.hidden = true;

  if (!estudianteElegido) {
    errorModal.textContent = 'Selecciona un estudiante para continuar.';
  } else if (habitacionActual.dataset.estado === 'mantenimiento') {
    errorModal.textContent = 'La habitación está en mantenimiento y no se puede asignar.';
  } else if (Number(habitacionActual.dataset.ocupantes) >= capacidad) {
    errorModal.textContent = 'La habitación no tiene cupos disponibles.';
  } else {
    mensajeModal.textContent = 'Asignación validada (aún no se guarda).';
    mensajeModal.hidden = false;
  }
});