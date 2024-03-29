const db = require("../db/connection.js")

exports.checkUsernameExists = (username) => {
    if (!username) return Promise.reject({status: 400, msg: "Bad request"})
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

exports.selectUserByUsername = (username) => {
    return db.query(`
    SELECT * FROM users
    WHERE username = $1
    `, [username])
    .then(user => {
        if (user.rows.length === 0) return Promise.reject({status: 404, msg: `Not found`})
        return user.rows[0]
    })
}