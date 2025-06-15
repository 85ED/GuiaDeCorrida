const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

// POST /usuarios/cadastrar
router.post("/cadastrar", usuarioController.cadastrar);

// POST /usuarios/autenticar
router.post("/autenticar", usuarioController.autenticar);

// POST /usuarios/recuperar-senha
router.post("/recuperar-senha", usuarioController.recuperarSenha);

// POST /usuarios/resetar-senha
router.post("/resetar-senha", usuarioController.resetarSenha);

module.exports = router;
