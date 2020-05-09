const { User } = require("../models");
const jwt = require('jsonwebtoken');
const { SECRET } = require("../config");


async function auth(req, res, callback) {
    try {
        if (!req.headers.authorization) {
            res.sendStatus(401)
            return
        }
        const decoded = jwt.verify(req.headers.authorization, SECRET)
        const dUser = await User.findOne({email: decoded.data.email, password: decoded.data.password});
        if (dUser != null) {
            req.user = dUser
        } else {
            res.sendStatus(401)
            return
        }
        console.log(decoded)
    } catch (ex) {
        console.error(ex)
        res.sendStatus(401)
        return
    }
    callback()
}

module.exports = auth
