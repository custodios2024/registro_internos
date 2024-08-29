// Función para iniciar sesión
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Lógica simple de autenticación
    if (username === 'admin' && password === 'admin') {
        localStorage.setItem('loggedIn', 'true');
        window.location.href = 'registro_internos.html'; // Redirige a la página de registro de internos
    } else {
        alert('Usuario o contraseña incorrectos.');
    }
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

// Función para exportar los registros a PDF
async function exportarPDF() {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        alert('jsPDF no está cargado correctamente.');
        return;
    }

    const doc = new jsPDF('landscape');
    const fechaSeleccionada = document.getElementById('fechaSeleccion').value;
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const registrosFiltrados = registros.filter(registro => registro.fecha === fechaSeleccionada);

    if (registrosFiltrados.length === 0) {
        alert('No hay registros para exportar.');
        return;
    }

    // Centrar y ajustar el encabezado
    doc.setFontSize(18);
    doc.text('Centro de Internamiento:', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text('DIRECCIÓN DE MEDIDAS DE EJECUCIÓN PARA ADOLESCENTES', doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });

    doc.setFontSize(18);
    doc.text('Registro de Internos', doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });

    // Configuración de autoTable para crear la tabla
    const headers = [['Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal de la DGRS']];
    const rows = registrosFiltrados.map(record => Object.values(record));

    doc.autoTable({
        head: headers,
        body: rows,
        startY: 50,
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255], textColor: 0, lineWidth: 0.1 },
        bodyStyles: { lineWidth: 0.1 },
        styles: { cellPadding: 3, fontSize: 10, halign: 'center', valign: 'middle' },
    });

    doc.save(`Registro_${fechaSeleccionada}.pdf`);
}

// Función para exportar todos los registros a PDF
async function exportarPDFCompleto() {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        alert('jsPDF no está cargado correctamente.');
        return;
    }

    const doc = new jsPDF('landscape');
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    
    if (registros.length === 0) {
        alert('No hay registros para exportar.');
        return;
    }

    // Centrar y ajustar el encabezado
    doc.setFontSize(18);
    doc.text('Centro de Internamiento:', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
    doc.setFontSize(14);
    doc.text('DIRECCIÓN DE MEDIDAS DE EJECUCIÓN PARA ADOLESCENTES', doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });

    doc.setFontSize(18);
    doc.text('Registro de Internos', doc.internal.pageSize.getWidth() / 2, 35, { align: 'center' });

    // Configuración de autoTable para crear la tabla
    const headers = [['Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal de la DGRS']];
    const rows = registros.map(record => Object.values(record));

    doc.autoTable({
        head: headers,
        body: rows,
        startY: 50,
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255], textColor: 0, lineWidth: 0.1 },
        bodyStyles: { lineWidth: 0.1 },
        styles: { cellPadding: 3, fontSize: 10, halign: 'center', valign: 'middle' },
    });

    doc.save('Registro_Completo.pdf');
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
}

// Inicializa la lista de fechas en el select
function inicializarFechas() {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const fechas = [...new Set(registros.map(registro => registro.fecha))];
    const fechaSeleccion = document.getElementById('fechaSeleccion');

    fechas.forEach(fecha => {
        const option = document.createElement('option');
        option.value = fecha;
        option.textContent = fecha;
        fechaSeleccion.appendChild(option);
    });
}

// Llama a inicializarFechas al cargar la página
window.onload = inicializarFechas;
