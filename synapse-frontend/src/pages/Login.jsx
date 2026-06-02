import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Importando o novo CSS
import { ip } from "../ip";

function Login() {
  const [pin, setPin] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  // Função para Acessar (Login)
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!pin) {
      setErro("Por favor, digite um PIN válido.");
      return;
    }

    try {
      const response = await axios.post(`${ip}:2399/api/synapse-ti/api/usuarios/login`, {
        pin: pin,
      });

      const usuarioId = response.data.id;

      localStorage.setItem("synapse_usuario_id", usuarioId);
      localStorage.setItem("synapse_usuario_pin", pin);

      navigate("/manager");
    } catch (error) {
      // Tratamento inteligente de erros do Login
      if (error.response) {
        if (error.response.status === 404) {
          setErro('PIN não encontrado. Clique em "Cadastrar PIN".');
        } else if (typeof error.response.data === "string") {
          setErro(error.response.data);
        } else {
          setErro("Erro ao validar o PIN no servidor.");
        }
      } else {
        setErro("O servidor está offline. Verifique se o Spring Boot está rodando.");
      }
    }
  };

  // Função para Cadastrar Novo PIN
  const handleCadastro = async () => {
    setErro("");
    setSucesso("");

    if (!pin) {
      setErro("Digite um PIN para cadastrar.");
      return;
    }

    try {
      await axios.post(`${ip}:2399/api/synapse-ti/api/usuarios/cadastrar`, { pin: pin });
      setSucesso("PIN cadastrado com sucesso! Clique em Acessar.");
    } catch (error) {
      // Tratamento inteligente de erros do Cadastro
      if (error.response) {
        if (error.response.status === 409) {
          setErro('Este PIN já existe. Tente outro ou clique em "Acessar".');
        } else if (typeof error.response.data === "string") {
          setErro(error.response.data);
        } else {
          setErro("Erro ao tentar cadastrar o PIN.");
        }
      } else {
        setErro("O servidor está offline. Verifique se o Spring Boot está rodando.");
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">S</div>
        <h1>Synapse</h1>
        <p className="login-subtitle">
          Gerenciador de Dashboards.
          <br />
          Digite seu PIN corporativo para acessar.
        </p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Seu PIN (ex: 1234)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="login-input"
            autoComplete="off"
          />

          {/* Exibe erro em vermelho se houver */}
          {erro && <p className="login-error">{erro}</p>}

          {/* Exibe sucesso em verde se houver */}
          {sucesso && (
            <p style={{ color: "#10b981", fontWeight: "bold", margin: "0", fontSize: "0.95rem" }}>{sucesso}</p>
          )}

          {/* Área com os dois botões */}
          <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
            <button
              type="button"
              onClick={handleCadastro}
              style={{ flex: 1, backgroundColor: "#64748b" }}
              className="login-button"
            >
              Cadastrar PIN
            </button>

            <button type="submit" style={{ flex: 1 }} className="login-button">
              Acessar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
