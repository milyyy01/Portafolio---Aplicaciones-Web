var formulario = document.getElementById('formulario');
var mensajeExito = document.getElementById('mensajeExito');
var casillas = [
  { id: 'aceptoCondiciones', mensaje: 'Debes aceptar las condiciones del documento de compromiso.' },
  { id: 'aceptoLopd', mensaje: 'Debes declarar que conoces la política de tratamiento de datos.' }
];

casillas.forEach(function (casilla) {
  document.getElementById(casilla.id).addEventListener('change', function () {
    document.getElementById('error-' + casilla.id).textContent = '';
  });
});

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  mensajeExito.hidden = true;
  var valido = true;

  casillas.forEach(function (casilla) {
    var error = document.getElementById('error-' + casilla.id);
    if (document.getElementById(casilla.id).checked) {
      error.textContent = '';
    } else {
      error.textContent = casilla.mensaje;
      valido = false;
    }
  });

  if (valido) {
    mensajeExito.hidden = false;
    setTimeout(function () { window.location.href = '../pantalla_inicio/inicio_residente.html'; }, 1500);
  }
});