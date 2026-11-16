# Feature Specification: Pomodoro Ranqueado

**Feature Branch**: `001-pomodoro-ranqueado`
**Created**: 2026-11-15
**Status**: Draft - revisão do grupo pendente
**Input**: Funcionalidade baseada no rascunho `sdd.txt`

## User Scenarios & Testing

### User Story 1 - Concluir uma sessão de foco (Priority: P1)

Como participante, quero informar meu nome e iniciar um ciclo Pomodoro de 25
minutos para registrar meu tempo de foco no ranking ao concluir a sessão.

**Why this priority**: É o fluxo principal da aplicação e entrega o valor central
do produto.

**Independent Test**: Informar um nome, iniciar o timer, simular a passagem dos
25 minutos e confirmar que a sessão foi enviada à API e aparece no ranking.

**Acceptance Scenarios**:

1. **Given** que o campo de nome está preenchido, **When** o usuário seleciona
   "Iniciar Foco", **Then** o timer regressivo de 25 minutos é iniciado.
2. **Given** que o timer está em execução, **When** os 25 minutos terminam,
   **Then** a aplicação registra uma sessão de 25 minutos na API e atualiza o
   ranking.
3. **Given** que o campo de nome está vazio, **When** o usuário seleciona
   "Iniciar Foco", **Then** o timer não é iniciado e uma mensagem de validação é
   exibida.

### User Story 2 - Consultar o ranking (Priority: P2)

Como participante, quero visualizar os participantes ordenados pelo tempo total
de foco para acompanhar minha posição.

**Why this priority**: O ranking fornece o componente de gamificação que motiva
as sessões, mas depende de dados carregados da API.

**Independent Test**: Iniciar o JSON Server com dados conhecidos e confirmar que
o ranking exibe posição, nome e tempo total em ordem decrescente.

**Acceptance Scenarios**:

1. **Given** que a API está disponível, **When** a tela é carregada, **Then** a
   aplicação consulta `GET /rankings` e exibe os resultados ordenados pelo
   maior `tempoTotalMinutos`.
2. **Given** que a consulta do ranking está em andamento, **When** os dados ainda
   não chegaram, **Then** a aplicação exibe um estado de carregamento.
3. **Given** que a API está indisponível, **When** a consulta falha, **Then** a
   aplicação exibe uma mensagem de erro e oferece uma nova tentativa.

### User Story 3 - Interromper uma sessão (Priority: P1)

Como participante, quero desistir de uma sessão antes do fim para encerrar o
timer sem registrar tempo parcial no ranking.

**Why this priority**: Evita pontuação indevida e define explicitamente o
comportamento de erro obrigatório da atividade.

**Independent Test**: Iniciar uma sessão, selecionar "Desistir" antes do fim e
confirmar a mensagem de erro e a ausência de requisição de registro.

**Acceptance Scenarios**:

1. **Given** que o timer está em execução, **When** o usuário seleciona
   "Desistir", **Then** o timer é encerrado e é exibida a mensagem:
   "Foco quebrado! Esta sessão foi invalidada e não somará pontos no ranking."
2. **Given** que uma sessão foi interrompida, **When** o ranking é consultado,
   **Then** o tempo parcial não aparece como novo registro nem altera o tempo
   total do participante.

## Edge Cases

- Nome contendo apenas espaços deve ser tratado como vazio.
- Uma falha ao registrar uma sessão concluída deve exibir erro claro e não
  informar sucesso ao usuário.
- Uma falha no carregamento do ranking deve permitir nova tentativa.
- O timer não deve aceitar mais de uma sessão simultânea.
- A atualização do ranking após conclusão deve refletir os dados retornados pela
  API, sem depender apenas do estado local.

## Requirements

### Functional Requirements

- **FR-001**: O sistema MUST permitir informar o nome do participante antes de
  iniciar uma sessão.
- **FR-002**: O sistema MUST impedir o início quando o nome estiver vazio ou
  contiver apenas espaços.
- **FR-003**: O sistema MUST exibir uma contagem regressiva de 25 minutos.
- **FR-004**: O sistema MUST permitir interromper uma sessão em andamento pelo
  controle "Desistir".
- **FR-005**: Ao interromper uma sessão, o sistema MUST exibir exatamente a
  mensagem de foco quebrado definida nos critérios de aceite.
- **FR-006**: O sistema MUST NOT enviar tempo parcial à API quando uma sessão for
  interrompida.
- **FR-007**: Ao completar 25 minutos, o sistema MUST registrar a sessão na API
  HTTP do JSON Server.
- **FR-008**: O registro concluído MUST adicionar 25 minutos ao tempo total do
  participante.
- **FR-009**: O sistema MUST consultar o endpoint `GET /rankings`.
- **FR-010**: O ranking MUST exibir posição, nome e tempo total focado.
- **FR-011**: O ranking MUST ser ordenado por `tempoTotalMinutos` em ordem
  decrescente.
- **FR-012**: O sistema MUST exibir estados de carregamento e erro para
  operações da API.
- **FR-013**: O sistema MUST oferecer nova tentativa após falha ao carregar o
  ranking.
- **FR-014**: A comunicação HTTP MUST ficar isolada em `src/api`.
- **FR-015**: Componentes reutilizáveis MUST ficar em `src/components` e as
  telas/páginas MUST ficar em `src/pages`.

### API Contract

O mock será executado com JSON Server e terá o seguinte contrato em `db.json`:

```json
{
  "rankings": [
    {
      "id": "1",
      "nome": "Arthur",
      "tempoTotalMinutos": 150,
      "dataUltimoFoco": "2026-11-12T19:30:00Z"
    },
    {
      "id": "2",
      "nome": "Marcela",
      "tempoTotalMinutos": 125,
      "dataUltimoFoco": "2026-11-11T14:20:00Z"
    }
  ]
}
```

O cliente deve consumir `GET /rankings`. O registro de uma sessão concluída
deve usar o recurso `rankings`, preservando o contrato dos campos e atualizando
`dataUltimoFoco` com a data da conclusão.

### Key Entities

- **RankingEntry**: registro persistido de um participante, contendo `id`,
  `nome`, `tempoTotalMinutos` e `dataUltimoFoco`.
- **FocusSession**: sessão em execução no cliente, contendo o nome informado,
  duração prevista de 25 minutos e estado de execução, conclusão ou interrupção.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Um participante com nome válido consegue iniciar o timer em uma
  única ação.
- **SC-002**: Uma sessão concluída gera exatamente um registro ou atualização
  de 25 minutos na API.
- **SC-003**: Uma sessão interrompida não realiza requisição de persistência e
  exibe a mensagem de erro definida.
- **SC-004**: O ranking exibido corresponde aos dados da API e está ordenado
  corretamente em 100% dos testes com dados conhecidos.
- **SC-005**: Falhas de carregamento ou gravação exibem uma mensagem visível ao
  usuário e não apresentam sucesso falso.

## Assumptions

- O JSON Server será executado localmente durante o desenvolvimento.
- A API estará disponível em uma porta local documentada no README.
- O navegador possui conexão com o servidor local.
- A primeira versão não terá autenticação, notificações push, múltiplos tipos de
  timer ou persistência local.
- O grupo revisará este arquivo em conjunto antes de gerar o plano.
