const initialUser = {
    name: "admin",
    email: "admin@campusparking.com",
    password: "Admin123"
};

localStorage.setItem("user", JSON.stringify(initialUser));

const nombre = document.getElementById("user");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btnLogin = document.querySelector(".btn-login");

const user = JSON.parse(localStorage.getItem("user"));

btnLogin.addEventListener("click", (e) => {
    e.preventDefault();

    if (nombre.value === user.name && email.value === user.email && password.value === user.password) {
        
        window.location.href = "registro.html";
    } else {
        alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
});