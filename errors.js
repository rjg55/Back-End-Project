exports.errorHandling = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ status: err.status, msg: err.msg });
  } else if (err.code === "22P02") {
    res.status(400).send({ status: 400, msg: "Bad request!" });
  } else if (err.code === "23502") {
    res.status(400).send({ status: 400, msg: "No comment input provided" });
  } else if (
    err.code === "23503" &&
    err.constraint === "comments_article_id_fkey"
  ) {
    res.status(404).send({ status: 404, msg: "Article not found" });
  } else if (
    err.code === "23503" &&
    err.constraint === "comments_author_fkey"
  ) {
    res.status(404).send({ status: 404, msg: "Username not found" });
  }
};
