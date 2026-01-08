import React from 'react'
import './GetStarted.css'
import { MdArrowForward } from 'react-icons/md';
import { Link } from 'react-router-dom';
import {
  FaComments,
  FaCar,
  FaUsers,
  FaSearch,
  FaFolderOpen,
} from "react-icons/fa";



const getStartedData = [
  {
    id: 1,
    title: "Discussion",
    description: "Connect with everyone on campus through our public chat rooms. Share announcements, ask questions, and stay updated",
    icon: <FaComments/>
  },
  {
    id: 2,
    title: "Inbox",
    description: "Connect with everyone on campus through our public chat rooms. Share announcements, ask questions, and stay updated",
    icon: <FaComments/>
  },
  {
    id: 3,
    title: "Car Rental",
    description: "Explore the core features and how to use them effectively.",
    icon: <FaCar/>
  },
  {
    id: 4,
    title: "Car Pool",
    description: "Integrate with services and tools to supercharge your workflow.",
    icon: <FaUsers/>
  },
  {
    id: 5,
    title: "Lost and Found",
    description: "Lost something? Found something? Our platform helps connect lost items with their owners quickly.",
    icon: <FaSearch/>
  },
  {
    id: 6,
    title: "Projects",
    description: "Collaborate on academic projects, club initiatives, or startup ideas with other students.",
    icon: <FaFolderOpen/>
  }
];


const GetStarted = () => (

  <div id='getstarted'>
    <div className="page1">
      <div className="page1-heading">
        <h1>Campus<span>Connect</span></h1>
        <p>Your all-in-one platform for campus life. Connect, share, and collaborate with your campus community.</p>
      </div>
      <div className="page1-buttons">
        <Link to="/signup" className="btn-1">Signup</Link>
        <Link to="/login" className='btn-2'>Login</Link>
      </div>
      <button className='learn-more' onClick={() => {
        document.getElementById('page2').scrollIntoView({ behavior: 'smooth' });
      }}>
      Learn More<MdArrowForward /></button>
    </div>

    <div id="page2">
      <div className="page2-heading">
        <h1>Everything you need <span>in one place</span></h1>
      </div>
      <div className="page2-cards">
        {getStartedData.map((card, Idx) => {
          return (
            <div className="page2-card" key={Idx}>
              <div className='icon' >{card.icon}</div>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)

export default GetStarted;