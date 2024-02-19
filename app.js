const express = require("express");
const app = express();
const {getAllTopics, getAllEndpoints, getArticleById, getAllArticles} = require("./controllers/app.controllers.js")

app.get("/api/topics", getAllTopics)
app.get("/api", getAllEndpoints)
app.get("/api/articles/:article_id", getArticleById)
// app.get("/api/articles", getAllArticles)


// PSQL Errors
app.use((err, request, response, next) => {
    if (err.code === "22P02") response.status(400).send({msg: "Bad request"})
    else next(err)
})

// Custom Errors
app.use((err, request, response, next) => {
    if (err.status && err.msg) response.status(404).send({msg: "Not found"})
    else next(err)
})

// Incorrect Route Errors
app.all("/*", (request, response, next) => {
    response.status(404).send({msg: "Route does not exist"})
    next(err)
})

// Internal Server Errors
app.use((err, request, response, next) => {
    // console.log("server error")
    response.status(500).send({msg: `Internal server error`})
  })




module.exports = app