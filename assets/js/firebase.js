import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { showAlert } from "./alerta.js";

const firebaseConfig = {
    apiKey: "AIzaSyAKhY7Xhb4QrjC8Vbb9lRgXceMjThM8Oj8",
    authDomain: "sam-app-dfd5a.firebaseapp.com",
    databaseURL: "https://sam-app-dfd5a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sam-app-dfd5a",
    storageBucket: "sam-app-dfd5a.appspot.com",
    messagingSenderId: "833856297629",
    appId: "1:833856297629:web:250de3b7fc3847b9cc5274"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
const dbref = ref(db);

let RegisterForm = document.getElementById('RegisterForm');
let LoginForm = document.getElementById('LoginForm');

if (RegisterForm) {
    RegisterForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        let username = document.getElementById('username');
        let firstname = document.getElementById('fname');
        let lastname = document.getElementById('lname');
        let email = document.getElementById('email');
        let password = document.getElementById('password');

        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((credentials) => {
                console.log(credentials);
                set(ref(db, 'users/' + credentials.user.uid), {
                    firstname: firstname.value,
                    lastname: lastname.value,
                    username: username.value,
                    email: email.value
                })

                showAlert("A sua conta foi criada com sucesso!", "success");
                setTimeout(function () {
                    window.location.href = 'index.html';
                }, 1000);
            })
            .catch((error) => {
                var errorCode = error.code;
                if (errorCode === 'auth/email-already-in-use') {
                    showAlert("O email que introduziu já se encontra em uso", "error");

                } else if (errorCode === 'auth/invalid-email') {
                    showAlert("Introduza um email válido", "error");
                    
                } else if (errorCode === 'auth/weak-password') {
                    showAlert("A password deve ter pelo menos 6 caracteres", "error");

                } else {
                    showAlert(error.message, "error");
                }
            })
    });
}

if (LoginForm) {
    LoginForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        let email = document.getElementById('email');
        let password = document.getElementById('password');

        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((credentials) => {
                console.log(credentials);
                get(child(dbref, 'users/' + credentials.user.uid)).then((snapshot) => {
                    if (snapshot.exists) {
                        sessionStorage.setItem("user-info", JSON.stringify({
                            username: snapshot.val().username,
                            firstname: snapshot.val().firstname,
                            lastname: snapshot.val().lastname
                        }))
                        sessionStorage.setItem("user-creds", JSON.stringify(credentials.user));
                        window.location.href = './dash/html/index.html';
                    };
                })
            })
            .catch((error) => {
            var errorCode = error.code;
                if (errorCode === 'auth/invalid-email') {
                    showAlert("Introduza um email válido", "error");
                    
                } else if (errorCode === 'auth/invalid-credential') {
                    showAlert("As suas credenciais não sao válidas", "error");

                } else {
                    showAlert(error.message, "error");
                }
            })
    });
}
