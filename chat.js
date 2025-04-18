// Import required Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAe13L8IYi0Yx3SC9zFEutoei8dqqrc0Tw",
    authDomain: "vibehive-e0c3e.firebaseapp.com",
    projectId: "vibehive-e0c3e",
    storageBucket: "vibehive-e0c3e.firebasestorage.app",
    messagingSenderId: "161937693460",
    appId: "1:161937693460:web:fab26e2455469f3cef4001"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM elements
const chatContainer = document.getElementById("chat-container");
const chatMessages = document.getElementById("chat-messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

// Send a new message
async function sendMessage(e) {
    e.preventDefault();

    const message = messageInput.value.trim();
    const userEmail = localStorage.getItem('userEmail') || "unknown@user.com";
    const username = userEmail; // Use email as username

    if (message === "") return;

    try {
        await addDoc(collection(db, "chats"), {
            username: username,
            email: userEmail,
            message: message,
            timestamp: serverTimestamp()
        });

        messageInput.value = "";
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message: " + error.message);
    }
}

// Listen for new messages
function loadMessages() {
    const q = query(collection(db, "chats"), orderBy("timestamp", "asc"));

    onSnapshot(q, (snapshot) => {
        chatMessages.innerHTML = "";

        snapshot.forEach((doc) => {
            const data = doc.data();
            const messageElement = document.createElement("div");
            messageElement.classList.add("message");

            if (data.email === localStorage.getItem('userEmail')) {
                messageElement.classList.add("own-message");
            }

            messageElement.innerHTML = `
                <span class="username">${data.username}:</span>
                <span class="message-content">${data.message}</span>
                <span class="timestamp">${data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString() : 'Sending...'}</span>
            `;

            chatMessages.appendChild(messageElement);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// Initialize chat
function initChat() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        window.location.href = "index.html";
        return;
    }

    loadMessages();
    messageForm.addEventListener("submit", sendMessage);
}

document.addEventListener("DOMContentLoaded", initChat);