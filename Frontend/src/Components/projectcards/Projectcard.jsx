import React from 'react';
import { FaUsers, FaCalendarAlt } from 'react-icons/fa';
import './Projectcard.css';

const Projectcard = ({
  projectTitle,
  Description,
  Category,
  personrequired,
  dueDate,
  Technologies
}) => {
  return (
    <div className="project-card">
      <div className="project-header">
        <h2>{projectTitle}</h2>
      </div>
      <p className="category">{Category}</p>
      <div className="project-details">
        <p className="description">{Description}</p>
        <div className="pro-date">
          <p><FaUsers /> {personrequired}</p>
          <p><FaCalendarAlt /> {new Date(dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
        <div className="technology">
          {Technologies?.map((tech, i) => (
            <span className="tech" key={i}>{tech}</span>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default Projectcard;