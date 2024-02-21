const db = require("../db/connection.js")

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