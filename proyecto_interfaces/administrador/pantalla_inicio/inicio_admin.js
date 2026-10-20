document.querySelectorAll('a[href="#"]').forEach(function (enlace) {
  enlace.addEventListener('click', function (evento) { evento.preventDefault(); });
});

var pestanas = document.querySelectorAll('[data-pestana]');

pestanas.forEach(function (pestana) {
  pestana.addEventListener('click', function () {
    pestanas.forEach(function (otra) { otra.classList.remove('activa'); });
    pestana.classList.add('activa');
  });
});