// Variable para verificar si el usuario ha iniciado sesión
let sesionIniciada = false;

// Usuario predeterminado
const defaultUser = {
    nombre: "admin",
    email: "admin@campusparking.com",
    contraseña: "Admin123"
};

// Variable para almacenar el estado de los espacios
const espacios = {};

// Función para inicializar los espacios
function inicializarEspacios() {
    const slots = document.querySelectorAll(".slot, .slot-moto");
    slots.forEach(slot => {
        const id = slot.dataset.id;
        espacios[id] = "libre"; // Todos los espacios comienzan como libres

        // Agregar evento de clic a cada espacio
        slot.addEventListener("click", () => seleccionarEspacio(slot));
    });
}

// Función para seleccionar un espacio
function seleccionarEspacio(slot) {
    const id = slot.dataset.id;

    if (espacios[id] === "ocupado") {
        alert("Este espacio ya está ocupado. Por favor, seleccione otro.");
        return;
    }

    // Mostrar el espacio seleccionado en el formulario
    document.getElementById("selected-slot").value = id;
}

// Función para verificar si el usuario ha iniciado sesión
function verificarSesion() {
    if (!sesionIniciada) {
        alert("Debe iniciar sesión antes de registrar un vehículo.");
        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = "login.html";
        return false;
    }
    return true;
}

// Función para registrar un vehículo
function registrarVehiculo(event) {
    event.preventDefault(); // Evita el envío del formulario

    // Verificar si la sesión está iniciada
    if (!verificarSesion()) return;

    const placa = document.querySelector("input[placeholder='P-000ABC']").value;
    const marca = document.querySelector("input[placeholder='Toyota Hilux']").value;
    const color = document.querySelector("input[placeholder='Gris Policromado']").value;
    const espacioSeleccionado = document.getElementById("selected-slot").value;

    if (!placa || !marca || !color || !espacioSeleccionado) {
        alert("Por favor, complete todos los campos y seleccione un espacio.");
        return;
    }

    // Marcar el espacio como ocupado
    espacios[espacioSeleccionado] = "ocupado";

    // Cambiar el color del espacio ocupado
    const slot = document.querySelector(`.slot[data-id="${espacioSeleccionado}"], .slot-moto[data-id="${espacioSeleccionado}"]`);
    if (slot) {
        slot.classList.add("occupied");
        slot.classList.remove("available");
    }

    alert(`Vehículo registrado con éxito en el espacio ${espacioSeleccionado}.`);
    // Limpiar el formulario
    document.querySelector("form").reset();
    document.getElementById("selected-slot").value = "";
}

// Función para validar el inicio de sesión
function validarLogin(email, contraseña) {
    if (email === defaultUser.email && contraseña === defaultUser.contraseña) {
        alert("Inicio de sesión exitoso. ¡Bienvenido, " + defaultUser.nombre + "!");
        sesionIniciada = true; // Marcar la sesión como iniciada
        window.location.href = "registro.html"; // Redirigir al registro
    } else {
        alert("Credenciales incorrectas. Por favor, verifica tu email y contraseña.");
    }
}

// Evento para manejar el inicio de sesión
const loginForm = document.querySelector("form");
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío del formulario

        const emailInput = document.getElementById("user").value;
        const passwordInput = document.getElementById("password").value;

        validarLogin(emailInput, passwordInput);
    });
}

// Inicializar los espacios al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    inicializarEspacios();

    // Agregar evento al botón de "Confirmar Registro"
    const btnLogin = document.querySelector(".btn-login");
    if (btnLogin) {
        btnLogin.addEventListener("click", registrarVehiculo);
    }
});