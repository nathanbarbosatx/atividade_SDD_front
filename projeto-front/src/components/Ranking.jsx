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

  const top3 = ordenados.slice(0, 3)

  return (
    <section className="painel ranking-painel" aria-label="Ranking">
      <h2>Ranking de Foco</h2>
      {ordenados.length === 0 ? (
        <p className="mensagem">Nenhum participante registrado ainda.</p>
      ) : (
        <>
          <div className="ranking-compact">
            {top3.map((item, index) => (
              <div className="ranking-item" key={item.id ?? `${item.nome}-top-${index}`}>
                <span className="rank-pos">{index + 1}</span>
                <span className="rank-name">{item.nome}</span>
                <span className="rank-time">{item.tempoTotalMinutos} min</span>
              </div>
            ))}
            {ordenados.length > 3 ? (
              <details className="ranking-details">
                <summary>Ver ranking completo ({ordenados.length})</summary>
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
              </details>
            ) : null}
          </div>
        </>
      )}
    </section>
  )
}

export default Ranking
