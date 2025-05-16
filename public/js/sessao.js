function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;
    var id = sessionStorage.ID_USUARIO;

    if (email == null || nome == null || id == null) {
        // Redireciona para login se não houver sessão
        window.location = "./login.html";
    } else {
        // Preenche dados do usuário se necessário
        const b_usuario = document.getElementById("b_usuario");
        if (b_usuario) {
            b_usuario.innerHTML = nome;
        }
        const b_email = document.getElementById("b_email");
        if (b_email) {
            b_email.innerHTML = email;
        }
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "./login.html";
}

function aguardar() {
    const divAguardar = document.getElementById("div_aguardar");
    if (divAguardar) divAguardar.style.display = "block";
}

function finalizarAguardar(textoErro) {
    const divAguardar = document.getElementById("div_aguardar");
    if (divAguardar) divAguardar.style.display = "none";

    const divErros = document.getElementById("div_erros_login");
    if (divErros && textoErro) divErros.innerHTML = textoErro;
}
