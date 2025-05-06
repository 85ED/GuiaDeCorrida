-- Guia de Corrida (Consulte a modelagem para maiores informações)

CREATE DATABASE corrida;
USE corrida;

CREATE TABLE usuario (
  idUsuario INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  nivel VARCHAR(20) DEFAULT 'iniciante',
  data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_usuario_nivel CHECK (nivel IN ('iniciante', 'intermediario', 'avancado'))
);

CREATE TABLE preparo (
  idPreparo INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  data_treino DATE NOT NULL,
  distancia DECIMAL(5,2) NOT NULL, -- km
  pace DECIMAL(4,2), -- min/km
  duracao TIME,
  tipo_treino VARCHAR(50), -- regenerativo, longo, etc.
  fc_media INT, -- frequência cardíaca média (bpm)
  observacoes TEXT,
  completou BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_preparo_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(idUsuario)
);

CREATE TABLE prova (
  idProva INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  preparo_id INT,
  nome VARCHAR(100) NOT NULL,
  distancia DECIMAL(5,2) NOT NULL, -- km
  data_prova DATE NOT NULL,
  altimetria INT, -- metros
  modalidade VARCHAR(20) NOT NULL,
  CONSTRAINT chk_prova_modalidade CHECK (modalidade IN ('montanha', 'rua')),
  CONSTRAINT fk_prova_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(idUsuario),
  CONSTRAINT fk_prova_preparo FOREIGN KEY (preparo_id) REFERENCES preparo(idPreparo)
);
