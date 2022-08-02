const { updateVotesById } = require("../models/votes.models");

exports.patchVotesByID = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVotesById(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(201).send({ article: updatedArticle });
    })
    .catch(next);
};
