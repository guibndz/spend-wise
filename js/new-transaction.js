// ID 22: Intercepta o submit do formulário de transação, valida os dados e
// persiste no JSON Server via a função de serviço postDados() (js/api.js).

$(document).ready(function () {
  const form = $('#transaction-form')
  const typeInput = $('#type')
  const submitBtn = $('#submit-btn')
  const feedback = $('#form-feedback')

  // Classes que diferenciam o botão ativo do inativo no toggle de tipo.
  const ACTIVE_CLASSES = 'bg-surface-lowest shadow-sm text-primary-custom'
  const INACTIVE_CLASSES = 'text-muted'

  // Define a data de hoje como valor padrão do campo de data.
  $('#date').val(new Date().toISOString().slice(0, 10))

  // --- Toggle de tipo (Despesa / Receita) ---
  function selecionarTipo(tipo) {
    typeInput.val(tipo)
    const ehDespesa = tipo === 'DESPESA'
    $('#btn-expense')
      .removeClass(ehDespesa ? INACTIVE_CLASSES : ACTIVE_CLASSES)
      .addClass(ehDespesa ? ACTIVE_CLASSES : INACTIVE_CLASSES)
    $('#btn-income')
      .removeClass(ehDespesa ? ACTIVE_CLASSES : INACTIVE_CLASSES)
      .addClass(ehDespesa ? INACTIVE_CLASSES : ACTIVE_CLASSES)
  }

  $('#btn-expense').on('click', () => selecionarTipo('DESPESA'))
  $('#btn-income').on('click', () => selecionarTipo('RECEITA'))

  // ID 13: a categoria é coletada por um <select>, lido no envio do formulário.
  const categoryInput = $('#category')

  // --- Helpers de feedback ---
  function limparFeedback() {
    feedback.addClass('d-none').removeClass('alert alert-success alert-danger').empty()
    $('#description, #value, #date').removeClass('is-invalid')
  }

  function mostrarFeedback(mensagem, tipo) {
    feedback
      .removeClass('d-none')
      .addClass(`alert mb-4 alert-${tipo === 'sucesso' ? 'success' : 'danger'}`)
      .text(mensagem)
  }

  // --- Interceptação do submit ---
  form.on('submit', async function (event) {
    // Previne o recarregamento/navegação padrão do formulário.
    event.preventDefault()
    limparFeedback()

    // Coleta e normaliza os valores.
    const descricao = $('#description').val().trim()
    const valor = parseFloat($('#value').val())
    const data = $('#date').val()
    const tipo = typeInput.val()

    // --- Validação ---
    let isValid = true
    if (descricao === '') {
      $('#description').addClass('is-invalid')
      isValid = false
    }
    if (isNaN(valor) || valor <= 0) {
      $('#value').addClass('is-invalid')
      isValid = false
    }
    if (!data) {
      $('#date').addClass('is-invalid')
      isValid = false
    }

    if (!isValid) {
      mostrarFeedback(
        'Preencha todos os campos corretamente (valor deve ser maior que zero).',
        'erro'
      )
      return
    }

    // Identifica o usuário logado (definido no login). Fallback para o id 1.
    const usuario = JSON.parse(localStorage.getItem('loggedUser') || '{}')
    const usuarioId = usuario.id || '1'

    // Monta o objeto conforme o modelo de dados (docs/spec.md), incluindo a
    // categoria selecionada.
    const transacao = {
      tipo,
      valor,
      data,
      hora: new Date().toTimeString().slice(0, 8),
      descricao,
      categoria: categoryInput.val(),
    }

    // --- Envio assíncrono via serviço POST ---
    submitBtn.prop('disabled', true)
    try {
      await postDados(`usuarios/${usuarioId}/transacoes`, transacao)
      mostrarFeedback('Transação registrada com sucesso! Redirecionando...', 'sucesso')
      setTimeout(() => {
        window.location.href = 'index.html'
      }, 1200)
    } catch (error) {
      mostrarFeedback(error.message, 'erro')
      submitBtn.prop('disabled', false)
    }
  })
})
