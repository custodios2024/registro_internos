// Función para iniciar sesión
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Lógica simple de autenticación
    if (username === 'admin' && password === '2024contraseña') {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'registro_internos.html'; // Redirige a la página de registro de internos
    } else {
        alert('Usuario o contraseña incorrectos.');
    }
}

// Función para verificar si el usuario está autenticado
function checkAuthentication() {
    if (localStorage.getItem('loggedIn') !== 'true') {
        alert('Debes iniciar sesión primero.');
        window.location.href = 'index.html';
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
}

// Función para guardar el registro
function guardarRegistro() {
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const motivo = document.getElementById('motivo').value;
    const excarcelados = parseInt(document.getElementById('excarcelados').value) || 0;
    const presentes = parseInt(document.getElementById('presentes').value) || 0;
    const total = excarcelados + presentes;
    const custodioResponsable = document.getElementById('custodioResponsable').value;
    const personalDGRS = document.getElementById('personalDGRS').value;
    const centroInternamiento = document.getElementById('centroInternamiento').value;

    const registro = {
        fecha,
        hora,
        motivo,
        excarcelados,
        presentes,
        total,
        custodioResponsable,
        personalDGRS,
        centroInternamiento
    };

    let registros = JSON.parse(localStorage.getItem('registros')) || [];
    registros.push(registro);
    localStorage.setItem('registros', JSON.stringify(registros));
    
    alert('Registro guardado correctamente.');
    mostrarRegistrosPorFecha(); // Actualiza la lista de registros
}

// Función para sumar los valores de excarcelados y presentes
function sumarTotal() {
    const excarcelados = parseInt(document.getElementById('excarcelados').value) || 0;
    const presentes = parseInt(document.getElementById('presentes').value) || 0;
    document.getElementById('total').value = excarcelados + presentes;
}

// Función para mostrar registros por fecha
function mostrarRegistrosPorFecha() {
    const fechaSeleccionada = document.getElementById('fechaSeleccion').value;
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    
    const registrosFiltrados = registros.filter(registro => registro.fecha === fechaSeleccionada);
    
    const recordList = document.getElementById('recordList');
    recordList.innerHTML = '';

    if (registrosFiltrados.length === 0) {
        recordList.innerHTML = 'No se encontraron registros.';
        return;
    }

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    const header = table.createTHead();
    const headerRow = header.insertRow();
    const headers = ['Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal de la DGRS'];
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.border = '1px solid black';
        th.style.padding = '5px';
        th.style.textAlign = 'center';
        th.style.lineHeight = '1.5'; // Interlineado
        headerRow.appendChild(th);
    });

    const body = table.createTBody();
    registrosFiltrados.forEach(record => {
        const row = body.insertRow();
        Object.values(record).forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
            cell.style.border = '1px solid black';
            cell.style.padding = '5px';
            cell.style.textAlign = 'center';
        });
    });

    recordList.appendChild(table);
}

// Función para llenar el selector de fechas únicas
function llenarSelectorDeFechas() {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const fechasUnicas = [...new Set(registros.map(registro => registro.fecha))];

    const fechaSeleccion = document.getElementById('fechaSeleccion');
    fechaSeleccion.innerHTML = '';

    fechasUnicas.forEach(fecha => {
        const option = document.createElement('option');
        option.value = fecha;
        option.textContent = fecha;
        fechaSeleccion.appendChild(option);
    });

    mostrarRegistrosPorFecha(); // Mostrar registros para la fecha inicial seleccionada
}

// Función para exportar los registros filtrados por fecha a PDF
function exportarPDF() {
    const fechaSeleccionada = document.getElementById('fechaSeleccion').value;
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const registrosFiltrados = registros.filter(registro => registro.fecha === fechaSeleccionada);

    if (registrosFiltrados.length === 0) {
        alert('No hay registros para exportar.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(12);
    doc.text('Registros de Internos', 14, 15);
    doc.autoTable({
        startY: 20,
        head: [['Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal de la DGRS']],
        body: registrosFiltrados.map(registro => [
            registro.fecha,
            registro.hora,
            registro.motivo,
            registro.excarcelados,
            registro.presentes,
            registro.total,
            registro.custodioResponsable,
            registro.personalDGRS
        ])
    });
    doc.save(`registros_${fechaSeleccionada}.pdf`);
}

// Función para exportar todos los registros a PDF
function exportarPDFCompleto() {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];

    if (registros.length === 0) {
        alert('No hay registros para exportar.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(12);
    doc.text('Todos los Registros de Internos', 14, 15);
    doc.autoTable({
        startY: 20,
        head: [['Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal de la DGRS']],
        body: registros.map(registro => [
            registro.fecha,
            registro.hora,
            registro.motivo,
            registro.excarcelados,
            registro.presentes,
            registro.total,
            registro.custodioResponsable,
            registro.personalDGRS
        ])
    });
    doc.save('todos_los_registros.pdf');
}

// Inicialización cuando se carga la página
window.onload = function() {
    checkAuthentication();
    llenarSelectorDeFechas();
};
