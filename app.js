const express = require("express");
const app = express();
const {
  getTopics,
  getArticlesById,
} = require("./controllers/news.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

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
