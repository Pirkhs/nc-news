const app = require("../app.js")
const request = require("supertest")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data/index.js")

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('STATUS 200: responds with an array of all the topic objects, each with a slug and a description   ', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(result => {
            const {topics} = result.body
            expect(topics.length).toBe(3)
            topics.forEach(topic => {
                expect(typeof topic.slug).toBe("string")
                expect(typeof topic.description).toBe("string")
            })
        })
    });
});

describe('Incorrect route', () => {
    test('STATUS: 404: should respond with appropriate error message when route does not exist', () => {
        return request(app)
        .get("/notARoute")
        .expect(404)
        .then(result => {
            expect(result.body.msg).toBe("Route does not exist")
        })
    });
});