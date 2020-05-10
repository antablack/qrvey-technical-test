/**
 * @module services/user
 */
const { User } = require("../models")
const jwt = require('jsonwebtoken')
const SHA256 = require("crypto-js/sha256")
const { SECRET } = require("../config")
const { validators } = require("../utils")


module.exports = {
    /**
     * Create a user
     * @param {object} userToCreate Object project to create
     * @param {string} userToCreate.fullName name of the user
     * @param {string} userToCreate.email email of the user
     * @param {string} userToCreate.password password
     * @return {Promise} return a promise
     */
    create: async (userToCreate) => {
        userToCreate = await validators.user.userSchemaValidator.validateAsync(userToCreate);
        let user = new User()
        user.fullName = userToCreate.fullName
        user.email = userToCreate.email
        user.password = SHA256(userToCreate.password).toString()
        await user.save()
    },

      /**
     * Sign in
     * @param {object} userLogin Object project to create
     * @param {string} userLogin.email email of the user
     * @param {string} userLogin.password password
     * @return {Promise} return a promise
     */
    signIn: async (userLogin) => {
        const { email, password } = await validators.user.signInSchemaValidator.validateAsync(userLogin);
        const dUser = await User.findOne({ email, password: SHA256(password).toString()});
        if (dUser) {
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + ((60 * 60) * 24), // one day
                data: {
                    email: dUser.email, password: dUser.password
                }
            }, SECRET)
            return token.toString()
        } else {
            return
        }
    },

    /**
     * Get time spent by users
     * @return {Promise<Array>} return a promise
     */
    getTimeUsers: async () => {
        return await User.aggregate([
            { $sort: { "created_at": -1 } },
            {
                $lookup:
                {
                    from: "tasks",
                    localField: "_id",
                    foreignField: "user",
                    as: "task"
                }
            },
        
            {
                $project: {
                    "description": 1,
                    "fullName": "$fullName",
                    "email": "$email",
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

}