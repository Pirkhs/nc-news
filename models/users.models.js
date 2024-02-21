const db = require("../db/connection.js")

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

exports.selectAllUsers = () => {
    return db.query(`
    SELECT * FROM users
    `)
    .then(users => {
        return users.rows
    })
}