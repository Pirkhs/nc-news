const {
        selectAllTopics, 
        readAllEndpoints, 
        selectArticleById, 
        selectAllArticles, 
        selectCommentsByArticleId, 
        insertCommentByArticleId, 
        updateArticleById,
        checkArticleExists
     }
= require("../models/app.models.js")

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

    // Check that the article exists using the article id
    const promises = [checkArticleExists(article_id)]

    // Find the comments array associated with the article id
    promises.push(selectCommentsByArticleId(article_id))

    // Both the article and comments array must be truthy for a successful request
    Promise.all(promises).then(promiseResolutions => {
        res.status(200).send({comments: promiseResolutions[1]})
    })
    // Otherwise catch the error 
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

exports.patchArticleById = ((req,res, next) => {
    const articleId = req.params.article_id
    const {incVotes} = req.body
    updateArticleById(articleId, incVotes).then(article => {
        res.status(200).send({article})
    })
    .catch(err => {
        next(err)
    })
})