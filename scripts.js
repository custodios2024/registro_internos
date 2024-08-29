// Función para iniciar sesión
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Usuario y contraseña predeterminados
    const validUsername = 'admin';
    const validPassword = 'password';

    if (username === validUsername && password === validPassword) {
        localStorage.setItem('loggedIn', true);
        window.location.href = 'registro_internos.html'; // Redirigir a la página de registro
    } else {
        alert('Usuario o contraseña incorrectos.');
    }
}

// Función para sumar el total de presentes y excarcelados
function sumarTotal() {
    const excarcelados = parseInt(document.getElementById('excarcelados').value) || 0;
    const presentes = parseInt(document.getElementById('presentes').value) || 0;
    document.getElementById('total').value = excarcelados + presentes;
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html'; // Redirigir a la página de inicio de sesión
}

// Función para exportar registros a PDF
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape'); // Crear un documento PDF en formato horizontal
    const fechaSeleccionada = document.getElementById('fechaSeleccion').value;
    // Aquí se incluiría la lógica para obtener los registros desde MySQL y exportarlos a PDF
    doc.setFontSize(18);
    doc.text(`Registro del ${fechaSeleccionada}`, 14, 20);
    // Agregar la tabla y más detalles del registro aquí
    doc.save(`Registro_${fechaSeleccionada}.pdf`);
}

// Función para exportar todos los registros a PDF
function exportarPDFCompleto() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape'); // Crear un documento PDF en formato horizontal
    // Aquí se incluiría la lógica para obtener todos los registros desde MySQL y exportarlos a PDF
    doc.setFontSize(18);
    doc.text('Registro Completo', 14, 20);
    // Agregar la tabla y más detalles del registro aquí
    doc.save('Registro_Completo.pdf');
}

// Función para mostrar registros por fecha
function mostrarRegistrosPorFecha() {
    const fechaSeleccionada = document.getElementById('fechaSeleccion').value;
    // Realizar una solicitud al backend para obtener los registros por fecha
    fetch(`/obtenerRegistros?fecha=${fechaSeleccionada}`)
        .then(response => response.json())
        .then(data => {
            // Aquí procesas y muestras los registros en la página
            console.log(data); // Solo para depuración
        })
        .catch(error => console.error('Error al obtener registros:', error));
}
