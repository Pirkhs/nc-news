const { removeCommentById } = require("../controllers/comments.controllers")

const commentRouter = require("express").Router()

commentRouter.delete("/:comment_id", removeCommentById)

module.exports = commentRouter