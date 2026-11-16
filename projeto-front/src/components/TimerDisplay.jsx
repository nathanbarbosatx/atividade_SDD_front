function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function TimerDisplay({ segundosRestantes, emExecucao, status }) {
  const rotulo =
    status === 'interrompida'
      ? 'Sessão interrompida'
      : status === 'concluida'
        ? 'Sessão concluída'
        : emExecucao
          ? 'Foco em andamento'
          : 'Pronto para iniciar'

  return (
    <section className="painel timer-painel" aria-label="Temporizador">
      <p className="timer-status">{rotulo}</p>
      <div className={`timer-display ${emExecucao ? 'ativo' : ''}`}>
        {formatTime(segundosRestantes)}
      </div>
    </section>
  )
}

export default TimerDisplay
