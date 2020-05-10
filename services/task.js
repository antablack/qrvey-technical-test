const { Task } = require("../models")
const Joi = require('@hapi/joi');

const taskSchemaValidator = Joi.object({
    name: Joi.string()
        .min(0)
        .max(500)
        .allow(""),
    duration: Joi.number().positive(),
})


const changeOfStateSchemaValidator = Joi.object({
    userId: Joi.string().required(),
    taskId: Joi.string().required(),
    duration: Joi.number().positive().required().allow(0),
    state: Joi.valid("PAUSED", "RESTARTED").required()
})

module.exports = {
    create: async (userId, taskToCreate) => {
        const { name, duration } = await taskSchemaValidator.validateAsync(taskToCreate);
        let task = new Task()
        task.name = name
        task.duration = duration
        task.user = userId
        await task.save()
    },

    listAll: async (userId) => {
        return await Task.find({ user: userId })
            .sort({ created_at: 'desc' })
            .exec()
    },

    changeOfState: async (data) => {
        console.log(data.userId)
        const { userId, taskId, duration, state } = await changeOfStateSchemaValidator.validateAsync(data);
        let update = {state: state}
        if (state === "PAUSED") {
            update.duration = duration
        } else if (state === "RESTARTED") {
            update.duration = 0
        }
        return await Task.findOneAndUpdate({ _id: taskId, user: userId}, update)
    },
}