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
        return article.rows[0]
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

exports.insertCommentByArticleId = (article_id, commentToPost) => {

    return db.query(`
    SELECT DISTINCT author FROM articles WHERE article_id = $1`, [article_id])
    .then(result => {
        if (result.rows.length === 0) return Promise.reject({status: 404, msg: "Not found"})
        return author = result.rows[0].author
    })
    .then(author => {
        return db.query(`
        INSERT INTO comments
        (body, author, article_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [commentToPost.body, author, article_id])
    })
    .then(comment => {
        return comment.rows[0]
    })

}