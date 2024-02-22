const {selectAllUsers} = require("../models/users.models")
const {selectUserByUsername} = require("../models/users.models")

exports.getAllUsers = ((req,res,next) => {
    selectAllUsers()
    .then(users => {
        res.status(200).send({users})
    })
})

exports.getUserByUsername = ((req,res,next) => {
    const {username} = req.params
    selectUserByUsername(username)
    .then(user => {
        res.status(200).send({user})
    })
    .catch(err => {
        next(err)
    })
})