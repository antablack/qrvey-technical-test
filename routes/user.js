const express = require("express");
const api = express.Router();

const { user } = require("../services")
const auth = require("../middleware/auth")


api.post("/", (req, res) => {
    user.create(req.body).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error.details) {
            res.status(400).send({ error: error.message })
            return
        }
        res.sendStatus(500)
    })
})

api.post("/signin", (req, res) => {
    user.signIn(req.body).then((token) => {
        if (token != null) {
            res.send({ Authorization: token.toString() });
        } else {
            res.sendStatus(401)
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


api.get("/all", auth, (req, res) => {
     user.getTimeUsers().then((users) => {
         res.send(users)
     }).catch((error) => {
         console.log(error)
         res.sendStatus(500)
     })
 })


api.post("/signout", (req, res) => {
    res.clearCookie("Authorization");
    res.sendStatus(200);
})


module.exports = api