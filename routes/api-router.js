const apiRouter = require('express').Router()
const userRouter = require("./users-router.js")
const topicRouter = require("./topics-router.js")
const articleRouter = require("./articles-router.js") 
const commentRouter = require("./comments-router.js")

const { getAllEndpoints } = require('../controllers/app.controllers.js')


apiRouter.get("/", getAllEndpoints)

apiRouter.use("/users", userRouter)
apiRouter.use("/topics", topicRouter)
apiRouter.use("/comments", commentRouter)
apiRouter.use("/articles", articleRouter)

module.exports = apiRouter