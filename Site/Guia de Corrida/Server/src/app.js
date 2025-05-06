const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
const usuarioRouter = require("./src/routes/usuarios");
app.use("/usuarios", usuarioRouter);

// Servir arquivos estáticos (front-end)
app.use(express.static(path.join(__dirname, "..")));

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});