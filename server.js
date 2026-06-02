require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// koneksi database Railway
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// cek koneksi database
db.connect((err) => {
  if (err) {
    console.log("Database gagal connect:", err);
  } else {
    console.log("Database berhasil connect");
  }
});

// test backend
app.get("/", (req, res) => {
  res.send("Backend Notepad berjalan");
});

// READ
app.get("/notes", (req, res) => {
  const sql = "SELECT * FROM notes";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("ERROR GET:", err);
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

// CREATE
app.post("/notes", (req, res) => {
  const { title, content } = req.body;

  const sql =
    "INSERT INTO notes (title, content) VALUES (?, ?)";

  db.query(sql, [title, content], (err, result) => {
    if (err) {
      console.log("ERROR SAVE:", err);
      return res.status(500).json(err);
    }

    res.json({
      message: "Note berhasil disimpan",
      id: result.insertId
    });
  });
});

// UPDATE
app.put("/notes/:id", (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;

  const sql =
    "UPDATE notes SET title = ?, content = ? WHERE id = ?";

  db.query(
    sql,
    [title, content, id],
    (err, result) => {
      if (err) {
        console.log("ERROR UPDATE:", err);
        return res.status(500).json(err);
      }

      res.json({
        message: "Note berhasil diupdate"
      });
    }
  );
});

// DELETE
app.delete("/notes/:id", (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM notes WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("ERROR DELETE:", err);
      return res.status(500).json(err);
    }

    res.json({
      message: "Note berhasil dihapus"
    });
  });
});

// Railway port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});