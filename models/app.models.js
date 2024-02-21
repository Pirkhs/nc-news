const db = require("../db/connection.js")
const fs = require("fs/promises")

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

exports.checkUsernameExists = (username) => {
    return db.query(`
    SELECT * FROM users
    WHERE username = $1 
    `, [username])
    .then(dbOutput => {
        if (dbOutput.rows.length === 0){
            return Promise.reject({status: 404, msg: "Not found"})
        }
        return dbOutput.rows
    })
}

exports.checkTopicExists = (topic) => {
    return db.query(`
    SELECT * FROM topics
    WHERE slug = $1
    `, [topic])
    .then(topic => {
        if (topic.rows.length === 0) return Promise.reject({status: 404, msg: "Not found"})
        return topic
    })
}


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

exports.selectAllArticles = (topic) => {
    const whereStr = topic ? "WHERE topic = $1" : ""
    const replacements = topic ? [topic] : []

    return db.query(`
    SELECT 
    articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.body) AS comment_count 
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    ${whereStr}
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
    `, replacements)
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

exports.insertCommentByArticleId = (article_id, username, body) => {

    if (!article_id || !username || !body) return Promise.reject({status: 400, msg: "Bad request"})
    
    return db.query(`
    INSERT INTO comments
    (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *
    `, [article_id, username, body])
    .then(result => {
        return result.rows[0]
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

exports.deleteCommentById = (commentId) => {
    return db.query(`
    SELECT * FROM comments
    WHERE comment_id = $1
    `, [commentId])
    .then((comment) => {
        if (comment.rows.length === 0) return Promise.reject({status: 404, msg: "Not found"})
        return db.query(`
        DELETE FROM comments
        WHERE comment_id = $1
        `, [commentId])
    })
}

exports.selectAllUsers = () => {
    return db.query(`
    SELECT * FROM users
    `)
    .then(users => {
        return users.rows
    })
}