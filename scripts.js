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
        headStyles: {
            fillColor: '#00bfff', // Color azul celeste para encabezados
            textColor: [255, 255, 255], // Color del texto en los encabezados
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: {
            cellPadding: 2,
            fontSize: 10,
            minCellWidth: 20,
            halign: 'center'
        },
        bodyStyles: {
            fillColor: [255, 255, 255] // Fondo blanco para celdas de datos
        },
        theme: 'grid'
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
                startY: doc.previousAutoTable ? doc.previousAutoTable.finalY + 20 : 50,
                margin: { horizontal: 10 },
                headStyles: {
                    fillColor: '#00bfff', // Color azul celeste para encabezados
                    textColor: [255, 255, 255], // Color del texto en los encabezados
                    fontStyle: 'bold',
                    halign: 'center'
                },
                styles: {
                    cellPadding: 2,
                    fontSize: 10,
                    minCellWidth: 20,
                    halign: 'center'
                },
                bodyStyles: {
                    fillColor: [255, 255, 255] // Fondo blanco para celdas de datos
                },
                theme: 'grid'
            });
        }
    });

    doc.save('Registro_Completo.pdf');
}
