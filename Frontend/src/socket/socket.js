import { io } from 'socket.io-client';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let socket;

const getSocket = () => {
    return socket;
};

const initSocket = () => {
    if(!socket) {
        socket = io(BASE_URL, {
            withCredentials : true,
            autoConnect : false,
            transports : ['websocket'],
            reconnection: true, 
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
            pingInterval: 25000,
            pingTimeout: 5000,
        })
    }
    return socket;
}

const connectSocket = () => {
    if (socket && !socket.connected) {
        socket.connect();
    }
}

const disconnectSocket = () => {
    if(socket && socket.connected) {
        socket.disconnect();
    }
}

export { getSocket, initSocket, connectSocket, disconnectSocket }