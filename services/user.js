const { User } = require("../models")
const jwt = require('jsonwebtoken')
const SHA256 = require("crypto-js/sha256")
const { SECRET } = require("../config")
const { validators } = require("../utils")


module.exports = {
    create: async (userToCreate) => {
        userToCreate = await validators.user.userSchemaValidator.validateAsync(userToCreate);
        let user = new User()
        user.fullName = userToCreate.fullName
        user.email = userToCreate.email
        user.password = SHA256(userToCreate.password).toString()
        await user.save()
    },

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