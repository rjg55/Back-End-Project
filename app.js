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

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ status: err.status, msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ status: 400, msg: "Bad request!" });
  } else if (err.code === "23502") {
    res.status(400).send({ status: 400, msg: "No comment input provided" });
  }
});

module.exports = app;
