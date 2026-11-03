// 1. Referencias al DOM
const formulario = document.getElementById('registro-estudiante');
const listaEstudiantes = document.getElementById('lista-estudiantes');
const mensajeVacio = document.getElementById('sin-datos');
const btnExportarJson = document.getElementById('btn-exportar-json');

// 2. Reglas de validación (expresiones regulares)
const LETRAS = 'A-Za-zÁÉÍÓÚáéíóúÑñÜü';
const reglas = {
    cedula: {
        regex: /^(0[1-9]|1\d|2[0-4]|30)[0-5]\d{7}$/,
        mensaje: 'Debe tener 10 dígitos válidos (provincia 01-24 o 30).'
    },
    apellidos: {
        regex: new RegExp(`^[${LETRAS}]{2,}(?:[ '-][${LETRAS}]+)*$`),
        mensaje: 'Solo letras y espacios (mínimo 2 caracteres).'
    },
    nombres: {
        regex: new RegExp(`^[${LETRAS}]{2,}(?:[ '-][${LETRAS}]+)*$`),
        mensaje: 'Solo letras y espacios (mínimo 2 caracteres).'
    },
    direccion: {
        regex: /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ.,#°\- ]{5,100}$/,
        mensaje: 'Entre 5 y 100 caracteres (letras, números y . , # - °).'
    },
    telefono: {
        regex: /^(09\d{8}|0[2-7]\d{7})$/,
        mensaje: 'Celular (09XXXXXXXX) o convencional (0[2-7]XXXXXXX).'
    },
    correo: {
        regex: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
        mensaje: 'Formato de correo inválido (ej. usuario@dominio.com).'
    },
    facultad: {
        regex: new RegExp(`^[${LETRAS}]{3,}(?:[ ,.-]+[${LETRAS}]+)*$`),
        mensaje: 'Solo letras y espacios (mínimo 3 caracteres).'
    },
    nivel: {
        regex: /^([1-9]|10)$/,
        mensaje: 'Debe ser un número del 1 al 10.'
    },
    paralelo: {
        regex: /^[A-Z]$/,
        mensaje: 'Una sola letra mayúscula (A-Z).'
    }
};

// 3. Estado: se carga de localStorage o se inicia vacío
const CLAVE = 'estudiantesGuardados';
let estudiantes = [];
try {
    estudiantes = JSON.parse(localStorage.getItem(CLAVE)) || [];
} catch (e) {
    estudiantes = [];
}

function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(estudiantes));
}

// 4. Validación de un campo
function validarCampo(id) {
    const input = document.getElementById(id);
    const error = document.getElementById('error-' + id);
    const valor = input.value.trim();
    let mensaje = '';

    if (!valor) {
        mensaje = 'Este campo es obligatorio.';
    } else if (!reglas[id].regex.test(valor)) {
        mensaje = reglas[id].mensaje;
    } else if (id === 'cedula' && estudiantes.some(e => e.cedula === valor)) {
        mensaje = 'Esta cédula ya está registrada.';
    }

    error.textContent = mensaje;
    input.classList.toggle('invalido', mensaje !== '');
    input.classList.toggle('valido', mensaje === '');
    return mensaje === '';
}

// Validación en tiempo real
Object.keys(reglas).forEach(id => {
    document.getElementById(id).addEventListener('input', () => validarCampo(id));
});

// 5. Envío del formulario
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const todosValidos = Object.keys(reglas).map(validarCampo).every(Boolean);
    if (!todosValidos) return;

    const nuevo = { fechaRegistro: new Date().toLocaleString() };
    Object.keys(reglas).forEach(id => {
        nuevo[id] = document.getElementById(id).value.trim();
    });

    estudiantes.push(nuevo);
    guardar();
    redibujar();
    formulario.reset();
    document.querySelectorAll('input').forEach(i => i.classList.remove('valido', 'invalido'));
});

// 6. Pintar la tabla (textContent evita inyección de HTML)
function redibujar() {
    listaEstudiantes.innerHTML = '';
    mensajeVacio.style.display = estudiantes.length ? 'none' : 'block';

    estudiantes.forEach((est, indice) => {
        const fila = document.createElement('tr');
        ['cedula', 'apellidos', 'nombres', 'direccion', 'telefono', 'correo', 'facultad', 'nivel', 'paralelo']
            .forEach(campo => {
                const celda = document.createElement('td');
                celda.textContent = est[campo];
                fila.appendChild(celda);
            });

        const celdaAccion = document.createElement('td');
        const btn = document.createElement('button');
        btn.textContent = 'Eliminar';
        btn.className = 'btn-eliminar';
        btn.addEventListener('click', () => eliminar(indice));
        celdaAccion.appendChild(btn);
        fila.appendChild(celdaAccion);

        listaEstudiantes.appendChild(fila);
    });
}

// 7. Eliminar por índice
function eliminar(indice) {
    estudiantes.splice(indice, 1);
    guardar();
    redibujar();
}

// 8. Exportar a JSON
btnExportarJson.addEventListener('click', () => {
    if (estudiantes.length === 0) return alert('No existen estudiantes para exportar.');
    const texto = JSON.stringify(estudiantes, null, 2);
    const url = URL.createObjectURL(new Blob([texto], { type: 'application/json' }));
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'estudiantes.json';
    enlace.click();
    URL.revokeObjectURL(url);
});

// 9. Render inicial
redibujar();