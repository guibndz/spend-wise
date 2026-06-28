// ID 20: Utiliza jQuery para manipulação do DOM e interatividade
// Aguarda o DOM ser totalmente carregado usando a sintaxe do jQuery
$(document).ready(function () {
  // ID 21: Integra e configura um plugin jQuery relevante (jQuery Mask Plugin)
  // Aplica a máscara de CPF ao input correspondente
  $('#cpf').mask('000.000.000-00');

  // Seleciona o formulário de login e adiciona um evento de 'submit'
  $('#login-form').on('submit', function (event) {
    // Previne o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();

    // Remove mensagens de erro antigas
    clearErrors();

    // Seleciona os inputs e obtém seus valores usando jQuery
    const cpfInput = $('#cpf');
    const passwordInput = $('#password');
    const cpf = cpfInput.val();
    const password = passwordInput.val();

    // Regex para validar o formato do CPF (###.###.###-##)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    let isValid = true;

    if (!cpfRegex.test(cpf)) {
      showError(cpfInput, 'CPF inválido. Use o formato 000.000.000-00.');
      isValid = false;
    }

    if (password.length < 8) {
      showError(passwordInput, 'A senha deve ter no mínimo 8 caracteres.');
      isValid = false;
    }

    // Se o formulário for válido, prossegue
    if (isValid) {
      // Simula um login bem-sucedido.
      const loggedUser = {
        id: '1',
        nome: 'Guilherme Bondezan',
        cpf: '123.456.789-00',
      };

      // Salva os dados do usuário logado no localStorage.
      localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

      // Redireciona para o dashboard
      window.location.href = 'index.html';
    }
  });
});

function showError(inputElement, message) {
  // Refatorado com jQuery para adicionar a mensagem de erro
  inputElement.addClass('is-invalid').parent().append(`<div class="invalid-feedback d-block">${message}</div>`);
}

function clearErrors() {
  // Refatorado com jQuery para limpar os erros
  $('.is-invalid').removeClass('is-invalid');
  $('.invalid-feedback').remove();
}