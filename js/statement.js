// ID 23: Busca as transações no JSON Server (GET) e as renderiza na tabela
// assim que a página é aberta.

$(document).ready(function () {
  const tbody = $('#transactions-body')
  const countLabel = $('#transactions-count')

  // Escapa texto vindo da API antes de injetar no HTML (evita XSS).
  function escaparHtml(texto) {
    return $('<div>')
      .text(texto ?? '')
      .html()
  }

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

  // Formata 'YYYY-MM-DD' como '01 mar. 2026' (sem problemas de fuso horário).
  function formatarData(data) {
    return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // Monta o HTML de uma linha da tabela.
  function montarLinha(transacao, saldoCorrente) {
    const ehReceita = transacao.tipo === 'RECEITA'
    const iconeWrap = ehReceita
      ? 'bg-secondary bg-opacity-10 p-2 rounded-circle text-secondary-custom d-flex'
      : 'bg-danger bg-opacity-10 p-2 rounded-circle text-danger d-flex'
    const icone = ehReceita ? 'arrow_upward' : 'arrow_downward'
    const corValor = ehReceita ? 'text-success' : 'text-tertiary-custom'
    const sinal = ehReceita ? '+' : '-'
    const rotuloTipo = ehReceita ? 'Receita' : 'Despesa'

    return `
      <tr>
        <td class="px-4 py-3">
          <div class="small fw-bold">${formatarData(transacao.data)}</div>
          <div class="small text-muted" style="font-size: 0.75rem">${(transacao.hora || '').slice(0, 5)}</div>
        </td>
        <td class="px-4 py-3">
          <div class="d-flex align-items-center gap-3">
            <div class="${iconeWrap}">
              <span class="material-symbols-outlined">${icone}</span>
            </div>
            <div>
              <div class="small fw-bold">${escaparHtml(transacao.descricao)}</div>
              <div class="small text-muted" style="font-size: 0.75rem">${rotuloTipo}</div>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 text-end">
          <div class="small fw-bold ${corValor}">${sinal} ${formatarMoeda(transacao.valor)}</div>
        </td>
        <td class="px-4 py-3 text-end">
          <div class="small fw-medium text-muted">${formatarMoeda(saldoCorrente)}</div>
        </td>
      </tr>`
  }

  // Renderiza uma mensagem ocupando a tabela inteira (vazio / erro).
  function renderizarMensagem(mensagem, classe = 'text-muted') {
    tbody.html(`<tr><td colspan="4" class="text-center ${classe} py-5">${mensagem}</td></tr>`)
  }

  // Guarda as transações já ordenadas e com o saldo corrente pré-calculado,
  // para que o filtro apenas selecione quais linhas exibir.
  let transacoesProcessadas = []

  // Renderiza a tabela aplicando o filtro de tipo: 'ALL', 'RECEITA' ou 'DESPESA'.
  function renderizar(filtro) {
    const visiveis =
      filtro === 'ALL'
        ? transacoesProcessadas
        : transacoesProcessadas.filter((t) => t.tipo === filtro)

    if (!visiveis.length) {
      countLabel.text('Nenhuma transação encontrada')
      renderizarMensagem('Nenhuma transação para este filtro.')
      return
    }

    // Exibe da mais recente para a mais antiga (o saldo já vem pré-calculado).
    tbody.html(
      [...visiveis]
        .reverse()
        .map((t) => montarLinha(t, t.saldoCorrente))
        .join('')
    )
    countLabel.text(`Exibindo ${visiveis.length} transações`)
  }

  // Ativa visualmente o botão de filtro selecionado.
  function ativarBotao(botao) {
    $('.filter-btn')
      .removeClass('btn-primary bg-opacity-10 text-primary-custom fw-bold')
      .addClass('btn-light bg-surface-low text-dark fw-medium')
    $(botao)
      .removeClass('btn-light bg-surface-low text-dark fw-medium')
      .addClass('btn-primary bg-opacity-10 text-primary-custom fw-bold')
  }

  $('.filter-btn').on('click', function () {
    ativarBotao(this)
    renderizar($(this).data('filter'))
  })

  // Carrega as transações do usuário logado e dispara a primeira renderização.
  async function carregarTransacoes() {
    const usuario = JSON.parse(localStorage.getItem('loggedUser') || '{}')
    const usuarioId = usuario.id || '1'

    try {
      const transacoes = await getDados(`usuarios/${usuarioId}/transacoes`)

      if (!transacoes.length) {
        countLabel.text('Nenhuma transação encontrada')
        renderizarMensagem('Você ainda não registrou nenhuma transação.')
        return
      }

      // Ordena da mais antiga para a mais recente e calcula o saldo corrente,
      // anexando-o a cada transação para que o filtro não o recalcule.
      let saldo = 0
      transacoesProcessadas = [...transacoes]
        .sort((a, b) => `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`))
        .map((t) => {
          saldo += t.tipo === 'RECEITA' ? Number(t.valor) : -Number(t.valor)
          return { ...t, saldoCorrente: saldo }
        })

      renderizar('ALL')
    } catch (error) {
      countLabel.text('Erro ao carregar')
      renderizarMensagem(error.message, 'text-danger')
    }
  }

  carregarTransacoes()
})
