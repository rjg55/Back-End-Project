const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());

describe("/api/topics", () => {
  describe("GET", () => {
    test("status 200: responds with an array of topic objects, containing slug and description properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          expect(response.body.topics.length).toEqual(3);
          expect(typeof response.body.topics[0].description).toBe("string");
          expect(typeof response.body.topics[0].slug).toBe("string");
        });
    });
  });
  describe("Error Handling", () => {
    test("status 404 - Not Found", () => {
      return request(app)
        .get("/api/notaroute")
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({ msg: "Not found!" });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("status 200: responds with an object", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(typeof response.body).toBe("object");
        });
    });
    test("status 200: object contains properties of author, title, article_id, body, topic, created_at & votes", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(response.body.article.hasOwnProperty("article_id")).toBe(true);
          expect(response.body.article.hasOwnProperty("title")).toBe(true);
          expect(response.body.article.hasOwnProperty("topic")).toBe(true);
          expect(response.body.article.hasOwnProperty("author")).toBe(true);
          expect(response.body.article.hasOwnProperty("body")).toBe(true);
          expect(response.body.article.hasOwnProperty("created_at")).toBe(true);
          expect(response.body.article.hasOwnProperty("votes")).toBe(true);
          expect(response.body.article.hasOwnProperty("comment_count")).toBe(
            true
          );
        });
    });
  });
  describe("Error Handling", () => {
    test("400 - Bad request. Input is not a number", () => {
      return request(app)
        .get("/api/articles/battenberg")
        .expect(400)
        .then((response) => {
          expect(response.body).toEqual({ status: 400, msg: "Bad request!" });
        });
    });
    test("404 - Not found. Input is valid but non-existent", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({
            status: 404,
            msg: "Article not found!",
          });
        });
    });
  });
  describe("PATCH", () => {
    test("status 201: created", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 2 })
        .expect(201)
        .then((response) => {
          expect(response.body.article.article_id).toEqual(1);
          expect(response.body.article.votes).toEqual(102);
        });
    });
    describe("Error Handling", () => {
      test("status 400 - bad request. invalid newVotes input", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "battenberg" })
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual({
              status: 400,
              msg: "Bad request!",
            });
          });
      });
      test("status 204 - no content. no newVotes input", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual({
              status: 400,
              msg: "Bad request - No user inputted content",
            });
          });
      });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("status 200: responds with an array of objects containing properties: username, name, avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          expect(response.body.users.length).toBe(4);
          expect(typeof response.body.users[0].username).toBe("string");
          expect(typeof response.body.users[0].name).toBe("string");
          expect(typeof response.body.users[0].avatar_url).toBe("string");
        });
    });
    describe("Error handling", () => {
      test("404 - not found", () => {
        return request(app)
          .get("/api/uzers")
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual({ msg: "Not found!" });
          });
      });
    });
  });
});

describe("Comment Count", () => {
  describe("GET", () => {
    test("status 200: article response includes a comment count property", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(response.body.article.hasOwnProperty("comment_count")).toBe(
            true
          );
        });
    });
  });
});

describe("api/articles", () => {
  describe("GET", () => {
    test("status 200: responds with an array of article objects sorted by date (descending) by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.articles)).toBe(true);
        });
    });
    describe("Error Handling", () => {
      test("status 404 - not found", () => {
        return request(app)
          .get("/api/artycles")
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual({ msg: "Not found!" });
          });
      });
    });
  });
});
