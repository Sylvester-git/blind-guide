const firebaseConfig = {
    apiKey: "AIzaSyBQtREGL6oBBGJcX0-f8NpcZBJK155HVyk",
    databaseURL: "https://blindguide-2509a-default-rtdb.firebaseio.com/",
    projectId: "blindguide-2509a",
    appId: "1:700112891294:web:d12266a1be893ca2647a8f" // Replace with your actual Firebase app ID
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization failed:', error);
}

// Get a reference to the database
const database = firebase.database();
if (!database) {
    console.error('Failed to get database reference');
} else {
    console.log('Database reference obtained');
}
const messageArea = document.getElementById('messageArea');

// Clear initial placeholder
messageArea.innerHTML = '';

// Function to add a message to the UI
function addMessage(id, text) {
    console.log('Adding message:', { id: id, text: text });
    const messageElement = document.createElement('p');
    messageElement.classList.add('message');
    messageElement.textContent = text;
    messageElement.dataset.id = id; // Store ID to prevent duplicates
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight; // Scroll to bottom
}

// Load existing messages
database.ref('/messages').once('value', (snapshot) => {
    if (snapshot.exists()) {
        console.log('Initial messages snapshot:', snapshot.val());
        snapshot.forEach((childSnapshot) => {
            const id = childSnapshot.key;
            const data = childSnapshot.val();
            if (data && data.text) {
                addMessage(id, data.text);
            } else {
                console.log('No text field for message ID:', id);
                addMessage(id, 'No message content available');
            }
        });
    } else {
        console.log('No messages found in /messages');
        const messageElement = document.createElement('p');
        messageElement.classList.add('message');
        messageElement.textContent = 'No messages available';
        messageArea.appendChild(messageElement);
    }
}, (error) => {
    console.error('Error fetching initial messages:', error);
    const messageElement = document.createElement('p');
    messageElement.classList.add('message');
    messageElement.textContent = 'Error fetching messages';
    messageArea.appendChild(messageElement);
});
// Listen for new messages in real-time
database.ref('/messages').on('child_added', (snapshot) => {
    const id = snapshot.key;
    const data = snapshot.val();
    console.log('New message received:', { id: id, data: data });

    // Check if message already exists to avoid duplicates
    if (!messageArea.querySelector(`[data-id="${id}"]`)) {
        if (data && data.text) {
            addMessage(id, data.text);
        } else {
            console.log('No text field in message with ID:', id);
            addMessage(id, 'No message content available');
        }
    } else {
        console.log('Message already displayed, skipping:', id);
    }
}, (error) => {
    console.error('Error reading new messages:', error);
    const messageElement = document.createElement('p');
    messageElement.classList.add('message');
    messageElement.textContent = 'Error fetching new messages';
    messageArea.appendChild(messageElement);
});