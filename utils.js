const db = require("./db/connection");
const format = require("pg-format");

exports.checkExists = async (table, column, value) => {
  const queryStr = format(`SELECT * FROM %I WHERE %I = $1`, table, column);
  const dbOutput = await db.query(queryStr, [value]);

  if (dbOutput.rows.length === 0 && column === "article_id") {
    return Promise.reject({ status: 404, msg: "Article not found" });
  } else if (dbOutput.rows.length === 0 && column === "slug") {
    return Promise.reject({ status: 404, msg: "Topic not found!" });
  }
};
