document.addEventListener("DOMContentLoaded", () => {

    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        window.location.href = "login.html";
    } else {
        actualizarMapa();
    }

});
const slots = document.querySelectorAll(".slot, .slot-moto");
const selectedSlotInput = document.getElementById("selected-slot");
const form = document.querySelector("form");

let selectedSlot = null;

function actualizarMapa() {
    const registros = JSON.parse(localStorage.getItem("registros")) || [];

    slots.forEach(slot => slot.classList.remove("occupied"));

    registros.forEach(vehiculo => {
        const slotOcupado = document.querySelector(`[data-id="${vehiculo.espacioAsignado}"]`);
        if (slotOcupado) {
            slotOcupado.classList.add("occupied");
        }
    });
    
    mostrarListaVehiculos(); 
}

function obtenerHoraActual() {
    const ahora = new Date();
    let horas = ahora.getHours()
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const ampm = horas >= 12 ? 'PM' : 'AM';
    
    horas = horas % 12;
    horas = horas ? horas : 12; 
    const horaStr = String(horas).padStart(2, '0');

    return `${horaStr}:${minutos} ${ampm}`;
}


function mostrarListaVehiculos() {
    const registros = JSON.parse(localStorage.getItem("registros")) || [];
    const container = document.getElementById("vehicle-table-body"); 
    
    if (!container) return;

    if (registros.length === 0) {
        container.innerHTML = "<tr><td colspan='7' style='text-align:center;'>No hay vehículos registrados actualmente.</td></tr>";
        return;
    }

    let html = "";
    
    registros.forEach((v, index) => {
        const horaMostrada = v.horaEntrada ? v.horaEntrada : obtenerHoraActual();
        
        html += `
            <tr>
                <td>${v.placa}</td>
                <td>${v.marcaModelo}</td>
                <td>${v.tipoVehiculo || 'N/A'}</td>
                <td>${v.fechaIngreso || 'N/A'}</td>
                <td class="hora-col"><strong>${horaMostrada}</strong></td>
                <td><strong>${v.espacioAsignado}</strong></td>
                <td>
                    <button onclick="prepararEdicion(${index})" class="btn-edit" title="Modificar Datos">Editar</button>
                    <button onclick="eliminarRegistro(${index}, '${v.espacioAsignado}')" class="btn-exit" title="Dar Salida">Salir</button>
                </td>
            </tr>`;
    });

    container.innerHTML = html;
}


window.eliminarRegistro = function(index, slotId) {
    if (confirm(`¿Confirmar salida del vehículo en el espacio ${slotId}?`)) {
        let registros = JSON.parse(localStorage.getItem("registros")) || [];
        

        const vehiculoSaliendo = registros[index];
        console.log("Salida registrada:", vehiculoSaliendo);
        registros.splice(index, 1);

        localStorage.setItem("registros", JSON.stringify(registros));

        if (typeof actualizarInterfaz === "function") {
            actualizarInterfaz();
        } else {

            mostrarListaVehiculos();
            if (typeof actualizarMapa === "function") actualizarMapa();
        }
        
        alert("El espacio ha sido liberado.");
    }
};


function prepararEdicion(index) {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    let vehiculo = registros[index];

    document.querySelector('input[placeholder="P-123ABC"]').value = vehiculo.placa;
    document.querySelector('input[placeholder="Toyota Hilux / Honda Civic"]').value = vehiculo.marcaModelo;
    document.getElementById("vehicle-type").value = vehiculo.tipoVehiculo;
    document.getElementById("entry-date").value = vehiculo.fechaIngreso;
    document.getElementById("entry-time").value = vehiculo.horaEntrada;
    document.getElementById("selected-slot").value = vehiculo.espacioAsignado;

    registros.splice(index, 1);

    localStorage.setItem("registros", JSON.stringify(registros));

}

slots.forEach(function(slot) {

    slot.addEventListener("click", function() {
        if (slot.classList.contains("occupied")) {
            alert("Este espacio ya está ocupado");
            return;
        }
        if (selectedSlot) {

            selectedSlot.classList.remove("selected");
        }

        slot.classList.add("selected");
        selectedSlot = slot;

        selectedSlotInput.value = slot.dataset.id;
    });

});

form.addEventListener("submit", function(e) {
    e.preventDefault();
    let placa = form.querySelector("input[placeholder='P-123ABC']").value;
    let marcaModelo = form.querySelector("input[placeholder='Toyota Hilux / Honda Civic']").value;
    let tipoVehiculo = document.getElementById("vehicle-type").value;
    let fechaIngreso = document.getElementById("entry-date").value;
    let horaEntrada = document.getElementById("entry-time").value;

    if (!selectedSlot) {
        alert("Selecciona un espacio disponible");
        return;
    }
    let vehiculo = {
        placa: placa,
        marcaModelo: marcaModelo,
        tipoVehiculo: tipoVehiculo,
        fechaIngreso: fechaIngreso,
        horaEntrada: horaEntrada,
        espacioAsignado: selectedSlot.dataset.id
    };

    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.push(vehiculo);
    localStorage.setItem("registros", JSON.stringify(registros));
    form.reset();
    selectedSlot.classList.remove("selected");
    selectedSlot = null;
    selectedSlotInput.value = "";
    actualizarMapa();

});
function logoutAndRedirect() {

    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("activeUser");

    alert("Sesión cerrada");

    window.location.href = "Index.html";
}

function toggleHistorial() {
    const historyContainer = document.getElementById("history-container");
    if (historyContainer.style.display === "none" || historyContainer.style.display === "") {
        historyContainer.style.display = "block";
    } else {
        historyContainer.style.display = "none";
    }
}
function mostrarFactura() {
    const registros = JSON.parse(localStorage.getItem("registros")) || [];
    const facturaContainer = document.getElementById("factura-container");
    const facturaDetalles = document.getElementById("factura-detalles");

    if (registros.length === 0) {
        alert("No hay vehículos registrados actualmente.");
        return;
    }

    const vehiculo = registros[0]; 
    const fechaIngreso = new Date(`${vehiculo.fechaIngreso}T${vehiculo.horaEntrada}`);
    const fechaSalida = new Date();
    const tiempoTranscurrido = Math.ceil((fechaSalida - fechaIngreso) / (1000 * 60 * 60)); 
    const tarifaPorHora = 10; 
    const total = tiempoTranscurrido * tarifaPorHora;

    facturaDetalles.innerHTML = `
        <p><strong>Placa:</strong> ${vehiculo.placa}</p>
        <p><strong>Marca/Modelo:</strong> ${vehiculo.marcaModelo}</p>
        <p><strong>Tipo:</strong> ${vehiculo.tipoVehiculo}</p>
        <p><strong>Espacio Asignado:</strong> ${vehiculo.espacioAsignado}</p>
        <p><strong>Fecha de Ingreso:</strong> ${vehiculo.fechaIngreso}</p>
        <p><strong>Hora de Entrada:</strong> ${vehiculo.horaEntrada}</p>
        <p><strong>Fecha de Salida:</strong> ${fechaSalida.toLocaleDateString()}</p>
        <p><strong>Hora de Salida:</strong> ${fechaSalida.toLocaleTimeString()}</p>
        <p><strong>Tiempo Total:</strong> ${tiempoTranscurrido} horas</p>
        <p><strong>Total a Pagar:</strong> Q${total.toFixed(2)}</p>
    `;

    facturaContainer.style.display = "block";
}
function cerrarFactura() {
    const facturaContainer = document.getElementById("factura-container");
    facturaContainer.style.display = "none";
}


document.addEventListener("DOMContentLoaded", actualizarMapa);