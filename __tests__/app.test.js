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
            expect(article.article_id).toBe(1)
            expect(article.title).toBe("Living in the shadow of a great man")
            expect(article.topic).toBe("mitch")
            expect(article.author).toBe("butter_bridge")
            expect(article.body).toBe('I find this existence challenging')
            expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
            expect(article.votes).toBe(100)
            expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
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

describe('GET /api/articles', () => {
    test('STATUS 200: responds with an article array of object, each with their own appropriate properties and values ', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(result => {
            const {articles} = result.body
            expect(articles.length).toBe(13)
            for (const article of articles){
                expect(typeof article.author).toBe("string")
                expect(typeof article.title).toBe("string")
                expect(typeof article.article_id).toBe("number")
                expect(typeof article.topic).toBe("string")
                expect(typeof article.created_at).toBe("string")
                expect(typeof article.votes).toBe("number")
                expect(typeof article.article_img_url).toBe("string")
                expect(typeof article.comment_count).toBe("string")
            }
        })
    });
    test('STATUS 200: ensure that the array of articles are sorted by their date created in descending order', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(result => {
            expect(result.body.articles).toBeSortedBy("created_at", {descending: true})
        })
    });
});


describe('GET /api/articles/:article_id/comments', () => {
    test('STATUS 200: responds with an array of comments for the given article_id', () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(result => {
            const {comments} = result.body
            expect(comments.length).toBe(11)
            for (const comment of comments) {
                expect(typeof comment.comment_id).toBe("number")
                expect(typeof comment.body).toBe("string")
                expect(comment.article_id).toBe(1)
                expect(typeof comment.author).toBe("string")
                expect(typeof comment.votes).toBe("number")
                expect(typeof comment.created_at).toBe("string")
            }
            
        })
    });
    
    test('STATUS 200: ensure that the responded array of comments is ordered by created_at, in descending order ', () => {
        return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((result => {
            const {comments} = result.body
            expect(comments).toBeSortedBy("created_at", {descending: true})
        }))
    });

    test("STATUS 200: responds with an empty array if the article has no comments", () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(result => {
            const {comments} = result.body
            expect(comments.length).toBe(0)
        })
    })

    test('STATUS 400: responds with appropriate error message for when given an invalid article id', () => {
        return request(app)
        .get("/api/articles/notanid/comments")
        .expect(400)
        .then(result => {
            expect(result.body.msg).toBe("Bad request")
        })
    });

    test("STATUS 404: responds with appropriate error message for when given a valid but non-existant article id", () => {
        return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(result => {
            expect(result.body.msg).toBe("Not found")
        })
    })
});

describe('POST /api/articles/:article_id/comments', () => {
    test("STATUS 201: responds with the posted comment requested for the article_id specified", () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({
            username: "icellusedkars",
            body: "My amazing body description"
        })
        .expect(201)
        .then(result => {
            const {comment} = result.body
            expect(comment.comment_id).toBe(19)
            expect(comment.body).toBe("My amazing body description")
            expect(comment.article_id).toBe(2)
            expect(comment.author).toBe("icellusedkars")
            expect(comment.votes).toBe(0)
            expect(typeof comment.created_at).toBe("string")
        })
    })

    test('STATUS 400: responds with appropriate error message for a malformed body request ', () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({})
        .expect(400)
        .then(result => {
            expect(result.body.msg).toBe("Bad request")
        })
    });

    test('STATUS 400: responds with appropriate error message for a failing schema validation ', () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({
            username: "icellusedkars",
            body: null 
        })
        .expect(400)
        .then(result => {
            expect(result.body.msg).toBe("Bad request")
        })
    });

    test('STATUS 400: responds with appropriate error message for an invalid id ', () => {
        return request(app)
        .post("/api/articles/notAnId/comments")
        .send({
            username: "icellusedkars",
            body: "Test body description"
        })
        .expect(400)
        .then(result => {
            expect(result.body.msg).toBe("Bad request")
        })
    });

    test('STATUS 404: responds with appropriate error message for a valid but non-existant id value ', () => {
        return request(app)
        .post("/api/articles/99999/comments")
        .send({
            username: "icellusedkars",
            body: "Test body description"
        })
        .expect(404)
        .then(result => {
            expect(result.body.msg).toBe("Not found")
        })
    });

    test('STATUS 404: responds with appropriate error message for a non-existant username', () => {
        return request(app)
        .post("/api/articles/2/comments")
        .send({
            username: 'invalidUsername',
            body: 'test body'
        })
        .expect(404)
        .then(result => {
            expect(result.body.msg).toBe("Not found")
        })
    });
});

describe('PATCH /api/articles/:article_id', () => {
    test('STATUS 200: responds with the updated article as per the requested body', () => {
        return request(app)
        .patch("/api/articles/1")
        .send({
            incVotes: -5
        })
        .expect(200)
        .then(result => {
            const {article} = result.body
            expect(article.article_id).toBe(1)
            expect(article.title).toBe('Living in the shadow of a great man')
            expect(article.topic).toBe('mitch')
            expect(article.author).toBe('butter_bridge')
            expect(article.body).toBe('I find this existence challenging')
            expect(article.created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(article.votes).toBe(95)
            expect(article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
        
    });

    test('STATUS 400: responds with appropriate error message for a malformed body request ', () => {
        return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(result => {
            expect(result.body.msg).toBe("Bad request")
        })
    });

    test('STATUS 400: responds with appropriate error message for a failing schema validation ', () => {
        return request(app)
        .patch("/api/articles/1")
        .send({
            incVotes: "word"
        })
        .expect(400)
        .then(result => {
            expect(result.body.msg).toBe("Bad request")
        })
    });

    test('STATUS 400: responds with appropriate error message for an invalid article id ', () => {
        return request(app)
        .patch("/api/articles/notAnId")
        .send({
            incVotes: 5
        })
        .expect(400)
        .then(result => {
            expect(result.body.msg).toBe("Bad request")
        })
    });

    test('STATUS 404: responds with appropriate error message for an valid but non-existant article id ', () => {
        return request(app)
        .patch("/api/articles/99999")
        .send({
            incVotes: 5
        })
        .expect(404)
        .then(result => {
            expect(result.body.msg).toBe("Not found")
        })
    });


});

// describe('DELETE /api/comments/:comment_id', () => {
//     test("STATUS 204: responds with 204 'No content' when deleting a comment by its id ", () => {
//         return request(app)
//         .delete("/api/comments/2")
//         .expect(204)
//     });
//     test("STATUS 400: responds with appropriate error message for an invalid comment id", () => {
//         return request(app)
//         .delete("/api/comments/notAnId")
//         .expect(400)
//         .then(result => {
//             expect(result.body.msg).toBe("Bad request")
//         })
//     })
//     test('STATUS 404: responds with appropriate erorr message for a valid but non-existant id', () => {
//         return request(app)
//         .delete("/api/comments/99999")
//         .expect(404)
//         .then(result => {
//             expect(result.body.msg).toBe("Not found")
//         })
//     });

// });

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

