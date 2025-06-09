// chat.js

const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const partnerId = urlParams.get('partnerId');

// UI references
const chatStatus = document.querySelector('.chat-status');
const chatWindow = document.getElementById('chatWindow');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const leaveBtn = document.getElementById('leaveBtn');

let selfId = null;
let isPartnerConnected = false;

// Helper: scroll chat window to bottom
function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Helper: append a new message bubble
function appendMessage(text, type) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message-bubble', `message-${type}`, 'fade-in-message');
  msgDiv.innerText = text;
  chatWindow.appendChild(msgDiv);
  scrollToBottom();
}

// On initial connection, store our socket ID
socket.on('connect', () => {
  selfId = socket.id;
  chatStatus.innerText = 'Waiting for partner...';

  // If we navigated here with a partnerId param, show “Connected” immediately
  if (partnerId) {
    isPartnerConnected = true;
    chatStatus.innerText = `Chatting with: ${partnerId}`;
    appendMessage('System: You are now connected!', 'system');
  }
});

// Handle incoming messages
socket.on('receive_message', ({ senderId, message }) => {
  if (senderId === partnerId) {
    appendMessage(`Stranger: ${message}`, 'partner');
  }
});

// If partner disconnects midway
socket.on('disconnect', () => {
  if (isPartnerConnected) {
    appendMessage('System: Your partner has disconnected.', 'system');
    chatStatus.innerText = 'Partner disconnected';
    isPartnerConnected = false;
  } else {
    alert('You have been disconnected. Returning to preferences.');
    window.location.href = 'preferences.html';
  }
});

// Send a message
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text || !partnerId) return;
  appendMessage(`You: ${text}`, 'you');
  socket.emit('send_message', { partnerId, message: text });
  messageInput.value = '';
});

// Leave chat button
leaveBtn.addEventListener('click', () => {
  window.location.href = 'preferences.html';
});

// If no partnerId provided, redirect back
if (!partnerId) {
  alert('No partner specified. Redirecting back.');
  window.location.href = 'preferences.html';
}
