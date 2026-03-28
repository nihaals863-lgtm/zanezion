const Project = require('../models/projectModel');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');

const getProjects = async (req, res) => {
    try {
        const { page, limit, offset } = getPaginationParams(req.query);
        const { search } = req.query;
        const companyId = req.user.role === 'super_admin' ? null : req.user.companyId;
        const { rows, total } = await Project.getAll(companyId, { limit, offset, search });
        res.json(formatPaginatedResponse(rows, total, page, limit));
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const payload = { ...req.body, company_id: req.user.companyId };
        const id = await Project.create(payload);
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
