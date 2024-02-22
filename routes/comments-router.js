const { removeCommentById, patchCommentById } = require("../controllers/comments.controllers")

const commentRouter = require("express").Router()

// commentRouter.delete("/:comment_id", removeCommentById)


commentRouter.route("/:comment_id")
.delete(removeCommentById)
.patch(patchCommentById)

module.exports = commentRouter