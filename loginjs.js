import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAe13L8IYi0Yx3SC9zFEutoei8dqqrc0Tw",
    authDomain: "vibehive-e0c3e.firebaseapp.com",
    projectId: "vibehive-e0c3e",
    storageBucket: "vibehive-e0c3e.firebasestorage.app",
    messagingSenderId: "161937693460",
    appId: "1:161937693460:web:fab26e2455469f3cef4001"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    // Enhanced password validation
    if (password.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Store user email in localStorage
            localStorage.setItem('userEmail', email);
            alert("Login successful!");
            window.location.href = "project.html";  // Redirect to project.html
        })
        .catch((error) => {
            alert("Error: " + error.message);
            console.error("Login Error:", error.message);
        });
});