const { selectTopics } = require("../models/news.models");

exports.getTopics = (req, res, next) => {
  selectTopics().then((response) => {
    res.status(200).send({ topics: response });
  });
};

exports.handleUnknownEndpoints = (req, res, next) => {
  console.log("im an unknown endpoint controller");
  next(err);
};
