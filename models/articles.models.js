const db = require("../db/connection");

exports.selectArticleById = (articleID) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleID])
    .then((article) => {
      if (!article.rows[0]) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return article.rows[0];
    });
};