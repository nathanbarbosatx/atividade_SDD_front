import { useCallback, useEffect, useRef, useState } from 'react'
import ControlesSessao from '../components/ControlesSessao'
import Ranking from '../components/Ranking'
import TimerDisplay from '../components/TimerDisplay'
import { getRankings, registrarSessaoConcluida } from '../api/rankings'

const DURACAO_SESSAO = 25 * 60
const MENSAGEM_FOCO_QUEBRADO =
  'Foco quebrado! Esta sessão foi invalidada e não somará pontos no ranking.'

function PomodoroPage() {
  const [nome, setNome] = useState('')
  const [segundosRestantes, setSegundosRestantes] = useState(DURACAO_SESSAO)
  const [statusSessao, setStatusSessao] = useState('ociosa') // ociosa | executando | concluida | interrompida
  const [mensagemValidacao, setMensagemValidacao] = useState('')
  const [mensagemSessao, setMensagemSessao] = useState('')
  const [erroSessao, setErroSessao] = useState('')
  const [salvando, setSalvando] = useState(false)

  const [rankings, setRankings] = useState([])
  const [carregandoRanking, setCarregandoRanking] = useState(true)
  const [erroRanking, setErroRanking] = useState('')

  const intervaloRef = useRef(null)
  const finalizandoRef = useRef(false)

  const carregarRanking = useCallback(async () => {
    setCarregandoRanking(true)
    setErroRanking('')
    try {
      const dados = await getRankings()
      setRankings(Array.isArray(dados) ? dados : [])
    } catch {
      setErroRanking('Não foi possível carregar o ranking. Verifique a API e tente novamente.')
    } finally {
      setCarregandoRanking(false)
    }
  }, [])

  useEffect(() => {
    carregarRanking()
  }, [carregarRanking])

  const limparIntervalo = useCallback(() => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current)
      intervaloRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => limparIntervalo()
  }, [limparIntervalo])

  const concluirSessao = useCallback(async () => {
    if (finalizandoRef.current) return
    finalizandoRef.current = true
    limparIntervalo()
    setStatusSessao('concluida')
    setSegundosRestantes(0)
    setSalvando(true)
    setErroSessao('')
    setMensagemSessao('')
    try {
      await registrarSessaoConcluida(nome)
      setMensagemSessao('Sessão concluída! 25 minutos adicionados ao seu tempo total.')
      await carregarRanking()
    } catch {
      setErroSessao('Não foi possível registrar a sessão concluída. Tente novamente mais tarde.')
    } finally {
      setSalvando(false)
      finalizandoRef.current = false
    }
  }, [carregarRanking, limparIntervalo, nome])

  useEffect(() => {
    if (statusSessao !== 'executando') return

    intervaloRef.current = setInterval(() => {
      setSegundosRestantes((atual) => {
        if (atual <= 1) {
          return 0
        }
        return atual - 1
      })
    }, 1000)

    return () => limparIntervalo()
  }, [statusSessao, limparIntervalo])

  useEffect(() => {
    if (statusSessao === 'executando' && segundosRestantes === 0) {
      concluirSessao()
    }
  }, [statusSessao, segundosRestantes, concluirSessao])

  function iniciarFoco() {
    if (statusSessao === 'executando') return
    if (!nome.trim()) {
      setMensagemValidacao('Informe seu nome antes de iniciar o foco.')
      return
    }
    setMensagemValidacao('')
    setErroSessao('')
    setMensagemSessao('')
    finalizandoRef.current = false
    setSegundosRestantes(DURACAO_SESSAO)
    setStatusSessao('executando')
  }

  function desistir() {
    if (statusSessao !== 'executando') return
    limparIntervalo()
    finalizandoRef.current = false
    setStatusSessao('interrompida')
    setSegundosRestantes(DURACAO_SESSAO)
    setErroSessao(MENSAGEM_FOCO_QUEBRADO)
    setMensagemSessao('')
  }

  function aoAlterarNome(valor) {
    setNome(valor)
    if (mensagemValidacao) setMensagemValidacao('')
  }

  const emExecucao = statusSessao === 'executando'

  return (
    <main className="pagina-pomodoro">
      <header className="cabecalho">
        <p className="subtitulo">Atelier do Tempo</p>
        <h1>Pomodoro Ranqueado</h1>
        <p className="descricao">
          Dedique 25 minutos de foco absoluto e eternize seu progresso no ranking.
        </p>
      </header>

      <div className="conteudo">
        <section className="coluna-principal">
          {/* TimerCard: primary focus */}
          <div className="timer-card painel">
            <div className="timer-hero">
              <TimerDisplay
                segundosRestantes={segundosRestantes}
                emExecucao={emExecucao}
                status={statusSessao}
              />
            </div>
            <div className="timer-meta">
              <span className="meta-item">Participantes: {rankings.length}</span>
              <span className="meta-item">Duração padrão: 25 min</span>
            </div>
          </div>

          {/* Controls placed close to timer for better UX */}
          <div className="controls-bar painel">
            <ControlesSessao
              nome={nome}
              onNomeChange={aoAlterarNome}
              onIniciar={iniciarFoco}
              onDesistir={desistir}
              emExecucao={emExecucao}
              erroValidacao={mensagemValidacao}
            />
          </div>

          <section className="painel mensagens-painel" aria-live="polite">
            {salvando ? <p className="mensagem">Registrando sessão na API...</p> : null}
            {mensagemSessao ? <p className="mensagem sucesso">{mensagemSessao}</p> : null}
            {erroSessao ? <p className="mensagem erro">{erroSessao}</p> : null}
          </section>

          {/* Session history placeholder (keeps existing structure) */}
        </section>

        <aside className="coluna-ranking">
          <Ranking
            itens={rankings}
            carregando={carregandoRanking}
            erro={erroRanking}
            onTentarNovamente={carregarRanking}
          />
        </aside>
      </div>
    </main>
  )
}

export default PomodoroPage
