const express = require("express");
const api = express.Router();

const user = require("./user")
const project = require("./project")
//const user = require("./user")

api.use("/user", user)
api.use("/project", project)

module.exports = api