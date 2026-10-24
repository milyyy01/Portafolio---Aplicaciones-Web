var filtroSede = document.getElementById('filtroSede');
var filtroEstado = document.getElementById('filtroEstado');
var filas = document.querySelectorAll('tbody tr[data-sede]');
var filaVacia = document.getElementById('filaVacia');

function filtrar() {
  var visibles = 0;
  filas.forEach(function (fila) {
    var coincideSede = filtroSede.value === '' || fila.dataset.sede === filtroSede.value;
    var coincideEstado = filtroEstado.value === '' || fila.dataset.estado === filtroEstado.value;
    fila.hidden = !(coincideSede && coincideEstado);
    if (!fila.hidden) { visibles++; }
  });
  filaVacia.hidden = visibles > 0;
}

filtroSede.addEventListener('change', filtrar);
filtroEstado.addEventListener('change', filtrar);

// Clic en una fila: abre el detalle de la solicitud
filas.forEach(function (fila) {
  fila.style.cursor = 'pointer';
  fila.addEventListener('click', function () {
    window.location.href = '../detalle_solicitud/detalle_solicitud.html';
  });
});
