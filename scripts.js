// Función de inicio de sesión
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aquí puedes añadir la lógica para validar el usuario y la contraseña  
    if (username === 'admin' && password === 'admin') {
        document.getElementById('loginContainer').classList.add('hidden');
        document.getElementById('registroContainer').classList.remove('hidden');
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

// Función para exportar los registros a PDF
async function exportarPDF() {
    const { jsPDF } = window.jspdf; // Asegúrate de obtener la clase jsPDF correctamente
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

    // Añadir título
    doc.setFontSize(18);
    doc.text('Centro de Internamiento:', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('DIRECCIÓN DE MEDIDAS DE EJECUCIÓN PARA ADOLESCENTES', 105, 30, { align: 'center' });

    doc.setFontSize(18);
    doc.text('Registro de Internos', 105, 40, { align: 'center' });

    // Establecer el formato de la tabla
    doc.setFontSize(10);
    const startY = 60;

    doc.autoTable({
        startY,
        head: [['Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal de la DGRS']],
        body: registrosFiltrados.map(record => [
            record.fecha,
            record.hora,
            record.motivo,
            record.excarcelados,
            record.presentes,
            record.total,
            record.custodioResponsable,
            record.personalDGRS
        ]),
        theme: 'grid',
        headStyles: { fillColor: [100, 100, 255] },
        margin: { left: 10, right: 10 }
    });

    doc.save(`Registro_${fechaSeleccionada}.pdf`);
}

// Función para exportar todos los registros a PDF
async function exportarPDFCompleto() {
    const { jsPDF } = window.jspdf; // Asegúrate de obtener la clase jsPDF correctamente
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

    // Añadir título
    doc.setFontSize(18);
    doc.text('Centro de Internamiento:', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('DIRECCIÓN DE MEDIDAS DE EJECUCIÓN PARA ADOLESCENTES', 105, 30, { align: 'center' });

    doc.setFontSize(18);
    doc.text('Registro de Internos Completo', 105, 40, { align: 'center' });

    // Establecer el formato de la tabla
    doc.setFontSize(10);
    const startY = 60;

    doc.autoTable({
        startY,
        head: [['Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal de la DGRS']],
        body: registros.map(record => [
            record.fecha,
            record.hora,
            record.motivo,
            record.excarcelados,
            record.presentes,
            record.total,
            record.custodioResponsable,
            record.personalDGRS
        ]),
        theme: 'grid',
        headStyles: { fillColor: [100, 100, 255] },
        margin: { left: 10, right: 10 }
    });

    doc.save('Registro_Completo.pdf');
}

// Función para sumar el total de excarcelados y presentes
function sumarTotal() {
    const excarcelados = parseInt(document.getElementById('excarcelados').value) || 0;
    const presentes = parseInt(document.getElementById('presentes').value) || 0;
    document.getElementById('total').value = excarcelados + presentes;
}

// Función para guardar un nuevo registro en localStorage
function guardarRegistro() {
    const centroInternamiento = document.getElementById('centroInternamiento').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const motivo = document.getElementById('motivo').value;
    const excarcelados = parseInt(document.getElementById('excarcelados').value) || 0;
    const presentes = parseInt(document.getElementById('presentes').value) || 0;
    const total = excarcelados + presentes;
    const custodioResponsable = document.getElementById('custodioResponsable').value;
    const personalDGRS = document.getElementById('personalDGRS').value;

    const nuevoRegistro = {
        centroInternamiento,
        fecha,
        hora,
        motivo,
        excarcelados,
        presentes,
        total,
        custodioResponsable,
        personalDGRS
    };

    let registros = JSON.parse(localStorage.getItem('registros')) || [];
    registros.push(nuevoRegistro);
    localStorage.setItem('registros', JSON.stringify(registros));

    actualizarFechaSeleccion();
    mostrarRegistrosPorFecha();

    alert('Registro guardado exitosamente.');
}

// Función para mostrar los registros por fecha seleccionada
function mostrarRegistrosPorFecha() {
    const fechaSeleccionada = document.getElementById('fechaSeleccion').value;
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const registrosFiltrados = registros.filter(registro => registro.fecha === fechaSeleccionada);

    const recordList = document.getElementById('recordList');
    recordList.innerHTML = '';

    if (registrosFiltrados.length > 0) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headRow = document.createElement('tr');
        ['Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal de la DGRS'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);

        registrosFiltrados.forEach(registro => {
            const row = document.createElement('tr');
            Object.values(registro).forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        recordList.appendChild(table);
    } else {
        recordList.textContent = 'No hay registros para la fecha seleccionada.';
    }
}

// Función para actualizar el selector de fechas
function actualizarFechaSeleccion() {
    const fechaSeleccion = document.getElementById('fechaSeleccion');
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const fechas = [...new Set(registros.map(registro => registro.fecha))];

    fechaSeleccion.innerHTML = '';

    fechas.forEach(fecha => {
        const option = document.createElement('option');
        option.value = fecha;
        option.textContent = fecha;
        fechaSeleccion.appendChild(option);
    });
}

// Inicialización al cargar la página
window.onload = () => {
    actualizarFechaSeleccion();
    mostrarRegistrosPorFecha();
};
