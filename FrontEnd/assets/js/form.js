const API_URL = "http://localhost:5678/api"
const LOGIN_ERROR_CONTAINER = document.querySelector('#login_error_container')
const LOGIN_BUTTON = document.querySelector('#login_button')

document.querySelector('#login_form').addEventListener('submit', function(event) {
    event.preventDefault();

    const userEmail = document.getElementById("email").value;
    const userPassword = document.getElementById("password").value;

    const loginData = {
        email: userEmail,
        password: userPassword
    };

    fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                LOGIN_BUTTON.disabled=true;
                LOGIN_ERROR_CONTAINER.style.padding="1rem";
                LOGIN_ERROR_CONTAINER.style.height="auto";

                setTimeout(function(){
                    LOGIN_ERROR_CONTAINER.style.padding=0;
                    LOGIN_ERROR_CONTAINER.style.height=0;

                    LOGIN_BUTTON.disabled=false;

                    },3000)

                throw new Error("Erreur dans l’identifiant ou le mot de passe");
            }
        })
        .then(data => {
            window.localStorage.setItem("token", data.token);
            window.location.href = "../index.html";
        })
        .catch(error => {
            console.error(error);
        });
});