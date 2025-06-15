const usuarioModel = require("../models/usuarioModel");
const enviarEmail = require("../utils/enviarEmail");
const crypto = require("crypto");

module.exports = {
  async cadastrar(req, res) {
    try {
      const { nome, email, telefone, senha } = req.body;

      if (!nome || !email || !telefone || !senha) {
        return res.status(400).json({
          success: false,
          error: "Todos os campos são obrigatórios"
        });
      }

      const resultado = await usuarioModel.cadastrar(nome, email, telefone, senha);
      res.json({ success: true, id: resultado.insertId });

    } catch (error) {
      console.error("Erro no cadastro:", error);
      res.status(500).json({
        success: false,
        error: error.code === "ER_DUP_ENTRY" ? "E-mail já cadastrado" : "Erro no servidor"
      });
    }
  },

  async autenticar(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          success: false,
          error: "E-mail e senha são obrigatórios"
        });
      }

      const usuario = await usuarioModel.autenticar(email, senha);

      if (usuario) {
        res.json({ success: true, usuario });
      } else {
        res.status(401).json({
          success: false,
          error: "Credenciais inválidas"
        });
      }
    } catch (error) {
      console.error("Erro no login:", error);
      res.status(500).json({
        success: false,
        error: "Erro no servidor"
      });
    }
  },

  async recuperarSenha(req, res) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "E-mail não informado." });
    }

    try {
      const [rows] = await usuarioModel.buscarPorEmail(email);

      if (rows.length === 0) {
        return res.status(200).json({ message: "Se existir, o e-mail será enviado." });
      }

      const usuario = rows[0];
      const token = crypto.randomBytes(32).toString("hex");
      const expiracao = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

      await usuarioModel.salvarTokenRecuperacao(usuario.idusuario, token, expiracao);

      const link = `https://seusite.com/resetar.html?token=${token}`;

      await enviarEmail(
        email,
        "Recupere sua senha",
        `Olá, ${usuario.nome}. Clique no link para redefinir sua senha:\n\n${link}\n\nEste link é válido por 1 hora.`
      );

      res.status(200).json({ message: "Se existir, o e-mail será enviado." });

    } catch (error) {
      console.error("Erro na recuperação de senha:", error);
      res.status(500).json({ error: "Erro ao processar recuperação." });
    }
  },

  async resetarSenha(req, res) {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      return res.status(400).json({ error: "Token ou nova senha ausentes." });
    }

    try {
      const [rows] = await usuarioModel.buscarPorToken(token);

      if (rows.length === 0) {
        return res.status(400).json({ error: "Token inválido ou expirado." });
      }

      const idusuario = rows[0].idusuario;
      await usuarioModel.redefinirSenha(idusuario, novaSenha);
      await usuarioModel.invalidarToken(token);

      res.status(200).json({ message: "Senha redefinida com sucesso." });
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      res.status(500).json({ error: "Erro ao redefinir senha." });
    }
  }
};
