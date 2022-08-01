const {
  selectTopics,
  selectArticleById,
  updateVotesById,
} = require("../models/news.models");

exports.getTopics = (req, res, next) => {
  selectTopics().then((response) => {
    res.status(200).send({ topics: response });
  });
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.patchVotesByID = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVotesById(article_id, inc_votes).then((updatedArticle) => {
    res.status(201).send({ article: updatedArticle });
  });
};
