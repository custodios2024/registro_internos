// Función para iniciar sesión
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Lógica simple de autenticación
    if (username === 'admin' && password === '2024contraseña') {
        localStorage.setItem('loggedIn', 'true');
        document.getElementById('login').style.display = 'none';
        document.getElementById('registro').style.display = 'block';
        document.getElementById('mostrarRegistros').style.display = 'block';
        llenarSelectorDeFechas();
    } else {
        alert('Usuario o contraseña incorrectos.');
    }
}

// Función para verificar si el usuario está autenticado
function checkAuthentication() {
    if (localStorage.getItem('loggedIn') === 'true') {
        document.getElementById('login').style.display = 'none';
        document.getElementById('registro').style.display = 'block';
        document.getElementById('mostrarRegistros').style.display = 'block';
        llenarSelectorDeFechas();
    } else {
        document.getElementById('login').style.display = 'block';
        document.getElementById('registro').style.display = 'none';
        document.getElementById('mostrarRegistros').style.display = 'none';
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('loggedIn');
    document.getElementById('login').style.display = 'block';
    document.getElementById('registro').style.display = 'none';
    document.getElementById('mostrarRegistros').style.display = 'none';
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
            p.innerHTML = `<strong>${field.label}</strong> ${field.value}`;
            registroDiv.appendChild(p);
        });

        recordList.appendChild(registroDiv);
    });
}

// Función para llenar el selector de fechas
function llenarSelectorDeFechas() {
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const fechaSeleccion = document.getElementById('fechaSeleccion');
    const fechas = [...new Set(registros.map(registro => registro.fecha))];

    fechaSeleccion.innerHTML = '';
    fechas.forEach(fecha => {
        const option = document.createElement('option');
        option.value = fecha;
        option.textContent = fecha;
        fechaSeleccion.appendChild(option);
    });
}

// Función para exportar a PDF
function exportarPDF() {
    if (typeof jsPDF === 'undefined' || typeof jsPDF.autoTable === 'undefined') {
        alert('jsPDF o jsPDF-AutoTable no están cargados correctamente.');
        return;
    }

    const fechaSeleccionada = document.getElementById('fechaSeleccion').value;
    const registros = JSON.parse(localStorage.getItem('registros')) || [];
    const registrosFiltrados = registros.filter(registro => registro.fecha === fechaSeleccionada);

    if (registrosFiltrados.length === 0) {
        alert('No hay registros para la fecha seleccionada.');
        return;
    }

    const doc = new jsPDF('l', 'mm', 'a4'); // Orientación horizontal

    // Título del Centro de Internamiento
    const centroInternamiento = document.getElementById('centroInternamiento').value;
    doc.setFontSize(14);
    const centroX = doc.internal.pageSize.getWidth() / 2; // Centro horizontal de la página
    doc.text(centroInternamiento, centroX, 30, { align: 'center' });

    // Título Registro de Internos del Día
    doc.setFontSize(16);
    doc.text('Registro de Internos del Día', centroX, 40, { align: 'center' });

    // Configurar autoTable
    const tableColumn = ['Fecha', 'Hora', 'Motivo', 'Excarcelados', 'Presentes', 'Total', 'Custodio Responsable', 'Personal DGRS'];
    const tableRows = registrosFiltrados.map(registro => [
        registro.fecha,
        registro.hora,
        registro.motivo,
        registro.excarcelados,
        registro.presentes,
        registro.total,
        registro.custodioResponsable,
        registro.personalDGRS
    ]);

    jsPDF.autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        margin: { top: 50 }, // Ajustar el margen superior si es necesario
        theme: 'grid',
        styles: { fontSize: 10 }, // Ajustar el tamaño de fuente para la tabla
        columnWidth: 'wrap' // Ajustar el ancho de las columnas para que no estén tan largas
    });

    doc.save('registro_internos.pdf');
}
