// preferences.js

const socket = io();

// UI references
const prefsForm = document.getElementById('prefsForm');
const countrySelect = document.getElementById('countrySelect');
const stateSelect = document.getElementById('stateSelect');
const interestSelect = document.getElementById('interestSelect');
const findPartnerBtn = document.getElementById('findPartnerBtn');

// Animate container on load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.pref-container').classList.add('fade-in');
});

// When the form is submitted (Find Partner clicked)
prefsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const country = countrySelect.value;
  const state = stateSelect.value;
  const interest = interestSelect.value;

  // Send preferences to server to find a match
  //socket.emit('find_partner', { country, state, interest });
   window.location.href = `home.html`;
  // Disable the button while searching
  findPartnerBtn.disabled = true;
  findPartnerBtn.innerText = 'Searching...';
});

// Handle no partner available
socket.on('no_partner_available', () => {
  alert('No partner found right now. Please try again soon.');
  findPartnerBtn.disabled = false;
  findPartnerBtn.innerText = 'Find a Partner';
});

// Handle partner found: redirect to chat page + pass partnerId via URL
socket.on('partner_found', (id) => {
  // Redirect to chat.html with query param ?partnerId=<id>
  window.location.href = `chat.html?partnerId=${id}`;
});

// If socket disconnects or any other error
socket.on('disconnect', () => {
  alert('Connection lost. Please refresh and try again.');
});
