const express = require('express');
const router = express.Router();
const provaModel = require('../models/provaModel');

// Rota para gravar prova escolhida no banco associada ao usuário
router.post('/gravar', async (req, res) => {
  const { idusuario, nome } = req.body;

  if (!idusuario || !nome) {
    return res.status(400).json({ erro: 'Campos obrigatórios não enviados.' });
  }

  try {
    const resultado = await provaModel.gravarProva(idusuario, nome);
    res.status(201).json({ mensagem: 'Prova gravada com sucesso!', resultado });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao gravar prova.', detalhes: erro.message });
  }
});

// Rota para listar as provas gravadas por um usuário específico
router.get('/usuario/:idusuario', async (req, res) => {
  const { idusuario } = req.params;

  try {
    const resultado = await provaModel.listarProvasDoUsuario(idusuario);
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar provas do usuário.', detalhes: erro.message });
  }
});


module.exports = router;
