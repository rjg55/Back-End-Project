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

describe.only("api/topics", () => {
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
