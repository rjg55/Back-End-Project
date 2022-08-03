const db = require("../db/connection");
const { checkExists } = require("../utils");

exports.selectArticles = (order = "desc") => {
  const orderValues = ["asc", "desc"];
  if (orderValues.includes(order)) {
    return db
      .query(
        `SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY created_at ${order};`
      )
      .then((articles) => {
        return articles.rows;
      });
  }
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

exports.selectCommentsByArticleId = (articleID) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [articleID])
    .then(async (comments) => {
      if (!comments.rows.length) {
        await checkExists("articles", "article_id", articleID);
      }
      return comments.rows;
    });
};

exports.addCommentByArticleId = (articleID, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [articleID, username, body]
    )
    .then((newComment) => {
      return newComment.rows[0];
    });
};
