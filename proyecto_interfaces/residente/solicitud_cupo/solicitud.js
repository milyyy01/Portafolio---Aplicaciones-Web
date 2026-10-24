var totalPasos = 4;
var pasoActual = 1;
var nombresPasos = ['Datos personales', 'Ficha socioeconómica', 'Documentos adjuntos', 'Revisión y envío'];
var subtitulos = ['Ficha socioeconómica', 'Ficha socioeconómica', 'Documentos adjuntos', 'Revisión y envío'];

var formulario = document.getElementById('formulario');
var secciones = document.querySelectorAll('.seccion');
var barras = document.querySelectorAll('.barras span');
var progreso = document.getElementById('progreso');
var botonAtras = document.getElementById('botonAtras');
var botonSiguiente = document.getElementById('botonSiguiente');
var campoTipoBeca = document.getElementById('campoTipoBeca');
var mensajeExito = document.getElementById('mensajeExito');

var archivos = { cedula: null, matricula: null, socioeconomico: null, discapacidad: null };

var iconoSubir = '<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>';
var iconoNoAplica = '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>';

/* -Utilidades (valor, ponerError y limpiarError están en compartido/utilidades.js)- */
function opcionElegida(nombre) {
  var marcada = document.querySelector('input[name="' + nombre + '"]:checked');
  return marcada ? marcada.value : '';
}

// Quita el error de un campo apenas la persona lo corrige
formulario.addEventListener('input', function (evento) {
  limpiarError(evento.target.id || evento.target.name);
});
formulario.addEventListener('change', function (evento) {
  limpiarError(evento.target.id || evento.target.name);
});

/* -Validaciones por paso- */
function validarPaso1() {
  var valido = true;
  var soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]{2,}$/;

  if (!soloLetras.test(valor('nombres'))) {
    ponerError('nombres', 'Ingresa tus nombres completos (solo letras).'); valido = false;
  }
  if (!soloLetras.test(valor('apellidos'))) {
    ponerError('apellidos', 'Ingresa tus apellidos completos (solo letras).'); valido = false;
  }
  if (!/^\d{10}$/.test(valor('cedula'))) {
    ponerError('cedula', 'La cédula debe tener 10 dígitos.'); valido = false;
  }

  var nacimiento = valor('nacimiento');
  if (nacimiento === '') {
    ponerError('nacimiento', 'Selecciona tu fecha de nacimiento.'); valido = false;
  } else if (new Date(nacimiento) > new Date()) {
    ponerError('nacimiento', 'La fecha no puede ser futura.'); valido = false;
  }

  if (valor('correo') === '') {
    ponerError('correo', 'Ingresa tu correo institucional.'); valido = false;
  } else if (!FORMATO_CORREO.test(valor('correo'))) {
    ponerError('correo', 'El correo no tiene un formato válido.'); valido = false;
  }

  if (!/^09\d{8}$/.test(valor('telefono'))) {
    ponerError('telefono', 'Ingresa un celular válido de 10 dígitos (09...).'); valido = false;
  }
  if (valor('carrera') === '') { ponerError('carrera', 'Selecciona tu carrera.'); valido = false; }
  if (valor('sede') === '') { ponerError('sede', 'Selecciona tu sede o extensión.'); valido = false; }
  return valido;
}

function validarPaso2() {
  var valido = true;

  if (valor('canton').length < 3) {
    ponerError('canton', 'Ingresa tu cantón o ciudad de procedencia.'); valido = false;
  }
  if (valor('distancia') === '') { ponerError('distancia', 'Selecciona una opción.'); valido = false; }

  if (opcionElegida('beca') === '') {
    ponerError('beca', 'Indica si tienes beca activa.'); valido = false;
  } else if (opcionElegida('beca') === 'Sí' && valor('tipoBeca') === '') {
    ponerError('tipoBeca', 'Selecciona el tipo de beca.'); valido = false;
  }

  if (valor('ingreso') === '') { ponerError('ingreso', 'Selecciona una opción.'); valido = false; }

  var dependientes = valor('dependientes');
  if (dependientes === '' || !/^\d+$/.test(dependientes) || Number(dependientes) > 20) {
    ponerError('dependientes', 'Ingresa un número entre 0 y 20.'); valido = false;
  }

  if (opcionElegida('discapacidad') === '') {
    ponerError('discapacidad', 'Selecciona una opción.'); valido = false;
  }
  if (valor('vivienda') === '') { ponerError('vivienda', 'Selecciona una opción.'); valido = false; }
  return valido;
}

function validarPaso3() {
  var valido = true;
  var requeridos = ['cedula', 'matricula', 'socioeconomico'];
  if (opcionElegida('discapacidad') === 'Sí') { requeridos.push('discapacidad'); }

  requeridos.forEach(function (clave) {
    if (!archivos[clave]) {
      var documento = document.querySelector('[data-doc="' + clave + '"]');
      documento.querySelector('.error').textContent = 'Adjunta este documento.';
      valido = false;
    }
  });
  return valido;
}

function validarPaso4() {
  var valido = true;
  if (!document.getElementById('declaroVeraz').checked) {
    ponerError('declaroVeraz', 'Debes declarar que la información es verídica.'); valido = false;
  }
  if (!document.getElementById('aceptoLopd').checked) {
    ponerError('aceptoLopd', 'Debes aceptar la política de tratamiento de datos.'); valido = false;
  }
  return valido;
}

var validaciones = [null, validarPaso1, validarPaso2, validarPaso3, validarPaso4];

/* -Pasos- */
function mostrarPaso(numero) {
  pasoActual = numero;
  secciones.forEach(function (seccion) {
    seccion.hidden = Number(seccion.dataset.paso) !== numero;
  });
  barras.forEach(function (barra, indice) {
    barra.classList.toggle('hecha', indice < numero);
  });
  progreso.classList.toggle('claro', numero === 3);
  document.getElementById('subtitulo').textContent = subtitulos[numero - 1];
  document.getElementById('textoPaso').textContent =
    'Paso ' + numero + ' de ' + totalPasos + ' · ' + nombresPasos[numero - 1];

  botonAtras.hidden = numero === 1;
  botonSiguiente.textContent = numero === totalPasos ? 'Enviar solicitud' : 'Siguiente';
  mensajeExito.hidden = true;

  if (numero === 4) { construirResumen(); }
  window.scrollTo(0, 0);
}

botonSiguiente.addEventListener('click', function () {
  if (!validaciones[pasoActual]()) { return; }
  if (pasoActual < totalPasos) {
    mostrarPaso(pasoActual + 1);
  } else {
    mensajeExito.hidden = false; // el envío real aún no existe
    setTimeout(function () { window.location.href = '../pantalla_inicio/inicio_residente.html'; }, 1500);
  }
});

botonAtras.addEventListener('click', function () {
  if (pasoActual > 1) { mostrarPaso(pasoActual - 1); }
});

document.querySelectorAll('.editar').forEach(function (boton) {
  boton.addEventListener('click', function () { mostrarPaso(Number(boton.dataset.ir)); });
});

/* -Ficha socioeconómica- */
campoTipoBeca.hidden = true;

document.querySelectorAll('input[name="beca"]').forEach(function (opcion) {
  opcion.addEventListener('change', function () {
    var tieneBeca = opcionElegida('beca') === 'Sí';
    campoTipoBeca.hidden = !tieneBeca;
    if (!tieneBeca) { document.getElementById('tipoBeca').value = ''; }
  });
});

document.querySelectorAll('input[name="discapacidad"]').forEach(function (opcion) {
  opcion.addEventListener('change', function () {
    actualizarCarnet(opcionElegida('discapacidad') === 'Sí');
  });
});

/* -Documentos-*/
function formatearTamano(bytes) {
  if (bytes < 1024 * 1024) { return Math.max(1, Math.round(bytes / 1024)) + ' KB'; }
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function actualizarCarnet(aplica) {
  var documento = document.querySelector('[data-doc="discapacidad"]');
  var vacio = documento.querySelector('.doc-vacio');
  documento.classList.toggle('inactivo', !aplica);
  vacio.disabled = !aplica;
  vacio.querySelector('svg').innerHTML = aplica ? iconoSubir : iconoNoAplica;
  vacio.querySelector('span').textContent = aplica ? 'Toca para subir archivo' : 'No aplica según tus respuestas';
  if (!aplica) { quitarArchivo(documento); }
}

function quitarArchivo(documento) {
  archivos[documento.dataset.doc] = null;
  documento.querySelector('input[type="file"]').value = '';
  documento.querySelector('.doc-cargado').hidden = true;
  documento.querySelector('.doc-vacio').hidden = false;
  documento.querySelector('.error').textContent = '';
}

document.querySelectorAll('.documento').forEach(function (documento) {
  var entrada = documento.querySelector('input[type="file"]');
  var error = documento.querySelector('.error');

  documento.querySelector('.doc-vacio').addEventListener('click', function () { entrada.click(); });
  documento.querySelector('.doc-quitar').addEventListener('click', function () { quitarArchivo(documento); });

  entrada.addEventListener('change', function () {
    var archivo = entrada.files[0];
    if (!archivo) { return; }
    error.textContent = '';

    if (!/\.(pdf|jpe?g)$/i.test(archivo.name)) {
      error.textContent = 'Formato no permitido. Sube un PDF o JPG.';
      entrada.value = '';
      return;
    }
    if (archivo.size > 5 * 1024 * 1024) {
      error.textContent = 'El archivo supera los 5MB.';
      entrada.value = '';
      return;
    }

    archivos[documento.dataset.doc] = archivo;
    documento.querySelector('.doc-nombre').textContent = archivo.name + ' · ' + formatearTamano(archivo.size);
    documento.querySelector('.doc-cargado').hidden = false;
    documento.querySelector('.doc-vacio').hidden = true;
  });
});

/* -Resumen- */
function construirResumen() {
  document.getElementById('resNombre').textContent =
    valor('nombres') + ' ' + valor('apellidos') + ' · ' + valor('cedula');
  document.getElementById('resCarrera').textContent = valor('carrera') + ' · ' + valor('sede');

  document.getElementById('resCanton').textContent = valor('canton');
  document.getElementById('resBeca').textContent = opcionElegida('beca') === 'Sí'
    ? 'Beca activa: ' + valor('tipoBeca')
    : 'Beca activa: No';
  document.getElementById('resIngreso').textContent = 'Ingreso familiar: ' + valor('ingreso');

  var lista = document.getElementById('resDocumentos');
  lista.innerHTML = '';
  document.querySelectorAll('.documento').forEach(function (documento) {
    if (archivos[documento.dataset.doc]) {
      var item = document.createElement('li');
      item.textContent = documento.dataset.titulo;
      lista.appendChild(item);
    }
  });
}

/* -Inicio- */
mostrarPaso(1);