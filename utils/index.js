const Joi = require('@hapi/joi')

const constants =  {
    TASK_STATE: {
        IN_PROGRESS: "IN-PROGRESS",
        PAUSED: "PAUSED", 
        RESTARTED: "RESTARTED"
    }
}

module.exports = {
    constants,
    validators: {
        project: {
            projectSchemaValidator: Joi.object({
                name: Joi.string()
                    .min(3)
                    .max(500) 
                    .required()
            }),
            associateProjectSchemaValidator: Joi.object({
                userId: Joi.string().required(),
                projectId: Joi.string().required(),
                taskId: Joi.string().required()
            })
        },
        task: {
            taskSchemaValidator: Joi.object({
                name: Joi.string()
                    .min(0)
                    .max(500)
                    .allow(""),
                duration: Joi.number().positive().allow(0),
            }),
    
            changeOfStateSchemaValidator: Joi.object({
                userId: Joi.string().required(),
                taskId: Joi.string().required(),
                duration: Joi.number().positive().required().allow(0),
                state: Joi.valid(constants.TASK_STATE.PAUSED, constants.TASK_STATE.RESTARTED).required()
            })
        },
        user: {
            userSchemaValidator: Joi.object({
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
            }),
    
            signInSchemaValidator: Joi.object({
    
                email: Joi.string()
                    .required()
                    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'co'] } }),
    
                password: Joi.string()
                    .required()
                    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
            })
    
        }
    }
}