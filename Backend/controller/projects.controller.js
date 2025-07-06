
const Projects = require('../models/project.model');

// GET all projects
const getallprojects = async (req, res) => {
  try {
    const projects = await Projects.find().populate('user','_id username email') // Fixed: added await
    return res.status(200).json({ projects });
  } catch (error) {
    console.error("Projects error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// POST a new project
const postproject = async (req, res) => {
  try {

    const user = req.user;

    const {
      projectTitle,
      Category,
      Description,
      personrequired,
      dueDate,
      Technologies
    } = req.body;

    if (!projectTitle || !Category || !Description || !personrequired || !dueDate || !Technologies) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProject = await Projects.create({
      user: user._id,
      projectTitle,
      Category,
      Description,
      personrequired,
      dueDate,
      Technologies
    });

    user.projects.push(newProject._id);
    await user.save();
    return res.status(201).json(newProject);

  } catch (error) {
    console.error("Project creation error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = {
  getallprojects,
  postproject,
  
};
