const {selectAllUsers} = require("../models/users.models")

exports.getAllUsers = ((req,res,next) => {
    selectAllUsers()
    .then(users => {
        res.status(200).send({users})
    })
})