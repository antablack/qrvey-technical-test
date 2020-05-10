const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    })

/**
* @class Project
* @property {string} name - name of the project
* @property {Array} tasks - Array of the task Ids
* @property {string} user - Id of the owner
* @example
* // Just mandatory fields
* {"name": "Website design", "user", "56cb91bdc3464f14678934ca"}
* @example
* // All fields
* {"name": "Website design", "user", "56cb91bdc3464f14678934ca", tasks: ["5cabe64dcf0d4447fa60f5e2"]}
*/
module.exports = mongoose.model("Project", schema)