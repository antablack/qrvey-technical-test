const { Task } = require("../models")
const Joi = require('@hapi/joi')
const { constants, validators } = require("../utils")

module.exports = {
    create: async (userId, taskToCreate) => {
        const { name, duration } = await validators.task.taskSchemaValidator.validateAsync(taskToCreate);
        let task = new Task()
        task.name = name || ""
        task.duration = duration || 0
        task.user = userId
        return await task.save()
    },

    continue: async (userId, taskId) => {
        let dTask = await Task.findOne({ _id: taskId, user: userId })
        if (!dTask) return
        let task = {}
        task.name = dTask.name
        task.duration = parseInt(dTask.duration || 0)
        return await module.exports.create(userId, task)
    },

    listAll: async (userId) => {
        return await Task.find({ user: userId })
            .sort({ created_at: 'desc' })
            .exec()
    },

    changeOfState: async (data) => {
        const { userId, taskId, duration, state } = await validators.task.changeOfStateSchemaValidator.validateAsync(data);
        let update = {}
        if (state === constants.TASK_STATE.PAUSED) {
            update.duration = duration
            update.state = state 
        } else if (state === constants.TASK_STATE.RESTARTED) {
            update.duration = 0
            update.state = constants.TASK_STATE.IN_PROGRESS
        }
        return await Task.findOneAndUpdate({ _id: taskId, user: userId }, update)
    },
}