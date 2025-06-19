// bibliotecas necessárias
const express = require("express");
const path = require("path");
require("dotenv").config();
const cors = require('cors');
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares padrão
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// arquivos estáticos
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

// ROTAS
const usuarioRouter = require("./src/routes/usuarios");
app.use("/usuarios", usuarioRouter);

const provaRouter = require("./src/routes/provas");
app.use("/provas", provaRouter);

// página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// inicializando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// ----- TUDO RELACIONADO AO BOB (IA) -----

// configurando o Gemini (Google IA)
const chatIA = new GoogleGenAI({ apiKey: process.env.MINHA_CHAVE });

// servidor pronto para receber JSON
app.use(express.json());

// arquivos estáticos novamente (pode deixar)
app.use(express.static(path.join(__dirname, "public")));

// configuração CORS manual (reforço adicional)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
    next();
});

// rota da IA Bob
app.post("/perguntar", async (req, res) => {
    const pergunta = req.body.pergunta;

    try {
        const resultado = await gerarResposta(pergunta);
        res.json({ resultado });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// função da IA
async function gerarResposta(mensagem) {
    try {
        const modeloIA = chatIA.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `Em um paragráfo responda: ${mensagem}`
        });

        const resposta = (await modeloIA).text;
        const tokens = (await modeloIA).usageMetadata;

        console.log(resposta);
        console.log("Uso de Tokens:", tokens);

        return resposta;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
