const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10
});

// --- FUNÇÕES AUXILIARES ---

async function buscarPorEmail(email) {
  return await pool.query('SELECT * FROM usuario WHERE email = ?', [email]);
}

async function salvarTokenRecuperacao(idusuario, token, expiracao) {
  return await pool.query(
    'INSERT INTO recuperacao_senha (idusuario, token, expiracao) VALUES (?, ?, ?)',
    [idusuario, token, expiracao]
  );
}

async function buscarPorToken(token) {
  return await pool.query(
    `SELECT r.idusuario 
     FROM recuperacao_senha r 
     JOIN usuario u ON r.idusuario = u.idusuario 
     WHERE r.token = ? AND r.expiracao > NOW()`,
    [token]
  );
}

async function redefinirSenha(idusuario, novaSenha) {
  const hashSenha = await bcrypt.hash(novaSenha, 12);
  return await pool.query(
    'UPDATE usuario SET senha = ? WHERE idusuario = ?',
    [hashSenha, idusuario]
  );
}

async function invalidarToken(token) {
  return await pool.query(
    'DELETE FROM recuperacao_senha WHERE token = ?',
    [token]
  );
}

// --- MÉTODOS PRINCIPAIS ---

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
  },

  buscarPorEmail,
  salvarTokenRecuperacao,
  buscarPorToken,
  redefinirSenha,
  invalidarToken
};
