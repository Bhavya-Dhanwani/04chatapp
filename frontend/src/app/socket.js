// Socket.IO client singleton for real-time communication
import { io } from "socket.io-client";
import { getAccessToken } from "./tokenStore";

// The Socket.IO client instance
let socket = null;

// Event listeners registry for cleanup
const listeners = new Map();

// Connect to the Socket.IO server with the current access token
function connectSocket() {
    const token = getAccessToken();
    if (!token || (socket && socket.connected)) return socket;

    socket = io("http://localhost:5000", {
        auth: { token },
        autoConnect: false,
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
        console.log("Socket connection error:", err.message);
    });

    socket.connect();

    return socket;
}

// Disconnect from the server
function disconnectSocket() {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
        listeners.clear();
    }
}

// Get the current socket instance
function getSocket() {
    return socket;
}

// Emit an event to the server
function emit(event, data) {
    if (socket && socket.connected) {
        socket.emit(event, data);
    }
}

// Listen for an event (auto-cleanup tracked)
function on(event, callback) {
    if (!socket) return;

    socket.on(event, callback);

    // Track for cleanup
    if (!listeners.has(event)) {
        listeners.set(event, new Set());
    }
    listeners.get(event).add(callback);
}

// Remove a specific event listener
function off(event, callback) {
    if (!socket) return;

    socket.off(event, callback);

    if (listeners.has(event)) {
        listeners.get(event).delete(callback);
    }
}

export { connectSocket, disconnectSocket, getSocket, emit, on, off };
