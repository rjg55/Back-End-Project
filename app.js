const express = require("express");
const app = express();
const { patchVotesByID } = require("./controllers/votes.controllers");
const { getArticlesById } = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/topics.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.patch("/api/articles/:article_id", patchVotesByID);

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
  }
});

module.exports = app;