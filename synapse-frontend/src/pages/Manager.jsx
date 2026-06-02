import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Manager.css';

function Manager() {
  const [dashboards, setDashboards] = useState([]);
  const [nome, setNome] = useState(''); // <-- Novo estado para o Nome
  const [url, setUrl] = useState('');
  const [duracao, setDuracao] = useState(30);
  const [erro, setErro] = useState('');
  
  const [editandoId, setEditandoId] = useState(null);
  const [novoTempo, setNovoTempo] = useState('');
  
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem('synapse_usuario_id');
  const pin = localStorage.getItem('synapse_usuario_pin');

  useEffect(() => {
    if (!usuarioId) {
      navigate('/');
      return;
    }
    carregarDashboards();
  }, [usuarioId, navigate]);

  const carregarDashboards = async () => {
    try {
      const response = await axios.get(`${ip}:2399/api/synapse-ti/api/dashboards/usuario/${usuarioId}`);
      setDashboards(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar dashboards:", error);
    }
  };

  const handleAdicionar = async (e) => {
    e.preventDefault();
    setErro('');

    // Valida também o nome agora
    if (!nome || !url) {
      setErro("Por favor, preencha o Nome e o Link do Looker Studio.");
      return;
    }

    let urlTratada = url;
    urlTratada = urlTratada.replace('datastudio.google.com', 'lookerstudio.google.com');
    urlTratada = urlTratada.replace(/\/u\/\d+\//, '/');
    if (urlTratada.includes('/reporting/') && !urlTratada.includes('/embed/')) {
      urlTratada = urlTratada.replace('/reporting/', '/embed/reporting/');
    }

    try {
      await axios.post(`${ip}:2399/api/synapse-ti/api/dashboards/usuario/${usuarioId}`, {
        nome: nome, // <-- Envia o nome pro backend
        url: urlTratada,
        duracaoSegundos: Number(duracao)
      });
      
      setNome(''); // Limpa o campo
      setUrl('');
      setDuracao(30);
      carregarDashboards();
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      setErro("Erro ao salvar o dashboard.");
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Tem certeza que deseja excluir este dashboard?")) {
      try {
        await axios.delete(`${ip}:2399/api/synapse-ti/api/dashboards/${id}`);
        carregarDashboards(); 
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  const iniciarEdicao = (dash) => {
    setEditandoId(dash.id);
    setNovoTempo(dash.duracaoSegundos);
  };

  const salvarEdicao = async (id) => {
    try {
      await axios.put(`${ip}:2399/api/synapse-ti/api/dashboards/${id}/tempo`, {
        duracaoSegundos: Number(novoTempo)
      });
      setEditandoId(null);
      carregarDashboards();
    } catch (error) {
      console.error("Erro ao atualizar tempo", error);
    }
  };

  const handleSair = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="manager-container">
      <header className="manager-header">
        <h2>Synapse Workspace <span style={{fontSize: '0.9rem', color: '#94a3b8', fontWeight: 'normal'}}>| PIN: {pin}</span></h2>
        <div className="header-buttons">
          <button onClick={() => navigate('/player')} className="btn-play">
            ▶ Iniciar Player
          </button>
          <button onClick={handleSair} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="manager-main">
        <section className="card-section">
          <h3 className="section-title">Adicionar Novo Dashboard</h3>
          <form onSubmit={handleAdicionar} className="form-group">
            
            {/* NOVO CAMPO DE NOME */}
            <input
              type="text"
              placeholder="Nome (ex: Metas 2026)"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input-name"
            />

            <input
              type="url"
              placeholder="Cole o link do Looker Studio"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input-url"
            />
            
            <div className="time-wrapper">
              <label>Tempo (s):</label>
              <input
                type="number"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                min="5"
              />
            </div>
            
            <button type="submit" className="btn-add">Adicionar</button>
          </form>
          {erro && <p className="error-msg">{erro}</p>}
        </section>

        <section className="card-section">
          <h3 className="section-title">Sua Fila de Exibição ({dashboards.length})</h3>
          
          {dashboards.length === 0 ? (
            <p className="empty-state">Você ainda não possui painéis configurados.</p>
          ) : (
            <div className="dash-grid">
              {dashboards.map((dash, index) => (
                <div key={dash.id} className="dash-item">
                  
                  <div className="dash-info">
                    <div className="dash-number">{index + 1}</div>
                    
                    {editandoId === dash.id ? (
                      <div className="edit-mode-container">
                        <input 
                          type="number" 
                          value={novoTempo} 
                          onChange={(e)=> setNovoTempo(e.target.value)} 
                          className="edit-input"
                          autoFocus
                        />
                        <button onClick={() => salvarEdicao(dash.id)} className="btn-save">Salvar</button>
                        <button onClick={() => setEditandoId(null)} className="btn-cancel">Cancelar</button>
                      </div>
                    ) : (
                      <span className="dash-time" style={{cursor: 'pointer'}} onClick={() => iniciarEdicao(dash)} title="Clique para editar o tempo">
                        ⏱ {dash.duracaoSegundos}s
                      </span>
                    )}

                    {/* Grupo de Texto: Nome em cima, URL embaixo */}
                    <div className="dash-text-group">
                      {/* Se o dashboard antigo não tiver nome, mostra um aviso para não ficar em branco */}
                      <span className="dash-name" title={dash.nome}>
                        {dash.nome || "Dashboard sem nome"}
                      </span>
                      <span className="dash-url">
                        <a href={dash.url} target="_blank" rel="noreferrer" title={dash.url}>
                          {dash.url}
                        </a>
                      </span>
                    </div>

                  </div>
                  
                  <div className="dash-actions">
                    {editandoId !== dash.id && (
                      <button onClick={() => iniciarEdicao(dash)} className="btn-edit">
                        Editar Tempo
                      </button>
                    )}
                    <button onClick={() => handleDelete(dash.id)} className="btn-delete">
                      Excluir
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Manager;