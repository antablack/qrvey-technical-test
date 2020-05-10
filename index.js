const express = require("express")
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const cors = require("cors")
const app = express()
const routes = require("./routes")
const config = require("./config")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use("/api", routes)

mongoose.connect(config.HOST).then(() => {
    console.log("connections database successful...");
    const PORT = process.env.PORT || '3000'
    app.listen(PORT, function () {
        console.log("Server Running -> %s", PORT)
    })
}).catch((err) => {
    console.log("error database Connection -->" + err)
})

