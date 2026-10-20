var filtroEstado = document.getElementById('filtroEstado');
var filas = document.querySelectorAll('tbody tr[data-estado]');
var filaVacia = document.getElementById('filaVacia');

filtroEstado.addEventListener('change', function () {
  var visibles = 0;
  filas.forEach(function (fila) {
    var coincide = filtroEstado.value === '' || fila.dataset.estado === filtroEstado.value;
    fila.hidden = !coincide;
    if (coincide) { visibles++; }
  });
  filaVacia.hidden = visibles > 0;
});