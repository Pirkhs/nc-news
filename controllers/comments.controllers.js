const {checkArticleExists} = require("../models/articles.models")
const {selectCommentsByArticleId, insertCommentByArticleId, deleteCommentById, updateCommentById} = require("../models/comments.models")
const {checkUsernameExists} = require("../models/users.models")

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

exports.removeCommentById = ((req,res,next) => {
    const commentId = req.params.comment_id
    deleteCommentById(commentId).then(() => {
        res.send(204)
    })
    .catch(err => {
        next(err)
    })
})

exports.patchCommentById = ((req, res, next) => {
    const commentId = req.params.comment_id
    const incVotes = req.body.inc_votes
    updateCommentById(commentId, incVotes)
    .then(comment => {
        res.status(201).send({comment})
    })
    .catch(err => {
        next(err)
    })
})