
const socketHandler = (io) => {

    const onlineUsers = new Map();

    io.on("connection", (socket) => {

        socket.on("join", (userId) => {
            
            onlineUsers.set(userId, socket.id);
            io.emit("onlineUsers", Array.from(onlineUsers.keys()))
        });
  
        socket.on("sendMessage", (data) => {
            io.emit("receiveMessage", data);
        });
  
        socket.on("privateMessage", ({ receiverId, message }) => {
        const receiverSocketId = onlineUsers.get(receiverId);
           if (receiverSocketId) {
          io.to(receiverSocketId).emit("receivePrivateMessage", message);
        }
       });

  
        socket.on("disconnect", (reason) => {
            for (let [userId, id] of onlineUsers.entries()) {
                if (id === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        });
    });
}

module.exports = socketHandler;
  
