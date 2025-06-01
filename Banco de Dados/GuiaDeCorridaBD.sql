-- Guia de Corrida (Consulte a modelagem para maiores informações)

CREATE DATABASE corrida;
USE corrida;

CREATE TABLE usuario (
  idusuario INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  telefone VARCHAR(15),
  senha VARCHAR(64),
  nivel VARCHAR(20) DEFAULT 'iniciante',
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_usuario_nivel CHECK (nivel IN ('iniciante', 'intermediario', 'avancado'))
);

SELECT * FROM usuario;

ALTER TABLE usuario MODIFY COLUMN senha VARCHAR(64) NOT NULL COMMENT 'SHA-256 hashed'; -- armazenará hashes SHA-256 de 64 caracteres para não expor informações

CREATE TABLE treino (
  idtreino INT PRIMARY KEY AUTO_INCREMENT,
  idusuario INT,
  data_treino DATE NOT NULL,
  distancia DECIMAL(5,2) NOT NULL, -- km
  pace DECIMAL(4,2), -- min/km
  duracao TIME,
  tipo_treino VARCHAR(50), -- regenerativo, longo, etc.
  fc_media INT, -- frequência cardíaca média (bpm)
  observacoes TEXT,
  completou BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_preparo_usuario FOREIGN KEY (idusuario) REFERENCES usuario(idusuario)
);

CREATE TABLE prova (
  idprova INT PRIMARY KEY AUTO_INCREMENT,
  idusuario INT,
  nome VARCHAR(100) NOT NULL,
  distancia DECIMAL(5,2) NOT NULL, -- km
  data_prova DATE NOT NULL,
  altimetria INT, -- metros
  modalidade VARCHAR(20) NOT NULL,
  CONSTRAINT chk_prova_modalidade CHECK (modalidade IN ('Montanha', 'Asfalto')),
  CONSTRAINT fk_prova_usuario FOREIGN KEY (idusuario) REFERENCES usuario(idusuario)
);

SELECT * FROM prova;

-- consultar usuarios pelas provas
SELECT 
    u.idusuario,
    u.nome,
    u.nivel,
    COUNT(p.idprova) AS total_provas
FROM 
    usuario u
LEFT JOIN 
    prova p ON u.idusuario = p.idusuario
GROUP BY 
    u.idusuario;
    
-- total geral de usuarios
SELECT COUNT(*) AS total_usuarios FROM usuario;

-- contagem de Usuários por nivel
SELECT 
    nivel,
    COUNT(*) AS qtd_usuarios
FROM 
    usuario
GROUP BY 
    nivel;

-- consulta pra dashboard
SELECT 
    (SELECT COUNT(*) FROM usuario) AS total_usuarios,
    (SELECT COUNT(*) FROM prova) AS total_provas,
    (SELECT COUNT(*) FROM treino) AS total_treinos,
    (SELECT COUNT(DISTINCT idusuario) FROM prova) AS usuarios_com_provas;


	






















INSERT INTO preparo (idusuario, data_treino, distancia, pace, duracao, tipo_treino, fc_media, observacoes, completou) VALUES
(1, '2025-06-01', 6, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: intervalado 6x800m em ritmo forte, com 2 minutos de trote entre as séries.', TRUE),
(1, '2025-06-02', 7, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: subida contínua por 4 km com 300m de ganho de elevação, seguida de descida técnica controlada.', TRUE),
(1, '2025-06-03', 8, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: 10 km contínuos em ritmo confortável (Z2), foco em respiração e cadência.', TRUE),
(1, '2025-06-04', 9, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: fartlek na trilha, alternando 3 minutos forte com 2 minutos leve por 50 minutos.', TRUE),
(1, '2025-06-05', 10, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: progressivo 5 km + 3 km + 2 km (cada trecho mais rápido que o anterior).', TRUE),
(1, '2025-06-06', 11, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: circuito técnico com bastões, 12 km com 600m D+, alternando subidas íngremes e planos.', TRUE),
(1, '2025-06-07', 12, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: 3 tiros de 2 km em ritmo de prova, com 4 minutos de trote entre os tiros.', TRUE),
(1, '2025-06-08', 13, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: treino em trilha escorregadia com foco em pisada e equilíbrio por 8 km.', TRUE),
(1, '2025-06-09', 14, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: tempo run de 25 minutos em ritmo controlado (entre Z3 e Z4).', TRUE),
(1, '2025-06-10', 15, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: subida técnica com bastões, 5x400m em trilha com 15% de inclinação.', TRUE),
(1, '2025-06-11', 16, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: regenerativo leve, 6 km em Z1 com foco em soltura e respiração.', TRUE),
(1, '2025-06-12', 17, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: treino noturno em trilha com lanterna, 10 km ritmo confortável.', TRUE),
(1, '2025-06-13', 18, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: pirâmide 400m-800m-1200m-800m-400m com recuperação de 90 segundos entre os tiros.', TRUE),
(1, '2025-06-14', 19, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: treino de downhill, descidas rápidas por 3 km com foco em controle corporal.', TRUE),
(1, '2025-06-15', 20, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: 12 km em Z2 com os últimos 2 km em ritmo de prova.', TRUE),
(1, '2025-06-16', 21, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: trilha técnica com obstáculos naturais, total de 15 km e 700m de ganho altimétrico.', TRUE),
(1, '2025-06-17', 22, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: 5 km aquecimento + 4x1 km forte + 3 km desaquecimento.', TRUE),
(1, '2025-06-18', 23, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: hiking com corrida leve, 10 km alternando caminhada em subida e corrida em plano.', TRUE),
(1, '2025-06-19', 24, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: 10 tiros de 400m em ritmo de VO2 máximo com 1 minuto de pausa.', TRUE),
(1, '2025-06-20', 25, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: circuito de montanha com bastões, 18 km acumulando 900m D+.', TRUE),
(1, '2025-06-21', 26, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: 16 km ritmo contínuo (Z3), simulando a primeira metade de uma meia-maratona.', TRUE),
(1, '2025-06-22', 27, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: power hike 3x2 km em subida íngreme, descendo trotando.', TRUE),
(1, '2025-06-23', 28, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: 3 km leve + 5 km ritmo moderado + 2 km leve (treino em blocos).', TRUE),
(1, '2025-06-24', 29, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: simulado de prova curta, 10 km com 400m D+, foco no pacing.', TRUE),
(1, '2025-06-25', 30, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: 30 minutos de corrida com técnica de respiração 2:2 e 3:3 em alternância.', TRUE),
(1, '2025-06-26', 31, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: treino técnico de trilha com raízes, pedras e descidas acentuadas (12 km).', TRUE),
(1, '2025-06-27', 32, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: 4 tiros de 5 minutos em ritmo de limiar anaeróbico com pausa de 2 minutos.', TRUE),
(1, '2025-06-28', 33, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: longão de montanha, 20 km com 1200m de elevação acumulada, foco em nutrição e pacing.', TRUE),
(1, '2025-06-29', 34, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: circuito urbano com variação de terreno (asfalto + paralelepípedo), 8 km.', TRUE),
(1, '2025-06-30', 35, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: subida longa de 6 km com inclinação constante, treino de força de pernas.', TRUE),
(1, '2025-07-01', 36, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: 20 minutos de técnica de corrida (drills) + 6 km em Z2.', TRUE),
(1, '2025-07-02', 37, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: circuito com cordas e travessias leves, ideal para treinar agilidade e foco.', TRUE),
(1, '2025-07-03', 38, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: intervalado 5x1000m ritmo de prova, pausa ativa de 2 minutos.', TRUE),
(1, '2025-07-04', 39, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: exploração de trilha nova, 15 km ritmo confortável, foco em navegação.', TRUE),
(1, '2025-07-05', 40, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: 3 km aquecimento + 10 km ritmo constante + 2 km desaquecimento.', TRUE),
(1, '2025-07-06', 41, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: subida em zigue-zague por 3 km, fortalecimento muscular e cardio.', TRUE),
(1, '2025-07-07', 42, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: fartlek 45 minutos alternando 1 minuto forte e 2 minutos leve.', TRUE),
(1, '2025-07-08', 43, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: trekking com corrida leve, 12 km com 500m D+, treino de resistência.', TRUE),
(1, '2025-07-09', 44, 5.0, '00:30:00', 'Asfalto', 130, 'Treino de Hoje: 6 tiros de 400m com descanso de 90 segundos entre eles.', TRUE),
(1, '2025-07-10', 45, 5.0, '00:30:00', 'Montanha', 130, 'Treino de Hoje: treino de técnica em descidas, foco em postura e aterrissagem.', TRUE);


INSERT INTO prova (idusuario, idpreparo, nome, distancia, data_prova, altimetria, modalidade) VALUES
(1, 1, 'Maratona de Boston', 42.20, '2026-04-20', 245, 'Asfalto'),
(1, 1, 'Maratona de Londres', 42.20, '2026-04-27', 50, 'Asfalto'),
(1, 1, 'Maratona de Paris', 42.20, '2026-04-13', 140, 'Asfalto'),
(1, 1, 'Maratona de Berlim', 42.20, '2026-09-27', 38, 'Asfalto'),
(1, 1, 'Maratona de Chicago', 42.20, '2026-10-12', 40, 'Asfalto'),
(1, 1, 'Maratona de Nova York', 42.20, '2026-11-02', 300, 'Asfalto'),
(1, 1, 'Maratona de Tóquio', 42.20, '2026-03-02', 80, 'Asfalto'),
(1, 1, 'Maratona da Cidade do Cabo', 42.20, '2026-09-15', 150, 'Asfalto'),
(1, 1, 'Maratona de Roma', 42.20, '2026-03-22', 200, 'Asfalto'),
(1, 1, 'Maratona de Viena', 42.20, '2026-04-06', 60, 'Asfalto'),
(1, 1, 'Ultra-Trail du Mont-Blanc (UTMB)', 171.00, '2026-08-24', 10000, 'Montanha'),
(1, 1, 'Western States 100', 160.90, '2026-06-28', 5500, 'Montanha'),
(1, 1, 'Hardrock 100', 160.90, '2026-07-14', 10000, 'Montanha'),
(1, 1, 'Ultra-Trail Australia', 100.00, '2026-05-17', 4400, 'Montanha'),
(1, 1, 'Marathon des Sables', 250.00, '2026-04-12', 1000, 'Montanha'),
(1, 1, 'Ultra Pirineu', 100.00, '2026-09-28', 6600, 'Montanha'),
(1, 1, 'TDS (Sur les Traces des Ducs de Savoie)', 145.00, '2026-08-26', 9100, 'Montanha'),
(1, 1, 'Maratona da Muralha da China', 42.20, '2026-05-01', 5164, 'Montanha'),
(1, 1, 'Eiger Ultra Trail', 101.00, '2026-07-20', 6700, 'Montanha'),
(1, 1, 'Ultra Fiord', 100.00, '2026-04-18', 4500, 'Montanha');

