const express = require("express");
const api = express.Router();

const { task } = require("../services")
const auth = require("../middleware/auth")


api.post("/", auth, (req, res) => {
    task.create(req.user._id, req.body).then(() => {
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
    console.log(req.user)
    task.listAll(req.user._id).then((tasks) => {
        res.send(tasks)
    }).catch((error) => {
        res.sendStatus(500)
    })
})


api.put("/:taskId(([a-f0-9]{24}))/change-of-state", auth, (req, res) => {
    console.log(req.user)
    let data = {
        userId: req.user._id.toString(),
        taskId: req.params.taskId,
        ...req.body
    }
    task.changeOfState(data).then((task) => {
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


api.put("/:taskId(([a-f0-9]{24}))/continue", auth, (req, res) => {
    task.continue(req.user._id.toString(), req.params.taskId).then((task) => {
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