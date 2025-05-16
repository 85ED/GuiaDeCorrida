const usuarioModel = require("../models/usuarioModel");

module.exports = {
  async cadastrar(req, res) {
    try {
      const { nome, email, telefone, senha } = req.body;

      if (!nome || !email || !telefone || !senha) {
        return res.status(400).json({ success: false, error: "Todos os campos são obrigatórios" });
      }

      const resultado = await usuarioModel.cadastrar(nome, email, telefone, senha);
      res.json({ success: true, id: resultado.insertId });

    } catch (error) {
      console.error('Erro no cadastro:', error);
      res.status(500).json({
        success: false,
        error: error.code === 'ER_DUP_ENTRY' ? 'E-mail já cadastrado' : 'Erro no servidor'
      });
    }
  },

  async autenticar(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ success: false, error: "E-mail e senha são obrigatórios" });
      }

      const usuario = await usuarioModel.autenticar(email, senha);

      if (usuario) {
        res.json({ success: true, usuario });
      } else {
        res.status(401).json({ success: false, error: "Credenciais inválidas" });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ success: false, error: "Erro no servidor" });
    }
  }
};
