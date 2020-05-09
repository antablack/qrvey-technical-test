const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true}
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    })

module.exports = mongoose.model("Project", schema)