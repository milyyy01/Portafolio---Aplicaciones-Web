var enlaces = document.querySelectorAll('[data-menu]');

enlaces.forEach(function (enlace) {
  enlace.addEventListener('click', function (evento) {
    evento.preventDefault();
    enlaces.forEach(function (otro) { otro.classList.remove('activo'); });
    enlace.classList.add('activo');
  });
});