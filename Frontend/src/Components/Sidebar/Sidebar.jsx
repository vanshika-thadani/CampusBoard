import React, { useState } from "react";
import {
  FaComments,
  FaCar,
  FaUsers,
  FaSearch,
  FaFolderOpen,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "./Sidebar.css";
import defaultAvatar from "../../assets/Profile.jpg";
import { NavLink, Link } from "react-router-dom";
import { useLogout } from "../../hooks/logouthooks/logouthook";
import { useGetUser } from "../../hooks/user/usegetuser";

const Sidebar = () => {
  const logout = useLogout();
  const [isOpen, setisOpen] = useState(true);
  const { user } = useGetUser(); 

  const navbarToggle = () => {
    setisOpen(!isOpen);
  };

  return (
    <div className="main">
      <aside className={isOpen ? "sidebar" : "sidebar closed"}>
        <div className="sidebar-header" onClick={navbarToggle}>
          {isOpen && <h2 className="close-btn">UniVerse</h2>}
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className="user-info">
          <Link to="/user" className="user-img">
            <img
              src={user?.profilephoto || defaultAvatar}
              alt="user profile"
            />
          </Link>

          {isOpen && (
            <div className="user-details">
              <Link to="/user">
                <h3>{user?.username || "Loading..."}</h3>
                <p className="email">{user?.email || ""}</p>
              </Link>
            </div>
          )}
        </div>

        <div className="menu">
          <NavLink to="/discussion" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaComments size={25} />{isOpen && 'Discussion'}
          </NavLink>
          <NavLink to="/inbox" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaComments size={25} />{isOpen && 'Inbox'}
          </NavLink>
          <NavLink to="/carental" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaCar size={25} />{isOpen && 'Car Rental'}
          </NavLink>
          <NavLink to="/carpool" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaUsers size={25} />{isOpen && 'Car Pool'}
          </NavLink>
          <NavLink to="/lost&found" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaSearch size={25} />{isOpen && 'Lost and Found'}
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaFolderOpen size={25} />{isOpen && 'Projects'}
          </NavLink>
        </div>

        <div className="bottom-menu">
          <button className="menu-item" onClick={logout}>
            <FaSignOutAlt size={25} />{isOpen && 'Logout'}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;