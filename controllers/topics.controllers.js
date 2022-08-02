const { selectTopics } = require("../models/topics.models");
exports.getTopics = (req, res, next) => {
  selectTopics().then((response) => {
    res.status(200).send({ topics: response });
  });
};
