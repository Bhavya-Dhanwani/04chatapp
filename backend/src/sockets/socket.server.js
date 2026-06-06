// importing the modules
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { ACCESS_SECRET } from "../config/env.config.js";
import chatModel from "../models/chat.model.js";

// The Socket.IO server instance (set during initSocket)
let io;

// Map of userId -> Set of socketIds (supports multiple tabs per user)
const onlineUsers = new Map();

// Function to initialize and connect to the socket
function initSocket(httpServer) {

    // Making the server with CORS
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Auth middleware — verify JWT from handshake auth token
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            const payload = jwt.verify(token, ACCESS_SECRET);
            socket.data.userId = payload.id;
            socket.data.userName = payload.name;
            next();
        } catch (err) {
            return next(new Error("Authentication error: Invalid token"));
        }
    });

    // Making the connection event
    io.on("connection", async (socket) => {
        const userId = socket.data.userId;
        console.log(`Socket connected: ${userId} (${socket.id})`);

        // Track this socket as online for the user
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);

        // Broadcast to all that this user is now online (plain string, not object)
        io.emit("user_online", userId);

        // Join the user's personal room (for targeted events)
        socket.join(userId);

        // Auto-join the Global group chat room so this user always receives global messages
        try {
            const globalChat = await chatModel.findOne({ chatType: "group", name: "Global" });
            if (globalChat) {
                socket.join(String(globalChat._id));
                console.log(`Socket ${socket.id} auto-joined Global room: ${globalChat._id}`);
            }
        } catch (err) {
            console.log("Failed to auto-join Global room:", err.message);
        }

        // Join a chat room (client emits after fetching chats)
        socket.on("join_chat", (chatId) => {
            if (chatId) {
                socket.join(chatId);
                console.log(`Socket ${socket.id} joined room: ${chatId}`);
            }
        });

        // Leave a chat room
        socket.on("leave_chat", (chatId) => {
            if (chatId) {
                socket.leave(chatId);
            }
        });

        // Handle typing indicator
        socket.on("typing", ({ chatId }) => {
            if (chatId) {
                socket.to(chatId).emit("user_typing", {
                    chatId,
                    userId,
                    userName: socket.data.userName
                });
            }
        });

        // Handle stop typing indicator
        socket.on("stop_typing", ({ chatId }) => {
            if (chatId) {
                socket.to(chatId).emit("user_stop_typing", {
                    chatId,
                    userId
                });
            }
        });

        // Handle marking messages as read
        socket.on("mark_read", ({ chatId }) => {
            if (chatId) {
                // Notify other participants that this user has read the chat
                socket.to(chatId).emit("messages_read", {
                    chatId,
                    readBy: userId
                });
            }
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${userId} (${socket.id})`);

            // Remove this socket from online tracking
            const userSockets = onlineUsers.get(userId);
            if (userSockets) {
                userSockets.delete(socket.id);
                // If user has no more sockets, mark as offline
                if (userSockets.size === 0) {
                    onlineUsers.delete(userId);
                    io.emit("user_offline", userId);
                }
            }
        });
    });
}

// Getter for the io instance (used by services to emit events)
function getIO() {
    return io;
}

// Check if a user is online
function isUserOnline(userId) {
    return onlineUsers.has(userId);
}

// Get all online user IDs
function getOnlineUserIds() {
    return Array.from(onlineUsers.keys());
}

export { initSocket, getIO, isUserOnline, getOnlineUserIds };
