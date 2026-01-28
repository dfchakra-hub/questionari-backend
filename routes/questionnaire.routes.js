const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        mb.id AS macro_id,
        mb.nome AS macro_nome,

        b.id AS block_id,
        b.nome AS block_nome,

        qg.id AS group_id,
        qg.nome AS group_nome,

        q.id AS question_id,
        q.testo AS question_text,
        q.tipo

      FROM macro_blocks mb
      JOIN blocks b ON b.macro_block_id = mb.id
      JOIN question_groups qg ON qg.block_id = b.id
      JOIN questions q ON q.group_id = qg.id

      ORDER BY
        mb.id,
        b.id,
        qg.id,
        q.id
    `);

    // 🔽 QUI AVVIENE LA TRASFORMAZIONE ANNIDATA
    const data = result.rows;
    const macros = {};

    data.forEach(row => {
      // macro
      if (!macros[row.macro_id]) {
        macros[row.macro_id] = {
          id: row.macro_id,
          nome: row.macro_nome,
          blocks: {}
        };
      }

      const macro = macros[row.macro_id];

      // block
      if (!macro.blocks[row.block_id]) {
        macro.blocks[row.block_id] = {
          id: row.block_id,
          nome: row.block_nome,
          groups: {}
        };
      }

      const block = macro.blocks[row.block_id];

      // group
      if (!block.groups[row.group_id]) {
        block.groups[row.group_id] = {
          id: row.group_id,
          nome: row.group_nome,
          questions: []
        };
      }

      // question
      block.groups[row.group_id].questions.push({
        id: row.question_id,
        testo: row.question_text,
        tipo: row.tipo
      });
    });

    const response = Object.values(macros).map(macro => ({
      ...macro,
      blocks: Object.values(macro.blocks).map(block => ({
        ...block,
        groups: Object.values(block.groups)
      }))
    }));

    res.json(response);

  } catch (err) {
    console.error("ERRORE SQL:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

