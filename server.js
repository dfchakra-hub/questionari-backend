require("dotenv").config();
const express = require("express");
const cors = require("cors");

const questionnaireRoutes = require("./routes/questionnaire.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/questionnaire", questionnaireRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server avviato su porta ${PORT}`);
});
