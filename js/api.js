// ID 22: Camada de serviço para requisições assíncronas à API fake (JSON Server).

// URL base da API local. Inicie o servidor com: npm run api
const API_BASE_URL = 'http://localhost:3001'

/**
 * Função assíncrona dedicada a enviar dados ao JSON Server via método POST.
 *
 * @param {string} recurso - Caminho do recurso (ex.: 'usuarios/1/transacoes').
 * @param {Object} dados - Objeto a ser persistido.
 * @returns {Promise<Object>} O registro criado, já com o id gerado pela API.
 * @throws {Error} Caso a requisição falhe ou a API responda com erro.
 */
async function postDados(recurso, dados) {
  try {
    const response = await fetch(`${API_BASE_URL}/${recurso}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    })

    // Trata respostas HTTP que não sejam de sucesso (ex.: 400, 404, 500).
    if (!response.ok) {
      throw new Error(`Falha ao enviar dados (HTTP ${response.status}).`)
    }

    return await response.json()
  } catch (error) {
    // fetch rejeita com TypeError quando não consegue conectar (API offline).
    if (error instanceof TypeError) {
      throw new Error(
        'Não foi possível conectar à API. Verifique se o JSON Server está em execução (npm run api).'
      )
    }
    throw error
  }
}
