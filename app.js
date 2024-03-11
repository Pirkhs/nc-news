const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router.js")
const cors = require("cors")

app.use(cors())

app.use(express.json())

app.use("/api", apiRouter)

// Incorrect Route Errors
app.all("/*", (request, response, next) => {
    response.status(404).send({msg: "Route does not exist"})
})

// PSQL Errors
app.use((err, request, response, next) => {
    if (err.code === "22P02" || err.code === "23502") response.status(400).send({msg: "Bad request"})
    else next(err)
})

// Custom Errors
app.use((err, request, response, next) => {
    if (err.status && err.msg) response.status(err.status).send({msg: err.msg})
    else next(err)
})

// Internal Server Errors
app.use((err, request, response, next) => {
    // console.log("server error")
    response.status(500).send({msg: `Internal server error`})
  })




module.exports = app