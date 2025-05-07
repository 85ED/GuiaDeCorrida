const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = {
  async cadastrar(nome, email, telefone, senha) {
    const connection = await pool.getConnection();
    try {
      const hashSenha = await bcrypt.hash(senha, 12);
      const [result] = await connection.execute(
        `INSERT INTO usuario (nome, email, telefone, senha) VALUES (?, ?, ?, ?)`,
        [nome, email, telefone, hashSenha]
      );
      return result;
    } finally {
      connection.release();
    }
  },

  async autenticar(email, senha) {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT idUsuario, nome, email, senha FROM usuario WHERE email = ?`,
        [email]
      );

      if (rows.length === 0) return null;

      const usuario = rows[0];
      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      return senhaValida
        ? { idUsuario: usuario.idUsuario, nome: usuario.nome, email: usuario.email }
        : null;
    } finally {
      connection.release();
    }
  }
};
