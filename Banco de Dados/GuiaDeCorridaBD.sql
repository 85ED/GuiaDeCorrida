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

ALTER TABLE usuario MODIFY COLUMN senha VARCHAR(64) NOT NULL COMMENT 'SHA-256 hashed';

SELECT * FROM usuario;



CREATE TABLE preparo (
  idpreparo INT PRIMARY KEY AUTO_INCREMENT,
  idusuario INT,
  data_treino DATE NOT NULL,
  distancia DECIMAL(5,2) NOT NULL, -- km
  pace DECIMAL(4,2), -- min/km
  duracao TIME, -- ajusta
  tipo_treino VARCHAR(50), -- regenerativo, longo, etc.
  fc_media INT, -- frequência cardíaca média (bpm)
  observacoes TEXT, 
  completou BOOLEAN DEFAULT FALSE, 
  CONSTRAINT fk_preparo_usuario FOREIGN KEY (idusuario) REFERENCES usuario(idusuario)
);

CREATE TABLE prova (
  idprova INT PRIMARY KEY AUTO_INCREMENT,
  idusuario INT,
  idpreparo INT,
  nome VARCHAR(100) NOT NULL,
  distancia DECIMAL(5,2) NOT NULL, -- km
  data_prova DATE NOT NULL,
  altimetria INT, -- metros
  modalidade VARCHAR(20) NOT NULL,
  CONSTRAINT chk_prova_modalidade CHECK (modalidade IN ('montanha', 'rua')),
  CONSTRAINT fk_prova_usuario FOREIGN KEY (idusuario) REFERENCES usuario(idusuario),
  CONSTRAINT fk_prova_preparo FOREIGN KEY (idpreparo) REFERENCES preparo(idpreparo)
);

