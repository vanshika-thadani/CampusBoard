import React, { useState, useEffect, useRef } from 'react';
import './Inbox.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { FaSearch, FaPaperPlane, FaEdit } from "react-icons/fa";
import { FiUpload } from 'react-icons/fi';
import { useGetUser } from '../../hooks/user/usegetuser';
import {
  getSocket,
  initSocket,
  connectSocket,
  disconnectSocket
} from '../../socket/socket';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Inbox = () => {
  const { user } = useGetUser();
  const location = useLocation();
  const selectedReceiver = location?.state?.receiverId || '';
  const selectedReceiverUsername = location?.state?.receiverUsername || '';

  const [conversation, setConversation] = useState([]);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(selectedReceiver);
  const [selectedUsername, setSelectedUsername] = useState(selectedReceiverUsername);
  const [chatHistory, setChatHistory] = useState({});
  const [onlineUserList, setOnlineUserList] = useState([]);

  // New message search
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const messagesEndRef = useRef(null);
  const messages = chatHistory[selectedUserId] || [];

  // Sync from navigation state (Contact button)
  useEffect(() => {
    if (selectedReceiver) {
      setSelectedUserId(selectedReceiver);
      setSelectedUsername(selectedReceiverUsername);
    }
  }, [selectedReceiver, selectedReceiverUsername]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/messages/conversations`, {
          withCredentials: true,
        });
        setConversation(res.data);
      } catch (err) {
        console.error("Fetch conversations error:", err);
      }
    };
    if (user) fetchConversations();
  }, [user]);

  // Fetch all users for new message search
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/all`, {
          withCredentials: true,
        });
        console.log("ALL USERS RESPONSE:", res.data);
        setAllUsers(res.data);
        setFilteredUsers(res.data.filter(u => u._id !== user?._id));
      } catch (err) {
        console.error("Fetch all users error:", err);
      }
    };
    if (user) fetchAllUsers();
  }, [user]);

  // Filter users based on search query
  useEffect(() => {
    if (!allUsers.length) return;
    if (userSearchQuery.trim() === '') {
      setFilteredUsers(allUsers);
    } else {
      setFilteredUsers(
        allUsers.filter(u =>
          u.username.toLowerCase().includes(userSearchQuery.toLowerCase())
        )
      );
    }
  }, [userSearchQuery, allUsers]);

  // WebSocket setup
  useEffect(() => {
    const socket = initSocket();
    connectSocket();

    if (user?._id) {
      socket.emit("join", user._id);
    }

    socket.on("onlineUsers", (users) => {
      setOnlineUserList(users);
    });

    socket.on("receivePrivateMessage", (message) => {
      const senderId = typeof message.senderId === 'object' ? message.senderId._id : message.senderId;
      const receiverId = typeof message.receiverId === 'object' ? message.receiverId._id : message.receiverId;
      const otherUserId = senderId === user._id ? receiverId : senderId;

      setChatHistory((prev) => ({
        ...prev,
        [otherUserId]: [...(prev[otherUserId] || []), message],
      }));
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("receivePrivateMessage");
      disconnectSocket();
    };
  }, [user]);

  // Fetch messages when a new user is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUserId && user && !chatHistory[selectedUserId]) {
        try {
          const res = await axios.get(`${BASE_URL}/api/messages/dm/${selectedUserId}`, {
            withCredentials: true,
          });
          setChatHistory((prev) => ({
            ...prev,
            [selectedUserId]: res.data || [],
          }));
        } catch (err) {
          console.error("Fetch messages error:", err);
        }
      }
    };
    fetchMessages();
  }, [selectedUserId, user, chatHistory]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const res = await axios.post(
        `${BASE_URL}/api/messages/dm/${selectedUserId}`,
        { message: input },
        { withCredentials: true }
      );

      const message = res.data;

      setChatHistory((prev) => ({
        ...prev,
        [selectedUserId]: [...(prev[selectedUserId] || []), message],
      }));

      const socket = getSocket();
      socket.emit("privateMessage", {
        receiverId: selectedUserId,
        message,
      });

      setInput('');

      // refresh conversations list
      const convRes = await axios.get(`${BASE_URL}/api/messages/conversations`, { withCredentials: true });
      setConversation(convRes.data);
    } catch (err) {
      console.error("Send message error", err);
    }
  };

  const handleSelectNewUser = (u) => {
    setSelectedUserId(u._id);
    setSelectedUsername(u.username);
    setShowUserSearch(false);
    setUserSearchQuery('');
  };

  // Filter existing conversations by search
  const filteredConversations = conversation.filter((conv) => {
    const otherUser = conv.participants.find(p => p._id !== user?._id);
    if (!otherUser) return false;
    return otherUser.username.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="component-container">
      <Sidebar />
      <div id="inbox">
        {/* Contact List */}
        <div className="dm-container">
          <div className="inbox-top-bar">
            <div className="inbox-input">
              <FaSearch className='inbox-icon' />
              <input
                type="text"
                placeholder='Search conversations'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="new-msg-btn"
              title="New Message"
              onClick={() => setShowUserSearch(prev => !prev)}
            >
              <FaEdit />
            </button>
          </div>

          {/* New Message User Search */}
          {showUserSearch && (
            <div className="user-search-panel">
              <input
                type="text"
                placeholder="Search users..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                autoFocus
              />
              <ul className="user-search-results">
                {filteredUsers.length === 0 ? (
                  <li className="no-users">No users found</li>
                ) : (
                  filteredUsers.map((u) => (
                    <li key={u._id} onClick={() => handleSelectNewUser(u)}>
                      <img src={u.profilephoto} alt={u.username} className="user-avatar" />
                      <div>
                        <p className="user-name">{u.username}</p>
                        <p className="user-email">{u.email}</p>
                      </div>
                      {onlineUserList.includes(u._id) && <span className="online-dot" />}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}

          {/* Conversations List */}
          <ul>
            {filteredConversations.map((conv, idx) => {
              const otherUser = conv.participants.find(p => p._id !== user?._id);
              if (!otherUser) return null;
              const isOnline = onlineUserList.includes(otherUser._id);
              const isSelected = selectedUserId === otherUser._id;
              return (
                <li
                  key={idx}
                  className={isSelected ? 'active-conv' : ''}
                  onClick={() => {
                    setSelectedUserId(otherUser._id);
                    setSelectedUsername(otherUser.username);
                  }}
                >
                  <div className="conv-avatar-wrap">
                    <img src={otherUser.profilephoto} alt={otherUser.username} className="user-avatar" />
                    {isOnline && <span className="online-dot" />}
                  </div>
                  <div className="conv-info">
                    <p className="user-name">{otherUser.username}</p>
                    <p className="conv-last-msg">{conv.lastMessage?.message || 'Start a conversation'}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="dm-area">
          <div className="area-header">
            <h2>{selectedUserId ? `Chatting with ${selectedUsername}` : "Select a user or start a new conversation"}</h2>
          </div>

          <div className="pvt-dm">
            {messages.map((msg, idx) => {
              const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
              const isSent = senderId === user?._id;
              return (
                <div key={idx} className={`message ${isSent ? 'sent' : 'received'}`}>
                  <div className="msg-content">
                    <div className="text">{msg.message}</div>
                    <p>{new Date(msg.createdAt || Date.now()).toLocaleTimeString()}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Send Box */}
          {selectedUserId && (
            <form onSubmit={handleSubmit} className="inbox-upload-container">
              <FiUpload size={24} className='inbox-upload-icon' />
              <input
                type="text"
                placeholder='Write Message'
                className='inbox-upload-input'
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="inbox-button">
                <FaPaperPlane />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;