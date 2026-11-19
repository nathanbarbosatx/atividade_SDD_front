# Tasks: Pomodoro Ranqueado

**Input**: Design documents from `/specs/001-pomodoro-ranqueado/`

**Prerequisites**: plan.md, spec.md, contracts/rankings-api.md, checklists/timer-session.md

**Tests**: A suíte automatizada faz parte da entrega (Vitest + Testing Library, 62 testes e cobertura de 100%) e é rastreada abaixo porque SC-004 exige validação com 100% dos testes.

**Organization**: Tarefas agrupadas por user story, na ordem de prioridade US1 (P1) → US3 (P1) → US2 (P2).

> **Status**: Todas as tarefas já foram implementadas e validadas no repositório. Os checkboxes refletem o estado real do código, não um plano futuro.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência de tarefa incompleta)
- **[Story]**: User story à qual a tarefa pertence (US1, US2, US3)
- Cada tarefa inclui o caminho exato dos arquivos e as referências `FR-xxx`/`SC-xxx`

## Path Conventions

- Projeto único: caminhos relativos a `projeto-front/`
- Código em `src/`; testes co-localizados como `*.test.js` e `*.test.jsx`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicialização do projeto e estrutura básica

- [x] T001 Criar a estrutura do app Vite + React, incluindo entrypoints e configuração de build, em `package.json`, `vite.config.js`, `index.html` e `src/main.jsx` (FR-015)
  - Evidência: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`
- [x] T002 [P] Configurar o mock JSON Server com o recurso `rankings` em `db.json` e no script `api` de `package.json` (apoio a FR-007 e FR-009)
  - Evidência: `db.json`, `package.json`
- [x] T003 [P] Configurar lint, build e testes automatizados em `package.json`, `vitest.config.js` e `src/test/setup.js` (apoio a SC-004)
  - Evidência: `package.json`, `vitest.config.js`, `src/test/setup.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura compartilhada que bloqueia as user stories

**CRITICAL**: Nenhuma user story depende de trabalho pendente desta fase; todas já estão concluídas.

- [x] T004 [P] Implementar a camada HTTP isolada para o recurso `rankings` em `src/api/rankings.js` (FR-014)
  - Evidência: `src/api/rankings.js`, `src/api/rankings.test.js`
- [x] T005 [P] Documentar o contrato da API (campos, GET, POST e PATCH) em `contracts/rankings-api.md`, alinhado a `db.json` (FR-007, FR-009, FR-012)
  - Evidência: `contracts/rankings-api.md`, `db.json`
- [x] T006 Criar o shell da aplicação, estilos globais e composição da página em `src/App.jsx`, `src/index.css`, `src/App.css` e `src/main.jsx` (FR-015)
  - Evidência: `src/App.jsx`, `src/main.jsx`, `src/index.css`, `src/App.css`, `src/App.test.jsx`

**Checkpoint**: Base pronta — user stories podem ser implementadas e testadas de forma independente.

---

## Phase 3: User Story 1 - Concluir uma sessão de foco (Priority: P1)

**Goal**: Permitir informar o nome, iniciar o timer de 25 minutos e registrar a sessão concluída na API.

**Independent Test**: Informar um nome, iniciar o timer, avançar até a conclusão e confirmar o registro de +25 minutos e a atualização do ranking.

### Tests for User Story 1

- [x] T007 [P] [US1] Cobrir timer, controles e fluxo da página em `src/components/TimerDisplay.test.jsx`, `src/components/ControlesSessao.test.jsx` e `src/pages/PomodoroPage.test.jsx` (SC-001, SC-002)
  - Evidência: `src/components/TimerDisplay.test.jsx`, `src/components/ControlesSessao.test.jsx`, `src/pages/PomodoroPage.test.jsx`

### Implementation for User Story 1

- [x] T008 [P] [US1] Implementar `TimerDisplay` com anel SVG de progresso, transição suave, tempo centralizado e tipografia responsiva em `src/components/TimerDisplay.jsx` e `src/App.css` (FR-003)
  - Evidência: `src/components/TimerDisplay.jsx`, `src/App.css`, `src/components/TimerDisplay.test.jsx`
- [x] T009 [US1] Validar o nome (vazio ou somente espaços) e iniciar a sessão em uma única ação em `src/pages/PomodoroPage.jsx` e `src/components/ControlesSessao.jsx` (FR-001, FR-002; SC-001)
  - Evidência: `src/pages/PomodoroPage.jsx`, `src/components/ControlesSessao.jsx`, `src/pages/PomodoroPage.test.jsx`
- [x] T010 [US1] Implementar a contagem regressiva de 25 minutos, a conclusão da sessão e o registro de +25 minutos via API em `src/pages/PomodoroPage.jsx` e `src/api/rankings.js` (FR-003, FR-007, FR-008; SC-002)
  - Evidência: `src/pages/PomodoroPage.jsx`, `src/api/rankings.js`, `src/pages/PomodoroPage.test.jsx`, `src/api/rankings.test.js`
- [x] T011 [US1] Exibir erro de registro e permitir nova tentativa sem informar sucesso falso em `src/pages/PomodoroPage.jsx` (FR-012)
  - Evidência: `src/pages/PomodoroPage.jsx`, `src/pages/PomodoroPage.test.jsx`

**Checkpoint**: US1 funcional e testável isoladamente.

---

## Phase 4: User Story 3 - Interromper uma sessão (Priority: P1)

**Goal**: Encerrar uma sessão em andamento sem persistir tempo parcial.

**Independent Test**: Iniciar uma sessão, selecionar "Desistir" e confirmar a mensagem exata e a ausência de requisição de persistência.

### Tests for User Story 3

- [x] T012 [P] [US3] Cobrir a interrupção da sessão em `src/pages/PomodoroPage.test.jsx` e `src/components/ControlesSessao.test.jsx` (SC-003)
  - Evidência: `src/pages/PomodoroPage.test.jsx`, `src/components/ControlesSessao.test.jsx`

### Implementation for User Story 3

- [x] T013 [US3] Disponibilizar o controle "Desistir" apenas durante uma sessão em andamento em `src/components/ControlesSessao.jsx` e `src/pages/PomodoroPage.jsx` (FR-004)
  - Evidência: `src/components/ControlesSessao.jsx`, `src/pages/PomodoroPage.jsx`, `src/components/ControlesSessao.test.jsx`
- [x] T014 [US3] Encerrar a sessão, restaurar o timer para 25:00, exibir a mensagem exata e não chamar a API em `src/pages/PomodoroPage.jsx` (FR-005, FR-006; SC-003)
  - Evidência: `src/pages/PomodoroPage.jsx`, `src/pages/PomodoroPage.test.jsx`

**Checkpoint**: US3 funcional e testável isoladamente.

---

## Phase 5: User Story 2 - Consultar o ranking (Priority: P2)

**Goal**: Exibir participantes ordenados pelo tempo total de foco consumido da API.

**Independent Test**: Com a API disponível, confirmar `GET /rankings`, ordenação decrescente e exibição de posição, nome e tempo total.

### Tests for User Story 2

- [x] T015 [P] [US2] Cobrir carregamento, ordenação, render e falhas do ranking em `src/components/Ranking.test.jsx`, `src/api/rankings.test.js` e `src/pages/PomodoroPage.test.jsx` (SC-004, SC-005)
  - Evidência: `src/components/Ranking.test.jsx`, `src/api/rankings.test.js`, `src/pages/PomodoroPage.test.jsx`

### Implementation for User Story 2

- [x] T016 [US2] Consumir `GET /rankings` e ordenar por `tempoTotalMinutos` de forma decrescente em `src/api/rankings.js` e `src/pages/PomodoroPage.jsx` (FR-009, FR-011)
  - Evidência: `src/api/rankings.js`, `src/pages/PomodoroPage.jsx`, `src/api/rankings.test.js`
- [x] T017 [US2] Exibir posição, nome e tempo total, incluindo os destaques visuais do top 3 em `src/components/Ranking.jsx` e `src/App.css` (FR-010)
  - Evidência: `src/components/Ranking.jsx`, `src/App.css`, `src/components/Ranking.test.jsx`
- [x] T018 [US2] Exibir estados de carregamento e erro e oferecer nova tentativa após falha no ranking em `src/pages/PomodoroPage.jsx` e `src/components/Ranking.jsx` (FR-012, FR-013; SC-005)
  - Evidência: `src/pages/PomodoroPage.jsx`, `src/components/Ranking.jsx`, `src/pages/PomodoroPage.test.jsx`

**Checkpoint**: Todas as user stories funcionam de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Qualidade, documentação e validação final

- [x] T019 [P] Garantir 100% de cobertura em statements, branches, functions e lines em `vitest.config.js` e na suíte de testes (SC-004)
  - Evidência: `vitest.config.js`, `npm run test:coverage` (62 testes), commits `c856a4a` e `5290f70`
- [x] T020 [P] Executar `npm run lint` e `npm run build` sem erros em `package.json` (SC-004)
  - Evidência: `package.json`, scripts `lint` e `build`
- [x] T021 [P] Documentar execução, API, testes e política de cobertura em `README.md`
  - Evidência: `README.md`, commit `5290f70`
- [x] T022 Validar manualmente o layout em desktop, incluindo 768 px e telas maiores, em `src/App.css` e `src/components/TimerDisplay.jsx` (antiga T005)
  - Evidência: validação manual desktop executada com sucesso (informada pelo usuário em 2026-11-19)
- [x] T023 Validar manualmente o layout em viewports estreitas (320 px, 375 px e <420 px), sem rolagem horizontal, em `src/App.css` e `src/components/TimerDisplay.jsx` (antiga T006)
  - Evidência: validação manual mobile executada com sucesso (informada pelo usuário em 2026-11-19)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências
- **Foundational (Phase 2)**: Depende do Setup e bloqueia todas as user stories
- **User Stories (Phases 3–5)**: Dependem da fase Foundational; podem ser feitas em paralelo, mas a ordem recomendada é US1 → US3 → US2
- **Polish (Phase 6)**: Depende de todas as user stories

### User Story Dependencies

- **US1 (P1)**: Sem dependência de outras histórias
- **US3 (P1)**: Independente de US1, mas compartilha os controles da sessão
- **US2 (P2)**: Independente para leitura, mas o fluxo completo depende do registro concluído por US1

### Within Each User Story

- Testes devem ser escritos antes da implementação (já concluído e registrado como evidência)
- Componentes antes da integração na página
- Registro na API após timer e validação de nome
- Histórias concluídas antes de avançar para a próxima prioridade

### Parallel Opportunities

- T002 e T003
- T004 e T005
- T007, T012 e T015 (testes de histórias diferentes)
- T008 em paralelo com T009 (arquivos diferentes)
- T016 e T017 após T004
- T019, T020 e T021

---

## Parallel Example: Foundational + US1 Tests

```bash
# Infraestrutura compartilhada
Task: "T004 Implementar src/api/rankings.js (FR-014)"
Task: "T005 Documentar contracts/rankings-api.md (FR-007, FR-009, FR-012)"

# Testes e componente visual da US1
Task: "T007 Cobrir timer/controles/página (SC-001, SC-002)"
Task: "T008 Implementar TimerDisplay e estilos do anel (FR-003)"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Setup + Foundational
2. US1: timer, validação de nome, conclusão e registro
3. Validar US1 isoladamente

### Incremental Delivery

1. US1 (P1) — fluxo principal e MVP
2. US3 (P1) — interrupção sem persistência
3. US2 (P2) — ranking e estados de erro
4. Polish — cobertura, lint/build, README e validação manual

**Estado atual**: todos os incrementos foram entregues; este arquivo documenta a rastreabilidade retroativa.

---

## Requirement Coverage

| Requirement | Task IDs |
|---|---|
| FR-001 | T009 |
| FR-002 | T009 |
| FR-003 | T008, T010 |
| FR-004 | T013 |
| FR-005 | T014 |
| FR-006 | T014 |
| FR-007 | T005, T010 |
| FR-008 | T010 |
| FR-009 | T005, T016 |
| FR-010 | T017 |
| FR-011 | T016 |
| FR-012 | T005, T011, T018 |
| FR-013 | T018 |
| FR-014 | T004 |
| FR-015 | T001, T006 |
| SC-001 | T007, T009 |
| SC-002 | T007, T010 |
| SC-003 | T012, T014 |
| SC-004 | T003, T015, T019, T020 |
| SC-005 | T015, T018 |

---

## Notes

- `[P]` indica tarefas com arquivos distintos e sem dependência de tarefa incompleta
- `[Story]` mapeia a tarefa à user story correspondente
- Linhas `Evidência:` registram arquivos, testes e commits que comprovam a conclusão
- Validações manuais T022/T023 foram executadas com sucesso e registradas em 2026-11-19
- Nenhuma tarefa pendente: a feature está implementada, testada e documentada
