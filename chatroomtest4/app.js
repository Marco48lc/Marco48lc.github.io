// Firebase configuration
var firebaseConfig = {
	apiKey: "AIzaSyDfHKftm9qvVY8IpL4lEZUd8N2lTy4DaU8",
    authDomain: "snapripoff.firebaseapp.com",
    projectId: "snapripoff",
    storageBucket: "snapripoff.appspot.com",
    messagingSenderId: "584544074883",
    appId: "1:584544074883:web:865a6badeed98154d2afb6",
    measurementId: "G-NEYDZ8WNZG"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Get a reference to the Firebase Realtime Database
  var database = firebase.database();
  
  // Get a reference to the 'messages' node in the database
  var messagesRef = database.ref("messages");
  
  // Listen for new messages in the 'messages' node
  messagesRef.on("child_added", function (data) {
	var message = data.val();
	displayMessage(message.name, message.text);
  });
  
  // Send a message to the database
  function sendMessage(name, text) {
	var newMessageRef = messagesRef.push();
	newMessageRef.set({
	  name: name,
	  text: text,
	});
  }
  
  // Display a message in the chatroom
  function displayMessage(name, text) {
	var messagesDiv = document.getElementById("messages");
	var messageParagraph = document.createElement("p");
	messageParagraph.innerHTML = "<strong>" + name + ":</strong> " + text;
	messagesDiv.appendChild(messageParagraph);
  }
  
  // Handle form submission
  var messageForm = document.getElementById("message-form");
  messageForm.addEventListener("submit", function (event) {
	event.preventDefault();
	var messageInput = document.getElementById("message-input");
	var messageText = messageInput.value.trim();
	if (messageText.length > 0) {
	  sendMessage("Anonymous", messageText);
	  messageInput.value = "";
	}
  });
  