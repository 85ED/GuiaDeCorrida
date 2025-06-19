const API_URL = 'https://guiadecorrida-production.up.railway.app';

/* ===== Troca de telas ===== */
function mostrarLogin() {
  document.getElementById("formCadastro").style.display = "none";
  document.getElementById("formLogin").style.display = "flex";
  esconderMensagens();
}

function mostrarCadastro() {
  document.getElementById("formLogin").style.display = "none";
  document.getElementById("formCadastro").style.display = "flex";
  esconderMensagens();
}

/* ===== Limpa mensagens ===== */
function esconderMensagens() {
  document.getElementById("mensagem_erro_cadastro").style.display = "none";
  document.getElementById("mensagem_sucesso_cadastro").style.display = "none";
  document.getElementById("mensagem_erro_login").style.display = "none";
  document.getElementById("mensagem_sucesso_login").style.display = "none";
}

/* ===== Helpers de mensagem ===== */
function mostrarErroCadastro(msg) {
  const div = document.getElementById("mensagem_erro_cadastro");
  div.innerHTML = msg;
  div.style.display = "block";
  setTimeout(() => (div.style.display = "none"), 5000);
}

function mostrarSucessoCadastro(msg) {
  const div = document.getElementById("mensagem_sucesso_cadastro");
  div.innerHTML = msg;
  div.style.display = "block";
  setTimeout(() => (div.style.display = "none"), 5000);
}

function mostrarErroLogin(msg) {
  const div = document.getElementById("mensagem_erro_login");
  div.innerHTML = msg;
  div.style.display = "block";
  setTimeout(() => (div.style.display = "none"), 5000);
}

function mostrarSucessoLogin(msg) {
  const div = document.getElementById("mensagem_sucesso_login");
  div.innerHTML = msg;
  div.style.display = "block";
  setTimeout(() => (div.style.display = "none"), 5000);
}

/* ===== Destacar campo com erro ===== */
function marcarErroCampo(idInput) {
  const campo = document.getElementById(idInput);
  campo.classList.add("erro");
  campo.addEventListener("input", () => {
    campo.classList.remove("erro");
  }, { once: true });
}

/* ===== Cadastro ===== */
function cadastro() {
  const dados = {
    nome: document.getElementById("iptNome").value.trim(),
    email: document.getElementById("iptEmail").value.trim(),
    telefone: document.getElementById("iptTelefone").value.trim(),
    senha: document.getElementById("iptSenha").value,
    confirmacaoSenha: document.getElementById("iptConfirmacaoSenha").value,
  };

  if (!dados.nome) {
    mostrarErroCadastro("Informe seu nome completo.");
    marcarErroCampo("iptNome");
    return;
  }

  if (!dados.email) {
    mostrarErroCadastro("Informe seu e-mail.");
    marcarErroCampo("iptEmail");
    return;
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValido.test(dados.email)) {
    mostrarErroCadastro("E-mail no formato inválido.");
    marcarErroCampo("iptEmail");
    return;
  }

  if (!dados.telefone) {
    mostrarErroCadastro("Informe seu telefone celular.");
    marcarErroCampo("iptTelefone");
    return;
  }

  if (!dados.senha) {
    mostrarErroCadastro("Crie uma senha.");
    marcarErroCampo("iptSenha");
    return;
  }

  if (!dados.confirmacaoSenha) {
    mostrarErroCadastro("Confirme sua senha.");
    marcarErroCampo("iptConfirmacaoSenha");
    return;
  }

  if (dados.senha !== dados.confirmacaoSenha) {
    mostrarErroCadastro("As senhas não coincidem.");
    marcarErroCampo("iptSenha");
    marcarErroCampo("iptConfirmacaoSenha");
    return;
  }

  const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!regexSenha.test(dados.senha)) {
    mostrarErroCadastro("A senha deve ter 8+ caracteres, 1 letra maiúscula, 1 número e 1 símbolo.");
    marcarErroCampo("iptSenha");
    return;
  }

  fetch(`${API_URL}/usuarios/cadastrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  })
    .then(response =>
      response.json().then(resultado => {
        if (!response.ok) throw resultado;
        mostrarSucessoCadastro("Cadastro realizado com sucesso!");
        alert("Cadastro realizado com sucesso!");
        mostrarLogin();
      })
    )
    .catch(error =>
      mostrarErroCadastro(error.error || "Erro durante o cadastro.")
    );
}

/* ===== Login ===== */
function fazerLogin() {
  const dados = {
    email: document.getElementById("loginEmail").value.trim(),
    senha: document.getElementById("loginSenha").value,
  };

  if (!dados.email) {
    mostrarErroLogin("Informe seu e-mail.");
    marcarErroCampo("loginEmail");
    return;
  }

  if (!dados.senha) {
    mostrarErroLogin("Informe sua senha.");
    marcarErroCampo("loginSenha");
    return;
  }

  fetch(`${API_URL}/usuarios/autenticar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  })
    .then(response =>
      response.json().then(resultado => {
        if (resultado.success && resultado.usuario) {
          sessionStorage.NOME_USUARIO = resultado.usuario.nome;
          sessionStorage.EMAIL_USUARIO = resultado.usuario.email;
          sessionStorage.ID_USUARIO = resultado.usuario.idUsuario;

          mostrarSucessoLogin("Login realizado! Redirecionando...");
          setTimeout(() => (window.location.href = "/pre_dashboard.html"), 2000);
        } else {
          throw resultado;
        }
      })
    )
    .catch(error => mostrarErroLogin(error.error || "Falha no login."));
}

/* ===== Recuperação de Senha ===== */
function mostrarRecuperacao() {
  document.getElementById("bloco_botao_recuperar").style.display = "none";
  document.getElementById("areaRecuperacao").classList.remove("hidden");
}

function recuperarSenha() {
  const email = document.getElementById("recuperarEmail").value.trim();
  const divMsg = document.getElementById("mensagem_recuperacao");

  if (!email) {
    divMsg.innerHTML = "Informe seu e-mail.";
    divMsg.style.color = "red";
    divMsg.style.display = "block";
    return;
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValido.test(email)) {
    divMsg.innerHTML = "Formato de e-mail inválido.";
    divMsg.style.color = "red";
    divMsg.style.display = "block";
    return;
  }

  fetch(`${API_URL}/usuarios/recuperar-senha`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
    .then(res => res.json())
    .then(resposta => {
      divMsg.innerHTML = "Se o e-mail estiver cadastrado, você receberá instruções.";
      divMsg.style.color = "green";
      divMsg.style.display = "block";
    })
    .catch(() => {
      divMsg.innerHTML = "Erro ao tentar recuperar senha.";
      divMsg.style.color = "red";
      divMsg.style.display = "block";
    });
}

function toggleMenu() {
  var menu = document.getElementById('menu');
  menu.classList.toggle('show');
}
