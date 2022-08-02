const {
  selectArticleById,
  selectArticles,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};
