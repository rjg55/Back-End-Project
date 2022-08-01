const express = require("express");
const app = express();
const {
  getTopics,
  handleUnknownEndpoints,
} = require("./controllers/news.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

// This will handle all undefined endpoints

app.get("*", (req, res) => {
  console.log("unknown endpoint");
  res.status(404).send({ msg: "Not found!" });
});

// Error Handling //

module.exports = app;
