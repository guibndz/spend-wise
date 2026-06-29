# 🎬 Roteiro de Vídeo — Entrega Final SpendWise

Autor: Guilherme Bondezan Gastaldo · Tema: gerenciador de finanças pessoais.
Documento para ler durante a gravação. Estrutura: (0) pendências a corrigir antes
de gravar → (1) mapa de cada ID no código → (2) ordem de gravação.

---

## 0. Status das pendências (item 4)

### ✅ Já resolvido (o que NÃO dava pra esconder na gravação)
- **ID 13 (elemento de seleção):** os botões de categoria do `new-transaction.html` viraram um **`<select id="category">`** real, com 6 opções (Dining, Shopping, Transport, Bills, Salary, Other). O valor escolhido é lido no submit e **salvo na transação** (campo `categoria`). Verificado: salvou `"categoria": "Transport"`.
- **Avatar quebrado:** criado `assets/img/avatar.png` + `assets/img/avatar.webp` (iniciais "GB" na cor do tema). O `<picture>` do `index.html` agora carrega a imagem (e o WebP é menor que o PNG, reforçando o **ID 10**). Verificado: imagem carrega (naturalWidth 128).

### ⚠️ Ainda pendente — dá pra esconder no vídeo, mas resolva para a defesa/repos
- **ESLint quebrado (ID 19):** `npm run lint` falha (usa `.eslintrc.json`; ESLint v10 exige `eslint.config.js` flat config). **No vídeo:** basta não rodar `npm run lint` (mostre o Prettier, que funciona). Para o repo: migrar p/ flat config ou fixar `eslint@8`.
- **README (ID 17):** seções "Em andamento", **sem link do GitHub Pages**, e cita **"AwesomeAPI"** (não existe no código; a API real é a **ViaCEP**). **No vídeo:** não precisa abrir o README. Para o repo: preencher e corrigir.
- **GitHub Pages:** entregável obrigatório (precisa do seu deploy/push — não dá pra eu fazer). Rode `gh-pages` e teste os caminhos relativos (o avatar local já vai funcionar).
- **SCSS mixin não usado (ID 07):** `@mixin flex-center` está definido mas nunca `@include`. **No vídeo:** defenda pelas variáveis/`clamp`. Para refinar: incluir o mixin em algum seletor.

> Não é problema: rodar o JSON Server só em `localhost` é permitido; a ViaCEP (única chamada remota exigida) já está pronta.

---

## 1. 🗺️ Mapa dos IDs no código (itens 1 e 2)

Para cada ID: **onde está · conceito · motivação · teste prático (Método de Defesa em 4 passos)**.

### RA2 — Formulários e validações

#### ID 11 — Validação HTML nativa
- **Onde:** `login.html:174-204` (`required`, `type="password"`), `new-transaction.html` (`#value` com `required min="0.01"`, `#date required`, `#description required`), `signup.html` (`required`). Mensagens de erro/sucesso em `js/auth.js` → `showError()` (`js/auth.js:54`).
- **Conceito:** atributos do próprio HTML (`required`, `type`, `min`) que o navegador valida antes de enviar, sem JS.
- **Motivação:** garantir que o usuário não envie campos vazios ou valores inválidos (ex.: valor negativo) já na primeira barreira, barata e nativa.
- **Teste (4 passos):** 1) Conceito: "é a validação que o próprio navegador faz". 2) Motivação: "evita envio incompleto". 3) Código: mostrar `required`/`min` no input. 4) Tela: na tela de transação, deixe o valor vazio e clique em **Save** → o campo dispara a validação e marca `is-invalid` com a mensagem.

#### ID 12 — Expressões regulares (Regex)
- **Onde:** `js/auth.js:23` → `const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/` e `js/auth.js:26` → `cpfRegex.test(cpf)`.
- **Conceito:** um "molde" de texto. A regex `/^\d{3}\.\d{3}\.\d{3}-\d{2}$/` exige exatamente 3 dígitos, ponto, 3 dígitos, ponto, 3 dígitos, traço, 2 dígitos.
- **Motivação:** validar o **formato** do CPF no login (além da máscara visual), recusando entradas malformadas.
- **Teste:** 1-3) explicar e apontar a linha. 4) Na tela de login, digite um CPF incompleto (ex.: `123`) e envie → dispara "CPF inválido. Use o formato 000.000.000-00."

#### ID 13 — Elementos de seleção (checkbox/radio/select)
- **Onde:** `new-transaction.html` → `<select id="category">` (6 opções), lido em `js/new-transaction.js` (`categoryInput.val()`) e enviado no campo `categoria` do POST. Também há um `<input type="checkbox" id="terms">` em `signup.html`.
- **Conceito:** componentes de formulário para o usuário **escolher** entre opções pré-definidas (em vez de digitar), padronizando o dado coletado.
- **Motivação:** classificar a transação por categoria com valores consistentes — um `<select>` evita erro de digitação e é salvo junto da transação.
- **Teste:** 1-3) explicar e apontar o `<select>`. 4) Na tela de transação, escolha "Transport" no select, salve, e mostre no `db.json`/Network que a transação foi gravada com `"categoria": "Transport"`.

#### ID 14 — Web Storage (localStorage)
- **Onde:** **Escrita** em `js/auth.js:46` → `localStorage.setItem('loggedUser', ...)`. **Leitura** em `js/dashboard.js:18`, `js/statement.js:121`, `js/new-transaction.js:97` → `localStorage.getItem('loggedUser')`.
- **Conceito:** "gaveta" do navegador que guarda dados (string) mesmo após fechar a aba.
- **Motivação:** após o login, guardar quem é o usuário para as outras telas saberem de quem buscar/gravar as transações (`usuarioId`).
- **Teste:** 1-3) explicar e apontar. 4) Faça login, abra **F12 → Application → Local Storage** e mostre a chave `loggedUser`. Mostre que dashboard/extrato usam esse id.

### RA4 — Interatividade com jQuery

#### ID 20 — jQuery
- **Onde:** todos os scripts em `js/` (`$(document).ready`, seletores `$('#...')`, eventos `.on('submit'/'click'/'blur')`, manipulação `.val()/.text()/.html()/.addClass()`). Ex.: `js/statement.js` (render da tabela), `js/new-transaction.js` (toggle e submit).
- **Conceito:** biblioteca que simplifica selecionar e manipular elementos do DOM e tratar eventos.
- **Motivação:** escrever menos código para eventos e atualização de tela (ex.: montar as linhas do extrato, alternar o tipo da transação).
- **Teste:** 4) na tela de transação, clique nos botões **Expense/Income** e nas **categorias** → o destaque muda (manipulação de classe via jQuery, evento de clique).

#### ID 21 — Plugin jQuery (jQuery Mask)
- **Onde:** `js/auth.js:6` → `$('#cpf').mask('000.000.000-00')`; `js/viacep.js:51` → `cepInput.mask('00000-000')`. Importado via CDN nos HTML.
- **Conceito:** plugin que estende o jQuery, aplicando **máscara** de formatação automática enquanto o usuário digita.
- **Motivação:** formatar CPF e CEP automaticamente, melhorando UX e ajudando a validação.
- **Teste:** 4) na tela de login, digite só números no CPF → a máscara insere pontos e traço sozinha. Idem CEP no cadastro.

### RA5 — Consumo de APIs

#### ID 22 — POST na API fake (escrita)
- **Onde:** serviço `postDados()` em `js/api.js:14`; uso no submit em `js/new-transaction.js` → `postDados('usuarios/{id}/transacoes', transacao)`.
- **Conceito:** requisição assíncrona `fetch` com `method: 'POST'` que **grava** um novo registro no JSON Server.
- **Motivação:** persistir a transação criada pelo usuário no "banco" fake, em vez de só guardar na memória.
- **Teste:** 4) com `npm run api` rodando, crie uma transação → aparece o alerta verde "Transação registrada com sucesso!". Mostre no **F12 → Network** o POST `201`, e o registro novo no `db.json`.

#### ID 23 — GET na API fake (leitura)
- **Onde:** serviço `getDados()` em `js/api.js`; uso em `js/statement.js` (tabela do extrato) e `js/dashboard.js` (saldo/receitas/despesas).
- **Conceito:** `fetch` (GET) com `async/await` que **lê** dados do JSON Server ao abrir a página.
- **Motivação:** mostrar dinamicamente as transações salvas e o resumo financeiro, sempre refletindo o estado real.
- **Teste:** 4) abra o **Statements** → a tabela carrega do servidor (mostre o "Carregando..." e depois as linhas). No **Dashboard**, mostre saldo/receita/despesa calculados. F12 → Network → requisições GET.

#### ID 24 — API pública real (ViaCEP) com tratamento de erro
- **Onde:** `js/viacep.js:11` → `async function buscarEnderecoPorCep(cep)`; wiring no `blur` do `#cep` (`js/viacep.js:69`).
- **Conceito:** `fetch` para um serviço **externo real** (`https://viacep.com.br/...`), com `try/catch` tratando CEP inexistente, HTTP de erro e falha de rede.
- **Motivação:** preencher o endereço automaticamente a partir do CEP no cadastro, agilizando o formulário.
- **Teste:** 4) no **Cadastro (signup)**, digite um CEP válido (ex.: `01001-000`) e dê Tab → Rua/Bairro/Cidade/UF preenchem sozinhos. Depois digite um CEP inexistente (ex.: `00000-000`) → dispara a mensagem de erro do `catch`.

### Revisão RA1 (ID 01–10) e RA3 (ID 15–19)
- **RA1:** ID 01 (protótipo Stitch no README) · ID 02 (grid/flex do Bootstrap nas telas) · ID 03 (CSS puro: `.custom-grid-cards` e `.custom-flex-header` no `scss/style.scss`, usados nos "Savings Goals") · ID 04 (cards/botões/badges + componente JS navbar collapse) · ID 05 (unidades relativas + `clamp`) · ID 06 (design system via variáveis SCSS) · ID 07 (`scss/style.scss` com variáveis e mixin — ⚠️ mixin não usado) · ID 08 (tipografia fluida `clamp()` em `.display-3/.display-6/.fs-3`) · ID 09 (`object-fit-cover` no `new-goal.html`) · ID 10 (`<picture>`+`webp` no `index.html`, com `assets/img/avatar.webp` + `.png` ✅).
- **RA3:** ID 15 (`package.json`/NPM) · ID 16 (Git/`.gitignore`) · ID 17 (README — ⚠️ preencher + link Pages) · ID 18 (estrutura modular: `js/`, `scss/`, `docs/`) · ID 19 (Prettier OK; ⚠️ ESLint quebrado).

---

## 2. 🎥 Ordem de gravação (item 3)

### PARTE 1 — Tour rápido pela casca (RA1/RA3) · ~2-3 min
1. **Abertura:** "Sou o Guilherme, este é o SpendWise, um gerenciador de finanças pessoais."
2. **Navegação:** login → dashboard → statements → new transaction → new goal, mostrando que os links funcionam.
3. **Responsividade:** abra o F12, ative o modo dispositivo e redimensione → mostre o layout adaptando (mobile/desktop).
4. **Correções desde a Entrega 2 (mostre rápido o código + resultado):**
   - Tipografia fluida com `clamp()` → `scss/style.scss` (ID 08) e o título Total Balance encolhendo ao estreitar a tela.
   - CSS puro Grid/Flex → `.custom-grid-cards` (Savings Goals).
   - Correção dos hashes **SRI** quebrados (Bootstrap/jQuery Mask) — sem isso o JS era bloqueado.
   - Dashboard agora **lê dados reais** (antes era hardcoded) e **cores das barras** com critério único.
   - **Filtros** do extrato (All/Income/Expenses) agora funcionam.

### PARTE 2 — Mergulho no motor (RA2/RA4/RA5) · maior parte do vídeo
Grave **um bloco por ID**, sempre com tela dividida (VS Code + navegador F12) e os 4 passos.

| Ordem | ID | Fala-guia (resumo) | Ação na tela | Código a mostrar |
|---|---|---|---|---|
| 1 | **ID 11** | "Validação nativa do navegador" | Save com campo vazio → erro | `required`/`min` nos inputs + `showError` |
| 2 | **ID 12** | "Regex valida o formato do CPF" | Login com CPF `123` → erro | `js/auth.js:23-27` |
| 3 | **ID 13** | "Select coleta a categoria" | escolher opção no `<select>` e salvar | `new-transaction.html` `<select#category>` |
| 4 | **ID 14** | "Web Storage guarda o usuário logado" | F12 → Application → `loggedUser` | `js/auth.js:46` + leituras |
| 5 | **ID 20** | "jQuery simplifica DOM/eventos" | clicar toggle/categorias | `js/new-transaction.js` |
| 6 | **ID 21** | "Plugin de máscara" | digitar CPF/CEP só números | `js/auth.js:6`, `js/viacep.js:51` |
| 7 | **ID 22** | "POST grava no JSON Server" | criar transação → sucesso | `js/api.js` `postDados` + Network |
| 8 | **ID 23** | "GET lê e renderiza" | abrir Statements/Dashboard | `js/api.js` `getDados` + `js/statement.js` |
| 9 | **ID 24** | "API pública ViaCEP + try/catch" | CEP válido e inválido | `js/viacep.js:11` |

**Dica de roteiro:** comece a Parte 2 deixando o `npm run api` já rodando num terminal, para os blocos 7-8 fluírem. Para o bloco 9 (ViaCEP) não precisa do JSON Server — é API externa.

---

## 3. ✅ Pré-gravação (checklist rápido)
- [x] Avatar quebrado corrigido (`assets/img/avatar.webp` + `.png`).
- [x] ID 13 com `<select>` real usado em JS e salvo na transação.
- [ ] `npm run api` rodando (porta 3001) e site servido (ex.: `python3 -m http.server`).
- [ ] No vídeo, **não** rodar `npm run lint` (ESLint ainda em formato antigo) — mostrar o Prettier.
- [ ] (Repo, opcional p/ vídeo) README com link do GitHub Pages e "ViaCEP" no lugar de "AwesomeAPI".
- [ ] (Repo, opcional p/ vídeo) Deploy no GitHub Pages testado.