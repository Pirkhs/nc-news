const {selectAllTopics, readAllEndpoints} = require("../models/app.models.js")

exports.getAllTopics = (req,res,next) => {
    selectAllTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
    
}

exports.getAllEndpoints = (req,res,next) => {
    readAllEndpoints()
    .then(endpoints => {
        res.status(200).send({endpoints})
    })
}