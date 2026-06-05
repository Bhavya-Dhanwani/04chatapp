// importing the modules 
import { Server } from "socket.io";

// function to initalize and connect to the socket
function initSocket(httpServer) {

    // making the server 
    const io = new Server(httpServer);

    // Making the connection event to be triggered on connection
    io.on("connection", () => {
        console.log("User connected");
    });
}

export default initSocket