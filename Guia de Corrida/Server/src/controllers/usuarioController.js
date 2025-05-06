const usuarioModel = require("../models/usuarioModel");

function validarEmail(email) {
    return email.includes("@") && email.includes(".");
}

async function cadastrar(req, res) {
    const { nome, email, senha, confirmacaoSenha, codigo } = req.body;

    if (!validarEmail(email)) {
        return res.status(400).json({ error: "E-mail inválido" });
    }
    if (senha !== confirmacaoSenha) {
        return res.status(400).json({ error: "Senhas não coincidem" });
    }
    if (codigo !== "abc123") {
        return res.status(400).json({ error: "Código inválido" });
    }

    try {
        await usuarioModel.cadastrar(nome, email, senha);
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar: " + error.message });
    }
}

async function autenticar(req, res) {
    const { email, senha } = req.body;
    try {
        const usuario = await usuarioModel.autenticar(email, senha);
        if (usuario) {
            res.json({ success: true, usuario, redirect: "/dashboard.html" });
        } else {
            res.status(401).json({ error: "Credenciais inválidas" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro no servidor" });
    }
}

module.exports = { cadastrar, autenticar };