require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Configuração para receber imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const nomeArquivo = Date.now() + "-" + file.originalname;
    cb(null, nomeArquivo);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 3000;

// Conexão com o banco de dados PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Rota de teste
app.get("/api/teste-db", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");

    res.json({
      mensagem: "Conexão com o banco funcionando!",
      horario: resultado.rows[0].now,
    });
  } catch (erro) {
    console.error("Erro ao conectar com o banco:", erro);

    res.status(500).json({
      mensagem: "Erro ao conectar com o banco de dados.",
    });
  }
});
// Cadastrar uma fotografia
app.post("/api/fotografias", upload.single("imagem"), async (req, res) => {
  try {
    const { titulo, descricao, categoria } = req.body;

    if (!req.file) {
      return res.status(400).json({
        mensagem: "Nenhuma imagem foi enviada.",
      });
    }

    const imagem_url = `/uploads/${req.file.filename}`;

    const resultado = await pool.query(
      `INSERT INTO fotografias (titulo, descricao, imagem_url, categoria)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [titulo, descricao, imagem_url, categoria],
    );

    res.status(201).json({
      mensagem: "Fotografia cadastrada com sucesso!",
      fotografia: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao cadastrar fotografia:", erro);

    res.status(500).json({
      mensagem: "Erro ao cadastrar fotografia.",
    });
  }
});
// Listar todas as fotografias
app.get("/api/fotografias", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM fotografias ORDER BY id DESC",
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao buscar fotografias:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar fotografias.",
    });
  }
});
// Buscar uma fotografia pelo ID
app.get("/api/fotografias/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      "SELECT * FROM fotografias WHERE id = $1",
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Fotografia não encontrada.",
      });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    console.error("Erro ao buscar fotografia:", erro);

    res.status(500).json({
      mensagem: "Erro ao buscar fotografia.",
    });
  }
});
// Editar uma fotografia
app.put("/api/fotografias/:id", upload.single("imagem"), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, categoria } = req.body;

    const fotografiaAtual = await pool.query(
      "SELECT * FROM fotografias WHERE id = $1",
      [id],
    );

    if (fotografiaAtual.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Fotografia não encontrada.",
      });
    }

    let resultado;

    if (req.file) {
      const imagem_url = `/uploads/${req.file.filename}`;

      resultado = await pool.query(
        `UPDATE fotografias
           SET titulo = $1,
               descricao = $2,
               imagem_url = $3,
               categoria = $4
           WHERE id = $5
           RETURNING *`,
        [titulo, descricao, imagem_url, categoria, id],
      );

      const imagemAntiga = fotografiaAtual.rows[0].imagem_url;
      const caminhoImagemAntiga = path.join(
        __dirname,
        "uploads",
        path.basename(imagemAntiga),
      );

      fs.unlink(caminhoImagemAntiga, (erro) => {
        if (erro) {
          console.log(
            "Não foi possível excluir a imagem antiga:",
            erro.message,
          );
        }
      });
    } else {
      resultado = await pool.query(
        `UPDATE fotografias
           SET titulo = $1,
               descricao = $2,
               categoria = $3
           WHERE id = $4
           RETURNING *`,
        [titulo, descricao, categoria, id],
      );
    }

    res.json({
      mensagem: "Fotografia atualizada com sucesso!",
      fotografia: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao atualizar fotografia:", erro);
    res.status(500).json({
      mensagem: "Erro ao atualizar fotografia.",
    });
  }
});
// Excluir uma fotografia
app.delete("/api/fotografias/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await pool.query(
      "DELETE FROM fotografias WHERE id = $1 RETURNING *",
      [id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Fotografia não encontrada.",
      });
    }

    res.json({
      mensagem: "Fotografia excluída com sucesso!",
      fotografia: resultado.rows[0],
    });
  } catch (erro) {
    console.error("Erro ao excluir fotografia:", erro);

    res.status(500).json({
      mensagem: "Erro ao excluir fotografia.",
    });
  }
});
// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
