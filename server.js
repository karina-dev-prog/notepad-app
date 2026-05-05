const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

// koneksi database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "notepad_db"
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


// ==================== READ ====================
app.get("/notes", (req, res) => {
  const sql = "SELECT * FROM notes";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("ERROR GET:", err);
      res.send(err);
    } else {
      res.json(result);
    }
  });
});


// ==================== CREATE ====================
app.post("/notes", (req, res) => {
  console.log("BODY:", req.body);

  const { title, content } = req.body;

  const sql = "INSERT INTO notes (title, content) VALUES (?, ?)";

  db.query(sql, [title, content], (err, result) => {
    if (err) {
      console.log("ERROR SAVE:", err);
      res.send(err);
    } else {
      console.log("Note berhasil disimpan");
      res.send("Note berhasil disimpan");
    }
  });
});


// ==================== UPDATE ====================
app.put("/notes/:id", (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;

  const sql = "UPDATE notes SET title = ?, content = ? WHERE id = ?";

  db.query(sql, [title, content, id], (err, result) => {
    if (err) {
      console.log("ERROR UPDATE:", err);
      res.send(err);
    } else {
      console.log("Note berhasil diupdate");
      res.send("Note berhasil diupdate");
    }
  });
});


// ==================== DELETE ====================
app.delete("/notes/:id", (req, res) => {
  const id = req.params.id;

  console.log("Hapus ID:", id);

  const sql = "DELETE FROM notes WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("ERROR DELETE:", err);
      res.send(err);
    } else {
      console.log("Note berhasil dihapus");
      res.send("Note berhasil dihapus");
    }
  });
});


// jalankan server
app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});