// server.js

/**
 * NexMeet Backend
 * • Serves static files from /public
 * • Tracks connected users along with their preferences
 * • Matches users randomly but only if their (country, state, interest) filters overlap
 * • Relays text messages between matched partners
 * • Cleans up on disconnects
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve all frontend files (index.html, login.html, preferences.html, chat.html, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// In-memory array to keep track of "waiting" users & their preferences.
// Each entry has the form:
//   {
//     socketId: <string>,
//     country: <string> ('' if "Any"),
//     state: <string>   ('' if "Any"),
//     interest: <string> ('' if "Any")
//   }
let waitingUsers = [];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Whenever a client (preferences.html) emits 'find_partner' with filters:
  //
  //   socket.emit('find_partner', { country, state, interest });
  //
  // We:
  // 1) Remove any existing record of this socket from waitingUsers (in case they re-click).
  // 2) Push a new record with their current preferences.
  // 3) Attempt to find a “compatible” partner in waitingUsers.
  //    Matching rule: for fields (country, state, interest),
  //      either they are exactly equal, or one side is '' (meaning "Any").
  // 4) If found, emit 'partner_found' to both sockets and remove both from waitingUsers.
  // 5) If not found, emit 'no_partner_available' to this client, and they remain in waitingUsers.
  socket.on('find_partner', (prefs) => {
    const { country = '', state = '', interest = '' } = prefs || {};

    // 1) Remove previous entry for this socket, if any
    waitingUsers = waitingUsers.filter(u => u.socketId !== socket.id);

    // 2) Add this socket and its prefs to waitingUsers
    waitingUsers.push({
      socketId: socket.id,
      country,
      state,
      interest
    });

    // 3) Build a list of candidates that match this user's filters:
    const candidates = waitingUsers.filter((u) => {
      // Exclude self
      if (u.socketId === socket.id) return false;

      // Country matches if either side is '' or both equal
      const countryOk =
        u.country === country ||
        u.country === '' ||
        country === '';

      // State matches if either side is '' or both equal
      const stateOk =
        u.state === state ||
        u.state === '' ||
        state === '';

      // Interest matches if either side is '' or both equal
      const interestOk =
        u.interest === interest ||
        u.interest === '' ||
        interest === '';

      return countryOk && stateOk && interestOk;
    });

    if (candidates.length > 0) {
      // 4a) Pick one candidate randomly
      const match = candidates[Math.floor(Math.random() * candidates.length)];

      // Emit to both sockets: 'partner_found', passing each other's socketId
      socket.emit('partner_found', match.socketId);
      io.to(match.socketId).emit('partner_found', socket.id);

      // 4b) Remove both from waitingUsers so they won't be matched again
      waitingUsers = waitingUsers.filter(
        (u) =>
          u.socketId !== socket.id && u.socketId !== match.socketId
      );
    } else {
      // 5) No one matches right now. Inform client, but keep them in waitingUsers
      socket.emit('no_partner_available');
      // They remain in waitingUsers until either they find someone or disconnect
    }
  });

  // Relay chat messages. Client sends:
  //    socket.emit('send_message', { partnerId, message });
  // We forward to partner: 'receive_message', { senderId, message }
  socket.on('send_message', ({ partnerId, message }) => {
    if (partnerId && message && message.trim() !== '') {
      io.to(partnerId).emit('receive_message', {
        senderId: socket.id,
        message: message.trim()
      });
    }
  });

  // When a client disconnects:
  // 1) Remove them from waitingUsers (if they were waiting).
  // 2) Notify any matched partner? (We rely on the chat page’s disconnect handler.)
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);

    // 1) Remove from waitingUsers
    waitingUsers = waitingUsers.filter((u) => u.socketId !== socket.id);

    // 2) (Optional) If you wanted to actively notify a partner that this user disconnected,
    //     you'd need to track “active pairs” in memory. Since our frontend (chat.js)
    //     simply listens for 'disconnect' on its own socket, it will handle that case.
  });
});

// Start the server on port 3000 (or process.env.PORT)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`NexMeet server running at http://localhost:${PORT}`);
});
