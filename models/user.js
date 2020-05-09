const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator');


const schema = new mongoose.Schema({
    fullName: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})

schema.plugin(uniqueValidator);

module.exports = mongoose.model("User", schema)

