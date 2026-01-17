const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(path.join(__dirname, "../database.sqlite"));

// GET all non‑banned comments (with ID)
exports.getComments = (req, res) => {
  db.all(
    `SELECT id, username, comment, date FROM comments WHERE banned = 0 ORDER BY id DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
};

// POST a new comment
exports.postComment = (req, res) => {
  const { username, email, comment } = req.body;

  if (!username || !email || !comment)
    return res.status(400).json({ error: "Missing fields" });

  const date = new Date().toISOString().split("T")[0];

  db.run(
    `INSERT INTO comments (username, email, comment, date, banned)
     VALUES (?, ?, ?, ?, 0)`,
    [username, email, comment, date],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
};

// BAN a comment
exports.banComment = (req, res) => {
  const { id } = req.params;

  db.run(
    `UPDATE comments SET banned = 1 WHERE id = ?`,
    [id],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
};

// DELETE a comment permanently
exports.deleteComment = (req, res) => {
  const { id } = req.params;

  db.run(
    `DELETE FROM comments WHERE id = ?`,
    [id],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
};