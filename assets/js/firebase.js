import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"
import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"
import { showAlert } from "./alerta.js"

const firebaseConfig = {
    apiKey: "AIzaSyBB1p7R2VHpcdcaql9UWEf_qzzeMQ4koGE",
    authDomain: "smart-savings-a369a.firebaseapp.com",
    databaseURL: "https://smart-savings-a369a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "smart-savings-a369a",
    storageBucket: "smart-savings-a369a.appspot.com",
    messagingSenderId: "646945260742",
    appId: "1:646945260742:web:1ed62af60e1b85ad9ac3c7",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase()
const auth = getAuth(app)
const dbref = ref(db)

// Constants for selectors
const RegisterForm = document.getElementById("RegisterForm")
const LoginForm = document.getElementById("LoginForm")

// Function to handle registration
const handleRegistration = async (evt) => {
    evt.preventDefault()

    let username = document.getElementById("username")
    let firstname = document.getElementById("fname")
    let lastname = document.getElementById("lname")
    let email = document.getElementById("email")
    let password = document.getElementById("password")

    try {
        const credentials = await createUserWithEmailAndPassword(auth, email.value, password.value)
        console.log(credentials)

        await set(ref(db, "users/" + credentials.user.uid), {
            firstname: firstname.value,
            lastname: lastname.value,
            username: username.value,
            email: email.value,
        })

        showAlert("A sua conta foi criada com sucesso!", "success")
        setTimeout(() => {
            window.location.href = "index.html"
        }, 1000)
    } catch (error) {
        handleRegistrationError(error)
        console.error(error)
    }
}

// Function to handle login
const handleLogin = async (evt) => {
    evt.preventDefault()

    let email = document.getElementById("email")
    let password = document.getElementById("password")

    try {
        const credentials = await signInWithEmailAndPassword(auth, email.value, password.value)
        console.log(credentials)

        const snapshot = await get(child(dbref, "users/" + credentials.user.uid))

        if (snapshot.exists) {
            sessionStorage.setItem(
                "user-info",
                JSON.stringify({
                    username: snapshot.val().username,
                    firstname: snapshot.val().firstname,
                    lastname: snapshot.val().lastname,
                })
            )
            sessionStorage.setItem("user-creds", JSON.stringify(credentials.user))
            window.location.href = "./admin/index.html"
        }
    } catch (error) {
        handleLoginError(error)
        console.error(error)
    }
}

// Function to handle registration errors
const handleRegistrationError = (error) => {
    var errorCode = error.code
    if (errorCode === "auth/email-already-in-use") {
        showAlert("O email que introduziu já se encontra em uso", "error")
    } else if (errorCode === "auth/invalid-email") {
        showAlert("Introduza um email válido", "error")
    } else if (errorCode === "auth/weak-password") {
        showAlert("A password deve ter pelo menos 6 caracteres", "error")
    } else {
        showAlert(error.message, "error")
    }
}

// Function to handle login errors
const handleLoginError = (error) => {
    var errorCode = error.code
    if (errorCode === "auth/invalid-email") {
        showAlert("Introduza um email válido", "error")
    } else if (errorCode === "auth/invalid-credential") {
        showAlert("As suas credenciais não são válidas", "error")
    } else {
        showAlert(error.message, "error")
    }
}

// Event listeners
if (RegisterForm) {
    RegisterForm.addEventListener("submit", handleRegistration)
}

if (LoginForm) {
    LoginForm.addEventListener("submit", handleLogin)
}
