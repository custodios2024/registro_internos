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

    registrosFiltrados.forEach(registro => {
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
}

function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape'); // Orientación horizontal (landscape)
    const fechaSeleccionada = document.getElementById('fechaSeleccion').value;
    let registrosPorFecha = JSON.parse(localStorage.getItem('registrosPorFecha')) || {};
    let registros = registrosPorFecha[fechaSeleccionada] || [];

    if (registros.length === 0) {
        alert('No hay registros para exportar.');
        return;
    }

    let centroInternamiento = document.getElementById('centroInternamiento').value.toUpperCase();

    // Agregar el logo en la parte superior derecha
    const logo = 'logo_sspc2.png'; // Asegúrate de tener la imagen disponible en el directorio adecuado
    const logoWidth = 40; // Tamaño ajustado del logo
    const logoHeight = 20;
    const margin = 10;
    doc.addImage(logo, 'PNG', doc.internal.pageSize.getWidth() - logoWidth - margin, margin, logoWidth, logoHeight);

    // Centrar el texto "Centro de Internamiento"
    doc.setFontSize(18);
    const centroInternamientoX = doc.internal.pageSize.getWidth() / 2;
    const centroInternamientoY = 40;
    doc.text(centroInternamiento, centroInternamientoX, centroInternamientoY, { align: 'center' });

    // Agregar el título "Registro de Internos del Día"
    doc.setFontSize(16);
    const tituloY = 50; // Ajusta la posición vertical del título
    doc.text(`Registro de Internos del Día ${fechaSeleccionada}`, centroInternamientoX, tituloY, { align: 'center' });

    // Preparar los datos para la tabla
    const data = registros.map(registro => [
        registro.fecha, 
        registro.hora, 
        registro.motivoOrdinario, 
        registro.motivoExtraordinario, 
        registro.excarcelados, 
        registro.presentes, 
        registro.total, 
        registro.custodioResponsable, 
        registro.personalDGRS
    ]);

    const columns = [
        'Fecha', 'Hora', 'Motivo Ordinario', 'Motivo Extraordinario', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal D.G.R.S.'
    ];

    doc.autoTable({
        head: [columns],
        body: data,
        startY: 60 // Ajusta el inicio de la tabla según el espacio ocupado por el texto
    });

    doc.save(`registro_internos_${fechaSeleccionada}.pdf`);
}


    // Preparar los datos para la tabla
    const data = registros.map(registro => [
        registro.fecha, 
        registro.hora, 
        registro.motivoOrdinario, 
        registro.motivoExtraordinario, 
        registro.excarcelados, 
        registro.presentes, 
        registro.total, 
        registro.custodioResponsable, 
        registro.personalDGRS
    ]);

    const columns = [
        'Fecha', 'Hora', 'Motivo Ordinario', 'Motivo Extraordinario', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal D.G.R.S.'
    ];

    doc.autoTable({
        head: [columns],
        body: data,
        startY: 50 // Ajusta el inicio de la tabla según el espacio ocupado por el texto
    });

    doc.save(`registro_internos_${fechaSeleccionada}.pdf`);
}

// Función para exportar PDF completo
function exportarPDFCompleto() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    const registros = JSON.parse(localStorage.getItem('registros')) || [];

    if (registros.length === 0) {
        alert('No hay registros para exportar.');
        return;
    }

    let centroInternamiento = document.getElementById('centroInternamiento').value.toUpperCase();

    // Agregar el logo en la parte superior derecha
    const logo = 'logo_sspc2.png'; // Asegúrate de tener la imagen disponible en el directorio adecuado
    const logoWidth = 40; // Ajusta el tamaño del logo
    const logoHeight = 20;
    doc.addImage(logo, 'PNG', doc.internal.pageSize.getWidth() - logoWidth - 10, 10, logoWidth, logoHeight); // Ajusta la posición del logo

    // Centrar el texto "Centro de Internamiento"
    doc.setFontSize(18);
    const centroInternamientoX = doc.internal.pageSize.getWidth() / 2;
    const centroInternamientoY = 30;
    doc.text(centroInternamiento, centroInternamientoX, centroInternamientoY, { align: 'center' });

    // Agregar el título "Registro Completo de Internos"
    doc.setFontSize(16);
    doc.text('Registro Completo de Internos', centroInternamientoX, 40, { align: 'center' });

    // Preparar los datos para la tabla
    const data = registros.map(registro => [
        registro.fecha, 
        registro.hora, 
        registro.motivoOrdinario, 
        registro.motivoExtraordinario, 
        registro.excarcelados, 
        registro.presentes, 
        registro.total, 
        registro.custodioResponsable, 
        registro.personalDGRS
    ]);

    const columns = [
        'Fecha', 'Hora', 'Motivo Ordinario', 'Motivo Extraordinario', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal D.G.R.S.'
    ];

    doc.autoTable({
        head: [columns],
        body: data,
        startY: 50 // Ajusta el inicio de la tabla según el espacio ocupado por el texto
    });

    doc.save('registro_completo_internos.pdf');
}

