function Ranking({ itens, carregando, erro, onTentarNovamente }) {
  if (carregando) {
    return (
      <section className="painel ranking-painel" aria-label="Ranking">
        <h2>Ranking de Foco</h2>
        <p className="mensagem">Carregando ranking...</p>
      </section>
    )
  }

  if (erro) {
    return (
      <section className="painel ranking-painel" aria-label="Ranking">
        <h2>Ranking de Foco</h2>
        <p className="mensagem erro">{erro}</p>
        <button type="button" className="botao botao-secundario" onClick={onTentarNovamente}>
          Tentar novamente
        </button>
      </section>
    )
  }

  const ordenados = [...itens].sort(
    (a, b) => Number(b.tempoTotalMinutos || 0) - Number(a.tempoTotalMinutos || 0)
  )

  return (
    <section className="painel ranking-painel" aria-label="Ranking">
      <h2>Ranking de Foco</h2>
      {ordenados.length === 0 ? (
        <p className="mensagem">Nenhum participante registrado ainda.</p>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela-ranking">
            <thead>
              <tr>
                <th>Posição</th>
                <th>Nome</th>
                <th>Tempo total focado</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((item, index) => (
                <tr key={item.id ?? `${item.nome}-${index}`}>
                  <td>{index + 1}º</td>
                  <td>{item.nome}</td>
                  <td>{item.tempoTotalMinutos} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Ranking
