# Contracts: Rankings API (JSON Server)

**Base URL**: `http://localhost:3001` (configurável via `VITE_API_URL`)  
**Resource**: `/rankings`

## Data Shape

```json
{
  "id": "string",
  "nome": "string",
  "tempoTotalMinutos": 150,
  "dataUltimoFoco": "2026-11-12T19:30:00Z"
}
```

## Operations

### GET /rankings
- **Purpose**: Listar participantes para exibição do ranking (FR-009).
- **Response**: `200 OK`, array de objetos `RankingEntry`.
- **Client behavior**: ordenar por `tempoTotalMinutos` desc na UI; tratar loading/erro e permitir retry (FR-011–FR-013).

### POST /rankings
- **Purpose**: Criar participante quando não existe registro correspondente ao nome na conclusão de sessão (FR-007/008).
- **Body**:
```json
{
  "nome": "Nome",
  "tempoTotalMinutos": 25,
  "dataUltimoFoco": "<ISO-8601 now>"
}
```
- **Response**: `201 Created` (json-server) com objeto criado.

### PATCH /rankings/:id
- **Purpose**: Atualizar participante existente na conclusão de sessão (FR-007/008).
- **Body**:
```json
{
  "nome": "Nome existente",
  "tempoTotalMinutos": "<anterior + 25>",
  "dataUltimoFoco": "<ISO-8601 now>"
}
```
- **Response**: `200 OK` com objeto atualizado.

## Rules

- Sessão interrompida: **nenhuma** chamada de escrita (FR-006).
- Sessão concluída: exatamente um efeito de persistência de +25 min (SC-002).
- Preservar contrato de campos; `dataUltimoFoco` atualizado na conclusão.
- Correspondência de participante existente: nome normalizado (trim, comparação case-insensitive pt-BR) definida no cliente.
