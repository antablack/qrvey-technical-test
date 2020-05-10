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

/**
* @class User
* @property {string} fullName - full name of the user
* @property {string} email - Email of the user
* @property {string} password - Password (SHA256)
* @example
* // User
* {"fullName": "Juan Sanchez", "user", "jcsanchezv1998@gmail.com", password: "2f928d52962a3bddfda7ce5f0f10f861e24cb772b6f8267e1b33d009abfe616d"}
*/
module.exports = mongoose.model("User", schema)

