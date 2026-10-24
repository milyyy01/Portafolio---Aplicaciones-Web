const formulario = document.getElementById('formulario');
const foto = document.getElementById('foto');
const textoFoto = document.getElementById('textoFoto');
const mensajeExito = document.getElementById('mensajeExito');
const textoFotoInicial = textoFoto.textContent;

const listaIncidencias = document.getElementById('listaIncidencias');
const mensajeVacio = document.getElementById('mensajeVacio');
const botonJson = document.getElementById('botonJson');
const botonXml = document.getElementById('botonXml');

/* -Validación (valor, ponerError y limpiarError están en compartido/utilidades.js)- */
formulario.addEventListener('input', function (evento) { limpiarError(evento.target.id); });
formulario.addEventListener('change', function (evento) { limpiarError(evento.target.id); });

/* -Foto (opcional): JPG o PNG- */
document.getElementById('botonFoto').addEventListener('click', function () { foto.click(); });

foto.addEventListener('change', function () {
  const archivo = foto.files[0];
  limpiarError('foto');
  if (!archivo) { textoFoto.textContent = textoFotoInicial; return; }

  if (!/\.(jpe?g|png)$/i.test(archivo.name)) {
    ponerError('foto', 'Formato no permitido. Sube una imagen JPG o PNG.');
    foto.value = '';
    textoFoto.textContent = textoFotoInicial;
  } else if (archivo.size > 5 * 1024 * 1024) {
    ponerError('foto', 'La imagen supera los 5MB.');
    foto.value = '';
    textoFoto.textContent = textoFotoInicial;
  } else {
    textoFoto.textContent = archivo.name;
  }
});

/* -Mostrar los reportes guardados- */
function crearElemento(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) { elemento.className = clase; }
  if (texto !== undefined) { elemento.textContent = texto; } // textContent evita inyectar HTML
  return elemento;
}

function pintarIncidencias() {
  const lista = leerIncidencias();
  listaIncidencias.innerHTML = '';
  mensajeVacio.hidden = lista.length > 0;

  lista.slice().reverse().forEach(function (inc) {
    const item = crearElemento('li', 'incidencia-item');

    const cabecera = crearElemento('div', 'incidencia-cabecera');
    cabecera.appendChild(crearElemento('strong', '', inc.tipo + ' · ' + inc.habitacion));
    cabecera.appendChild(crearElemento(
      'span',
      'etiqueta-estado ' + (inc.estado === 'Abierta' ? 'abierta' : 'resuelta'),
      inc.estado
    ));
    item.appendChild(cabecera);

    item.appendChild(crearElemento('p', '', inc.descripcion));
    const fecha = new Date(inc.fecha).toLocaleString('es-EC');
    const detalle = 'Urgencia: ' + inc.urgencia + ' · ' + fecha +
      (inc.foto ? ' · Foto: ' + inc.foto : '') + ' · Código: ' + inc.codigo;
    item.appendChild(crearElemento('small', '', detalle));

    const botones = crearElemento('div', 'incidencia-botones');
    const botonEliminar = crearElemento('button', '', 'Eliminar');
    botonEliminar.type = 'button';
    botonEliminar.dataset.accion = 'eliminar';
    botonEliminar.dataset.codigo = inc.codigo;
    botones.appendChild(botonEliminar);
    item.appendChild(botones);

    listaIncidencias.appendChild(item);
  });
}

// Un solo "oyente" para los botones de todas las tarjetas
listaIncidencias.addEventListener('click', function (evento) {
  const boton = evento.target.closest('button[data-accion]');
  if (!boton) { return; }

  const codigo = boton.dataset.codigo;
  const lista = leerIncidencias().filter(function (inc) { return inc.codigo !== codigo; });
  guardarIncidencias(lista);
  pintarIncidencias();
});

/* -Enviar: validar y guardar- */
formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  mensajeExito.hidden = true;
  let valido = true;

  if (valor('tipo') === '') { ponerError('tipo', 'Selecciona el tipo de incidencia.'); valido = false; }
  if (valor('habitacion').length < 2) { ponerError('habitacion', 'Ingresa tu habitación.'); valido = false; }
  if (valor('descripcion').length < 10) {
    ponerError('descripcion', 'Describe el problema con al menos 10 caracteres.'); valido = false;
  }
  if (valor('urgencia') === '') { ponerError('urgencia', 'Selecciona el nivel de urgencia.'); valido = false; }
  if (document.getElementById('error-foto').textContent !== '') { valido = false; }

  if (!valido) { return; }

  // Objeto con claves descriptivas en español
  const nuevaIncidencia = {
    codigo: Date.now().toString(),
    tipo: valor('tipo'),
    habitacion: valor('habitacion'),
    descripcion: valor('descripcion'),
    urgencia: valor('urgencia'),
    foto: foto.files[0] ? foto.files[0].name : '', // solo se guarda el nombre del archivo
    estado: 'Abierta',
    fecha: new Date().toISOString()
  };

  const lista = leerIncidencias();
  lista.push(nuevaIncidencia);

  if (!guardarIncidencias(lista)) {
    alert('No se pudo guardar el reporte en el navegador.');
    return;
  }

  mensajeExito.hidden = false;
  formulario.reset();
  foto.value = '';
  textoFoto.textContent = textoFotoInicial;
  pintarIncidencias();
});

/* -Exportar- */
botonJson.addEventListener('click', function () {
  const lista = leerIncidencias();
  if (lista.length === 0) { return alert('No existen reportes para exportar.'); }
  generarDescarga(JSON.stringify(lista, null, 2), 'incidencias.json', 'application/json');
});

botonXml.addEventListener('click', function () {
  const lista = leerIncidencias();
  if (lista.length === 0) { return alert('No existen reportes para exportar.'); }
  generarDescarga(incidenciasAXml(lista), 'incidencias.xml', 'application/xml');
});

/* -Inicio- */
pintarIncidencias();