const express = require("express");
const app = express();
const { getTopics } = require("./controllers/news.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

// This will handle all undefined endpoints

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

// Error Handling //

module.exports = app;
