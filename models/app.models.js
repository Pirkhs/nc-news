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

exports.selectAllArticles = () => {

    return db.query(`
    SELECT 
    articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.body) AS comment_count 
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    `)
    .then(articles => {
        return articles.rows
    })
}


exports.selectCommentsByArticleId = (article_id) => {
    return db.query(`
    SELECT * FROM comments 
    WHERE article_id = $1
    ORDER BY created_at DESC
    `, [article_id])
    .then(results => {
        return results.rows
    })
}

exports.insertCommentByArticleId = (article_id, commentToPost) => {

    // Check for any bad requests and reject the promise
    if (!commentToPost.username || !commentToPost.body) return Promise.reject({status: 400, msg: "Bad request"})
    
    // Begin my checking for whether the username exists
    return db.query(`
    SELECT * FROM users
    WHERE username = $1
    `, [commentToPost.username])
    .then(username => {
        // If username does not exist, return a rejected promise of 'not found'
        if (!username.rows[0]) return Promise.reject({status: 404, msg: "Not found"})
    })
    .then(() => {
        // Check for whether the article id exists
        return db.query(`
            SELECT * FROM articles
            WHERE article_id = $1
        `, [article_id])
        .then((result) => {
            // If article id is valid but non-existant, reject the promise 
            if (result.rows.length === 0) return Promise.reject ({status: 404, msg: "Not found"})

            // 'Happy Path' for valid requests
            return db.query(`
                INSERT INTO comments
                (body, author, article_id)
                VALUES ($1, $2, $3)
                RETURNING *
                `,
                [commentToPost.body, commentToPost.username, article_id]
            )
            .then(comment => {
                return comment.rows[0]
            })
        })
    })
}
exports.updateArticleById = (articleId, incVotes) => {
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1
    `, [articleId])
    .then(article => {
        if (article.rows.length === 0) return Promise.reject({status: 404, msg: "Not found"})
    })
    .then(() => {
        return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2 
        RETURNING *
        `, [incVotes, articleId])
        .then(articles => {
            return articles.rows[0]
        })
    })
    
}

exports.checkArticleExists = (articleId) => {
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1
    `, [articleId])
    .then((dbOutput) => {
        if (dbOutput.rows.length === 0) {
            // resource DOES NOT exist
            return Promise.reject({status: 404, msg: "Not found"})
        }
        return dbOutput.rows
    })
}