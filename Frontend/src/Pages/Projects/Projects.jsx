import React, { useState } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './Projects.css';
import { FaSearch, FaPlusCircle, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { motion } from 'framer-motion';
import { useprojects } from '../../hooks/projectshooks/useprojectshooks';
import { useUserResources } from '../../hooks/user/useUserresources';
import { useGetUser } from '../../hooks/user/usegetuser';
import { useNavigate } from 'react-router-dom';
import { useaddprojects } from '../../hooks/projectshooks/useaddprojects';
import { toast } from 'react-toastify'; // ✅ Toastify import
import 'react-toastify/dist/ReactToastify.css'; // ✅ Toastify CSS

const Projects = () => {
  const [searchquery, setsearchquery] = useState("");
  const { projects, setprojects, getallprojects } = useprojects();
  const { createproject } = useaddprojects();
  const { refetchResources } = useUserResources();
  const { user } = useGetUser();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    projectTitle: "",
    Category: "",
    Description: "",
    personrequired: 0,
    dueDate: "",
    Technologies: []
  });

  const [techInput, setTechInput] = useState("");

  const handleContactOwner = (owner) => {
    navigate(`/inbox`, {
      state: {
        receiverId: owner?._id,
        receiverUsername: owner?.username
      }
    });
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const techArray = techInput.split(',').map(tech => tech.trim());
    const finalProject = { ...newProject, Technologies: techArray };

    await createproject(finalProject);
    await getallprojects();
    refetchResources();

    toast.success("Project created successfully!"); // ✅ Toast on project creation

    setNewProject({
      projectTitle: "",
      Category: "",
      Description: "",
      personrequired: 0,
      dueDate: "",
      Technologies: []
    });
    setTechInput("");
    setShowForm(false);
  };

  if (!projects) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  const filteredProjects = projects?.filter(project => {
    if (!project) return false;
    const query = searchquery.toLowerCase();
    return (
      project.projectTitle?.toLowerCase().includes(query) ||
      project.Description?.toLowerCase().includes(query) ||
      project.Category?.toLowerCase().includes(query)
    );
  }) || [];

  return (
    <div className='component-container'>
      <Sidebar />
      <motion.div
        id="projects"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
      >
        <div className="projects-heading">
          <h1>Projects</h1>
          <p>Collaborate on academic and campus projects</p>
        </div>

        <button className='add-project' onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : <><FaPlusCircle /> Offer a Project</>}
        </button>

        {showForm && (
          <form className="add-project-form" onSubmit={submitHandler}>
            <input
              type="text"
              name="projectTitle"
              value={newProject.projectTitle}
              onChange={changeHandler}
              placeholder="Project Title"
              required
            />
            <input
              type="text"
              name="Category"
              value={newProject.Category}
              onChange={changeHandler}
              placeholder="Category"
              required
            />
            <textarea
              name="Description"
              value={newProject.Description}
              onChange={changeHandler}
              placeholder="Description"
              required
            />
            <input
              type="number"
              name="personrequired"
              value={newProject.personrequired}
              onChange={changeHandler}
              placeholder="Members"
              required
              min="1"
            />
            <input
              type="date"
              name="dueDate"
              value={newProject.dueDate}
              onChange={changeHandler}
              required
            />
            <input
              type="text"
              name="Technologies"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Technologies (comma separated)"
            />
            <button type="submit" className="submit-project">Submit Project</button>
          </form>
        )}

        <h2 className='available-projects'>Available Projects</h2>

        <div className="search-bar">
          <FaSearch className='Search-icon' />
          <input
            type="text"
            placeholder="Search by title, description, or category..."
            value={searchquery}
            onChange={(e) => setsearchquery(e.target.value)}
          />
        </div>

        <div className="project-cards">
          {filteredProjects.map((project, index) => (
            <div className="project-card" key={index}>
              <div className="project-header">
                <h2>{project.projectTitle}</h2>
              </div>

              <p className='category'>{project.Category}</p>

              <div className="project-details">
                <p className='description'>{project.Description}</p>
                <div className="pro-date">
                  <p><FaUsers /> {project.personrequired}</p>
                  <p><FaCalendarAlt /> {new Date(project.dueDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}</p>
                </div>

                <div className="technology">
                  {Array.isArray(project.Technologies) &&
                    project.Technologies.map((tech, i) => (
                      <span className='tech' key={`${index}-${i}`}>{tech}</span>
                    ))}
                </div>
              </div>

              <div className="project-booking">
                {project?.user && user && project.user._id !== user._id && (
                  <button onClick={() => handleContactOwner(project.user)}>
                    Contact
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Projects;