const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    name: { type: String},
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    state: { type: String, required: true, default: "IN-PROGRESS" },
    startDateTime: { type: Date, default: new Date() },
    endDateTime: Date,
    duration: { type: Number, default: 0},
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
module.exports = mongoose.model("Task", schema)