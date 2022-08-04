const db = require("../db/connection");

exports.removeCommentsById = (commentID) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      commentID,
    ])
    .then((deletedComment) => {
      if (!deletedComment.rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found!" });
      }
    });
};
