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

  // Visual-only ring: uses segundosRestantes to compute a visual fraction
  // and does not modify timer logic, state, or props.
  const totalSeconds = 25 * 60
  const fraction = Math.max(0, Math.min(1, segundosRestantes / totalSeconds))
  const viewBoxSize = 100
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const dashOffset = Math.round(circumference * (1 - fraction))

  return (
    <section className="painel timer-painel" aria-label="Temporizador">
      <p className="timer-status">{rotulo}</p>
      <div className={`timer-display ${emExecucao ? 'ativo' : ''}`}>
        <div className="timer-ring" aria-hidden="true">
          <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="ring-svg">
            <circle className="ring-track" cx="50" cy="50" r="45" strokeWidth="6" fill="none" />
            <circle
              className="ring-progress"
              cx="50"
              cy="50"
              r="45"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="time-label">{formatTime(segundosRestantes)}</div>
        </div>
      </div>
    </section>
  )
}

export default TimerDisplay
