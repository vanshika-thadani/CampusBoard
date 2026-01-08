import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './Discussion.css';
import { FiUpload } from 'react-icons/fi';
import { FaPaperPlane } from 'react-icons/fa';
import {
  initSocket,
  connectSocket,
  disconnectSocket,
  getSocket,
} from '../../socket/socket';
import { useGetUser } from '../../hooks/user/usegetuser';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Discussion = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const { user } = useGetUser();

  const getPublicMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/messages/public`, {
        withCredentials: true,
      });
      setMessages(response.data);
    } catch (err) {
      console.log(err.response?.data.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const socket = initSocket();
    connectSocket();

    socket.emit("join", user?._id);
    getPublicMessages();

    socket.on('receiveMessage', (msg) => {
      console.log("Socket message received:", msg);
      setMessages(prev => [...prev, msg]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("onlineUsers");
      disconnectSocket();
    };
  }, [user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const changeHandler = (e) => setInput(e.target.value);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const socket = getSocket();

      const response = await axios.post(
        `${BASE_URL}/api/messages/public`,
        { input },
        { withCredentials: true }
      );

      const newMsg = response.data;

      socket.emit('sendMessage', newMsg);
      setInput('');
    }
  };

  return (
    <div className="component-container">
      <Sidebar />

      <div id="discussion">
        <div className="discussion-container">
          <div className="head">
            <h3>Wanna Have a Discussion?</h3>
            <span className="online">{onlineUsers.length} user(s) online 🟢</span>
          </div>

          <div className="mess-content">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg?.senderId?._id === user?._id ? 'sent' : 'received'}`}
              >
                <div className="msg-content">
                  <div className="text">{msg?.message || "No message"}</div>
                  <p>{msg?.senderId?.username || "Anonymous"} • {msg?.time || ""}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={SubmitHandler} className="chat-input">
            <FiUpload size={24} className='Ficon' />
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={changeHandler}
              className="chat-textbox"
            />
            <button type="submit" className="send-btn">
              <FaPaperPlane size={24} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Discussion;