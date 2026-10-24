var formulario = document.getElementById('formularioLogin');
var correo = document.getElementById('correo');
var contrasena = document.getElementById('contrasena');
var errorCorreo = document.getElementById('errorCorreo');
var errorContrasena = document.getElementById('errorContrasena');
var mostrarContrasena = document.getElementById('mostrarContrasena');

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

  if (correo.value.trim() === '') {
    errorCorreo.textContent = 'Ingresa tu correo institucional.';
    correo.classList.add('invalido');
    valido = false;
  } else if (!FORMATO_CORREO.test(correo.value.trim())) {
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

  if (valido) {
    // Simulación para la demo: si el correo contiene "admin" entra como administrador
    var esAdmin = correo.value.trim().toLowerCase().indexOf('admin') !== -1;
    iniciarSesion(esAdmin ? 'administrador' : 'residente', correo.value.trim());
    window.location.href = esAdmin
      ? '../../administrador/pantalla_inicio/inicio_admin.html'
      : '../bienvenida/bienvenida.html';
  }
});