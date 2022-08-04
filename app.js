const express = require("express");
const app = express();
const { patchVotesByID } = require("./controllers/votes.controllers");
const {
  getArticlesById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");
const { errorHandling } = require("./errors");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/users", getUsers);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.patch("/api/articles/:article_id", patchVotesByID);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

// This will handle all undefined endpoints

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

// Error Handling //

app.use(errorHandling);

module.exports = app;
