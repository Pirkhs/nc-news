const db = require("../db/connection.js")

exports.checkTopicExists = (topic) => {
    if (!topic) return Promise.reject({status: 400, msg: "Bad request"})
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