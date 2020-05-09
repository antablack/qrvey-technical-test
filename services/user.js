const { User } = require("../models")
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const SHA256 = require("crypto-js/sha256");
const { SECRET } = require("../config");

const userSchemaValidator = Joi.object({
    fullName: Joi.string()
        .min(3)
        .max(500)
        .required(),

    password: Joi.string()
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co'] } })
})


const signInSchemaValidator = Joi.object({

    email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co'] } }),

    password: Joi.string()
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
})


module.exports = {
    create: async (userToCreate) => {
        userToCreate = await userSchemaValidator.validateAsync(userToCreate);
        let user = new User()
        user.fullName = userToCreate.fullName
        user.email = userToCreate.email
        user.password = SHA256(userToCreate.password).toString()
        user.save()
    },

    signIn: async (userLogin) => {
        const { email, password } = await signInSchemaValidator.validateAsync(userLogin);
        const dUser = await User.findOne({ email, password: SHA256(password).toString()});
        if (dUser) {
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + ((60 * 60) * 24), // one day
                data: {
                    user: dUser.user, password: dUser.password
                }
            }, SECRET)
            return token.toString()
        } else {
            return
        }
    }
}