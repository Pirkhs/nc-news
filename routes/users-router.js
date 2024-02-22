const userRouter = require("express").Router()
const {getAllUsers} = require("../controllers/users.controllers")

userRouter.get("/", getAllUsers)

module.exports = userRouter