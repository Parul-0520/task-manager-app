// const Project = require('../models/Project');

// const getProjects = async (req, res) => {
//   try {
//     const projects = await Project.find({ members: req.user._id }).populate('owner', 'name email').populate('members', 'name email');
//     res.json(projects);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getProjectById = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) {
//       return res.status(404).json({ message: 'Project not found' });
//     }
//     res.json(project);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };

// // backend/controllers/projectController.js

// const createProject = async (req, res) => {
//   try {
//     const { name, description, members } = req.body;
    
//     // Fix: Ensure we take the members array from the frontend (which contains the user IDs)
//     // and combine it with the owner's ID.
//     const projectMembers = [req.user._id];
//     if (members && Array.isArray(members)) {
//       members.forEach(memberId => {
//         if (!projectMembers.includes(memberId)) {
//           projectMembers.push(memberId);
//         }
//       });
//     }

//     const project = await Project.create({ 
//       name, 
//       description, 
//       owner: req.user._id, 
//       members: projectMembers // This now contains the assigned users
//     });

//     res.status(201).json(project);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });
    
//     // Permission check
//     if (project.owner.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     // Fix: Allow updating the members array so you can add users to existing projects
//     const updated = await Project.findByIdAndUpdate(
//       req.params.id, 
//       req.body, 
//       { new: true }
//     ).populate('members', 'name email');

//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const deleteProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) return res.status(404).json({ message: 'Project not found' });
//     if (project.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
//     await project.deleteOne();
//     res.json({ message: 'Project deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };






const Project = require('../models/Project');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate('owner', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Security Check: Ensure the logged-in user is a member of this project
    const isMember = project.members.some(m => m._id.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    
    // Start with the creator (Admin)
    const projectMembers = [req.user._id]; 

    // Add assigned members from the form
    if (members && Array.isArray(members)) {
      members.forEach(id => {
        if (!projectMembers.includes(id)) projectMembers.push(id);
      });
    }

    const project = await Project.create({ 
      name, 
      description, 
      owner: req.user._id, 
      members: projectMembers // Crucial: This gives users access!
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     const project = await Project.create({ 
//       name, 
//       description, 
//       owner: req.user._id, 
//       members: projectMembers 
//     });

//     res.status(201).json(project);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Only the owner can update project settings/members
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate('members', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Only the owner can delete the project
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject };