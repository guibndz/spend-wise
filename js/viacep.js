// ID 24: Realiza requisições assíncronas para uma API pública real (ViaCEP),
// exibindo os dados e tratando erros.

/**
 * Função assíncrona isolada que consulta o endereço de um CEP na API do ViaCEP.
 *
 * @param {string} cep - O CEP a ser consultado (com ou sem máscara).
 * @returns {Promise<Object>} Os dados do endereço retornados pela API.
 * @throws {Error} Caso o CEP seja inválido, não exista ou a requisição falhe.
 */
async function buscarEnderecoPorCep(cep) {
  // Remove tudo que não for dígito (pontos, traços, espaços).
  const cepLimpo = String(cep).replace(/\D/g, '')

  // Valida o formato antes de fazer a requisição (8 dígitos).
  if (cepLimpo.length !== 8) {
    throw new Error('CEP inválido. Informe 8 dígitos.')
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)

    // Trata respostas HTTP que não sejam de sucesso (ex.: 400, 500).
    if (!response.ok) {
      throw new Error(`Falha na requisição (HTTP ${response.status}).`)
    }

    const data = await response.json()

    // O ViaCEP retorna { "erro": true } com status 200 quando o CEP não existe.
    if (data.erro) {
      throw new Error('CEP não encontrado.')
    }

    return data
  } catch (error) {
    // Diferencia erro de rede (fetch rejeita) de erros já tratados acima.
    if (error instanceof TypeError) {
      throw new Error('Não foi possível conectar ao serviço de CEP. Verifique sua conexão.')
    }
    throw error
  }
}

// Lógica de conexão da função ao formulário, usando jQuery (padrão do projeto).
$(document).ready(function () {
  const cepInput = $('#cep')

  // Aplica a máscara de CEP (00000-000) caso o plugin esteja disponível.
  if (typeof $.fn.mask === 'function') {
    cepInput.mask('00000-000')
  }

  // Helper para mostrar mensagens de erro reutilizando o padrão Bootstrap.
  function mostrarErroCep(mensagem) {
    cepInput.addClass('is-invalid')
    cepInput.closest('.input-group').siblings('.invalid-feedback').remove()
    cepInput
      .closest('.input-group')
      .after(`<div class="invalid-feedback d-block">${mensagem}</div>`)
  }

  function limparErroCep() {
    cepInput.removeClass('is-invalid')
    cepInput.closest('.input-group').siblings('.invalid-feedback').remove()
  }

  // Dispara a busca quando o usuário sai do campo de CEP.
  cepInput.on('blur', async function () {
    const cep = cepInput.val().trim()

    limparErroCep()

    // Não faz nada se o campo estiver vazio.
    if (cep === '') {
      return
    }

    try {
      const endereco = await buscarEnderecoPorCep(cep)

      // Preenche automaticamente os demais campos com os dados retornados.
      $('#street').val(endereco.logradouro)
      $('#neighborhood').val(endereco.bairro)
      $('#city').val(endereco.localidade)
      $('#state').val(endereco.uf)

      // Move o foco para o campo seguinte para agilizar o cadastro.
      $('#street').trigger('focus')
    } catch (error) {
      // Exibe o erro ao usuário e limpa os campos preenchidos.
      mostrarErroCep(error.message)
      $('#street, #neighborhood, #city, #state').val('')
    }
  })
})
