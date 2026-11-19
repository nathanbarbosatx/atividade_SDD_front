# Implementation Plan: Pomodoro Ranqueado

**Branch**: `001-pomodoro-ranqueado` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-pomodoro-ranqueado/spec.md`

## Summary

Implementar uma página única (PT-BR, estilo renascentista) em React+Vite com timer Pomodoro de 25 minutos, validação de nome, interrupção sem persistência parcial, e ranking consumido de API mock JSON Server (`/rankings`) via camada isolada em `src/api`. Ao concluir sessão: localizar participante por nome (comparação normalizada), somar 25 em `tempoTotalMinutos` e atualizar `dataUltimoFoco` (PATCH) ou criar registro (POST) se inexistente; UI reflete dados da API.

## Technical Context

**Language/Version**: JavaScript (ESM), React 19, Vite 8  
**Primary Dependencies**: react, react-dom, vite, json-server (dev, mock API)  
**Storage**: JSON Server (`db.json`, recurso `rankings`) — sem persistência local  
**Testing**: Vitest 5.1.1 + Testing Library + `@vitest/coverage-v8`; 62 testes com cobertura de 100% (statements, branches, functions e lines); `npm run test`, `npm run test:watch`, `npm run test:coverage`, `npm run lint` e `npm run build`
**Target Platform**: Navegador web (desktop/mobile), API local via HTTP  
**Project Type**: Web single-page frontend  
**Performance Goals**: N/A (app local simples; timer UI 1s tick)  
**Constraints**: HTTP isolado em `src/api`; componentes em `src/components`; páginas em `src/pages`; sem tempo parcial em desistência; mensagem de desistência exata; idioma PT-BR  
**Scale/Scope**: Uso local/educacional, única página, conjunto pequeno de participantes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` contém placeholders (sem princípios ratificados). **Gate: PASS (N/A)** — nenhuma regra adicional imposta; seguir estrutura e requisitos do spec.

**Post-design re-check**: PASS — design mantém isolamento de API, separação components/pages e contrato `rankings`.

## Project Structure

### Documentation (this feature)

```text
specs/001-pomodoro-ranqueado/
├── plan.md
├── spec.md
├── checklists/
│   ├── requirements.md
│   └── timer-session.md
└── contracts/
    └── rankings-api.md
```

### Source Code (repository root)

```text
db.json
.env.example
index.html
vitest.config.js
src/
├── api/
│   ├── rankings.js
│   └── rankings.test.js
├── components/
│   ├── ControlesSessao.jsx
│   ├── ControlesSessao.test.jsx
│   ├── TimerDisplay.jsx
│   ├── TimerDisplay.test.jsx
│   ├── Ranking.jsx
│   └── Ranking.test.jsx
├── pages/
│   ├── PomodoroPage.jsx
│   └── PomodoroPage.test.jsx
├── test/
│   └── setup.js
├── App.jsx
├── App.css
├── App.test.jsx
├── index.css
└── main.jsx
```

**Structure Decision**: Single frontend Vite app. `src/api` centraliza HTTP; `src/components` para UI reutilizável; `src/pages` para orquestração da tela única; mock backend via `json-server` + `db.json` na raiz.

## Implementation Notes

- **Registro de conclusão**: `GET /rankings` → match por nome normalizado (trim + lower pt-BR). Se existir: `PATCH /rankings/:id` com `tempoTotalMinutos += 25` e `dataUltimoFoco = now(ISO)` preservando `nome/id`. Se não: `POST /rankings` com `nome` (trim), `tempoTotalMinutos: 25`, `dataUltimoFoco: now(ISO)`.
- **Timer/sessão**: estado ociosa/executando/concluída/interrompida; bloqueio de início sem nome válido e sem sessão simultânea; desistir limpa intervalo, reseta timer, mostra mensagem exata e não chama API.
- **Ranking**: carregar no mount e após conclusão bem-sucedida; ordenar desc por `tempoTotalMinutos`; exibir loading/erro + retry.
- **Execução**: `npm run api` (porta 3001) e `npm run dev`; `VITE_API_URL` configurável.

### Melhoria visual: anel de progresso

- Adicionar um anel verde com pontas arredondadas ao redor do tempo,
  mantendo a contagem centralizada.
- Usar a prop existente `segundosRestantes`: anel cheio em 25:00,
  vazio em 00:00 e restaurado ao desistir.
- Implementar em `src/components/TimerDisplay.jsx`, com estilos
  responsivos em `src/App.css`, sem novas dependências.
- Não alterar a lógica do timer, os controles, a API, o ranking ou a spec.
- Validar início, avanço, conclusão e desistência, além da apresentação
  em telas de 320 px, 375 px, 768 px e desktop, sem rolagem horizontal.
- Executar `npm run lint` e `npm run build`.