 -- Garante que o esquema existe
    CREATE SCHEMA IF NOT EXISTS "ti";
  
    -- Cria a tabela de usuários
    CREATE TABLE "ti".usuarios (
        id UUID PRIMARY KEY,
        pin VARCHAR(255) NOT NULL UNIQUE,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  
    -- Cria a tabela de dashboards
    CREATE TABLE "ti".dashboards (
        id UUID PRIMARY KEY,
        nome VARCHAR(255),
        url TEXT NOT NULL,
        duracao_segundos INTEGER NOT NULL,
        ordem_exibicao INTEGER NOT NULL,
        usuario_id UUID NOT NULL,
        CONSTRAINT fk_dashboard_usuario FOREIGN KEY (usuario_id) REFERENCES "ti".usuarios(id)
    );