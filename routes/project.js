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


api.get("/all", auth, (req, res) => {
    project.getTimeProjects().then((projects) => {
        res.send(projects)
    }).catch((error) => {
        console.log(error)
        res.sendStatus(500)
    })
})


api.get("/:projectId(([a-f0-9]{24}))", auth, (req, res) => {
    project.getTimeByProjectByUser(req.params.projectId, req.user._id).then((project) => {
        if (!project) {
            res.sendStatus(404)
            return
        }
        res.send(project)
    }).catch((error) => {
        console.log(error)
        res.sendStatus(500)
    })
})


api.put("/:projectId(([a-f0-9]{24}))/associate-task", auth, (req, res) => {
    const data = {
        userId: req.user._id.toString(),
        projectId: req.params.projectId,
        taskId: req.body.taskId
    }

    project.associateTask(data).then((task) => {
        if (task) {
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }
    }).catch((error) => {
        console.log(error)
        if (error.details) {
            res.status(400).send({ error: error.message })
            return
        }
        res.sendStatus(500)
    })
})


module.exports = api