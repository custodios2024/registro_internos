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
    llenarSelectorDeFechas(); // Actualiza la lista de fechas en el selector
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
    const headers = ['Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal DGRS', 'Centro de Internamiento'];
    
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.backgroundColor = '#f4f4f4';
        headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    registrosFiltrados.forEach(registro => {
        const row = tbody.insertRow();
        Object.values(registro).forEach(value => {
            const cell = row.insertCell();
            cell.textContent = value;
            cell.style.border = '1px solid #ddd';
            cell.style.padding = '8px';
        });
    });

    recordList.appendChild(table);
}

// Función para llenar el selector de fechas
function llenarSelectorDeFechas() {
    const fechaSeleccion = document.getElementById('fechaSeleccion');
    fechaSeleccion.innerHTML = '';

    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const fechas = [...new Set(registros.map(registro => registro.fecha))];

    fechas.forEach(fecha => {
        const option = document.createElement('option');
        option.value = fecha;
        option.textContent = fecha;
        fechaSeleccion.appendChild(option);
    });
}

// Función para exportar a PDF
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const { autoTable } = window.jspdf;

    if (!jsPDF || !autoTable) {
        alert('jsPDF no está cargado correctamente.');
        return;
    }

    const fechaSeleccionada = document.getElementById('fechaSeleccion').value;
    const registros = JSON.parse(localStorage.getItem('registros')) || [];

    const registrosFiltrados = registros.filter(registro => registro.fecha === fechaSeleccionada);

    if (registrosFiltrados.length === 0) {
        alert('No hay registros para la fecha seleccionada.');
        return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFontSize(16);
    doc.text('Registro de Internos', 14, 10);

    const tableColumn = ['Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal DGRS', 'Centro de Internamiento'];
    const tableRows = registrosFiltrados.map(registro => [
        registro.fecha,
        registro.hora,
        registro.motivo,
        registro.excarcelados,
        registro.presentes,
        registro.total,
        registro.custodioResponsable,
        registro.personalDGRS,
        registro.centroInternamiento
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, margin: { top: 20 } });
    doc.save('registro_internos.pdf');
}

// Función para exportar PDF completo
function exportarPDFCompleto() {
    const { jsPDF } = window.jspdf;
    const { autoTable } = window.jspdf;

    if (!jsPDF || !autoTable) {
        alert('jsPDF no está cargado correctamente.');
        return;
    }

    const registros = JSON.parse(localStorage.getItem('registros')) || [];

    if (registros.length === 0) {
        alert('No hay registros para exportar.');
        return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFontSize(16);
    doc.text('Registro Completo de Internos', 14, 10);

    const tableColumn = ['Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal DGRS'];
    const tableRows = registros.map(registro => [
        registro.fecha,
        registro.hora,
        registro.motivo,
        registro.excarcelados,
        registro.presentes,
        registro.total,
        registro.custodioResponsable,
        registro.personalDGRS
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, margin: { top: 20 } });
    doc.save('registro_completo_internos.pdf');
}

// Inicializar la lista de fechas al cargar la página
window.onload = function() {
    checkAuthentication();
    llenarSelectorDeFechas();
}
