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
        placeholder: "Digite para buscar uma prova..."
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
    `Desafio - ${prova.nome} (${prova.data} - Faltam ${diferenca} dias)`;

  document.getElementById("distancia").textContent = `${prova.distancia} Km`;
  document.getElementById("altimetria").textContent = prova.altimetria;
  document.getElementById("temperatura").textContent = `${prova.temperatura}°C`;
  document.getElementById("modalidade").textContent = prova.tipo;

  desenharGraficoChartJS(prova.labels, prova.elevacao);
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