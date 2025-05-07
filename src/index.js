// src/index.js ou apenas index.js
const express = require('express');
const app = express();
const port = 3000;

// Configurações do servidor
app.use(express.json());  // Para processar JSON no corpo das requisições

// Definindo uma rota simples
app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
