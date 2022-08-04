const { removeCommentsById } = require("../models/comments.models");

exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentsById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
