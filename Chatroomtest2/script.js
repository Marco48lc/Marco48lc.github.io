document.addEventListener("DOMContentLoaded", function() {
    const chatArea = document.getElementById("chatArea");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");

    // Load messages from local storage
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    savedMessages.forEach(message => {
        displayMessage(message);
    });

    sendButton.addEventListener("click", function() {
        sendMessage();
    });

    messageInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message !== "") {
            displayMessage(message);
            saveMessage(message);
            messageInput.value = "";
            messageInput.focus();
        }
    }

    function displayMessage(message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.textContent = message;
        chatArea.appendChild(messageElement);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    function saveMessage(message) {
        const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
        savedMessages.push(message);
        localStorage.setItem("chatMessages", JSON.stringify(savedMessages));
    }
});
