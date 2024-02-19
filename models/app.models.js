const db = require("../db/connection.js")
const fs = require("fs/promises")

exports.selectAllTopics = () => {
    return db.query(`
    SELECT * FROM topics
    `)
    .then(result => {
        return result.rows
    })
}

exports.readAllEndpoints = () => {
    return fs.readFile("./endpoints.json", "utf-8").then(endpointsData => {
        return endpointsData
    })
}

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(article => {
        if (article.rows.length === 0) return Promise.reject({status: 404, msg: "Not found"})
        return article.rows
    })
}

// exports.selectAllArticles = () => {
//     const articlesFile = require("../db/data/test-data/articles.js")
//     return db.query(`
//     SELECT * FROM articles
//     `)
//     .then(articles => {
//         const articlesToSend = articles.rows.map(article => {
//             delete article.body
//             return article
//         })
    
//         return articlesToSend
//     })
// }


exports.selectCommentsByArticleId = (article_id) => {
    return db.query(`
    SELECT * FROM comments 
    WHERE article_id = $1
    ORDER BY created_at DESC
    `, [article_id])
    .then(results => {
        if (results.rows.length === 0) return Promise.reject({status: 404, msg: "Not found"})
        return results.rows
    })
}