const { selectArticleById } = require("../models/articles.models");

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      console.table(article);
      res.status(200).send({ article: article });
    })
    .catch(next);
};
