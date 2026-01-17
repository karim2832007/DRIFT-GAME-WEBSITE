// server.js — Part 1: setup, middleware, static folders, admin mount, DB + tables

const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Static upload folders
app.use("/uploads/cars", express.static(path.join(__dirname, "uploads/cars")));
app.use("/uploads/devlog", express.static(path.join(__dirname, "uploads/devlog")));
app.use("/uploads/screenshots", express.static(path.join(__dirname, "uploads/screenshots")));
app.use("/uploads/misc", express.static(path.join(__dirname, "uploads/misc")));


// Serve admin panel
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// Mount admin routes
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

// Create / open SQLite database
const db = new sqlite3.Database(path.join(__dirname, "database.sqlite"));

// Create tables if not exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS content (
      page TEXT PRIMARY KEY,
      title TEXT,
      subtitle TEXT,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS layout (
      id INTEGER PRIMARY KEY,
      showCars INTEGER,
      showComments INTEGER,
      showDownloads INTEGER,
      showSocialLinks INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      image TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT,
      comment TEXT,
      date TEXT,
      banned INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT,
      url TEXT
    )
  `);

  // NEW: devlog table for table-style entries
  db.run(`
    CREATE TABLE IF NOT EXISTS devlog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag TEXT,
      text TEXT,
      image TEXT,
      date TEXT
    )
  `);
});

// ------------------------------------------------------------
// PUBLIC API ROUTES
// ------------------------------------------------------------

// HOME CONTENT
app.get("/api/content/home", (req, res) => {
  db.get(`SELECT * FROM content WHERE page = 'home'`, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!row) {
      db.run(`
        INSERT INTO content (page, title, subtitle, description)
        VALUES ('home', 'CYBER DRIFT X', 'Official Game Portal', 'A cyberpunk drift universe forged in Unity.')
      `);

      return res.json({
        page: "home",
        title: "CYBER DRIFT X",
        subtitle: "Official Game Portal",
        description: "A cyberpunk drift universe forged in Unity."
      });
    }

    res.json(row);
  });
});

// UPDATE HOME CONTENT
app.post("/api/content/home/update", (req, res) => {
  const { title, subtitle, description } = req.body;

  db.run(
    `UPDATE content SET title=?, subtitle=?, description=? WHERE page='home'`,
    [title, subtitle, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, changes: this.changes });
    }
  );
});

// LAYOUT
app.get("/api/layout", (req, res) => {
  db.get(`SELECT * FROM layout WHERE id = 1`, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!row) {
      db.run(`
        INSERT INTO layout (id, showCars, showComments, showDownloads, showSocialLinks)
        VALUES (1, 1, 1, 1, 1)
      `);

      return res.json({
        showCars: 1,
        showComments: 1,
        showDownloads: 1,
        showSocialLinks: 1
      });
    }

    res.json(row);
  });
});

// CARS (public)
app.get("/api/cars", (req, res) => {
  db.all(`SELECT * FROM cars ORDER BY id DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ADD CAR
app.post("/api/cars/add", (req, res) => {
  const { name, image } = req.body;

  db.run(
    `INSERT INTO cars (name, image) VALUES (?, ?)`,
    [name, image],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// COMMENTS
app.get("/api/comments", (req, res) => {
  db.all(
    `SELECT id, username, comment, date FROM comments WHERE banned = 0 ORDER BY id DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.post("/api/comments", (req, res) => {
  const { username, email, comment } = req.body;
  const date = new Date().toISOString().split("T")[0];

  db.run(
    `INSERT INTO comments (username, email, comment, date, banned)
     VALUES (?, ?, ?, ?, 0)`,
    [username, email, comment, date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// DOWNLOADS
app.get("/api/downloads", (req, res) => {
  db.all(`SELECT * FROM downloads ORDER BY id DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!rows || rows.length === 0) {
      db.run(`INSERT INTO downloads (label, url) VALUES ('Windows Build', '#')`);
      db.run(`INSERT INTO downloads (label, url) VALUES ('Android APK', '#')`);

      return res.json([
        { label: "Windows Build", url: "#" },
        { label: "Android APK", url: "#" }
      ]);
    }

    res.json(rows);
  });
});

// ADD DOWNLOAD
app.post("/api/downloads/add", (req, res) => {
  const { label, url } = req.body;

  db.run(
    `INSERT INTO downloads (label, url) VALUES (?, ?)`,
    [label, url],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// DEVLOG (public)
app.get("/api/devlog", (req, res) => {
  db.all(`SELECT * FROM devlog ORDER BY id DESC`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "uploads/misc/icon.jpg"));
});

// ------------------------------------------------------------
// START SERVER
// ------------------------------------------------------------
app.listen(PORT, () => console.log(`SQLite backend running on port ${PORT}`));

module.exports = { app, db, PORT };