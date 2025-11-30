-- Script de inicialização do banco de dados PostgreSQL
-- Cria todas as tabelas necessárias para a aplicação Church Schedule

-- Criar tipo ENUM para ministerios
CREATE TYPE ministerio AS ENUM ('diaconia', 'louvor', 'midia');

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    nameEvent VARCHAR(100) NOT NULL,
    dateEvent DATE NOT NULL,
    hourEvent TIME NOT NULL,
    typeEvent VARCHAR(100) NOT NULL,
    descEvent VARCHAR(255),
    preletor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cargos/roles
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(45) NOT NULL,
    ministerio ministerio NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de membros
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    telefone VARCHAR(25),
    diaconia BOOLEAN DEFAULT FALSE,
    louvor BOOLEAN DEFAULT FALSE,
    midia BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de escalas
CREATE TABLE IF NOT EXISTS scale (
    id SERIAL PRIMARY KEY,
    idCargos INT NOT NULL,
    idEventos INT NOT NULL,
    idMembro INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idCargos) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (idEventos) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (idMembro) REFERENCES members(id) ON DELETE CASCADE
);

-- Tabela de bandas
CREATE TABLE IF NOT EXISTS bands (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de membros de banda
CREATE TABLE IF NOT EXISTS memberband (
    id SERIAL PRIMARY KEY,
    idmember INT NOT NULL,
    idband INT NOT NULL,
    idroles INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idmember) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (idband) REFERENCES bands(id) ON DELETE CASCADE,
    FOREIGN KEY (idroles) REFERENCES roles(id) ON DELETE CASCADE
);

-- Tabela de voluntários
CREATE TABLE IF NOT EXISTS volunteers (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(255),
    idevent INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idevent) REFERENCES events(id) ON DELETE CASCADE
);

-- Tabela de indisponibilidades
CREATE TABLE IF NOT EXISTS unavailable (
    id SERIAL PRIMARY KEY,
    idMembro INT NOT NULL,
    dataInicio DATE NOT NULL,
    dataFim DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idMembro) REFERENCES members(id) ON DELETE CASCADE
);

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========== DADOS DE TESTE ==========

-- Inserir usuários de teste
INSERT INTO users (email, password, role) VALUES 
('admin@church.test', 'admin123', 'admin'),
('user@church.test', 'user123', 'user')
ON CONFLICT (email) DO NOTHING;

-- Inserir roles/cargos de teste
INSERT INTO roles (descricao, ministerio) VALUES
('Guitarrista', 'louvor'),
('Baterista', 'louvor'),
('Baixista', 'louvor'),
('Teclista', 'louvor'),
('Vocalista', 'louvor'),
('Maestro', 'louvor'),
('Operador de áudio', 'midia'),
('Operador de vídeo', 'midia'),
('Editor de fotos', 'midia'),
('Webmaster', 'midia'),
('Técnico de som', 'midia'),
('Diácono', 'diaconia'),
('Diácona', 'diaconia'),
('Tesoureiro', 'diaconia'),
('Secretário', 'diaconia'),
('Vigilante', 'diaconia'),
('Líder de louvor', 'louvor')
ON CONFLICT DO NOTHING;

-- Inserir membros de teste
INSERT INTO members (name, telefone, diaconia, louvor, midia) VALUES
('João Silva', '(11) 99999-0001', false, true, false),
('Maria Santos', '(11) 99999-0002', false, true, false),
('Pedro Oliveira', '(11) 99999-0003', true, false, false),
('Ana Costa', '(11) 99999-0004', false, false, true),
('Carlos Mendes', '(11) 99999-0005', true, true, false),
('Lucia Ferreira', '(11) 99999-0006', false, true, true),
('Bruno Evangelista', '(11) 99999-0007', true, false, true),
('Fernanda Rocha', '(11) 99999-0008', false, true, false),
('Ricardo Alves', '(11) 99999-0009', true, false, false),
('Juliana Pereira', '(11) 99999-0010', false, false, true)
ON CONFLICT DO NOTHING;

-- Inserir bandas de teste
INSERT INTO bands (nome) VALUES
('Banda de Louvor A'),
('Banda de Louvor B'),
('Banda Instrumental')
ON CONFLICT DO NOTHING;

-- Inserir membros de banda de teste
INSERT INTO memberband (idmember, idband, idroles) VALUES
(1, 1, 1),  -- João é Guitarrista na Banda A
(2, 1, 5),  -- Maria é Vocalista na Banda A
(8, 1, 2),  -- Fernanda é Baterista na Banda A
(3, 2, 3),  -- Pedro é Baixista na Banda B
(6, 2, 4),  -- Lucia é Teclista na Banda B
(9, 2, 1)   -- Ricardo é Guitarrista na Banda B
ON CONFLICT DO NOTHING;

-- Inserir eventos de teste
INSERT INTO events (nameEvent, dateEvent, hourEvent, typeEvent, descEvent, preletor) VALUES
('Culto Domingo Manhã', '2025-12-07', '08:00:00', 'Culto', 'Culto principal de domingo', 'Pastor João'),
('Culto Domingo Noite', '2025-12-07', '19:00:00', 'Culto', 'Culto noturno de domingo', 'Pastor Pedro'),
('Culto Quarta-feira', '2025-12-10', '19:30:00', 'Culto', 'Culto de quarta-feira', 'Pastor Carlos'),
('Ensaio da Banda', '2025-12-05', '18:00:00', 'Ensaio', 'Ensaio geral da banda', NULL),
('Conferência Anual', '2025-12-15', '10:00:00', 'Conferência', 'Conferência anual da igreja', 'Bispo Paulo')
ON CONFLICT DO NOTHING;

-- Inserir escalas de teste
INSERT INTO scale (idCargos, idEventos, idMembro) VALUES
(1, 1, 1),    -- João (Guitarrista) escalado para Culto Domingo Manhã
(5, 1, 2),    -- Maria (Vocalista) escalada para Culto Domingo Manhã
(7, 1, 4),    -- Ana (Operador de áudio) escalada para Culto Domingo Manhã
(2, 2, 8),    -- Fernanda (Baterista) escalada para Culto Domingo Noite
(3, 2, 3),    -- Pedro (Baixista) escalado para Culto Domingo Noite
(5, 2, 6),    -- Lucia (Vocalista) escalada para Culto Domingo Noite
(12, 1, 5),   -- Carlos (Diácono) escalado para Culto Domingo Manhã
(12, 2, 9),   -- Ricardo (Diácono) escalado para Culto Domingo Noite
(8, 3, 4),    -- Ana (Operador de vídeo) escalada para Culto Quarta-feira
(1, 4, 1)     -- João (Guitarrista) escalado para Ensaio da Banda
ON CONFLICT DO NOTHING;

-- Inserir indisponibilidades de teste
INSERT INTO unavailable (idMembro, dataInicio, dataFim) VALUES
(2, '2025-12-20', '2025-12-27'),  -- Maria indisponível de 20 a 27 de dezembro
(5, '2025-12-10', '2025-12-12')   -- Carlos indisponível de 10 a 12 de dezembro
ON CONFLICT DO NOTHING;

-- Inserir voluntários de teste
INSERT INTO volunteers (nome, cargo, idevent) VALUES
('Voluntário 1', 'Usheiro', 1),
('Voluntário 2', 'Recepção', 1),
('Voluntário 3', 'Estacionamento', 2)
ON CONFLICT DO NOTHING;

-- ========== CRIAR ÍNDICES PARA PERFORMANCE ==========
CREATE INDEX IF NOT EXISTS idx_events_date ON events(dateEvent);
CREATE INDEX IF NOT EXISTS idx_members_ministerio ON members(louvor, diaconia, midia);
CREATE INDEX IF NOT EXISTS idx_scale_event ON scale(idEventos);
CREATE INDEX IF NOT EXISTS idx_scale_member ON scale(idMembro);
CREATE INDEX IF NOT EXISTS idx_scale_cargo ON scale(idCargos);
CREATE INDEX IF NOT EXISTS idx_memberband_member ON memberband(idmember);
CREATE INDEX IF NOT EXISTS idx_memberband_band ON memberband(idband);
CREATE INDEX IF NOT EXISTS idx_unavailable_member ON unavailable(idMembro);
CREATE INDEX IF NOT EXISTS idx_volunteers_event ON volunteers(idevent);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Confirmação
SELECT 'Database initialized successfully!' as status;
