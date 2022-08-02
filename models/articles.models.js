const db = require("../db/connection");

exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
    )
    .then((articles) => {
      return articles.rows;
    });
};

exports.selectArticleById = (articleID) => {
  return db
    .query(
      "SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [articleID]
    )
    .then((article) => {
      if (!article.rows[0]) {
        return Promise.reject({ status: 404, msg: "Article not found!" });
      }
      return article.rows[0];
    });
};
