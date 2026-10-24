var mensajeAccion = document.getElementById('mensajeAccion');
var cajaMotivo = document.getElementById('cajaMotivo');
var motivoRechazo = document.getElementById('motivoRechazo');
var errorMotivo = document.getElementById('errorMotivo');
var mensajeRechazo = document.getElementById('mensajeRechazo');

function cerrarMotivo() {
  cajaMotivo.hidden = true;
  motivoRechazo.value = '';
  motivoRechazo.classList.remove('invalido');
  errorMotivo.textContent = '';
  mensajeRechazo.hidden = true;
}

// Aceptar: cierra el recuadro del motivo, si estaba abierto
document.getElementById('botonAceptar').addEventListener('click', function () {
  cerrarMotivo();
  mensajeAccion.textContent = 'Solicitud aceptada (aún no se guarda).';
  mensajeAccion.hidden = false;
});

// Rechazar: muestra el recuadro para escribir la razón
document.getElementById('botonRechazar').addEventListener('click', function () {
  mensajeAccion.hidden = true;
  mensajeRechazo.hidden = true;
  cajaMotivo.hidden = false;
  motivoRechazo.focus();
});

document.getElementById('botonCancelarMotivo').addEventListener('click', cerrarMotivo);

motivoRechazo.addEventListener('input', function () {
  errorMotivo.textContent = '';
  motivoRechazo.classList.remove('invalido');
});

// Confirmar rechazo: el motivo es obligatorio (mínimo 10 caracteres)
document.getElementById('botonConfirmarRechazo').addEventListener('click', function () {
  var motivo = motivoRechazo.value.trim();
  mensajeRechazo.hidden = true;

  if (motivo === '') {
    errorMotivo.textContent = 'Escribe el motivo del rechazo.';
    motivoRechazo.classList.add('invalido');
  } else if (motivo.length < 10) {
    errorMotivo.textContent = 'El motivo debe tener al menos 10 caracteres.';
    motivoRechazo.classList.add('invalido');
  } else {
    mensajeRechazo.textContent = 'Solicitud rechazada con motivo registrado (aún no se guarda).';
    mensajeRechazo.hidden = false;
  }
});