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
  const fimSessaoRef = useRef(null)

  const buscarRanking = useCallback(async () => {
    try {
      const dados = await getRankings()
      setRankings(Array.isArray(dados) ? dados : [])
      setErroRanking('')
    } catch {
      setErroRanking('Não foi possível carregar o ranking. Verifique a API e tente novamente.')
    }
  }, [])

  const carregarRanking = useCallback(async () => {
    setCarregandoRanking(true)
    setErroRanking('')
    try {
      await buscarRanking()
    } finally {
      setCarregandoRanking(false)
    }
  }, [buscarRanking])

  useEffect(() => {
    let ativo = true
    getRankings()
      .then((dados) => {
        if (!ativo) return
        setRankings(Array.isArray(dados) ? dados : [])
        setErroRanking('')
      })
      .catch(() => {
        if (ativo) {
          setErroRanking('Não foi possível carregar o ranking. Verifique a API e tente novamente.')
        }
      })
      .finally(() => {
        if (ativo) setCarregandoRanking(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  const limparIntervalo = useCallback(() => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current)
      intervaloRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => limparIntervalo()
  }, [limparIntervalo])

  const registrarSessao = useCallback(
    async (verificarDuplicidade = false) => {
      setSalvando(true)
      setErroSessao('')
      setMensagemSessao('')
      try {
        await registrarSessaoConcluida(nome, { verificarDuplicidade })
        setMensagemSessao('Sessão concluída! 25 minutos adicionados ao seu tempo total.')
        await carregarRanking()
      } catch {
        setErroSessao('Não foi possível registrar a sessão concluída. Tente novamente mais tarde.')
      } finally {
        setSalvando(false)
        finalizandoRef.current = false
      }
    },
    [carregarRanking, nome]
  )

  const concluirSessao = useCallback(async () => {
    if (finalizandoRef.current) return
    finalizandoRef.current = true
    fimSessaoRef.current = null
    limparIntervalo()
    setStatusSessao('concluida')
    setSegundosRestantes(0)
    await registrarSessao(false)
  }, [limparIntervalo, registrarSessao])

  useEffect(() => {
    if (statusSessao !== 'executando') return

    const tick = () => {
      const restante = Math.max(
        0,
        Math.ceil(((fimSessaoRef.current ?? Date.now()) - Date.now()) / 1000)
      )
      setSegundosRestantes(restante)
      if (restante === 0) {
        concluirSessao()
      }
    }

    intervaloRef.current = setInterval(tick, 250)

    return () => limparIntervalo()
  }, [statusSessao, limparIntervalo, concluirSessao])

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
    fimSessaoRef.current = Date.now() + DURACAO_SESSAO * 1000
    setSegundosRestantes(DURACAO_SESSAO)
    setStatusSessao('executando')
  }

  function desistir() {
    if (statusSessao !== 'executando') return
    limparIntervalo()
    finalizandoRef.current = false
    fimSessaoRef.current = null
    setStatusSessao('interrompida')
    setSegundosRestantes(DURACAO_SESSAO)
    setErroSessao(MENSAGEM_FOCO_QUEBRADO)
    setMensagemSessao('')
  }

  function tentarRegistrarNovamente() {
    if (statusSessao !== 'concluida' || salvando) return
    finalizandoRef.current = true
    registrarSessao(true)
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
            {erroSessao && statusSessao === 'concluida' && !salvando ? (
              <button
                type="button"
                className="botao botao-secundario"
                onClick={tentarRegistrarNovamente}
              >
                Tentar registrar novamente
              </button>
            ) : null}
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
