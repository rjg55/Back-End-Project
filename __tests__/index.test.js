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
          expect(response.body).toEqual({
            topics: [
              {
                description: "The man, the Mitch, the legend",
                slug: "mitch",
              },
              {
                description: "Not dogs",
                slug: "cats",
              },
              {
                description: "what books are made of",
                slug: "paper",
              },
            ],
          });
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
          expect(Object.keys(response.body.article)).toEqual([
            "article_id",
            "title",
            "topic",
            "author",
            "body",
            "created_at",
            "votes",
          ]);
        });
    });
  });
  describe("Error Handling", () => {
    test("400 - Bad request. Input is not a number", () => {
      return request(app)
        .get("/api/articles/battenburg")
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
});
