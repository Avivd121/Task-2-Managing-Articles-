const dbSingleton = require("../dbSingleton");
const express = require("express");
const router = express.Router();
const db = dbSingleton.getConnection();

/**
 * GET /articles
 * Retrieve all articles
 * B
 */
router.get("/", (req, res) => {
  const query = "SELECT * FROM articles";
  db.query(query, (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Failed to fetch articles", details: err });
    res.json(results);
  });
});

/**
 * POST /articles
 * Create a new article
 * Body: { title, content, author }
 * A
 */
router.post("/", (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res
      .status(400)
      .json({ error: "Missing required fields: title, content, author" });
  }
  const query =
    "INSERT INTO articles (title, content, author) VALUES (?, ?, ?)";
  db.query(query, [title, content, author], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Failed to create article", details: err });
    res
      .status(201)
      .json({ message: "Article created", articleId: result.insertId });
  });
});

/**
 * GET /articles/author/:author
 * Retrieve articles by author name
 * E
 */
router.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const query = "SELECT * FROM articles WHERE author = ?";
  db.query(query, [author], (err, results) => {
    if (err)
      return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
});

/**
 * GET /articles/created-after/:date
 * Retrieve articles created after a specific date
 * F
 */
router.get("/created-after/:date", (req, res) => {
  const date = req.params.date;
  const query = "SELECT * FROM articles WHERE created_at > ?";
  db.query(query, [date], (err, results) => {
    if (err)
      return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
});

/**
 * GET /articles/sorted-by-date
 * Retrieve all articles sorted by creation date (newest first)
 * G
 */
router.get("/sorted-by-date", (req, res) => {
  const query = "SELECT * FROM articles ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err)
      return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
});

/**
 * GET /articles/count
 * Get total number of articles
 * H
 */
router.get("/count", (req, res) => {
  const query = "SELECT COUNT(*) AS total FROM articles";
  db.query(query, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to count articles", details: err });
    }
    res.json({ total: results[0].total });
  });
});

/**
 * GET /articles/:id
 * Retrieve a specific article by ID
 * C
 */
router.get("/:id", (req, res) => {
  const articleId = req.params.id;
  const query = "SELECT * FROM articles WHERE id = ?";
  db.query(query, [articleId], (err, results) => {
    if (err)
      return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0)
      return res.status(404).json({ error: "Article not found" });
    res.json(results[0]);
  });
});

/**
 * GET /articles/search/title/:term
 * Search articles where title contains the given term
 * I
 */
router.get("/search/title/:term", (req, res) => {
  const term = `%${req.params.term}%`;
  const query = "SELECT * FROM articles WHERE title LIKE ?";
  db.query(query, [term], (err, results) => {
    if (err)
      return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
});

/**
 * GET /articles/authors/unique
 * Retrieve distinct authors from the articles table
 * J
 */
router.get("/authors/unique", (req, res) => {
  const sql = "SELECT DISTINCT author FROM articles";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error in db", err);
      return res.status(500).json({ error: "Server Error" });
    }

    res.json(results);
  });
});

/**
 * DELETE /articles/:id
 * Delete an article by ID
 * D
 */
router.delete("/:id", (req, res) => {
  const articleId = req.params.id;
  const query = "DELETE FROM articles WHERE id = ?";
  db.query(query, [articleId], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Failed to delete article", details: err });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Article not found" });
    res.json({ message: `Article with ID ${articleId} deleted successfully` });
  });
});

module.exports = router;
