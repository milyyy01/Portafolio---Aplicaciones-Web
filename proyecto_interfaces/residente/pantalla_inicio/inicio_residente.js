document.querySelectorAll('a[href="#"]').forEach(function (enlace) {
  enlace.addEventListener('click', function (evento) { evento.preventDefault(); });
});

var opcionesMenu = document.querySelectorAll('[data-menu]');

opcionesMenu.forEach(function (opcion) {
  opcion.addEventListener('click', function () {
    opcionesMenu.forEach(function (otra) { otra.classList.remove('activo'); });
    opcion.classList.add('activo');
  });
});