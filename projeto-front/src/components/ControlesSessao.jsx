function ControlesSessao({
  nome,
  onNomeChange,
  onIniciar,
  onDesistir,
  emExecucao,
  erroValidacao,
}) {
  return (
    <section className="painel controles-painel" aria-label="Controles da sessão">
      <label className="campo-nome" htmlFor="nome-participante">
        Nome do participante
      </label>
      <input
        id="nome-participante"
        type="text"
        className="entrada-nome"
        value={nome}
        onChange={(event) => onNomeChange(event.target.value)}
        placeholder="Digite seu nome"
        disabled={emExecucao}
        autoComplete="name"
      />
      {erroValidacao ? <p className="mensagem erro">{erroValidacao}</p> : null}
      <div className="acoes">
        <button
          type="button"
          className="botao botao-principal"
          onClick={onIniciar}
          disabled={emExecucao}
        >
          Iniciar Foco
        </button>
        <button
          type="button"
          className="botao botao-perigo"
          onClick={onDesistir}
          disabled={!emExecucao}
        >
          Desistir
        </button>
      </div>
    </section>
  )
}

export default ControlesSessao
