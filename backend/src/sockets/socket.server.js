import { Server } from "socket.io";

function initSocket(httpServer) {

    const io = new Server(httpServer);

    io.on("connection", () => {
        console.log("Server connected");
    });

}