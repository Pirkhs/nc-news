const userRouter = require("express").Router()
const {getAllUsers, getUserByUsername} = require("../controllers/users.controllers")

userRouter.get("/", getAllUsers)
userRouter.get("/:username", getUserByUsername)


module.exports = userRouter