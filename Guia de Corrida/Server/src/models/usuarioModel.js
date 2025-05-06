const mysql = require("mysql2/promise");

async function cadastrar(nome, email, senha) {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

    const [results] = await connection.execute(
        "INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, senha]
    );
    return results;
}

async function autenticar(email, senha) {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

    const [rows] = await connection.execute(
        "SELECT idUsuario, nome, nivel FROM usuario WHERE email = ? AND senha = ?",
        [email, senha]
    );
    return rows[0];
}

module.exports = { cadastrar, autenticar };