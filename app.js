const express = require("express");
const app = express();
const { getTopics } = require("./controllers/news.controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

// This will handle all undefined endpoints

app.get("*");

// Error Handling //

module.exports = app;
