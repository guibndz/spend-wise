# 📄 Product Requirements Document (PRD) - SpendWise

## 1. Visão Geral e Objetivo

O **SpendWise** é uma aplicação web responsiva que permite ao usuário gerenciar suas finanças pessoais de forma intuitiva e eficiente. A aplicação possibilita o registro de entradas (receitas), saídas (despesas) e a visualização do saldo atualizado em tempo real, com histórico detalhado de transações.

**O diferencial:** Fornecer uma visão clara e centralizada das movimentações financeiras do usuário, permitindo melhor controle e compreensão dos hábitos de gastos através de um painel intuitivo e responsivo.

## 2. Atores do Sistema

- **Visitante:** Usuário não autenticado que acessa a página inicial e deseja criar uma conta para gerenciar suas finanças.
- **Usuário/Cliente:** Usuário autenticado que possui uma conta no SpendWise e realiza operações financeiras (registrar receitas, despesas, visualizar saldo e histórico).
- **O Sistema:** Ator responsável por aplicar as regras de negócio, persistir dados e manter o saldo atualizado a cada transação.

## 3. Histórias de Usuário e Escopo

Abaixo estão as funcionalidades principais do MVP (Minimum Viable Product), escritas sob a perspectiva do usuário final.

### 👤 Épico 1: Autenticação e Conta

- **US01 - Criação de Conta:** Como um Visitante, quero preencher um formulário com meus dados pessoais (Nome, CPF, Senha) para criar uma nova conta no SpendWise.
  - _Critérios de Aceitação:_ O CPF deve ser validado; todos os campos são obrigatórios; a conta deve iniciar com saldo R$ 0,00; dados devem ser persistidos localmente (localStorage) ou em uma API fake (JSON Server).

- **US02 - Acesso ao Sistema (Login):** Como um Visitante/Cliente, quero inserir meu CPF e Senha para acessar meu painel financeiro.
  - _Critérios de Aceitação:_ O sistema deve validar as credenciais; caso incorretas, exibir mensagem de erro; após login bem-sucedido, redirecionar para o painel principal.

### 💰 Épico 2: Movimentações Financeiras

- **US03 - Visualização de Saldo:** Como um Usuário logado, quero ver meu saldo total atualizado em destaque no painel principal, para saber minha situação financeira atual.
  - _Critérios de Aceitação:_ O saldo deve ser exibido em local de destaque; deve ser atualizado em tempo real após cada transação; deve ser formatado em moeda brasileira (R$).

- **US04 - Registrar Receita (Depósito/Entrada):** Como um Usuário, quero informar um valor e uma descrição para registrar uma entrada financeira na minha conta.
  - _Critérios de Aceitação:_ O valor deve ser positivo; a descrição deve ser obrigatória; o valor deve ser creditado integralmente na conta; a transação deve ser registrada com data e hora.

- **US05 - Registrar Despesa (Saque/Saída):** Como um Usuário, quero informar um valor e uma descrição para registrar uma saída financeira da minha conta.
  - _Critérios de Aceitação:_ O valor deve ser positivo; a descrição deve ser obrigatória; o sistema deve validar se há saldo disponível antes de realizar a despesa; a transação deve ser registrada com data e hora.

### 📊 Épico 3: Histórico e Transparência

- **US06 - Visualizar Extrato Completo:** Como um Usuário, quero visualizar uma lista (tabela ou cards) com o histórico de todas as minhas transações (receitas e despesas).
  - _Critérios de Aceitação:_ A lista deve mostrar: data, tipo de transação (entrada/saída), descrição, valor; os dados devem ser organizados em ordem cronológica (mais recentes primeiro); deve ser possível filtrar por tipo de transação; deve exibir o saldo parcial após cada transação.

- **US07 - Visualizar Saldo em Tempo Real:** Como um Usuário, quero que o saldo seja recalculado automaticamente após cada operação.
  - _Critérios de Aceitação:_ O cálculo do saldo deve ser: Saldo Anterior + Receitas - Despesas; o resultado deve ser atualizado instantaneamente na tela.

## 4. Requisitos Funcionais

1. **Validação de Entrada de Dados:**
   - CPF deve seguir o padrão brasileiro e ser validado (verificação de dígitos verificadores).
   - Campos obrigatórios devem ser sinalizados visualmente.
   - Valores monetários devem aceitar apenas números positivos (com duas casas decimais).

2. **Persistência de Dados:**
   - Dados devem ser armazenados localmente (localStorage) e/ou em uma API fake (JSON Server).
   - A sessão do usuário deve ser mantida após recarga da página.

3. **Responsividade:**
   - A aplicação deve ser totalmente responsiva para mobile (≤600px) e desktop (≥1024px).
   - Deve usar um framework CSS (Bootstrap, Tailwind + DaisyUI ou similar) ou CSS puro com Flexbox/Grid.

4. **Segurança Básica:**
   - Senhas devem ser armazenadas de forma segura (no mínimo, hash local ou variável de sessão).
   - Dados sensíveis não devem ser exibidos em URLs (evitar query strings com informações do usuário).

## 5. Requisitos Não-Funcionais

- **Performance:** A página deve carregar em menos de 3 segundos em conexão 4G.
- **Acessibilidade:** Cumprimento básico das diretrizes WCAG 2.1 (uso de labels, navegação por teclado, cores com contraste adequado).
- **Compatibilidade:** Deve funcionar em navegadores modernos (Chrome, Firefox, Safari, Edge - versões recentes).
- **Usabilidade:** Interface intuitiva, com fluxo claro de navegação entre telas.

## 6. Design e Layout

- **Painel Principal (Dashboard):** Exibe saldo atual, resumo de receitas/despesas do mês, links para registrar transações e visualizar extrato.
- **Formulário de Registro:** Campos para descrição e valor, com validação em tempo real.
- **Tabela/Cards de Extrato:** Listagem de todas as transações com filtros opcionais.
- **Menu de Navegação:** Menu simples com opções: Dashboard, Extrato, Logout.

## 7. MVP - Escopo Mínimo para Primeira Versão

- ✅ Criação de conta
- ✅ Login
- ✅ Visualização de saldo
- ✅ Registro de receitas
- ✅ Registro de despesas
- ✅ Visualização de extrato
- ✅ Logout

## 8. Critérios de Aceitação Gerais

- Todas as funcionalidades devem ser testadas em browsers diferentes.
- Formulários devem incluir mensagens de feedback (sucesso, erro, validação).
- O layout deve ser responsivo e se adaptar a diferentes tamanhos de tela.
- Dados sensíveis devem ser tratados com segurança básica.
