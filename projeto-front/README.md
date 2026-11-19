# Pomodoro Ranqueado

Aplicação front-end (React + Vite) para registrar sessões de foco Pomodoro de 25 minutos e exibir um ranking de participantes, usando uma API mock com JSON Server.

## Requisitos

- Node.js e npm
- Dependências instaladas (`npm install`)

## Contrato da API (`db.json`)

Recurso `rankings` com os campos:

- `id` (string)
- `nome` (string)
- `tempoTotalMinutos` (number)
- `dataUltimoFoco` (string ISO 8601)

Exemplo em `db.json` na raiz do projeto.

## Configuração

A URL base da API é lida de `VITE_API_URL` (padrão: `http://localhost:3001`).

Copie o exemplo se desejar customizar:

```bash
cp .env.example .env
```

## Como executar

Em terminais separados:

1. **API mock (JSON Server, porta 3001)**
   ```bash
   npm run api
   ```
   Endpoints principais: `GET/POST/PATCH http://localhost:3001/rankings`

2. **Front-end (Vite)**
   ```bash
   npm run dev
   ```
   Acesse a URL exibida pelo Vite (geralmente `http://localhost:5173`).

## Scripts

- `npm run dev` — inicia o front-end
- `npm run api` — inicia o JSON Server em `http://localhost:3001` com `db.json`
- `npm run build` — build de produção
- `npm run preview` — preview do build
- `npm run lint` — executa o oxlint
- `npm run test` — executa os testes unitários
- `npm run test:watch` — testes em modo watch
- `npm run test:coverage` — testes com relatório de cobertura

## Testes

- Stack: Vitest + Testing Library, ambiente `jsdom`.
- Cobertura mínima exigida: 100% em statements, branches, functions e lines.
- `src/main.jsx` é excluído da cobertura por ser apenas o bootstrap da aplicação.
- A API é sempre mockada nos testes; nenhum teste acessa a rede real.

## Funcionalidades

- Informar nome e iniciar contagem regressiva de 25 minutos.
- Validação: nome vazio ou só com espaços impede o início.
- Ao concluir 25 minutos: registra/atualiza o participante em `rankings`, soma +25 em `tempoTotalMinutos` e atualiza `dataUltimoFoco`.
- "Desistir": encerra o timer, exibe a mensagem de foco quebrado e não envia tempo parcial à API.
- Ranking: consulta `GET /rankings`, exibe posição, nome e tempo total ordenado por maior tempo, com estados de carregamento, erro e nova tentativa.

## Limitações conhecidas

- O registro de sessão faz `GET /rankings` e depois `POST`/`PATCH`. O JSON Server
  não oferece transação nem incremento atômico, então duas conclusões simultâneas
  do mesmo participante podem causar atualização perdida (lost update). Para uso
  local/educacional isso é aceitável; a proteção existente cobre apenas o retry
  da mesma sessão, ignorando gravações repetidas dentro de 15 segundos.

## Estrutura relevante

- `src/api/` — comunicação HTTP com a API
- `src/components/` — componentes reutilizáveis
- `src/pages/` — página principal
- `specs/001-pomodoro-ranqueado/spec.md` — especificação da funcionalidade
