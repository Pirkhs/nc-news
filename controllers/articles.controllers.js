const {selectAllArticles, selectArticleById, updateArticleById, insertArticle} = require("../models/articles.models")
const {checkTopicExists} = require("../models/topics.models")
const {checkUsernameExists} = require("../models/users.models")

exports.getAllArticles = (req,res,next) => {
    const {topic, sort_by, order} = req.query
    const promises = [selectAllArticles(topic, sort_by, order)]
    
    if (topic) promises.push(checkTopicExists(topic))

    Promise.all(promises).then(promiseResolutions => {
        res.status(200).send({articles: promiseResolutions[0]})
    })
    .catch(err => {
        next(err)
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

exports.postArticle = ((req,res,next) => {
    const articleToPost = req.body
    const promises = [checkTopicExists(articleToPost.topic), checkUsernameExists(articleToPost.author), insertArticle(articleToPost)]
    Promise.all(promises)
    .then(promiseResolutions => {
        res.status(201).send({article: promiseResolutions[2]})
    })
    .catch(err => {
        next(err)
    })
})