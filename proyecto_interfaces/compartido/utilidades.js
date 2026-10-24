// Utilidades compartidas por todas las pantallas (se cargan antes del JS de cada una)

// Correo con forma algo@dominio.ext (no comprueba que exista)
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Texto de un campo, sin espacios al inicio ni al final
function valor(id) { return document.getElementById(id).value.trim(); }

// Escribe el mensaje en <small id="error-ID"> y marca el campo en rojo
function ponerError(id, mensaje) {
  document.getElementById('error-' + id).textContent = mensaje;
  const campo = document.getElementById(id);
  if (campo) { campo.classList.add('invalido'); }
}

// Borra el mensaje y el borde rojo
function limpiarError(id) {
  const error = document.getElementById('error-' + id);
  if (error) { error.textContent = ''; }
  const campo = document.getElementById(id);
  if (campo) { campo.classList.remove('invalido'); }
}

// Los enlaces href="#" aún no llevan a ninguna pantalla: se anulan para que no salten al inicio
document.querySelectorAll('a[href="#"]').forEach(function (enlace) {
  enlace.addEventListener('click', function (evento) { evento.preventDefault(); });
});

// Los elementos con data-destino="ruta" navegan a esa página al hacer clic
document.querySelectorAll('[data-destino]').forEach(function (elemento) {
  elemento.addEventListener('click', function () { window.location.href = elemento.dataset.destino; });
});

// ----- Sesión (demo): se guarda en sessionStorage y se pierde al cerrar la pestaña -----
const CLAVE_SESION = 'sgruSesion';
const PAGINA_LOGIN = '../../residente/inicio_sesion/login.html';  // todas las pantallas están a 2 niveles de profundidad

function leerSesion() {
  try { return JSON.parse(sessionStorage.getItem(CLAVE_SESION)); } catch (error) { return null; }
}

function iniciarSesion(rol, correo) {
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ rol: rol, correo: correo }));
}

function cerrarSesion() {
  sessionStorage.removeItem(CLAVE_SESION);
  window.location.replace(PAGINA_LOGIN);   // replace: la pantalla protegida no queda en el historial
}

// Las pantallas con <body data-rol="residente|administrador"> exigen una sesión de ese rol
function exigirSesion() {
  const rol = document.body.dataset.rol;
  const sesion = leerSesion();
  if (rol && (!sesion || sesion.rol !== rol)) { window.location.replace(PAGINA_LOGIN); }
}
exigirSesion();
// Al volver con "Atrás", el navegador puede mostrar la página guardada: se revisa de nuevo
window.addEventListener('pageshow', function (evento) { if (evento.persisted) { exigirSesion(); } });

// Cualquier elemento con data-cerrar-sesion cierra la sesión al hacer clic
document.querySelectorAll('[data-cerrar-sesion]').forEach(function (elemento) {
  elemento.addEventListener('click', cerrarSesion);
});
