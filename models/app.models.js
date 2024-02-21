const db = require("../db/connection.js")
const fs = require("fs/promises")

exports.readAllEndpoints = () => {
    return fs.readFile("./endpoints.json", "utf-8").then(endpointsData => {
        return endpointsData
    })
}
