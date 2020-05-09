const express = require("express");
const api = express.Router();

const { project } = require("../services")
const auth = require("../middleware/auth")


api.post("/", auth, (req, res) => {
   console.log(req.user)
    project.create(req.user._id, req.body).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        console.log(error)
        if (error.details) {
            res.status(400).send({ error: error.message })
            return
        }
        res.sendStatus(500)
    })
})


api.get("/", auth, (req, res) => {
    console.log(req.user)
     project.listAll(req.user._id).then((projects) => {
         res.send(projects)
     }).catch((error) => {
         res.sendStatus(500)
     })
 })


module.exports = api