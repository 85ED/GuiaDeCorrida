document.addEventListener("DOMContentLoaded", () => {
  // Isso aqui roda quando a página termina de carregar
  const localizacao = document.getElementById("localizacao");
  const selectProva = document.getElementById("selecao_prova");
  var ultimaProvaExibida = null; // Guarda qual prova tá mostrando agora

  // Mostra a data atual bonitinha no cabeçalho
  const dataAtual = new Date().toLocaleDateString("pt-BR");
  localizacao.textContent = `São Paulo, ${dataAtual}`;

  // Verifica que horas são pra dar bom dia/boa tarde
  const mensagens = ["Boa noite", "Bom dia", "Boa tarde", "Boa noite"];
  const hora = new Date().getHours();
  var saudacao = "";

  function obterSaudacao(hora) {
    if (hora >= 6 && hora < 12) return "Bom dia";
    if (hora >= 12 && hora < 18) return "Boa tarde";
    if (hora >= 0 && hora < 6) return "Boa noite";
    return "Boa noite";
  }

  var saudacao = obterSaudacao(hora);

  // Procura o nome do usuário pra dar a mensagem de boas-vindas
  const intervalo = setInterval(() => {
    const nomeUsuario = document.getElementById("b_usuario")?.innerText;
    if (nomeUsuario) {
      const saudacaoCompleta = `${saudacao}, ${nomeUsuario}. Seja bem-vindo(a) ao Guia de Corrida!`;
      const el = document.getElementById("saudacao_usuario");
      if (el) el.textContent = saudacaoCompleta;
      clearInterval(intervalo);
    }
  }, 100); // Tenta achar o nome 10x por segundo

  fetch("./data/provas.json")
    // Quando a resposta chega, converte o conteúdo para um objeto JavaScript
    .then((res) => res.json())
    .then((provas) => {
      // Primeiro, pegamos todos os IDs das provas e colocamos em ordem alfabética pelo nome
      const idsOrdenados = Object.keys(provas).sort((a, b) => {
        // Aqui comparamos os nomes das provas para deixar a lista organizada no select
        return provas[a].nome.localeCompare(provas[b].nome);
      });

      // Agora, para cada prova ordenada, criamos uma opção no seletor de provas
      idsOrdenados.forEach((id) => {
        const option = document.createElement("option");      // Cria o elemento <option>
        option.value = id;                                    // Define o valor como o ID da prova
        option.textContent = provas[id].nome.trim();          // Mostra o nome da prova como texto visível
        selectProva.appendChild(option);                      // Adiciona essa opção no <select> da tela
      });

      // Transforma o select numa caixa de pesquisa chique
      new TomSelect("#selecao_prova", {
        create: false,
        sortField: {
          field: "text",
          direction: "asc"
        },
        placeholder: "Digite ou selecione uma uma prova..."
      });

      // Mostra a primeira prova como padrão
      atualizarProva(provas, Object.keys(provas)[0]);

      // Atualiza quando muda a prova selecionada
      selectProva.addEventListener("change", () => {
        const idSelecionado = selectProva.value;
        atualizarProva(provas, idSelecionado);
      });
    })
    .catch((erro) => {
      console.error("Erro ao carregar o JSON:", erro);
    });

});
// Desenha o gráfico de altimetria
// Essa função desenha um gráfico usando a biblioteca Chart.js
// Ela recebe dois parâmetros: `labels` (para o eixo X) e `dados` (para o eixo Y)
function desenharGraficoChartJS(labels, dados) {
  // Aqui pegamos o contexto do canvas onde o gráfico será desenhado
  const ctx = document.getElementById("graficoAltimetria").getContext("2d");

  // Se já existir um gráfico desenhado antes, destruímos ele pra não sobrepor
  if (window.meuGrafico) {
    window.meuGrafico.destroy();
  }

  // Criamos um novo gráfico do tipo linha
  window.meuGrafico = new Chart(ctx, {
    type: "line", // Tipo de gráfico: linha

    // Aqui definimos os dados que serão exibidos no gráfico
    data: {
      labels: labels, // Rótulos no eixo X (ex: km 1, km 2, etc)
      datasets: [{
        data: dados, // Valores no eixo Y (ex: altimetria acumulada)
        borderColor: "blue", // Cor da linha
        backgroundColor: "lightblue", // Cor de fundo da área sob a linha
        fill: true, // Preenche a área sob a linha
        tension: 0.4 // Deixa a curva suave (0 = linha reta entre os pontos)
      }]
    },

    // Opções de aparência e comportamento do gráfico
    options: {
      responsive: true, // Faz o gráfico se adaptar ao tamanho da tela
      plugins: {
        legend: {
          display: false // Esconde a legenda (já que só tem uma linha)
        },
        title: {
          display: true,
          text: "Distância e Altimetria Acumulada", // Título do gráfico
          font: {
            size: 18
          },
          color: "#0a1f56", // Cor do título
          padding: {
            top: 10,
            bottom: 20
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Distância em Quilômetros (km)" // Título do eixo X
          }
        },
        y: {
          title: {
            display: true,
            text: "Altimetria em Metros (m)" // Título do eixo Y
          }
        }
      }
    }
  });
}

var conteudoInfo = null; // para os botões de planejamento BobIA
var conteudoInf = null;  // para os botões de recuperação BobIA

// Atualiza todas as informações quando muda a prova
function atualizarProva(provas, id) {
  const prova = provas[id];
  // Calcula quantos dias faltam pra prova
  // Exemplo: se a data da prova for "21/04/2026"
  // 1. .split("/") divide em partes: ["21", "04", "2026"]
  // 2. map(Number) transforma em números: [21, 4, 2026]
  const [dia, mes, ano] = prova.data.split("/").map(Number);
  // 3. Cria uma data no formato que o JavaScript entende (mês começa do zero)
  //    Ex: new Date(2026, 3, 21) significa 21 de abril de 2026
  const dataProva = new Date(ano, mes - 1, dia);
  // 4. Pega a data de hoje
  var hoje = new Date();
  // 5. Subtrai a data da prova menos a data de hoje (em milissegundos)
  // 6. Divide esse número para transformar em dias
  //    1000 ms * 60 s * 60 min * 24 h = total de milissegundos em 1 dia
  // 7. Math.ceil arredonda pra cima, pois 2,3 dias ainda são 3 dias faltando
  const diferenca = Math.ceil((dataProva - hoje) / (1000 * 60 * 60 * 24));
  // Resultado: se hoje for 18/04/2026, o resultado será 3
  // Atualiza o card principal
  document.getElementById("proximo_desafio").textContent =
    `Prova: ${prova.nome} (${prova.data})`;

  document.getElementById("distancia").textContent = `${prova.distancia} Km`;
  document.getElementById("altimetria").textContent = prova.altimetria;
  document.getElementById("temperatura").textContent = `${prova.temperatura}°C`;
  document.getElementById("modalidade").textContent = prova.tipo;

  ultimaProvaExibida = prova;

  // Atualiza o gráfico
  desenharGraficoChartJS(prova.labels, prova.elevacao);

  // planejamento antes da prova e execucao
  var menuLinks = document.getElementById("menu_links");
  menuLinks.innerHTML = "";

  conteudoInfo = document.getElementById("conteudo_info"); // texto inicial da IA
  conteudoInfo.innerHTML = "";

  var botoes = [];
  // Escolhe os botões conforme o tipo de prova
  if (prova.tipo === "Asfalto") {
    botoes = ["Sobre a Prova (IA)", "Pace", "Recorde Mundial", "Treino"];
  } else if (prova.tipo === "Montanha") {
    botoes = ["Sobre a Prova (IA)", "Técnicas de Subida", "Equipamentos", "Treino"];
  }
  // pra cada item da lista botoes, cria um botão com aquele nome e coloca ele na tela
  botoes.forEach(function (botao) {
    var a = document.createElement("a");
    a.href = "#";
    a.textContent = botao;
    // estudando usar estilo direto pelo js
    a.style.marginRight = "10px";
    a.style.marginBottom = "10px";
    a.style.marginRight = "10px";
    a.style.textDecoration = "none";
    a.style.color = "#0a1f56";
    a.style.border = "1px solid #0a1f56";
    a.style.padding = "6px 12px";
    a.style.borderRadius = "4px";
    a.style.cursor = "pointer";

    // hover .. esse mouseenter e mouseleave eh do proprio dom
    a.addEventListener("mouseenter", function () {
      a.style.backgroundColor = "#f0f0f0";
    });

    a.addEventListener("mouseleave", function () {
      a.style.backgroundColor = "transparent";
    });
    // O que acontece quando clica em cada botão
    a.addEventListener("click", function (e) {
      e.preventDefault();

      var texto = "";
      var treinoRandomico = Math.random();

      switch (botao) {
        case "Sobre a Prova (IA)":
          conteudoInfo.textContent = "Consultando IA sobre a prova...";
          var nomeUsuario = document.getElementById("b_usuario")?.innerText || "o corredor";
          gerarResposta(`Em um parágrafo, fale para ${nomeUsuario} sobre a prova ${prova.nome}.`)
            .then(function (respostaIA) {
              conteudoInfo.textContent = respostaIA;
            })
            .catch(function () {
              conteudoInfo.textContent = `A prova ${prova.nome} é uma das mais importantes no mundo da corrida.`;
            });
          return;
        // Respostas fixas para os outros botões
        case "Pace":
          texto = "Use a calculadora de pace logo abaixo para planejar seu ritmo ideal para a distância.";
          break;
        case "Recorde Mundial":
          texto = "O recorde mundial de maratona masculina é 2h00m35s. Feminino é 2h11m53s.";
          break;
        case "Técnicas de Subida":
          texto = "Em montanhas, use passos curtos e constantes para otimizar energia.";
          break;
        case "Equipamentos":
          texto = "Para provas de montanha, use tênis com tração, mochila de hidratação e corta-vento.";
          break;
        case "Treino":
          fetch("./data/treinos.json")
            .then(function (res) {
              return res.json();
            })
            .then(function (treinos) {
              var treinosFiltrados = treinos.filter(function (t) {
                return t.tipo === prova.tipo;
              });
              // Pega um treino aleatório do JSON
              var indice = Math.floor(Math.random() * treinosFiltrados.length);
              var treinoSelecionado = treinosFiltrados[indice];

              conteudoInfo.textContent = treinoSelecionado
                ? treinoSelecionado.treino
                : "Nenhum treino disponível para esta modalidade.";
            })
            .catch(function () {
              conteudoInfo.textContent = "Erro ao carregar os treinos.";
            });
          return;
      }

      conteudoInfo.textContent = texto;
    });

    menuLinks.appendChild(a);
  });

  // recuperacao depois da prova ou no dia a dia

  var menuLink = document.getElementById("menu_recupera");
  menuLink.innerHTML = "";

  conteudoInf = document.getElementById("recupera_info"); // texto inicial da IA
  conteudoInf.innerHTML = "";

  var opcoes = [];

  if (prova.tipo === "Asfalto") {
    opcoes = ["Recuperação pós Prova (IA)", "Cuidados Essenciais", "Descanso Ativo", "Entender Como Você Foi"];
  } else if (prova.tipo === "Montanha") {
    opcoes = ["Recuperação pós Prova (IA)", "Relaxar o Corpo", "Descanso Ativo", "Aprender com a Experiência"];
  }

  opcoes.forEach(function (opcao) {
    var a = document.createElement("a");
    a.href = "#";
    a.textContent = opcao;

    a.style.marginRight = "10px";
    a.style.marginBottom = "10px";
    a.style.marginRight = "10px";
    a.style.textDecoration = "none";
    a.style.color = "#0a1f56";
    a.style.border = "1px solid #0a1f56";
    a.style.padding = "6px 12px";
    a.style.borderRadius = "4px";
    a.style.cursor = "pointer";

    // hover .. esse mouseenter e mouseleave eh do proprio dom
    a.addEventListener("mouseenter", function () {
      a.style.backgroundColor = "#f0f0f0";
    });

    a.addEventListener("mouseleave", function () {
      a.style.backgroundColor = "transparent";
    });

    a.addEventListener("click", function (e) {
      e.preventDefault();

      var texto = "";
      var treinoRandomico = Math.random();

      switch (opcao) {
        case "Recuperação pós Prova (IA)":
          conteudoInf.textContent = "Consultando IA sobre uma recuperação adequada...";
          var nomeUsuario = document.getElementById("b_usuario")?.innerText || "o corredor";
          gerarResposta(`Em um parágrafo, diga para ${nomeUsuario} como se recuperar da prova ${prova.nome}.`)
            .then(function (respostaIA) {
              conteudoInf.textContent = respostaIA;
            })
            .catch(function () {
              conteudoInf.textContent = `A prova ${prova.nome} é uma das mais importantes no mundo da corrida.`;
            });
          return;
        case "Cuidados Essenciais":
          texto = "Tudo o que você faz na primeira hora conta muito: Comer algo leve com proteína e carboidrato (como frango com batata - doce). Alongar suavemente as pernas e costas. Usar gelo nas articulações para aliviar o impacto. Depois da prova, o corpo precisa de pausa de qualidade: Dormir bem na noite seguinte à prova. Beber bastante água ou isotônico para se hidratar. Fazer uma caminhada leve no dia seguinte para ajudar a soltar a musculatura.";
          break;
        case "Relaxar o Corpo":
          texto = "Depois de tanto sobe e desce, o corpo pede cuidado: Dormir bastante para recuperar a energia. Fazer exercícios leves como respiração ou alongamentos tranquilos. Comer bem, incluindo frutas, vegetais e alimentos que ajudem a combater o cansaço. A montanha exige muito — é hora de devolver:Beber líquidos com sais minerais (como água de coco ou isotônicos). Caminhar devagar no dia seguinte para ativar a circulação. Usar compressas frias em locais doloridos.";
          break;
        case "Entender Como Você Foi":
          texto = "Refletir é tão importante quanto correr: Veja como foi seu ritmo, hidratação e estratégia ao longo da prova. Reflita sobre o que funcionou e o que pode ser melhorado (tênis, roupa, alimentação, clima, ansiedade). Anote tudo em um caderno de treinos ou diário de corrida: estudos mostram que o ato de escrever ajuda o cérebro a consolidar aprendizados e identificar padrões. Isso te ajuda a ajustar treinos futuros e fazer escolhas mais conscientes no próximo desafio.";
          break;
        case "Aprender com a Experiência":
          texto = "Cada prova ensina algo: Pense nos trechos mais exigentes: onde cansou mais? Onde sentiu mais confiança? Avalie se o equipamento foi adequado para o terreno e clima..Escreva suas percepções em um caderno de corrida: a escrita reflexiva, comprovada por pesquisas em neurociência, ativa áreas do cérebro ligadas à memória e ao planejamento. Com isso, você evolui com propósito e se prepara melhor para a próxima trilha.";
          break;
        case "Descanso Ativo":
          fetch("./data/treinos.json")
            .then(function (res) {
              return res.json();
            })
            .then(function (treinos) {
              var treinosFiltrados = treinos.filter(function (t) {
                return t.tipo === prova.tipo;
              });

              var indice = Math.floor(treinoRandomico * treinosFiltrados.length);
              var treinoSelecionado = treinosFiltrados[indice];

              conteudoInf.textContent = treinoSelecionado
                ? treinoSelecionado.treino
                : "Nenhum treino disponível para esta modalidade.";
            })
            .catch(function () {
              conteudoInf.textContent = "Erro ao carregar os treinos.";
            });
          return;
      }

      conteudoInf.textContent = texto;
    });

    menuLink.appendChild(a);
  });

}

function calcularPace() {
  var distancia = parseFloat(document.getElementById('ipt_distancia').value);
  var tempo = parseFloat(document.getElementById('ipt_tempo').value);
  if (!isNaN(distancia) && distancia > 0 && !isNaN(tempo) && tempo > 0) {
    var pace = tempo / distancia;
    var minutos = Math.floor(pace);
    var segundos = Math.round((pace - minutos) * 60);
    if (segundos < 10) {
      segundos = `0${segundos}`;
    }
    document.getElementById('txt').innerText = `Pace: ${minutos}:${segundos} min/km`;
  } else {
    document.getElementById('txt').innerText = `Preencha todos os campos corretamente.`;
  }
}

function calcular_zona2() {
  var idade = parseInt(document.getElementById('idade_input').value);
  if (!isNaN(idade) && idade > 0) {
    var fcmax = 220 - idade;
    var fcrepouso = 60;
    var fcr = fcmax - fcrepouso;
    var z2_min = Math.round((fcr * 0.6) + fcrepouso);
    var z2_max = Math.round((fcr * 0.7) + fcrepouso);

    document.getElementById('fcmax').innerText = fcmax;
    document.getElementById('z2').innerText = `${z2_min} a ${z2_max} bpm`;
  }
}

// bobia.js
async function gerarResposta(pergunta) {
  const response = await fetch('/perguntar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pergunta })
  });

  const data = await response.json();
  return data.resultado;
}

// vincular prova ao usuario

function gravarProva() {
  var idusuario = sessionStorage.ID_USUARIO;
  if (!idusuario) {
    alert("Usuário não logado.");
    return;
  }

  if (!ultimaProvaExibida || !ultimaProvaExibida.nome) {
    alert("Nenhuma prova selecionada.");
    return;
  }

  var dados = {
    idusuario: idusuario,
    nome: ultimaProvaExibida.nome
  };

  fetch('http://localhost:3000/provas/gravar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dados)
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (resposta) {
      if (resposta.mensagem) {
        alert(resposta.mensagem);
      } else {
        alert("Erro ao gravar prova.");
        console.error(resposta);
      }
    })
    .catch(function (erro) {
      console.error("Erro na requisição:", erro);
      alert("Falha ao enviar dados.");
    });
}

function carregarProvasGravadas() {
  var idusuario = sessionStorage.ID_USUARIO;
  if (!idusuario) {
    alert("Usuário não logado.");
    return;
  }

  fetch(`http://localhost:3000/provas/usuario/${idusuario}`)
    .then(function (res) {
      return res.json();
    })
    .then(function (provas) {
      var container = document.getElementById("lista_provas_usuario");
      if (!container) return;

      container.innerHTML = "";

      if (provas.length === 0) {
        container.innerHTML = "<p>Você ainda não gravou nenhuma prova.</p>";
        return;
      }

      provas.forEach(function (prova) {
        var item = document.createElement("div");
        item.style.marginBottom = "10px";
        item.textContent = `${prova.nome} (${prova.data_prova}) - ${prova.distancia} km | ${prova.modalidade}`;
        container.appendChild(item);
      });
    })
    .catch(function (erro) {
      console.error("Erro ao buscar provas do usuário:", erro);
    });
}
