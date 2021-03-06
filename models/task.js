
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const { constants } = require("../utils")

const schema = new mongoose.Schema({
    name: { type: String },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    state: { type: String, required: true, default: constants.TASK_STATE.IN_PROGRESS, enum: [constants.TASK_STATE.IN_PROGRESS, constants.TASK_STATE.PAUSED, constants.TASK_STATE.RESTARTED] },
    duration: { type: Number, default: 0 },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})

/**
* @class Task
* @property {string} name - Optional name for the task
* @property {string} user - user id of the owner
* @property {IN-PROGRESS|PAUSED|RESTARTED} state - State of the task
* @property {number} duration - Duration in seconds of the task
* @example
* // User
* {name: "wireframe design", user: "56cb91bdc3464f14678934ca", state: "IN-PROGRESS", duration: 5}
*/
module.exports = mongoose.model("Task", schema)