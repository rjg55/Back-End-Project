const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  addCommentByArticleId,
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

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  console.log(req.body);
  const { username, body } = req.body;
  const { article_id } = req.params;
  addCommentByArticleId(article_id, username, body)
    .then((newComment) => {
      console.log(newComment);
      res.status(201).send({ comment: newComment });
    })
    .catch(next);
};
