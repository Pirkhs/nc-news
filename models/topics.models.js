const db = require("../db/connection.js")

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