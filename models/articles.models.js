const db = require("../db/connection.js")

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

exports.selectArticleById = (article_id) => {
    return db.query(`
    SELECT 
    articles.author, articles.title, articles.article_id, articles.topic, articles.body, articles.created_at, articles.votes, article_img_url, COUNT(comments.body) AS comment_count 
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    `, [article_id])
    .then(article => {
        if (article.rows.length === 0) return Promise.reject({status: 404, msg: "Not found"})
        return article.rows[0]
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