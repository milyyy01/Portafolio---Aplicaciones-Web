const indIncidencias = document.getElementById('indIncidencias');
const listaTipos = document.getElementById('listaTipos');
const mensajeExportar = document.getElementById('mensajeExportar');

// Valores fijos (aún no hay almacenamiento para ocupación, becas ni tiempo de respuesta)
const OCUPACION_GENERAL = 78;
const BECAS_OTORGADAS = 96;
const TIEMPO_RESPUESTA_HORAS = 22;

/* -Calcular el reporte con las incidencias guardadas- */
function calcularReporte() {
  const incidencias = leerIncidencias();
  const abiertas = incidencias.filter(function (i) { return i.estado === 'Abierta'; }).length;

  // Contar cuántas incidencias hay de cada tipo
  const conteo = {};
  incidencias.forEach(function (i) { conteo[i.tipo] = (conteo[i.tipo] || 0) + 1; });

  const tipos = Object.keys(conteo)
    .map(function (tipo) {
      return {
        tipo: tipo,
        cantidad: conteo[tipo],
        porcentaje: Math.round((conteo[tipo] / incidencias.length) * 100)
      };
    })
    .sort(function (a, b) { return b.cantidad - a.cantidad; })
    .slice(0, 3);

  return {
    periodo: '2026-2',
    generado: new Date().toISOString(),
    indicadores: {
      ocupacionGeneral: OCUPACION_GENERAL,
      becasOtorgadas: BECAS_OTORGADAS,
      incidenciasAbiertas: abiertas,
      tiempoRespuestaHoras: TIEMPO_RESPUESTA_HORAS
    },
    ocupacionPorSede: [{ sede: 'Manta', porcentaje: OCUPACION_GENERAL }],
    tiposFrecuentes: tipos
  };
}

/* -Mostrar en pantalla- */
function pintarReporte() {
  const reporte = calcularReporte();
  indIncidencias.textContent = reporte.indicadores.incidenciasAbiertas;
  listaTipos.innerHTML = '';

  if (reporte.tiposFrecuentes.length === 0) {
    const vacio = document.createElement('li');
    vacio.textContent = 'Aún no hay incidencias registradas.';
    listaTipos.appendChild(vacio);
    return;
  }

  reporte.tiposFrecuentes.forEach(function (item) {
    const fila = document.createElement('li');
    const nombre = document.createElement('span');
    nombre.textContent = item.tipo;
    const porcentaje = document.createElement('strong');
    porcentaje.textContent = item.porcentaje + '%';
    fila.appendChild(nombre);
    fila.appendChild(porcentaje);
    listaTipos.appendChild(fila);
  });
}

/* -Reporte -> XML- */
function reporteAXml(reporte) {
  const ind = reporte.indicadores;
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<reporte periodo="' + escaparXml(reporte.periodo) + '" generado="' + escaparXml(reporte.generado) + '">\n';
  xml += '  <indicadores>\n';
  xml += '    <ocupacionGeneral>' + ind.ocupacionGeneral + '</ocupacionGeneral>\n';
  xml += '    <becasOtorgadas>' + ind.becasOtorgadas + '</becasOtorgadas>\n';
  xml += '    <incidenciasAbiertas>' + ind.incidenciasAbiertas + '</incidenciasAbiertas>\n';
  xml += '    <tiempoRespuestaHoras>' + ind.tiempoRespuestaHoras + '</tiempoRespuestaHoras>\n';
  xml += '  </indicadores>\n';
  xml += '  <ocupacionPorSede>\n';
  reporte.ocupacionPorSede.forEach(function (s) {
    xml += '    <sede nombre="' + escaparXml(s.sede) + '" porcentaje="' + s.porcentaje + '"/>\n';
  });
  xml += '  </ocupacionPorSede>\n';
  xml += '  <tiposFrecuentes>\n';
  reporte.tiposFrecuentes.forEach(function (t) {
    xml += '    <tipo nombre="' + escaparXml(t.tipo) + '" cantidad="' + t.cantidad + '" porcentaje="' + t.porcentaje + '"/>\n';
  });
  xml += '  </tiposFrecuentes>\n';
  xml += '</reporte>';
  return xml;
}

/* -Exportar- */
function avisar(texto) {
  mensajeExportar.textContent = texto;
  mensajeExportar.hidden = false;
}

document.getElementById('botonExportarJson').addEventListener('click', function () {
  generarDescarga(JSON.stringify(calcularReporte(), null, 2), 'reporte_institucional.json', 'application/json');
  avisar('Reporte exportado a JSON.');
});

document.getElementById('botonExportarXml').addEventListener('click', function () {
  generarDescarga(reporteAXml(calcularReporte()), 'reporte_institucional.xml', 'application/xml');
  avisar('Reporte exportado a XML.');
});

// Si se agrega una incidencia en otra pestaña, se actualiza sola
window.addEventListener('storage', pintarReporte);

/* -Inicio- */
pintarReporte();