import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Player() {
  const [dashboards, setDashboards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem('synapse_usuario_id');

  // 1. Busca os dashboards quando a tela abre
  useEffect(() => {
    if (!usuarioId) {
      navigate('/');
      return;
    }

    const buscarDados = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/dashboards/usuario/${usuarioId}`);
        setDashboards(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar o player:", error);
        setLoading(false);
      }
    };

    buscarDados();
  }, [usuarioId, navigate]);

  // 2. A Mágica do Carrossel (Temporizador)
  useEffect(() => {
    // Se ainda está carregando ou não tem dashboards, não faz nada
    if (loading || dashboards.length === 0) return;

    // Pega o tempo do dashboard atual e converte para milissegundos
    const tempoEmMilissegundos = dashboards[currentIndex].duracaoSegundos * 1000;

    // Configura o cronômetro para mudar para o próximo
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        // Se chegou no último, volta para o primeiro (0), senão vai pro próximo (+1)
        if (prevIndex === dashboards.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, tempoEmMilissegundos);

    // Limpa o cronômetro anterior se o componente for desmontado ou trocar de slide
    return () => clearTimeout(timer);
  }, [currentIndex, dashboards, loading]);

  // Telas de carregamento ou erro
  if (loading) {
    return <div style={styles.center}><h2>Carregando player...</h2></div>;
  }

  if (dashboards.length === 0) {
    return (
      <div style={styles.center}>
        <h2>Você não tem nenhum dashboard cadastrado.</h2>
        <button onClick={() => navigate('/manager')} style={styles.backButton}>Voltar ao Gerenciador</button>
      </div>
    );
  }

  const dashboardAtual = dashboards[currentIndex];

  return (
    <div style={styles.fullScreen}>
      {/* Botão flutuante para sair do modo apresentação */}
      <button 
        onClick={() => navigate('/manager')} 
        style={styles.floatingButton}
        title="Voltar ao Gerenciador"
      >
        ✖ Sair do Player
      </button>

      {/* O Iframe que exibe o Looker Studio */}
      <iframe
        src={dashboardAtual.url}
        style={styles.iframe}
        title={`Dashboard ${currentIndex + 1}`}
        allowFullScreen
      />
    </div>
  );
}

// Estilos
const styles = {
  fullScreen: { width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#000', position: 'relative' },
  iframe: { width: '100%', height: '100%', border: 'none' },
  floatingButton: { 
    position: 'absolute', 
    top: '20px', 
    right: '20px', 
    zIndex: 1000, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    color: 'white', 
    border: '1px solid white', 
    padding: '10px 15px', 
    borderRadius: '4px', 
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s'
  },
  center: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', gap: '20px' },
  backButton: { padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }
};

export default Player;