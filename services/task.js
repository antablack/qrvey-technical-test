/**
 * @module services/task
 */
const { Task } = require("../models")
const Joi = require('@hapi/joi')
const { constants, validators } = require("../utils")

module.exports = {
    /**
     * Create a user
     * @param {string} userId User id of the owner
     * @param {object} taskToCreate Object task to create
     * @param {string} taskToCreate.name name of the task
     * @param {number} taskToCreate.duration duration in seconds of the task
     * @return {Promise} return a promise
     */
    create: async (userId, taskToCreate) => {
        const { name, duration } = await validators.task.taskSchemaValidator.validateAsync(taskToCreate);
        let task = new Task()
        task.name = name || ""
        task.duration = duration || 0
        task.user = userId
        return await task.save()
    },
    
    /**
     * Continue task
     * @param {string} userId User id of the owner
     * @param {string} taskId Task id
     * @return {Promise} return a promise
     */
    continue: async (userId, taskId) => {
        let dTask = await Task.findOne({ _id: taskId, user: userId })
        if (!dTask) return
        let task = {}
        task.name = dTask.name
        task.duration = parseInt(dTask.duration || 0)
        return await module.exports.create(userId, task)
    },

    /**
     * Get all task by user
     * @param {string} userId User id of the owner
     * @return {Promise<Array>} return a promise
     */
    listAll: async (userId) => {
        return await Task.find({ user: userId })
            .sort({ created_at: 'desc' })
            .exec()
    },

    /**
     * Change state of the task
     * @param {object} data Object task to change of state
     * @param {string} data.userId User id of the owner
     * @param {string} data.taskId Task id
     * @param {number} data.duration duration in seconds of the task
     * @param {PAUSED|RESTARTED} data.state State to be changed
     * @return {Promise} return a promise
     */
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