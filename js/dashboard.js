// Bug fix: o painel exibia valores fixos (hardcoded) que não refletiam os
// dados salvos. Agora os totais são calculados a partir das transações do
// JSON Server (GET) e renderizados ao abrir a página, com cor condicional.

$(document).ready(function () {
  // Formata um número como moeda brasileira (R$ 1.234,56).
  function formatarMoeda(valor) {
    return (
      'R$ ' +
      Number(valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    )
  }

  async function carregarResumo() {
    const usuario = JSON.parse(localStorage.getItem('loggedUser') || '{}')
    const usuarioId = usuario.id || '1'

    try {
      const transacoes = await getDados(`usuarios/${usuarioId}/transacoes`)

      // Soma receitas e despesas separadamente (Saldo = Receitas - Despesas).
      const receitas = transacoes
        .filter((t) => t.tipo === 'RECEITA')
        .reduce((soma, t) => soma + Number(t.valor), 0)
      const despesas = transacoes
        .filter((t) => t.tipo === 'DESPESA')
        .reduce((soma, t) => soma + Number(t.valor), 0)
      const saldo = receitas - despesas

      // Atualiza os valores na interface com base no estado real dos dados.
      $('#monthly-income').text(formatarMoeda(receitas))
      $('#monthly-expenses').text(formatarMoeda(despesas))

      // O saldo fica sobre fundo escuro com "R$" em span separado, então
      // exibe apenas o número; a cor muda condicionalmente se for negativo.
      $('#total-balance')
        .text(
          Number(saldo).toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        )
        .toggleClass('text-warning', saldo < 0)
    } catch (error) {
      // Sinaliza falha sem quebrar o restante da página.
      $('#total-balance').text('--')
      $('#monthly-income, #monthly-expenses').text('Indisponível')
      console.error('Falha ao carregar o resumo do dashboard:', error.message)
    }
  }

  // Critério ÚNICO de cor por progresso, compartilhado entre "Savings Goals"
  // e "Spending by Category": verde quando saudável (longe do limite),
  // amarelo ao se aproximar e vermelho quando alto/excedido.
  function corDeProgresso(percentual) {
    if (percentual > 80) return 'bg-danger'
    if (percentual > 50) return 'bg-warning'
    return 'bg-success'
  }

  // Conecta a cor de cada barra ao dado real (o próprio percentual = width),
  // substituindo as cores hardcoded sem lógica.
  function padronizarBarrasDeProgresso() {
    $('.progress-bar').each(function () {
      const percentual = parseFloat(this.style.width) || 0
      $(this)
        .removeClass(
          'bg-primary bg-secondary bg-warning bg-danger bg-success text-bg-secondary opacity-50'
        )
        .addClass(corDeProgresso(percentual))
    })
  }

  carregarResumo()
  padronizarBarrasDeProgresso()
})
