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
const { response } = require("../app");

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
      test("status 400 - no content. no newVotes input", () => {
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
    test("status 200: responds with an array of article objects sorted by default column and ordered by default date (descending)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.articles)).toBe(true);
          expect(response.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("status 200: responds with an array of article objects containing properties: title, topic, author, body, created_at, votes)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          expect(response.body.articles[0]).toHaveProperty(
            "created_at",
            "title",
            "topic",
            "author",
            "body",
            "votes"
          );
        });
    });
    test("status 200: responds with an array of articles sorted by chosen column (ordered by desc as default)", () => {
      return request(app)
        .get("/api/articles?sortby=title")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("title", {
            descending: true,
          });
        });
    });
    test("status 200: responds with array of articles sorted by default column and ordered by chosen order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("created_at");
        });
    });
    test("status 200: responds with array of articles sorted by chosen column in chosen order", () => {
      return request(app)
        .get("/api/articles?sortby=title&order=asc")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy("title");
        });
    });
    test("status 200: responds with array of articles filtered by user-inputted topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((response) => {
          const notInclude = [
            {
              article_id: 7,
              title: "Z",
              topic: "mitch",
              author: "icellusedkars",
              body: "I was hungry.",
              created_at: "2020-01-07T14:08:00.000Z",
              votes: 0,
              comment_count: "0",
            },
          ];
          expect(response.body.articles).toEqual(
            expect.not.arrayContaining(notInclude)
          );
        });
    });
    test("status 200: responds with empty array when topic exists but has no associated articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toEqual([]);
        });
    });
    describe("Error Handling", () => {
      test("status 404 - endpoint not found", () => {
        return request(app)
          .get("/api/artycles")
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual({ msg: "Not found!" });
          });
      });
      test("status 400 - bad request - sortby column doesnt exist on db", () => {
        return request(app)
          .get("/api/articles?sortby=battenberg")
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual({
              status: 400,
              msg: "Not a valid column",
            });
          });
      });
      test("status 400 - bad request - order by != ASC or DESC (invalid input)", () => {
        return request(app)
          .get("/api/articles?order=newest")
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual({
              status: 400,
              msg: "Invalid order query - must be 'asc' or 'desc",
            });
          });
      });
      test("status 404 - not found - topic not in database", () => {
        return request(app)
          .get("/api/articles?topic=battenberg")
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual({
              status: 404,
              msg: "Topic not found!",
            });
          });
      });
    });
  });
});

describe("api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("status 200: responds with an array of comments for selected article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body.comments)).toBe(true);
        });
    });
    test("status 200: comments object should contain properties: comment_id, votes, created_at, author, body", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments[0]).toHaveProperty(
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body"
          );
        });
    });
    test("status 200: responds with an empty array for a valid article with no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          expect(response.body.comments).toEqual([]);
        });
    });
    describe("Error Handling", () => {
      test("status 404 - not found - article doesn't exist but is valid", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual({
              status: 404,
              msg: "Article not found",
            });
          });
      });
      test("status 400 - bad request - article_id is invalid", () => {
        return request(app)
          .get("/api/articles/battenberg/comments")
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual({ status: 400, msg: "Bad request!" });
          });
      });
    });
  });
  describe("POST", () => {
    test("status 201 - responds with a post comment", () => {
      return request(app)
        .post("/api/articles/11/comments")
        .send({
          username: "rogersop",
          body: "You know I'm something of a feline myself.",
        })
        .expect(201)
        .then((response) => {
          expect(response.body.comment).toHaveProperty(
            "author",
            "body",
            "votes",
            "article_id",
            "created_at"
          );
        });
    });
    describe("Error Handling", () => {
      test("status 400 - bad request - no user inputted content", () => {
        return request(app)
          .post("/api/articles/11/comments")
          .send({ username: "rogersop", body: undefined })
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual({
              status: 400,
              msg: "No comment input provided",
            });
          });
      });
      test("status 404 - article_id not found", () => {
        return request(app)
          .post("/api/articles/999/comments")
          .send({ username: "rogersop", body: "Im a 404 comment" })
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual({
              status: 404,
              msg: "Article not found",
            });
          });
      });
      test("status 400 - invalid article_id", () => {
        return request(app)
          .post("/api/articles/battenberg/comments")
          .send({ username: "rogersop", body: "Im a 400 comment" })
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual({
              status: 400,
              msg: "Bad request!",
            });
          });
      });
      test("status 404 - username does not exist", () => {
        return request(app)
          .post("/api/articles/11/comments")
          .send({ username: "rickroll", body: "Im a 404 comment" })
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual({
              status: 404,
              msg: "Username not found",
            });
          });
      });
    });
  });
});

describe("/api/comments/:comments_id", () => {
  describe("DELETE", () => {
    test("status 204 - no content: deletes specific comment and responds with no content", () => {
      return request(app).delete("/api/comments/1").expect(204);
    });
    describe("Error Handling", () => {
      test("status 404 - not found - comment_id does not exist", () => {
        return request(app)
          .delete("/api/comments/999")
          .expect(404)
          .then((response) => {
            expect(response.body).toEqual({
              status: 404,
              msg: "Comment not found!",
            });
          });
      });
      test("status 400 - bad request - comment_id is invalid", () => {
        return request(app)
          .delete("/api/comments/battenberg")
          .expect(400)
          .then((response) => {
            expect(response.body).toEqual({
              status: 400,
              msg: "Bad request!",
            });
          });
      });
    });
  });
});
