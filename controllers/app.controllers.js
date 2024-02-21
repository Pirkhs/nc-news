const {
        selectAllTopics, 
        readAllEndpoints, 
        selectArticleById, 
        selectAllArticles, 
        selectCommentsByArticleId, 
        insertCommentByArticleId, 
        updateArticleById,
        checkArticleExists,
        deleteCommentById,
        checkUsernameExists,
        selectAllUsers,
        checkTopicExists
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

exports.getAllArticles = (req,res,next) => {
    const {topic} = req.query
    const promises = [selectAllArticles(topic)]
    
    if (topic) promises.push(checkTopicExists(topic))

    Promise.all(promises).then(promiseResolutions => {
        res.status(200).send({articles: promiseResolutions[0]})
    })
    .catch(err => {
        next(err)
    })
}

exports.getCommentsByArticleId = ((req,res,next) => {
    const {article_id} = req.params

    const promises = [checkArticleExists(article_id), selectCommentsByArticleId(article_id)]

    Promise.all(promises).then(promiseResolutions => {
        res.status(200).send({comments: promiseResolutions[1]})
    })
    
    .catch(err => {
        next(err)
    })
})

exports.postCommentByArticleId = ((req,res,next) => {
    const {article_id} = req.params
    const {username, body} = req.body
    
    const promises = [ checkUsernameExists(username), checkArticleExists(article_id), insertCommentByArticleId(article_id, username, body)]
    
    Promise.all(promises).then(promiseResolutions => {
        res.status(201).send( {comment: promiseResolutions[2]} )
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

exports.removeCommentById = ((req,res,next) => {
    const commentId = req.params.comment_id
    deleteCommentById(commentId).then(() => {
        res.send(204)
    })
    .catch(err => {
        next(err)
    })
})

exports.getAllUsers = ((req,res,next) => {
    selectAllUsers()
    .then(users => {
        res.status(200).send({users})
    })
})