const { Project } = require("../models")
const mongoose = require("mongoose")
const { validators } = require("../utils")

module.exports = {
    create: async (userId, projectToCreate) => {
        const { name } = await validators.project.projectSchemaValidator.validateAsync(projectToCreate);
        let project = new Project()
        project.name = name
        project.user = userId
        await project.save()
    },

    associateTask: async (data) => {
        const { userId, projectId, taskId } = await validators.project.associateProjectSchemaValidator.validateAsync(data);
        let project = await Project.findOne({ _id: projectId, user: userId })
        if (!project) return
        project.tasks.push(taskId)
        return await project.save()
    },

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

    getTimeByProjectByUser: async (projectId, userId) => {
        const project = await module.exports.getTimeProjects({_id: mongoose.Types.ObjectId(projectId), user: userId})
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