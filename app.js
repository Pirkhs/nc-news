const express = require("express");
const app = express();
const {getAllTopics, getAllEndpoints, getArticleById, getAllArticles, getCommentsByArticleId, postCommentByArticleId, patchArticleById} = require("./controllers/app.controllers.js")

app.use(express.json())

app.get("/api/topics", getAllTopics)
app.get("/api", getAllEndpoints)
app.get("/api/articles/:article_id", getArticleById)
// app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)


app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleById)
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