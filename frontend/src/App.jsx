import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [fotografias, setFotografias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [editandoId, setEditandoId] = useState(null);

  // Buscar fotografias do banco
  const carregarFotografias = () => {
    setCarregando(true);
    setErro("");

    fetch("http://localhost:3000/api/fotografias")
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error("Erro ao buscar fotografias.");
        }

        return resposta.json();
      })
      .then((dados) => {
        setFotografias(dados);
      })
      .catch((erro) => {
        console.error(erro);
        setErro("Não foi possível carregar as fotografias.");
      })
      .finally(() => {
        setCarregando(false);
      });
  };

  useEffect(() => {
    carregarFotografias();
  }, []);

  // Cadastrar fotografia
  const cadastrarFotografia = async (evento) => {
    evento.preventDefault();
    try {
      const formulario = new FormData();

      formulario.append("titulo", titulo);
      formulario.append("descricao", descricao);
      formulario.append("categoria", categoria);
      formulario.append("imagem", imagem);

      const resposta = await fetch("http://localhost:3000/api/fotografias", {
        method: "POST",
        body: formulario,
      });

      if (!resposta.ok) {
        throw new Error("Erro ao cadastrar fotografia.");
      }

      // Limpa o formulário
      setTitulo("");
      setDescricao("");
      setImagem(null);
      setCategoria("");

      // Atualiza a galeria
      carregarFotografias();
    } catch (erro) {
      console.error(erro);
      setErro("Não foi possível cadastrar a fotografia.");
    }
  };

  // Excluir fotografia
  const editarFotografia = (fotografia) => {
    setEditandoId(fotografia.id);
    setTitulo(fotografia.titulo);
    setDescricao(fotografia.descricao);
    setCategoria(fotografia.categoria);
  };
  const salvarEdicao = async () => {
    try {
      const formulario = new FormData();

      formulario.append("titulo", titulo);
      formulario.append("descricao", descricao);
      formulario.append("categoria", categoria);

      if (imagem) {
        formulario.append("imagem", imagem);
      }

      const resposta = await fetch(
        `http://localhost:3000/api/fotografias/${editandoId}`,
        {
          method: "PUT",
          body: formulario,
        },
      );

      if (!resposta.ok) {
        throw new Error("Erro ao atualizar fotografia.");
      }

      setEditandoId(null);
      setTitulo("");
      setDescricao("");
      setCategoria("");
      setImagem(null);

      carregarFotografias();
    } catch (erro) {
      console.error(erro);
      setErro("Não foi possível atualizar a fotografia.");
    }
  };
  const excluirFotografia = async (id) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta fotografia?",
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
        `http://localhost:3000/api/fotografias/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!resposta.ok) {
        throw new Error("Erro ao excluir fotografia.");
      }

      carregarFotografias();
    } catch (erro) {
      console.error(erro);
      setErro("Não foi possível excluir a fotografia.");
    }
  };

  return (
    <main>
      {/* CABEÇALHO */}
      <header className="cabecalho">
        <div className="logo">
          <span>PHOTO</span>
          <strong>STUDIO</strong>
        </div>

        <nav>
          <a href="#inicio">Início</a>
          <a href="#galeria">Galeria</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      {/* HERO */}
      <section id="inicio" className="hero">
        <div className="hero-conteudo">
          <p className="subtitulo">FOTOGRAFIA • ARTE • EMOÇÃO</p>

          <h1>
            Momentos que
            <br />
            <span>merecem ser lembrados.</span>
          </h1>

          <p className="hero-texto">
            Cada fotografia conta uma história. Aqui estão alguns dos momentos
            registrados através das minhas lentes.
          </p>

          <a href="#galeria" className="botao">
            Ver meu trabalho
          </a>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="galeria-secao">
        <div className="titulo-secao">
          <p>PORTFÓLIO</p>
          <h2>Minha Galeria</h2>
          <span>
            Uma seleção de fotografias registradas com cuidado e criatividade.
          </span>
        </div>

        {carregando && <p className="mensagem">Carregando fotografias...</p>}

        {erro && <p className="mensagem erro">{erro}</p>}

        {!carregando && !erro && fotografias.length === 0 && (
          <p className="mensagem">Nenhuma fotografia cadastrada.</p>
        )}

        <div className="galeria">
          {fotografias.map((fotografia) => (
            <article className="foto-card" key={fotografia.id}>
              <div className="foto-container">
                <img
                  src={`http://localhost:3000${fotografia.imagem_url}`}
                  alt={fotografia.titulo}
                />
              </div>

              <div className="foto-info">
                <span className="categoria">{fotografia.categoria}</span>

                <h3>{fotografia.titulo}</h3>

                <p>{fotografia.descricao}</p>

                <button
                  className="botao-editar"
                  onClick={() => editarFotografia(fotografia)}
                >
                  Editar fotografia
                </button>

                <button
                  className="botao-excluir"
                  onClick={() => excluirFotografia(fotografia.id)}
                >
                  Excluir fotografia
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="sobre">
        <div>
          <p className="subtitulo">SOBRE O TRABALHO</p>

          <h2>
            Fotografia para
            <br />
            guardar histórias.
          </h2>

          <p>
            Meu trabalho busca transformar momentos especiais em lembranças que
            possam ser revividas através da fotografia.
          </p>

          <p>
            Ensaios, eventos, retratos e momentos únicos registrados com
            sensibilidade e atenção aos detalhes.
          </p>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="contato">
        <p className="subtitulo">VAMOS CONVERSAR?</p>

        <h2>Gostou do meu trabalho?</h2>

        <p>
          Entre em contato para conversar sobre seu próximo ensaio ou evento.
        </p>

        <a
          href="https://wa.me/5500000000000"
          target="_blank"
          rel="noreferrer"
          className="botao"
        >
          Falar pelo WhatsApp
        </a>
      </section>

      {/* ÁREA DE CADASTRO */}
      <section className="cadastro">
        <div className="titulo-secao">
          <p>ADMINISTRAÇÃO</p>
          <h2>Cadastrar fotografia</h2>
          <span>Adicione novas fotografias ao portfólio.</span>
        </div>

        <form
          onSubmit={(evento) => {
            evento.preventDefault();

            if (editandoId) {
              salvarEdicao();
            } else {
              cadastrarFotografia(evento);
            }
          }}
        >
          <label>Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            required
          />

          <label>Descrição</label>
          <textarea
            value={descricao}
            onChange={(evento) => setDescricao(evento.target.value)}
            required
          />

          <label>Fotografia</label>
          <input
            type="file"
            accept="image/*"
            onChange={(evento) => setImagem(evento.target.files[0])}
            required={!editandoId}
          />
          {imagem && (
            <div className="preview-imagem">
              <p>Pré-visualização:</p>
              <img src={URL.createObjectURL(imagem)} alt="Pré-visualização" />
            </div>
          )}

          <label>Categoria</label>
          <input
            type="text"
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
            required
          />

          <button type="submit" className="botao">
            {editandoId ? "Salvar alterações" : "Cadastrar fotografia"}
          </button>

          {editandoId && (
            <button
              type="button"
              className="botao-cancelar"
              onClick={() => {
                setEditandoId(null);
                setTitulo("");
                setDescricao("");
                setCategoria("");
                setImagem(null);
              }}
            >
              Cancelar edição
            </button>
          )}
        </form>
      </section>

      {/* RODAPÉ */}
      <footer>
        <p>© 2026 — Portfólio do Fotógrafo</p>
        <p>Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}

export default App;
