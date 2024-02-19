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