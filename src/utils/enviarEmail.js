const nodemailer = require('nodemailer');

async function enviarEmail(destinatario, assunto, conteudo) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log('SMTP conectado com sucesso.');

    await transporter.sendMail({
      from: `"Guia de Corrida" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: assunto,
      text: conteudo
    });

    console.log(`E-mail enviado para ${destinatario}`);
  } catch (erro) {
    console.error('Erro ao enviar e-mail:', erro);
    throw erro; 
  }
}

module.exports = enviarEmail;
