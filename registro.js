const slots = document.querySelectorAll(".slot, .slot-moto");
const selectedSlotInput = document.getElementById("selected-slot");
const form = document.querySelector("form");

let selectedSlot = null;

// --- FUNCIÓN 1: Cargar y marcar espacios ocupados ---
function actualizarMapa() {
    const registros = JSON.parse(localStorage.getItem("registros")) || [];
    
    // Limpiar todos los espacios primero (opcional, útil para filtros)
    slots.forEach(slot => slot.classList.remove("occupied"));

    // Marcar como ocupados los espacios que están en el localStorage
    registros.forEach(vehiculo => {
        const slotOcupado = document.querySelector(`[data-id="${vehiculo.espacioAsignado}"]`);
        if (slotOcupado) {
            slotOcupado.classList.add("occupied");
        }
    });
    
    mostrarListaVehiculos(); // Llamamos también a la función de la lista
}

// --- FUNCIÓN 2: Mostrar los autos en una tabla o lista ---
function mostrarListaVehiculos() {
    const registros = JSON.parse(localStorage.getItem("registros")) || [];
    const container = document.getElementById("lista-vehiculos-container"); // Asegúrate de crear este div en tu HTML
    
    if (!container) return;

    if (registros.length === 0) {
        container.innerHTML = "<p>No hay vehículos registrados actualmente.</p>";
        return;
    }

    let html = `
        <table class="tabla-registros">
            <thead>
                <tr>
                    <th>Placa</th>
                    <th>Marca/Modelo</th>
                    <th>Espacio</th>
                    <th>Entrada</th>
                </tr>
            </thead>
            <tbody>`;
    
    registros.forEach(v => {
        html += `
            <tr>
                <td>${v.placa}</td>
                <td>${v.marcaModelo}</td>
                <td><strong>${v.espacioAsignado}</strong></td>
                <td>${v.horaEntrada}</td>
            </tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

// --- Lógica de Selección de Espacios ---
slots.forEach(slot => {
    slot.addEventListener("click", () => {
        // No permitir seleccionar si ya está ocupado
        if (slot.classList.contains("occupied")) {
            alert("Este espacio ya está ocupado por otro vehículo.");
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

// --- Lógica de Envío del Formulario ---
form.addEventListener("submit", (e) => {
    e.preventDefault(); 

    const placa = form.querySelector("input[placeholder='P-123ABC']").value;
    const marcaModelo = form.querySelector("input[placeholder='Toyota Hilux / Honda Civic']").value;
    const tipoVehiculo = document.getElementById("vehicle-type").value;
    const fechaIngreso = document.getElementById("entry-date").value;
    const horaEntrada = document.getElementById("entry-time").value;

    if (!selectedSlot) {
        alert("Por favor, selecciona un espacio disponible en el mapa.");
        return;
    }

    const vehiculo = {
        placa,
        marcaModelo,
        tipoVehiculo,
        fechaIngreso,
        horaEntrada,
        espacioAsignado: selectedSlot.dataset.id
    };

    // Guardar en LocalStorage
    const registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.push(vehiculo);
    localStorage.setItem("registros", JSON.stringify(registros));

    alert(`Vehículo ${placa} registrado en el espacio ${vehiculo.espacioAsignado}`);

    // Limpiar formulario y actualización visual
    form.reset();
    selectedSlot.classList.remove("selected");
    selectedSlot = null;
    selectedSlotInput.value = "";
    
    actualizarMapa(); // Refrescar mapa y lista inmediatamente
});

// Inicializar la página al cargar
document.addEventListener("DOMContentLoaded", actualizarMapa);