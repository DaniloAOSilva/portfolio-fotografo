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
    const { titulo, descricao } = req.body;
    const categoriaId = req.body.categoria_id;
    const categoriaAntiga = req.body.categoria;

    if (!req.file) {
      return res.status(400).json({
        mensagem: "Nenhuma imagem foi enviada.",
      });
    }

    const imagem_url = `/uploads/${req.file.filename}`;
    let categoriaNome = categoriaAntiga || null;
    let categoriaIdFinal = null;

    if (categoriaId) {
      const categoriaEncontrada = await pool.query(
        "SELECT id, nome FROM categorias WHERE id = $1",
        [categoriaId],
      );

      if (categoriaEncontrada.rows.length === 0) {
        return res.status(400).json({
          mensagem: "Categoria não encontrada.",
        });
      }

      categoriaIdFinal = categoriaEncontrada.rows[0].id;
      categoriaNome = categoriaEncontrada.rows[0].nome;
    }

    const resultado = await pool.query(
      `INSERT INTO fotografias
        (titulo, descricao, imagem_url, categoria, categoria_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [titulo, descricao, imagem_url, categoriaNome, categoriaIdFinal],
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
      `SELECT
         fotografias.*,
         categorias.nome AS categoria_nome
       FROM fotografias
       LEFT JOIN categorias
         ON fotografias.categoria_id = categorias.id
       ORDER BY fotografias.id DESC`,
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
    const { titulo, descricao } = req.body;
    const categoriaId = req.body.categoria_id;
    const categoriaAntiga = req.body.categoria;

    const fotografiaAtual = await pool.query(
      "SELECT * FROM fotografias WHERE id = $1",
      [id],
    );

    if (fotografiaAtual.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Fotografia não encontrada.",
      });
    }

    let categoriaNome = categoriaAntiga ?? fotografiaAtual.rows[0].categoria;
    let categoriaIdFinal = fotografiaAtual.rows[0].categoria_id;

    if (categoriaId) {
      const categoriaEncontrada = await pool.query(
        "SELECT id, nome FROM categorias WHERE id = $1",
        [categoriaId],
      );

      if (categoriaEncontrada.rows.length === 0) {
        return res.status(400).json({
          mensagem: "Categoria não encontrada.",
        });
      }

      categoriaIdFinal = categoriaEncontrada.rows[0].id;
      categoriaNome = categoriaEncontrada.rows[0].nome;
    }

    let resultado;

    if (req.file) {
      const imagem_url = `/uploads/${req.file.filename}`;

      resultado = await pool.query(
        `UPDATE fotografias
         SET titulo = $1,
             descricao = $2,
             imagem_url = $3,
             categoria = $4,
             categoria_id = $5
         WHERE id = $6
         RETURNING *`,
        [titulo, descricao, imagem_url, categoriaNome, categoriaIdFinal, id],
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
             categoria = $3,
             categoria_id = $4
         WHERE id = $5
         RETURNING *`,
        [titulo, descricao, categoriaNome, categoriaIdFinal, id],
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

// Rotas da Entrega 2 — Categorias

// Listar todas as categorias
app.get("/api/categorias", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM categorias ORDER BY nome ASC",
    );

    res.json(resultado.rows);
  } catch (erro) {
    console.error("Erro ao listar categorias:", erro);
    res.status(500).json({
      mensagem: "Erro ao listar categorias.",
    });
  }
});

// Cadastrar uma categoria
app.post("/api/categorias", async (req, res) => {
  try {
    const nome = req.body.nome?.trim();

    if (!nome) {
      return res.status(400).json({
        mensagem: "Informe o nome da categoria.",
      });
    }

    const resultado = await pool.query(
      "INSERT INTO categorias (nome) VALUES ($1) RETURNING *",
      [nome],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    if (erro.code === "23505") {
      return res.status(409).json({
        mensagem: "Essa categoria já existe.",
      });
    }

    console.error("Erro ao cadastrar categoria:", erro);
    res.status(500).json({
      mensagem: "Erro ao cadastrar categoria.",
    });
  }
});

// Editar uma categoria
app.put("/api/categorias/:id", async (req, res) => {
  try {
    const nome = req.body.nome?.trim();

    if (!nome) {
      return res.status(400).json({
        mensagem: "Informe o nome da categoria.",
      });
    }

    const resultado = await pool.query(
      "UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *",
      [nome, req.params.id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada.",
      });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    if (erro.code === "23505") {
      return res.status(409).json({
        mensagem: "Essa categoria já existe.",
      });
    }

    console.error("Erro ao editar categoria:", erro);
    res.status(500).json({
      mensagem: "Erro ao editar categoria.",
    });
  }
});

// Excluir uma categoria sem fotografias vinculadas
app.delete("/api/categorias/:id", async (req, res) => {
  try {
    const vinculadas = await pool.query(
      "SELECT COUNT(*) FROM fotografias WHERE categoria_id = $1",
      [req.params.id],
    );

    if (Number(vinculadas.rows[0].count) > 0) {
      return res.status(409).json({
        mensagem:
          "Não é possível excluir: existem fotografias vinculadas a essa categoria.",
      });
    }

    const resultado = await pool.query(
      "DELETE FROM categorias WHERE id = $1 RETURNING *",
      [req.params.id],
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: "Categoria não encontrada.",
      });
    }

    res.json({
      mensagem: "Categoria excluída com sucesso.",
    });
  } catch (erro) {
    console.error("Erro ao excluir categoria:", erro);
    res.status(500).json({
      mensagem: "Erro ao excluir categoria.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
