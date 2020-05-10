

require('dotenv').config({path: `.${process.env.NODE_ENV}.env`, encoding: "utf8", debug: true})
module.exports = {
    HOST: process.env.DB_HOST,
    SECRET: process.env.JWT_SECRET
} 