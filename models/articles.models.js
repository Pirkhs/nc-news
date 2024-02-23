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

exports.getTotalArticles = (topic) => {
    return db.query(`
    SELECT COUNT(body) AS total_count FROM articles
    WHERE topic = $1`, [topic])
    .then(result => {
        const {total_count} = result.rows[0]
        console.log(total_count)
        return total_count
    })
}

exports.selectAllArticles = (...args) => {
    const [topic, sort_by = "created_at", order = "desc", limit = 10, p] = args
    const queryVals = args.filter(arg => {
        if (arg) return arg
    })

    const replacements = []
    if (queryVals.includes(topic)) replacements.push(topic)
    if (queryVals.includes(limit)) replacements.push(limit)

    const whereStr = queryVals.includes(topic) ? `WHERE topic = $${replacements.indexOf(topic) + 1}` : ""
    const limitStr = queryVals.includes(limit) ? `LIMIT $${replacements.indexOf(limit) + 1}` : ""

    if (!["title", "topic", "author", "body", "created_at", "votes", "article_img_url"].includes(sort_by)) return Promise.reject({status: 400, msg: "Bad request"})
    if (order !== "desc" && order !== "asc") return Promise.reject({status: 400, msg: "Bad request"})
   
    return db.query(`
    SELECT 
    articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.body) AS comment_count 
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    ${whereStr}
    GROUP BY articles.article_id
    ORDER BY articles.${sort_by} ${order}
    ${limitStr}
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

exports.insertArticle = (articleToPost) => {
    const {title, topic, author, body} = articleToPost
    return db.query(`
    INSERT INTO articles
    (title, topic, author, body)
    VALUES
    ($1, $2, $3, $4)
    RETURNING *
    `, [ title, topic, author, body ])
    .then(article => {
        article.rows[0].comment_count = 0
        return article.rows[0]
    })
}