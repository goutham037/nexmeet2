// client.js for NexMeet

const socket = io();

// UI Elements
const statusEl = document.getElementById('status');
const findPartnerBtn = document.getElementById('findPartnerBtn');
const chatContainer = document.getElementById('chatContainer');
const chatWindow = document.getElementById('chatWindow');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const leaveBtn = document.getElementById('leaveBtn');

let partnerId = null;

// Update status text
function setStatus(text) {
  statusEl.innerText = text;
}

// Scroll chat window to the bottom
function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Add a message to the chat window
function addMessage(text, sender) {
  const div = document.createElement('div');
  div.classList.add('message', sender);
  div.innerText = text;
  chatWindow.appendChild(div);
  scrollToBottom();
}

// On successful socket connection
socket.on('connect', () => {
  setStatus('Connected (you are ' + socket.id + ')');
});

// Handle case when no partner is available
socket.on('no_partner_available', () => {
  setStatus('No partner available. Please try again shortly.');
});

// When a partner is found, show chat UI
socket.on('partner_found', (id) => {
  partnerId = id;
  setStatus('Paired with: ' + partnerId);
  chatContainer.classList.remove('hidden');
  findPartnerBtn.disabled = true;
  addMessage('System: You are now chatting!', 'system');
});

// Receive a message from partner
socket.on('receive_message', ({ senderId, message }) => {
  if (senderId === partnerId) {
    addMessage('Stranger: ' + message, 'partner');
  }
});

// Click “Find a Partner” button
findPartnerBtn.addEventListener('click', () => {
  setStatus('Searching for a partner...');
  socket.emit('find_partner');
});

// Sending a chat message
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = messageInput.value.trim();
  if (msg && partnerId) {
    addMessage('You: ' + msg, 'you');
    socket.emit('send_message', { partnerId, message: msg });
    messageInput.value = '';
  }
});

// Leave chat (reset UI and state)
leaveBtn.addEventListener('click', () => {
  partnerId = null;
  chatWindow.innerHTML = '';
  chatContainer.classList.add('hidden');
  findPartnerBtn.disabled = false;
  setStatus('Connected (you are ' + socket.id + ')');
});
