const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(path.join(__dirname, "../database.sqlite"));

/* ---------------------------------------------------------
   GENERIC MULTER (misc uploads)
--------------------------------------------------------- */
const genericStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.query.folder || "misc";
    const uploadPath = path.join(__dirname, "../uploads", folder);

    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 999999);
    cb(null, unique + path.extname(file.originalname));
  }
});

const genericUpload = multer({ storage: genericStorage });

/* ---------------------------------------------------------
   CAR UPLOAD (/uploads/cars)
--------------------------------------------------------- */
const carStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/cars");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 999999);
    cb(null, unique + path.extname(file.originalname));
  }
});

const carUpload = multer({ storage: carStorage });

/* ---------------------------------------------------------
   DEVLOG UPLOAD (/uploads/devlog)
--------------------------------------------------------- */
const devlogStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/devlog");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 999999);
    cb(null, unique + path.extname(file.originalname));
  }
});

const devlogUpload = multer({ storage: devlogStorage });

/* ---------------------------------------------------------
   HOME CONTENT
--------------------------------------------------------- */
router.post("/content/home/update", (req, res) => {
  const { title, subtitle, description } = req.body;

  db.run(
    `UPDATE content SET title=?, subtitle=?, description=? WHERE page='home'`,
    [title, subtitle, description],
    () => res.json({ success: true })
  );
});

/* ---------------------------------------------------------
   LAYOUT
--------------------------------------------------------- */
router.post("/layout/update", (req, res) => {
  const { showCars, showComments, showDownloads, showSocialLinks } = req.body;

  db.run(
    `UPDATE layout SET showCars=?, showComments=?, showDownloads=?, showSocialLinks=? WHERE id=1`,
    [showCars, showComments, showDownloads, showSocialLinks],
    () => res.json({ success: true })
  );
});

/* ---------------------------------------------------------
   CARS CRUD
--------------------------------------------------------- */
router.post("/cars/add", (req, res) => {
  const { name, image } = req.body;

  db.run(
    `INSERT INTO cars (name, image) VALUES (?, ?)`,
    [name, image],
    () => res.json({ success: true })
  );
});

router.post("/cars/update/:id", (req, res) => {
  const { name, image } = req.body;

  db.run(
    `UPDATE cars SET name=?, image=? WHERE id=?`,
    [name, image, req.params.id],
    () => res.json({ success: true })
  );
});

router.delete("/cars/delete/:id", (req, res) => {
  db.run(`DELETE FROM cars WHERE id=?`, [req.params.id], () => {
    res.json({ success: true });
  });
});

router.post("/cars/upload", carUpload.single("file"), (req, res) => {
  res.json({
    success: true,
    filename: req.file.filename,
    url: `/uploads/cars/${req.file.filename}`
  });
});

/* ---------------------------------------------------------
   DEVLOG CRUD (TABLE SYSTEM)
--------------------------------------------------------- */

/* Add row */
router.post("/devlog/add", (req, res) => {
  const { tag, text, image } = req.body;
  const date = new Date().toISOString().split("T")[0];

  db.run(
    `INSERT INTO devlog (tag, text, image, date)
     VALUES (?, ?, ?, ?)`,
    [tag, text, image, date],
    () => res.json({ success: true })
  );
});

/* Update row */
router.post("/devlog/update/:id", (req, res) => {
  const { tag, text, image } = req.body;

  db.run(
    `UPDATE devlog SET tag=?, text=?, image=? WHERE id=?`,
    [tag, text, image, req.params.id],
    () => res.json({ success: true })
  );
});

/* Delete row */
router.delete("/devlog/delete/:id", (req, res) => {
  db.run(`DELETE FROM devlog WHERE id=?`, [req.params.id], () => {
    res.json({ success: true });
  });
});

/* Upload image */
router.post("/devlog/upload", devlogUpload.single("file"), (req, res) => {
  res.json({
    success: true,
    filename: req.file.filename,
    url: `/uploads/devlog/${req.file.filename}`
  });
});

/* ---------------------------------------------------------
   DEVLOG OVERWRITE (SAVE ALL ROWS AT ONCE)
--------------------------------------------------------- */
router.post("/devlog/overwrite", (req, res) => {
  const rows = req.body;

  db.serialize(() => {
    db.run(`DELETE FROM devlog`);

    const stmt = db.prepare(
      `INSERT INTO devlog (tag, text, image, date) VALUES (?, ?, ?, ?)`
    );

    rows.forEach(r => {
      stmt.run(
        r.tag,
        r.text,
        r.image,
        new Date().toISOString().split("T")[0]
      );
    });

    stmt.finalize();
  });

  res.json({ success: true });
});

/* ---------------------------------------------------------
   DOWNLOADS CRUD
--------------------------------------------------------- */
router.post("/downloads/add", (req, res) => {
  const { label, url } = req.body;

  db.run(
    `INSERT INTO downloads (label, url) VALUES (?, ?)`,
    [label, url],
    () => res.json({ success: true })
  );
});

router.post("/downloads/update/:id", (req, res) => {
  const { label, url } = req.body;

  db.run(
    `UPDATE downloads SET label=?, url=? WHERE id=?`,
    [label, url, req.params.id],
    () => res.json({ success: true })
  );
});

router.delete("/downloads/delete/:id", (req, res) => {
  db.run(`DELETE FROM downloads WHERE id=?`, [req.params.id], () => {
    res.json({ success: true });
  });
});

/* ---------------------------------------------------------
   COMMENTS
--------------------------------------------------------- */
router.post("/comments/ban/:id", (req, res) => {
  db.run(`UPDATE comments SET banned=1 WHERE id=?`, [req.params.id], () => {
    res.json({ success: true });
  });
});

router.delete("/comments/delete/:id", (req, res) => {
  db.run(`DELETE FROM comments WHERE id=?`, [req.params.id], () => {
    res.json({ success: true });
  });
});

/* ---------------------------------------------------------
   GENERIC UPLOAD
--------------------------------------------------------- */
router.post("/upload", genericUpload.single("file"), (req, res) => {
  const folder = req.query.folder || "misc";

  res.json({
    success: true,
    filename: req.file.filename,
    url: `/uploads/${folder}/${req.file.filename}`
  });
});

module.exports = router;