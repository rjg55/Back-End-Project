const db = require("../db/connection");

exports.updateVotesById = (articleID, incVotes) => {
  if (incVotes === undefined) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - No user inputted content",
    });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *`,
      [articleID, incVotes]
    )
    .then((article) => {
      return article.rows[0];
    });
};
