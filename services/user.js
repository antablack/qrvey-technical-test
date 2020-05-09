const { User } = require("../models")
const Joi = require('@hapi/joi');

const userSchemaValidator =  Joi.object({
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


module.exports = {
    create: async (userToCreate) => {
        console.log(userToCreate)
        userToCreate = await userSchemaValidator.validateAsync(userToCreate);
        let user = new User()
        user.fullName = userToCreate.fullName
        user.email = userToCreate.email
        user.password = userToCreate.password
        user.save()
    }
}