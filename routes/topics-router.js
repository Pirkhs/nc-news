const topicRouter = require("express").Router()
const {getAllTopics} = require("../controllers/topics.controllers")

topicRouter.use("/", getAllTopics)

module.exports = topicRouter