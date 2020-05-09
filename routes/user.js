const express = require("express");
const api = express.Router();

const { user } = require("../services")


api.post("/", (req, res) => {
    user.create(req.body).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if(error.details) {
            res.status(400).send({error: error.message})
            return
        }
        res.sendStatus(500)
    })
})

module.exports = api