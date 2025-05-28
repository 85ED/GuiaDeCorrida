document.addEventListener("DOMContentLoaded", () => {
  const localizacao = document.getElementById("localizacao");
  const selectProva = document.getElementById("selecao_prova");

  const dataAtual = new Date().toLocaleDateString("pt-BR");
  localizacao.textContent = `São Paulo, ${dataAtual}`;

  // vetor pra dar bom dia, boa tarde e boa noite
  const mensagens = ["Boa noite", "Bom dia", "Boa tarde", "Boa noite"];
  const hora = new Date().getHours();
  var saudacao = "";

  if (hora >= 6 && hora < 12) {
    saudacao = mensagens[1];
  } else if (hora >= 12 && hora < 18) {
    saudacao = mensagens[2];
  } else if (hora >= 0 && hora < 6) {
    saudacao = mensagens[0];
  } else {
    saudacao = mensagens[3];
  }

  const intervalo = setInterval(() => {
    const nomeUsuario = document.getElementById("b_usuario")?.innerText;
    if (nomeUsuario) {
      const saudacaoCompleta = `${saudacao}, ${nomeUsuario}. Seja bem-vindo(a) ao Guia de Corrida!`;
      const el = document.getElementById("saudacao_usuario");
      if (el) el.textContent = saudacaoCompleta;
      clearInterval(intervalo);
    }
  }, 100);

  fetch("./data/provas.json")
    .then((res) => res.json())
    .then((provas) => {
      // Preenche o dropdown
      const idsOrdenados = Object.keys(provas).sort((a, b) => {
        return provas[a].nome.localeCompare(provas[b].nome);
      });
      // Adiciona as opções ordenadas
      idsOrdenados.forEach((id) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = provas[id].nome.trim();
        selectProva.appendChild(option);
      });

      // campo de pesquisa das provas
      new TomSelect("#selecao_prova", {
        create: false,
        sortField: {
          field: "text",
          direction: "asc"
        },
        placeholder: "Digite ou selecione uma uma prova..."
      });

      // Atualiza os dados na primeira prova como padrão
      atualizarProva(provas, Object.keys(provas)[0]);

      // Adiciona o evento de troca de prova
      selectProva.addEventListener("change", () => {
        const idSelecionado = selectProva.value;
        atualizarProva(provas, idSelecionado);
      });
    })
    .catch((erro) => {
      console.error("Erro ao carregar o JSON:", erro);
    });

  // Executa cálculo da zona 2 ao carregar
  calcular_zona2();
});

function desenharGraficoChartJS(labels, dados) {
  const ctx = document.getElementById("graficoAltimetria").getContext("2d");

  if (window.meuGrafico) {
    window.meuGrafico.destroy();
  }

  window.meuGrafico = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        data: dados,
        borderColor: "blue",
        backgroundColor: "lightblue",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "Distância e Altimetria Acumulada",
          font: {
            size: 18
          },
          color: "#0a1f56",
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
            text: "Distância em Quilômetros (km)"
          }
        },
        y: {
          title: {
            display: true,
            text: "Altimetria em Metros (m)"
          }
        }
      }
    }
  });
}

var ultimaProvaExibida = null;

function atualizarProva(provas, id) {
  const prova = provas[id];
  const hoje = new Date();
  const [dia, mes, ano] = prova.data.split("/").map(Number);
  const dataProva = new Date(ano, mes - 1, dia);
  const diferenca = Math.ceil((dataProva - hoje) / (1000 * 60 * 60 * 24));

  document.getElementById("proximo_desafio").textContent =
    `Prova: ${prova.nome} (${prova.data}, faltam ${diferenca} dias)`;

  document.getElementById("distancia").textContent = `${prova.distancia} Km`;
  document.getElementById("altimetria").textContent = prova.altimetria;
  document.getElementById("temperatura").textContent = `${prova.temperatura}°C`;
  document.getElementById("modalidade").textContent = prova.tipo;

  ultimaProvaExibida = prova;

  desenharGraficoChartJS(prova.labels, prova.elevacao);

  // planejamento antes da prova e execucao

  var menuLinks = document.getElementById("menu_links");
  menuLinks.innerHTML = "";

  var conteudoInfo = document.getElementById("conteudo_info");
  conteudoInfo.innerHTML = "";

  var botoes = [];

  if (prova.tipo === "Asfalto") {
    botoes = ["Sobre a Prova (IA)", "Pace", "Recorde Mundial", "Treino"];
  } else if (prova.tipo === "Montanha") {
    botoes = ["Sobre a Prova (IA)", "Técnicas de Subida", "Equipamentos", "Treino"];
  }

  botoes.forEach(function (botao) {
    var a = document.createElement("a");
    a.href = "#";
    a.textContent = botao;

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

      switch (botao) {
        case "Sobre a Prova (IA)":
          conteudoInfo.textContent = "Consultando IA sobre a prova...";
          gerarResposta(`Em um parágrafo fale sobre a prova ${prova.nome}`)
            .then(function (respostaIA) {
              conteudoInfo.textContent = respostaIA;
            })
            .catch(function () {
              conteudoInfo.textContent = `A prova ${prova.nome} é uma das mais importantes no mundo da corrida.`;
            });
          return;
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

              var indice = Math.floor(treinoRandomico * treinosFiltrados.length);
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

  var conteudoInf = document.getElementById("recupera_info");
  conteudoInf.innerHTML = "";

  var opcoes = [];

  if (prova.tipo === "Asfalto") {
    opcoes = ["Análise de Desempenho (IA)", "Cuidados Pós Prova", "Descanso Ativo", "Entender Como Você Foi"];
  } else if (prova.tipo === "Montanha") {
    opcoes = ["Análise de Desempenho (IA)", "Relaxar o Corpo", "Descanso Ativo", "Aprender com a Experiência"];
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
        case "Sobre a Prova (IA)":
          conteudoInf.textContent = "Consultando IA sobre a prova...";
          gerarResposta(`Em um parágrafo fale sobre a prova ${prova.nome}`)
            .then(function (respostaIA) {
              conteudoInf.textContent = respostaIA;
            })
            .catch(function () {
              conteudoInf.textContent = `A prova ${prova.nome} é uma das mais importantes no mundo da corrida.`;
            });
          return;
        case "Cuidados Pós Prova":
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

// inserir prova

function inserirProva() {
  if (!ultimaProvaExibida) {
    alert("Nenhuma prova selecionada.");
    return;
  }

  var prova = ultimaProvaExibida;

  // Formata a data no formato YYYY-MM-DD
  var [dia, mes, ano] = prova.data.split("/");
  var dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

  // Cria uma nova div com as informações da prova
  var novaDiv = document.createElement("div");
  novaDiv.textContent = `${prova.nome} - ${prova.distancia} km - ${prova.tipo} - ${dataFormatada}`;
  document.getElementById("provas_gravadas").appendChild(novaDiv);

  // Salva localmente (opcional)
  var provasSalvas = JSON.parse(localStorage.getItem("provasGravadas")) || [];
  provasSalvas.push({
    nome: prova.nome,
    distancia: prova.distancia,
    tipo: prova.tipo,
    data: dataFormatada,
    altimetria: prova.altimetria
  });
  localStorage.setItem("provasGravadas", JSON.stringify(provasSalvas));

  alert("Prova gravada com sucesso!");
}


