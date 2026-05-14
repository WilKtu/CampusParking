const initialUser = {
    name: "admin",
    email: "admin@campusparking.com",
    password: "Admin123"
};

// Guardar usuario inicial
localStorage.setItem("user", JSON.stringify(initialUser));

const nombre = document.getElementById("user");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btnLogin = document.querySelector(".btn-login");

const user = JSON.parse(localStorage.getItem("user"));

btnLogin.addEventListener("click", (e) => {
    e.preventDefault();

    if (
        nombre.value === user.name &&
        email.value === user.email &&
        password.value === user.password
    ) {
        sessionStorage.setItem("isLoggedIn", "true");

        sessionStorage.setItem("activeUser", user.name);

        window.location.href = "registro.html";

    } else {
        alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
});