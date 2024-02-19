const app = require("../app.js")
const request = require("supertest")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data/index.js")
const { parse } = require("dotenv")

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

describe('GET /api', () => {
    test('STATUS 200: responds with an object describing all the available endpoints on the API', () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(result => {
            const endpointsFileData = require("../endpoints.json")
            const {endpoints} = result.body
            const parsedEndpoints = JSON.parse(endpoints)
            expect(parsedEndpoints.length >= 1)
            expect(endpointsFileData).toEqual(parsedEndpoints)
            
        })
    });
});

describe('GET /api/articles:article_id', () => {
    test('STATUS 200: responds with an article object, which should have its appropriate properties ', () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(result => {
            const {article} = result.body
            expect(article[0].article_id).toBe(1)
            expect(article[0].title).toBe("Living in the shadow of a great man")
            expect(article[0].topic).toBe("mitch")
            expect(article[0].author).toBe("butter_bridge")
            expect(article[0].body).toBe('I find this existence challenging')
            expect(article[0].created_at).toBe("2020-07-09T20:11:00.000Z")
            expect(article[0].votes).toBe(100)
            expect(article[0].article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        })   
    });

    test('STATUS 400: responds with appropriate error message for when given an invalid id', () => {
        return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then(result => {
            expect(result.body.msg).toBe("Bad request")
        })
    });

    test('STATUS 404: responds with appropriate error message for when given a valid but non-existant id in the data', () => {
        return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(result => {
            expect(result.body.msg).toBe("Not found")
        })
    })
});


describe('Incorrect route', () => {
    test('STATUS 404: should respond with appropriate error message when route does not exist', () => {
        return request(app)
        .get("/notARoute")
        .expect(404)
        .then(result => {
            expect(result.body.msg).toBe("Route does not exist")
        })
    });
});
