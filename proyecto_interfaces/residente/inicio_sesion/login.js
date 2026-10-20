var formulario = document.getElementById('formularioLogin');
var correo = document.getElementById('correo');
var contrasena = document.getElementById('contrasena');
var errorCorreo = document.getElementById('errorCorreo');
var errorContrasena = document.getElementById('errorContrasena');
var mostrarContrasena = document.getElementById('mostrarContrasena');

// Los enlaces no llevan a ningún lado
document.getElementById('enlaceVolver').addEventListener('click', function (evento) {
  evento.preventDefault();
});
document.getElementById('enlaceOlvido').addEventListener('click', function (evento) {
  evento.preventDefault();
});

// Mostrar u ocultar la contraseña
mostrarContrasena.addEventListener('change', function () {
  contrasena.type = mostrarContrasena.checked ? 'text' : 'password';
});

function limpiarErrores() {
  errorCorreo.textContent = '';
  errorContrasena.textContent = '';
  correo.classList.remove('invalido');
  contrasena.classList.remove('invalido');
}

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  limpiarErrores();

  var valido = true;
  var formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (correo.value.trim() === '') {
    errorCorreo.textContent = 'Ingresa tu correo institucional.';
    correo.classList.add('invalido');
    valido = false;
  } else if (!formatoCorreo.test(correo.value.trim())) {
    errorCorreo.textContent = 'El correo no tiene un formato válido.';
    correo.classList.add('invalido');
    valido = false;
  }

  if (contrasena.value === '') {
    errorContrasena.textContent = 'Ingresa tu contraseña.';
    contrasena.classList.add('invalido');
    valido = false;
  } else if (contrasena.value.length < 6) {
    errorContrasena.textContent = 'La contraseña debe tener al menos 6 caracteres.';
    contrasena.classList.add('invalido');
    valido = false;
  }
});