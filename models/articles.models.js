const db = require("../db/connection");
const { checkExists } = require("../utils");

exports.selectArticles = (sortby = "created_at", order = "desc", topic) => {
  const orderValues = ["asc", "desc"];
  const sortbyValues = [
    "created_at",
    "title",
    "topic",
    "author",
    "body",
    "votes",
  ];
  const topicValues = [];

  const queryStr = `SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id `;
  const whereStr = `WHERE topic = $1`;
  const orderStr = `GROUP BY articles.article_id ORDER BY ${sortby} ${order};`;

  if (
    orderValues.includes(order) &&
    sortbyValues.includes(sortby) &&
    topic === undefined
  ) {
    return db.query(queryStr + orderStr).then((articles) => {
      return articles.rows;
    });
  } else if (
    topic !== undefined &&
    orderValues.includes(order) &&
    sortbyValues.includes(sortby)
  ) {
    topicValues.push(topic);
    return db
      .query(queryStr + whereStr + orderStr, topicValues)
      .then(async (articles) => {
        if (!articles.rows.length) {
          await checkExists("topics", "slug", topic);
        }
        return articles.rows;
      });
  } else if (!sortbyValues.includes(sortby)) {
    return Promise.reject({ status: 400, msg: "Not a valid column" });
  } else if (!orderValues.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid order query - must be 'asc' or 'desc",
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
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      [articleID]
    )
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
