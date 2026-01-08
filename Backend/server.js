
require("dotenv").config();//loads environment variables from .env file
const app = require("./app.js");//express app


const http = require("http");
const server = http.createServer(app);//wraps Express inside a raw HTTP server because Socket.io needes the actual HTTP server and not just express


const { Server } = require("socket.io");//imports Socket.io Server class
const socketHandler = require("./config/socket.js");
const PORT = process.env.PORT || 5000;

// CORS Allows your frontend (React, etc.) to connect to sockets
//io is your socket.io server instance
const io = new Server(server, {
    cors : {
        origin : process.env.FRONTEND_API_URL,
        methods : ['GET', 'POST'],
        credentials:true
    },
    pingInterval : 25000, //Socket sends a “ping” to check if client is alive and if client doesn't respons disconnect
    pingTimeout : 5000,
});

socketHandler(io);

server.listen(PORT, () => {
    console.log(`Server Listening on Port : ${PORT}`);
});
