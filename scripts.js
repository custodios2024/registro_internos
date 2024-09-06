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

    let registrosPorFecha = JSON.parse(localStorage.getItem('registrosPorFecha')) || {};
    let registros = registrosPorFecha[fecha] || [];

    if (registros.length < 10) {
        registros.push(registro);
        registrosPorFecha[fecha] = registros;
        localStorage.setItem('registrosPorFecha', JSON.stringify(registrosPorFecha));
        alert('Registro guardado correctamente.');
        llenarSelectorDeFechas(); // Actualiza la lista de fechas en el selector
        mostrarRegistrosPorFecha(); // Muestra los registros para la fecha seleccionada
    } else {
        alert('Se han alcanzado los 10 registros para esta fecha.');
    }
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
    let registrosPorFecha = JSON.parse(localStorage.getItem('registrosPorFecha')) || {};
    let registros = registrosPorFecha[fechaSeleccionada] || [];
    
    const recordList = document.getElementById('recordList');
    recordList.innerHTML = '';

    if (registros.length === 0) {
        recordList.innerHTML = 'No se encontraron registros.';
        return;
    }

    registros.forEach((registro, index) => {
        const registroDiv = document.createElement('div');
        registroDiv.style.border = '1px solid #ddd';
        registroDiv.style.padding = '10px';
        registroDiv.style.marginBottom = '10px';
        registroDiv.style.borderRadius = '4px';
        registroDiv.style.backgroundColor = '#fff';
        
        const fields = [
            { label: 'Fecha:', value: registro.fecha },
            { label: 'Hora:', value: registro.hora },
            { label: 'Motivo:', value: registro.motivo },
            { label: 'Excarcelados:', value: registro.excarcelados },
            { label: 'Presentes:', value: registro.presentes },
            { label: 'Total:', value: registro.total },
            { label: 'Custodio Responsable:', value: registro.custodioResponsable },
            { label: 'Personal DGRS:', value: registro.personalDGRS },
            { label: 'Centro de Internamiento:', value: registro.centroInternamiento }
        ];

        fields.forEach(field => {
            const p = document.createElement('p');
            p.style.margin = '0';
            p.style.padding = '5px 0';
            p.innerHTML = `<strong>${field.label}</strong> ${field.value}`;
            registroDiv.appendChild(p);
        });

        recordList.appendChild(registroDiv);
    });
}

// Función para llenar el selector de fechas
function llenarSelectorDeFechas() {
    let registrosPorFecha = JSON.parse(localStorage.getItem('registrosPorFecha')) || {};
    const fechasUnicas = Object.keys(registrosPorFecha);

    const fechaSeleccion = document.getElementById('fechaSeleccion');
    fechaSeleccion.innerHTML = '';

    fechasUnicas.forEach(fecha => {
        const option = document.createElement('option');
        option.value = fecha;
        option.textContent = fecha;
        fechaSeleccion.appendChild(option);
    });

    if (fechaSeleccion.options.length > 0) {
        fechaSeleccion.value = fechaSeleccion.options[fechaSeleccion.options.length - 1].value;
        mostrarRegistrosPorFecha();
    }
}

// Función para exportar a PDF
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    const fechaSeleccionada = document.getElementById('fechaSeleccion').value;
    let registrosPorFecha = JSON.parse(localStorage.getItem('registrosPorFecha')) || {};
    let registros = registrosPorFecha[fechaSeleccionada] || [];

    if (registros.length === 0) {
        alert('No hay registros para la fecha seleccionada.');
        return;
    }

    let centroInternamiento = document.getElementById('centroInternamiento').value.toUpperCase();

    // Agregar logo
    const logo = document.querySelector('img').src;
    doc.addImage(logo, 'PNG', 10, 10, 30, 30);

    doc.setFontSize(18);
    doc.text(centroInternamiento, 140, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Registro de Internos del Día', 140, 35, { align: 'center' });

    const data = registros.map(registro => [
        registro.fecha, 
        registro.hora, 
        registro.motivo, 
        registro.excarcelados, 
        registro.presentes, 
        registro.total, 
        registro.custodioResponsable, 
        registro.personalDGRS
    ]);

    const columns = [
        'Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal D.G.R.S.'
    ];

    doc.autoTable({
        head: [columns],
        body: data,
        startY: 50,
        margin: { horizontal: 10 },
        columnStyles: { 0: { cellWidth: 25 } },
        theme: 'plain', // Elimina cualquier color de la tabla
        styles: { fillColor: [255, 255, 255] } // Blanco para todas las celdas
    });

    doc.save(`Registro_${fechaSeleccionada}.pdf`);
}

// Función para exportar PDF completo
function exportarPDFCompleto() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    let registrosPorFecha = JSON.parse(localStorage.getItem('registrosPorFecha')) || {};
    let todasLasFechas = Object.keys(registrosPorFecha);

    if (todasLasFechas.length === 0) {
        alert('No hay registros para exportar.');
        return;
    }

    let centroInternamiento = document.getElementById('centroInternamiento').value.toUpperCase();

    // Agregar logo
    const logo = document.querySelector('img').src;
    doc.addImage(logo, 'PNG', 10, 10, 30, 30);

    doc.setFontSize(18);
    doc.text(centroInternamiento, 140, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Registro de Internos Completo', 140, 35, { align: 'center' });

    todasLasFechas.forEach(fecha => {
        let registros = registrosPorFecha[fecha] || [];

        if (registros.length > 0) {
            const data = registros.map(registro => [
                registro.fecha, 
                registro.hora, 
                registro.motivo, 
                registro.excarcelados, 
                registro.presentes, 
                registro.total, 
                registro.custodioResponsable, 
                registro.personalDGRS
            ]);

            const columns = [
                'Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal D.G.R.S.'
            ];

            doc.autoTable({
                head: [columns],
                body: data,
                startY: doc.autoTable.previous ? doc.autoTable.previous.finalY + 20 : 50,
                margin: { horizontal: 10 },
                columnStyles: { 0: { cellWidth: 25 } },
                theme: 'plain', // Elimina cualquier color de la tabla
                styles: { fillColor: [255, 255, 255] } // Blanco para todas las celdas
            });
        }
    });

    doc.save('Registro_Completo.pdf');
}

// Llenar el selector de fechas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    llenarSelectorDeFechas();
});

