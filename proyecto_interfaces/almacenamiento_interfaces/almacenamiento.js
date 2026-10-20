// Funciones compartidas por incidencia.html y reportes.html
const CLAVE_INCIDENCIAS = 'sgruIncidencias';

// Lee el arreglo guardado en LocalStorage (o devuelve uno vacío)
function leerIncidencias() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_INCIDENCIAS)) || [];
  } catch (error) {
    return [];
  }
}

// Guarda el arreglo como texto JSON. Devuelve true si se pudo guardar
function guardarIncidencias(lista) {
  try {
    localStorage.setItem(CLAVE_INCIDENCIAS, JSON.stringify(lista));
    return true;
  } catch (error) {
    return false;
  }
}

// Descarga un archivo desde el navegador
function generarDescarga(contenido, nombreArchivo, tipoMime) {
  const bloque = new Blob([contenido], { type: tipoMime });
  const url = URL.createObjectURL(bloque);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

// Evita que caracteres reservados rompan el XML
function escaparXml(texto) {
  return String(texto).replace(/[<>&'"]/g, function (caracter) {
    switch (caracter) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Lista de incidencias -> texto XML
function incidenciasAXml(lista) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<incidencias>\n';
  lista.forEach(function (i) {
    xml += '  <incidencia codigo="' + escaparXml(i.codigo) + '">\n';
    xml += '    <tipo>' + escaparXml(i.tipo) + '</tipo>\n';
    xml += '    <habitacion>' + escaparXml(i.habitacion) + '</habitacion>\n';
    xml += '    <descripcion>' + escaparXml(i.descripcion) + '</descripcion>\n';
    xml += '    <urgencia>' + escaparXml(i.urgencia) + '</urgencia>\n';
    xml += '    <foto>' + escaparXml(i.foto) + '</foto>\n';
    xml += '    <estado>' + escaparXml(i.estado) + '</estado>\n';
    xml += '    <fecha>' + escaparXml(i.fecha) + '</fecha>\n';
    xml += '  </incidencia>\n';
  });
  return xml + '</incidencias>';
}