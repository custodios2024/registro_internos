function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aquí deberías verificar el usuario y la contraseña con tu backend
    if (username === 'admin' && password === 'admin') {
        localStorage.setItem('loggedIn', true);
        window.location.href = 'registro.html'; // Redirige a la página principal después del inicio de sesión
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

function sumarTotal() {
    const excarcelados = parseInt(document.getElementById('excarcelados').value) || 0;
    const presentes = parseInt(document.getElementById('presentes').value) || 0;
    document.getElementById('total').value = excarcelados + presentes;
}

async function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    const fechaSeleccionada = document.getElementById('fechaSeleccion').value;

    doc.setFontSize(18);
    doc.text('Registro de Internos', 105, 10, { align: 'center' });

    doc.setFontSize(12);
    doc.text('Fecha: ' + fechaSeleccionada, 10, 20);

    // Ejemplo de tabla simple
    const columns = ["Fecha", "Hora", "Motivo", "Excarcelados", "Presentes", "Total", "Custodio Responsable", "Personal DGRS"];
    const rows = [
        ["2024-08-30", "10:00", "Motivo Ejemplo", "1", "5", "6", "Custodio Ejemplo", "Personal Ejemplo"]
    ];

    doc.autoTable({
        head: [columns],
        body: rows,
        startY: 30,
        theme: 'striped',
        headStyles: { lineWidth: 0.5, lineColor: [44, 62, 80] },
        margin: { top: 20 },
    });

    doc.save('Registro.pdf');
}

async function exportarPDFCompleto() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');

    doc.setFontSize(18);
    doc.text('Registro Completo', 105, 10, { align: 'center' });

    // Agregar más detalles aquí

    doc.save('Registro_Completo.pdf');
}

function cerrarSesion() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
}

function mostrarRegistrosPorFecha() {
    // Lógica para mostrar registros desde MySQL
}
