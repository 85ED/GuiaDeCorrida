const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
  waitForConnections: true,
  connectionLimit: 10
});

async function gravarProva(idusuario, nome) {
  const connection = await pool.getConnection();
  try {
    const comando = `
      INSERT INTO prova (idusuario, nome, distancia, data_prova, altimetria, modalidade)
      SELECT ?, nome, distancia, data_prova, altimetria, modalidade
      FROM provas_json
      WHERE nome = ?
    `;
    const [resultado] = await connection.execute(comando, [idusuario, nome]);
    return resultado;
  } finally {
    connection.release();
  }
}

async function listarProvasDoUsuario(idusuario) {
  const connection = await pool.getConnection();
  try {
    const [linhas] = await connection.execute(
      `SELECT nome, distancia, data_prova, altimetria, modalidade
       FROM prova
       WHERE idusuario = ?`,
      [idusuario]
    );
    return linhas;
  } finally {
    connection.release();
  }
}

module.exports = {
  gravarProva,
  listarProvasDoUsuario
};
