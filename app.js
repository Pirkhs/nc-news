const express = require("express");
const app = express();
const {getAllTopics, getAllEndpoints} = require("./controllers/app.controllers.js")

app.get("/api/topics", getAllTopics)

app.get("/api", getAllEndpoints)

app.all("/*", (request, response, next) => {
    response.status(404).send({msg: "Route does not exist"})
    next(err)
})

app.use((err, request, response, next) => {
    // console.log("server error")
    response.status(500).send({msg: `Internal server error`})
  })




module.exports = app