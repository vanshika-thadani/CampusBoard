//io = the whole server (everyone)
//socket = one single user







const socketHandler = (io) => {

    const onlineUsers = new Map();//tracking who all are connected stores userid-->socketId(so that we can send private msg later)

    //user connects to server---whenever a new user opens the app --runs this code----socket passed here is one conncted user,every user has their own socket
    io.on("connection", (socket) => {

        //listen to something a user sends
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

        //if user disconnects server removes from online list
        socket.on("disconnect", (reason) => {
            for (let [userId, id] of onlineUsers.entries()) {
                if (id === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            io.emit("onlineUsers", Array.from(onlineUsers.keys()));//update list of online users
        });
    });
}

module.exports = socketHandler;
  
