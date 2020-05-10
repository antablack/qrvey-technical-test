const express = require("express");
const api = express.Router();

const user = require("./user")
const project = require("./project")
const task = require("./task")

api.use("/user", user)
api.use("/project", project)
api.use("/task", task)

module.exports = api