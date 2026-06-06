// Importing moduels
import app from "./src/app.js";
import { initSocket } from "./src/sockets/socket.server.js";
import { PORT } from "./src/config/env.config.js";
import { createServer } from "http";

// making the http server to run the socket and the express server together
const httpServer = createServer(app);

// initlaizing the socket server
initSocket(httpServer)

httpServer.listen(PORT, () => {
    console.log("Server is running");
});
