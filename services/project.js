const { Project } = require("../models")
const Joi = require('@hapi/joi');

const projectSchemaValidator = Joi.object({
    name: Joi.string()
        .min(3)
        .max(500)
        .required()
})

module.exports = {
    create: async (userId, projectToCreate) => {
        const { name } = await projectSchemaValidator.validateAsync(projectToCreate);
        let project = new Project()
        project.name = name
        project.user = userId
        await project.save()
    },

    listAll:  async (userId) => {
        return await Project.find({user: userId})
        .populate("user", "fullName email")
        .sort({date: 'desc'})
        .exec()
    }
}