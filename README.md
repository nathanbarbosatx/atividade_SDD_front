# Pomodoro Ranqueado

## Projeto e integrantes

O **Pomodoro Ranqueado** é uma aplicação front-end para registrar sessões de foco de 25 minutos e exibir um ranking de participantes pelo tempo total focado. O problema que ele resolve é a falta de acompanhamento e de motivação em sessões de estudo ou trabalho: em vez de controlar o tempo manualmente, o usuário inicia um ciclo Pomodoro e vê seu progresso somado a um ranking coletivo.

A aplicação usa React 19 + Vite 8 no front-end e JSON Server como API mock local.

Integrantes:

- Nathan Barbosa Teixeira
- Marcela Vicente
- Gabrielly Marquez Sarzuri
- Arthur Amaral
- Matheus Scalabrin
- Gabriel Camargo

## Framework utilizado

O grupo utilizou o **Spec Kit**, um framework de **Spec-Driven Development (SDD)** integrado ao OpenCode por meio dos comandos `/speckit.*`.

A escolha foi feita porque o Spec Kit organiza o trabalho em artefatos explícitos — `spec.md`, `plan.md` e `tasks.md` — e oferece checklists, análise de consistência e uma constituição do projeto. Isso ajudou o grupo a separar o problema da solução, registrar critérios de aceite antes da implementação e manter rastreabilidade entre requisitos, tarefas e código.

A configuração do Spec Kit, dos comandos e da estrutura `.specify/` ficou a cargo de **Gabriel Camargo** e **Gabrielly Marquez Sarzuri**.

## Como rodar

Pré-requisitos:

- Node.js e npm

Todos os comandos abaixo são executados dentro de `projeto-front/`.

```bash
cd projeto-front
npm install
```

Em terminais separados (ambos em `projeto-front/`):

1. **API mock (JSON Server, porta 3001)**

   ```bash
   npm run api
   ```

   Endpoints principais: `GET/POST/PATCH http://localhost:3001/rankings`.

2. **Front-end (Vite)**

   ```bash
   npm run dev
   ```

   Acesse a URL exibida pelo Vite (geralmente `http://localhost:5173`).

A URL base da API é lida de `VITE_API_URL` (padrão: `http://localhost:3001`). Para customizar:

```bash
cp .env.example .env
```

### Contrato da API

O recurso `rankings` em `projeto-front/db.json` usa os campos:

- `id` (string)
- `nome` (string)
- `tempoTotalMinutos` (number)
- `dataUltimoFoco` (string ISO 8601)

### Scripts

Executados dentro de `projeto-front/`:

- `npm run dev` — inicia o front-end
- `npm run api` — inicia o JSON Server com `db.json`
- `npm run build` — build de produção
- `npm run preview` — preview do build
- `npm run lint` — executa o oxlint
- `npm run test` — executa os testes
- `npm run test:watch` — testes em modo watch
- `npm run test:coverage` — testes com relatório de cobertura

### Testes

- Stack: Vitest + Testing Library, ambiente `jsdom`.
- Cobertura mínima exigida: 100% em statements, branches, functions e lines.
- `projeto-front/src/main.jsx` é excluído da cobertura por ser apenas o bootstrap da aplicação.
- A API é sempre mockada nos testes; nenhum teste acessa a rede real.

### Limitações conhecidas

O registro de sessão faz `GET /rankings` e depois `POST`/`PATCH`. O JSON Server não oferece transação nem incremento atômico, então duas conclusões simultâneas do mesmo participante podem causar atualização perdida (lost update). Para uso local/educacional isso é aceitável; a proteção existente cobre apenas o retry da mesma sessão, ignorando gravações repetidas dentro de 15 segundos.

## Onde estão os artefatos

Caminhos relativos à raiz do repositório:

| Artefato | Caminho | Responsáveis |
|---|---|---|
| Spec | [`projeto-front/specs/001-pomodoro-ranqueado/spec.md`](projeto-front/specs/001-pomodoro-ranqueado/spec.md) | Nathan (autoria); Gabriel (organização) |
| Plano | [`projeto-front/specs/001-pomodoro-ranqueado/plan.md`](projeto-front/specs/001-pomodoro-ranqueado/plan.md) | Gabriel (estrutura inicial); Arthur; Gabrielly (anel) |
| Tarefas | [`projeto-front/specs/001-pomodoro-ranqueado/tasks.md`](projeto-front/specs/001-pomodoro-ranqueado/tasks.md) | Gabrielly (versão inicial); Matheus (reescrita completa) |
| Contrato da API | [`projeto-front/specs/001-pomodoro-ranqueado/contracts/rankings-api.md`](projeto-front/specs/001-pomodoro-ranqueado/contracts/rankings-api.md) | Arthur |
| Checklist | [`projeto-front/specs/001-pomodoro-ranqueado/checklists/timer-session.md`](projeto-front/specs/001-pomodoro-ranqueado/checklists/timer-session.md) | Arthur |
| Constituição | [`projeto-front/.specify/memory/constitution.md`](projeto-front/.specify/memory/constitution.md) | Gabriel e Gabrielly |

### Divisão das tarefas

Atribuição inferida do histórico de commits; ajuste se o grupo preferir outra divisão.

| Tarefa | Descrição | Principal | Apoio |
|---|---|---|---|
| Infra SDD | Configuração do Spec Kit, comandos e constituição | Gabriel | Gabrielly |
| T001 | Estrutura Vite/React e entrypoints | Marcela | Arthur |
| T002 | JSON Server e `db.json` | Arthur | Matheus |
| T003 | Lint, build e testes automatizados | Matheus | Marcela, Gabriel |
| T004 | Camada HTTP em `src/api` | Arthur | Matheus |
| T005 | Contrato da API | Arthur | — |
| T006 | Shell, estilos e composição da página | Marcela | Arthur, Matheus |
| T007 | Testes de timer, controles e página | Matheus | — |
| T008 | `TimerDisplay` com anel de progresso | Gabrielly | Arthur, Matheus |
| T009 | Validação de nome e início da sessão | Arthur | Matheus |
| T010 | Contagem regressiva e registro de +25 minutos | Arthur | Matheus |
| T011 | Erro de registro e nova tentativa | Matheus | Arthur |
| T012 | Testes de interrupção | Matheus | — |
| T013 | Controle "Desistir" | Arthur | — |
| T014 | Reset, mensagem exata e nenhuma persistência | Arthur | Matheus |
| T015 | Testes do ranking | Matheus | — |
| T016 | `GET /rankings` e ordenação decrescente | Arthur | — |
| T017 | Render do ranking e destaques do top 3 | Arthur | Marcela, Matheus |
| T018 | Carregamento, erro e retry do ranking | Arthur | Matheus |
| T019 | Cobertura de 100% | Matheus | — |
| T020 | Lint e build sem erros | Matheus | — |
| T021 | README | Matheus | Arthur, Marcela |
| T022 | Validação manual em desktop | Gabrielly | Matheus |
| T023 | Validação manual em mobile | Gabrielly | Matheus |

## Reflexão

**Que decisão o agente teria tomado sozinho e a spec evitou?**

Ao interromper uma sessão, o agente poderia simplesmente registrar o tempo já decorrido ou resetar o timer sem aviso. A spec proibiu explicitamente o envio de tempo parcial (FR-006) e exigiu a mensagem exata de foco quebrado (FR-005). Outro exemplo: o ranking poderia ser montado apenas com estado local; a spec exigiu que a interface refletisse os dados retornados pela API.

**Que inconsistência a validação encontrou? Estava na spec ou no código?**

A validação encontrou `tasks.md` cobrindo apenas o anel de progresso, enquanto a spec e o código já tratavam timer, registro de sessão, ranking e interrupção. A inconsistência estava na **documentação**, não no código: os testes passavam e as funcionalidades existiam. O plano também declarava “Testing: N/A” mesmo com uma suíte de 62 testes. As duas falhas foram corrigidas com a reescrita das tarefas e a atualização do plano.

**Como o framework ajudou (ou atrapalhou) a coordenação do grupo?**

Ajudou ao criar uma fonte única de requisitos, critérios de aceite claros e tarefas organizadas por história, além de permitir que a análise apontasse a deriva entre spec, plano e tarefas. Atrapalhou quando as tarefas foram geradas para um incremento estreito (o anel) e passaram a não representar a feature completa; também houve fricção com caminhos de configuração e a constituição permaneceu como template. O framework não substitui a disciplina de atualizar os artefatos junto com o código.

**O que fariam diferente com outro framework?**

Com Kanban ou GitHub Issues, o grupo usaria uma issue por requisito e vincularia cada pull request a ela, reduzindo a chance de o arquivo de tarefas ficar defasado. Com outro framework de SDD, o grupo regeneraria e revalidaria as tarefas após cada mudança de escopo, em vez de manter uma lista paralela. O trade-off seria menos estrutura inicial, mas mais rastreabilidade no dia a dia.
