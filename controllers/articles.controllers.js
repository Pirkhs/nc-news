const {selectAllArticles, selectArticleById, updateArticleById} = require("../models/articles.models")
const {checkTopicExists} = require("../models/topics.models")

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