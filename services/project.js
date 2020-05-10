/**
 * @module services/project
 */
const { Project } = require("../models")
const mongoose = require("mongoose")
const { validators } = require("../utils")

module.exports = {
    /**
     * Create a project
     * @param {string} userId User id of the owner
     * @param {object} projectToCreate Object project to create
     * @param {string} projectToCreate.name name of the project
     * @return {Promise} return a promise
     */
    create: async (userId, projectToCreate) => {
        const { name } = await validators.project.projectSchemaValidator.validateAsync(projectToCreate);
        let project = new Project()
        project.name = name
        project.user = userId
        await project.save()
    },

    /**
     * Associate project with task
     * @param {object} data Object data
     * @param {string} data.userId id of the user
     * @param {string} data.projectId id of the project
     * @param {string} data.taskId id of the task
     * @return {Promise} return a promise
     */
    associateTask: async (data) => {
        const { userId, projectId, taskId } = await validators.project.associateProjectSchemaValidator.validateAsync(data);
        let project = await Project.findOne({ _id: projectId, user: userId })
        if (!project) return
        project.tasks.push(taskId)
        return await project.save()
    },

     /**
     * Get all projects with their time spent
     * @param {object} filter filter to apply at the query
     * @return {Promise<Array>} return a promise
     */
    getTimeProjects: async (filter = {}) => {
        return await Project.aggregate([
            { $sort: { "created_at": -1 } },
            { $match: filter },
            {
                $lookup:
                {
                    from: "tasks",
                    localField: "tasks",
                    foreignField: "_id",
                    as: "task"
                }
            },
            {
                $project: {
                    "description": 1,
                    "name": "$name",
                    "created_at": "$created_at",
                    "timeSpent": {
                        $reduce: {
                            input: "$task",
                            initialValue: 0,
                            in: { $sum: ["$$value", "$$this.duration"] }
                        }
                    }
                }
            }
        ])
    },

    /**
     * Get time by project and user
     * @param {string} projectId id of the project
     * @param {string} userId id of the user
     * @return {Promise<Array>} return a promise
     */
    getTimeByProjectByUser: async (projectId, userId) => {
        const project = await module.exports.getTimeProjects({ _id: mongoose.Types.ObjectId(projectId), user: userId })
        if (project) {
            return project[0]
        }
    },

    listAll: async (userId) => {
        return await Project.find({ user: userId })
            .populate("user", "fullName email")
            .sort({ created_at: 'desc' })
            .exec()
    }
}