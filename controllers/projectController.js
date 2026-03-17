const Project = require('../models/projectModel');

const getProjects = async (req, res) => {
    try {
        const projects = await Project.getAll();
        res.json({ success: true, data: projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const id = await Project.create(req.body);
        res.status(201).json({ success: true, id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        await Project.update(req.params.id, req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        await Project.delete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
