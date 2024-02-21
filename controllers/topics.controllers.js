const {selectAllTopics, checkTopicExists} = require("../models/topics.models")

exports.getAllTopics = (req,res,next) => {
    selectAllTopics()
    .then((topics) => {
        res.status(200).send({topics})
    }) 
}