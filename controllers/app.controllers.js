const {selectAllTopics, readAllEndpoints, selectArticleById, selectAllArticles, selectCommentsByArticleId, insertCommentByArticleId} = require("../models/app.models.js")

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

exports.getArticleById = (req,res,next) => {
    const {article_id} = req.params
    selectArticleById(article_id)
    .then(article => {
        res.status(200).send({article})
    })
    .catch(err => {
        next(err)
    })
}

// exports.getAllArticles = (req,res,next) => {
//     selectAllArticles().then(articles => {
//         res.status(200).send({articles})
//     })
// }

exports.getCommentsByArticleId = ((req,res,next) => {
    const {article_id} = req.params
    selectCommentsByArticleId(article_id)
    .then(comments => {
        res.status(200).send({comments})
    })
    .catch(err => {
        next(err)
    })
})

exports.postCommentByArticleId = ((req,res,next) => {
    const {article_id} = req.params
    const commentToPost = req.body
    insertCommentByArticleId(article_id, commentToPost).then(comment => {
        res.status(201).send( {comment} )
    })
    .catch(err => {
        next(err)
    })
})