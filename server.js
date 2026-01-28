const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());

// TEST SERVER
app.get("/test", (req, res) => {
  res.json({ status: "Backend collegato correttamente!" });
});

// TEST DATABASE
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      db: "collegato",
      time: result.rows[0].now
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// LISTA UTENTI
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nome, cognome, email, ruolo FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore lettura utenti" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server avviato su http://localhost:" + PORT);
});
const questionnaireRoutes = require("./routes/questionnaire.routes");

app.use("/questionnaire", questionnaireRoutes);
