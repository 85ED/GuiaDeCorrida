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

      new TomSelect("#selecao_prova", {
        create: false,
        sortField: {
          field: "text",
          direction: "asc"
        },
        placeholder: "Selecione ou digite uma prova..."
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
});

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

  desenharGraficoChartJS(prova.labels, prova.elevacao);

  // Atualiza os botões
  var menuLinks = document.getElementById("menu_links");
  menuLinks.innerHTML = "";

  var conteudoInfo = document.getElementById("conteudo_info");
  conteudoInfo.innerHTML = "";

  var botoes = [];

  if (prova.tipo === "Asfalto") {
    botoes = ["Altimetria", "Pace", "Recorde Mundial", "Histórico"];
  } else if (prova.tipo === "Montanha") {
    botoes = ["Altimetria", "Técnicas de Subida", "Equipamentos", "Tempo Limite"];
  }

  botoes.forEach(function(botao) {
    var a = document.createElement("a");
    a.href = "#";
    a.textContent = botao;
    a.style.marginRight = "15px";
    a.style.textDecoration = "none";
    a.style.color = "#0a1f56";
    a.style.fontWeight = "bold";

    // Função ao clicar no botão
    a.addEventListener("click", function (e) {
      e.preventDefault();

      var texto = "";

      switch (botao) {
        case "Altimetria":
          texto = `A prova apresenta ${prova.altimetria} metros de altimetria acumulada.`;
          break;
        case "Pace":
          texto = "Use a calculadora de pace para planejar seu ritmo ideal para a distância.";
          break;
        case "Recorde Mundial":
          texto = "O recorde mundial de maratona masculina é 2h00m35s. Feminino é 2h11m53s.";
          break;
        case "Histórico":
          texto = `A prova ${prova.nome} é uma das mais tradicionais no calendário mundial.`;
          break;
        case "Técnicas de Subida":
          texto = "Em montanhas, use passos curtos e constantes para otimizar energia.";
          break;
        case "Equipamentos":
          texto = "Para provas de montanha, use tênis com tração, mochila de hidratação e corta-vento.";
          break;
        case "Tempo Limite":
          texto = "Provas de montanha geralmente exigem pace médio de até 12min/km com cortes em pontos.";
          break;
      }

      conteudoInfo.textContent = texto;
    });

    menuLinks.appendChild(a);
  });
}

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

function calcularPace() {
  const distancia = parseFloat(document.getElementById("ipt_distancia").value);
  const tempo = parseFloat(document.getElementById("ipt_tempo").value);

  if (!distancia || !tempo || distancia <= 0 || tempo <= 0) {
    document.getElementById("txt").textContent = "Insira valores válidos.";
    return;
  }

  const pace = tempo / distancia;
  const minutos = Math.floor(pace);
  const segundos = Math.round((pace - minutos) * 60);

  document.getElementById("txt").textContent =
    `Pace: ${minutos}m ${segundos.toString().padStart(2, '0')}s por km.`;
}

//historico das provas
// Função que pega só a parte antes do hífen e monta a URL da Wikipedia
function montarUrlWikipedia(nomeProva) {
  let nomeLimpo = nomeProva.split('-')[0].trim(); // só antes do '-'
  nomeLimpo = nomeLimpo.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); // remove acentos
  nomeLimpo = nomeLimpo.replace(/\s+/g, '_'); // espaços viram underline
  // Remove caracteres não alfanuméricos exceto _
  nomeLimpo = nomeLimpo.replace(/[^\w_]/g, '');
  return `https://pt.wikipedia.org/api/rest_v1/page/summary/${nomeLimpo}`;
}

// Função para buscar resumo da Wikipedia
async function buscarResumoWikipedia(nomeProva) {
  const url = montarUrlWikipedia(nomeProva);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Página não encontrada');
    const data = await res.json();
    return data.extract || 'Resumo não disponível.';
  } catch (error) {
    return 'Erro ao buscar resumo na Wikipedia.';
  }
}

// Exemplo de uso: quando clicar no botão "Histórico"
document.getElementById('btnHistorico').addEventListener('click', async () => {
  // Supondo que você tenha o id da prova selecionada no select
  const select = document.getElementById('selecao_prova');
  const idProva = select.value;
  if (!idProva) return alert('Selecione uma prova primeiro.');

  // Pegamos o nome da prova do seu JSON carregado (supondo que você tenha a variável provas carregada)
  const nomeProva = provas[idProva].nome;

  // Busca o resumo e mostra numa div (exemplo)
  const resumo = await buscarResumoWikipedia(nomeProva);
  document.getElementById('resumoHistorico').textContent = resumo;
});

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

// Executa cálculo padrão ao carregar
window.onload = function () {
  calcular_zona2();
};
