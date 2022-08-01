const { selectTopics, selectArticleById } = require("../models/news.models");

exports.getTopics = (req, res, next) => {
  selectTopics().then((response) => {
    res.status(200).send({ topics: response });
  });
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((response) => {
      res.status(200).send({ article: response });
    })
    .catch(next);
};
