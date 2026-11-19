import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PomodoroPage from './PomodoroPage'
import { getRankings, registrarSessaoConcluida } from '../api/rankings'

vi.mock('../api/rankings', () => ({
  getRankings: vi.fn(),
  registrarSessaoConcluida: vi.fn(),
}))

const getRankingsMock = vi.mocked(getRankings)
const registrarMock = vi.mocked(registrarSessaoConcluida)

const PARTICIPANTE = {
  id: '1',
  nome: 'Arthur',
  tempoTotalMinutos: 150,
  dataUltimoFoco: '2026-11-12T19:30:00Z',
}
const MENSAGEM_VALIDACAO = 'Informe seu nome antes de iniciar o foco.'
const MENSAGEM_ERRO_RANKING =
  'Não foi possível carregar o ranking. Verifique a API e tente novamente.'
const MENSAGEM_ERRO_REGISTRO =
  'Não foi possível registrar a sessão concluída. Tente novamente mais tarde.'
const MENSAGEM_SUCESSO =
  'Sessão concluída! 25 minutos adicionados ao seu tempo total.'
const MENSAGEM_FOCO_QUEBRADO =
  'Foco quebrado! Esta sessão foi invalidada e não somará pontos no ranking.'

async function flush() {
  await act(async () => {
    for (let i = 0; i < 10; i += 1) {
      await Promise.resolve()
    }
  })
}

async function montar() {
  render(<PomodoroPage />)
  await flush()
}

function digitarNome(valor) {
  fireEvent.change(screen.getByLabelText('Nome do participante'), {
    target: { value: valor },
  })
}

function iniciarSessao(nome = 'Ana') {
  digitarNome(nome)
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar Foco' }))
}

function promessaPendente() {
  let resolver
  let rejeitar
  const promessa = new Promise((res, rej) => {
    resolver = res
    rejeitar = rej
  })
  return { promessa, resolver, rejeitar }
}

beforeEach(() => {
  getRankingsMock.mockReset()
  registrarMock.mockReset()
  getRankingsMock.mockResolvedValue([])
})

afterEach(() => {
  vi.useRealTimers()
})

describe('carregamento do ranking', () => {
  it('exibe o ranking carregado', async () => {
    getRankingsMock.mockResolvedValue([PARTICIPANTE])

    await montar()

    expect(screen.getByText('Participantes: 1')).toBeInTheDocument()
    expect(screen.getByText('Arthur')).toBeInTheDocument()
    expect(screen.queryByText('Carregando ranking...')).not.toBeInTheDocument()
  })

  it('trata resposta que não é lista', async () => {
    getRankingsMock.mockResolvedValue(null)

    await montar()

    expect(screen.getByText('Participantes: 0')).toBeInTheDocument()
    expect(
      screen.getByText('Nenhum participante registrado ainda.')
    ).toBeInTheDocument()
  })

  it('exibe erro e recarrega ao tentar novamente', async () => {
    getRankingsMock.mockRejectedValueOnce(new Error('falha'))

    await montar()

    expect(screen.getByText(MENSAGEM_ERRO_RANKING)).toBeInTheDocument()

    getRankingsMock.mockResolvedValueOnce([PARTICIPANTE])
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    await flush()

    expect(screen.getByText('Arthur')).toBeInTheDocument()
  })

  it('trata retry com resposta que não é lista', async () => {
    getRankingsMock.mockRejectedValueOnce(new Error('falha'))

    await montar()

    getRankingsMock.mockResolvedValueOnce({})
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    await flush()

    expect(screen.getByText('Participantes: 0')).toBeInTheDocument()
  })

  it('mantém o erro quando o retry falha', async () => {
    getRankingsMock.mockRejectedValueOnce(new Error('falha'))

    await montar()

    getRankingsMock.mockRejectedValueOnce(new Error('falha de novo'))
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    await flush()

    expect(screen.getByText(MENSAGEM_ERRO_RANKING)).toBeInTheDocument()
  })

  it('ignora resposta após desmontar', async () => {
    const pendente = promessaPendente()
    getRankingsMock.mockReturnValue(pendente.promessa)

    const { unmount } = render(<PomodoroPage />)
    unmount()
    pendente.resolver([PARTICIPANTE])
    await flush()

    expect(screen.queryByText('Arthur')).not.toBeInTheDocument()
  })

  it('ignora erro após desmontar', async () => {
    const pendente = promessaPendente()
    getRankingsMock.mockReturnValue(pendente.promessa)

    const { unmount } = render(<PomodoroPage />)
    unmount()
    pendente.rejeitar(new Error('falha'))
    await flush()

    expect(screen.queryByText(MENSAGEM_ERRO_RANKING)).not.toBeInTheDocument()
  })
})

describe('validação do nome', () => {
  it('bloqueia o início sem nome e limpa a mensagem ao digitar', async () => {
    await montar()

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Foco' }))
    expect(screen.getByText(MENSAGEM_VALIDACAO)).toBeInTheDocument()

    digitarNome('   ')
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Foco' }))
    expect(screen.getByText(MENSAGEM_VALIDACAO)).toBeInTheDocument()

    digitarNome('Ana')
    expect(screen.queryByText(MENSAGEM_VALIDACAO)).not.toBeInTheDocument()

    digitarNome('An')
    expect(screen.queryByText(MENSAGEM_VALIDACAO)).not.toBeInTheDocument()
  })
})

describe('execução da sessão', () => {
  it('inicia a contagem com nome válido', async () => {
    await montar()

    iniciarSessao()

    expect(screen.getByText('Foco em andamento')).toBeInTheDocument()
    expect(screen.getByText('25:00')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome do participante')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Iniciar Foco' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Desistir' })).toBeEnabled()
  })

  it('atualiza a contagem e conclui a sessão', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-18T12:00:00.000Z'))
    await montar()

    iniciarSessao()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000)
    })

    expect(screen.getByText('24:59')).toBeInTheDocument()

    await act(async () => {
      vi.setSystemTime(new Date(Date.now() + 25 * 60 * 1000))
      await vi.advanceTimersByTimeAsync(250)
    })
    await flush()

    expect(screen.getByText('Sessão concluída')).toBeInTheDocument()
    expect(screen.getByText('00:00')).toBeInTheDocument()
    expect(screen.getByText(MENSAGEM_SUCESSO)).toBeInTheDocument()
    expect(registrarMock).toHaveBeenCalledWith('Ana', {
      verificarDuplicidade: false,
    })
  })

  it('exibe o aviso de registrando durante a gravação', async () => {
    vi.useFakeTimers()
    const pendente = promessaPendente()
    registrarMock.mockReturnValueOnce(pendente.promessa)
    await montar()

    iniciarSessao()
    await act(async () => {
      vi.setSystemTime(new Date(Date.now() + 25 * 60 * 1000))
      await vi.advanceTimersByTimeAsync(250)
    })

    expect(screen.getByText('Registrando sessão na API...')).toBeInTheDocument()

    pendente.resolver({})
    await flush()

    expect(screen.getByText(MENSAGEM_SUCESSO)).toBeInTheDocument()
  })

  it('desiste sem registrar tempo parcial', async () => {
    vi.useFakeTimers()
    await montar()

    iniciarSessao()
    fireEvent.click(screen.getByRole('button', { name: 'Desistir' }))

    expect(screen.getByText('Sessão interrompida')).toBeInTheDocument()
    expect(screen.getByText(MENSAGEM_FOCO_QUEBRADO)).toBeInTheDocument()
    expect(screen.getByText('25:00')).toBeInTheDocument()
    expect(registrarMock).not.toHaveBeenCalled()
    expect(
      screen.queryByRole('button', { name: 'Tentar registrar novamente' })
    ).not.toBeInTheDocument()
  })
})

describe('registro da sessão', () => {
  async function concluirComFalha() {
    vi.useFakeTimers()
    registrarMock.mockRejectedValueOnce(new Error('falha'))
    await montar()

    iniciarSessao()
    await act(async () => {
      vi.setSystemTime(new Date(Date.now() + 25 * 60 * 1000))
      await vi.advanceTimersByTimeAsync(250)
    })
    await flush()
  }

  it('exibe erro e permite tentar novamente com sucesso', async () => {
    await concluirComFalha()

    expect(screen.getByText(MENSAGEM_ERRO_REGISTRO)).toBeInTheDocument()

    registrarMock.mockResolvedValueOnce({})
    fireEvent.click(
      screen.getByRole('button', { name: 'Tentar registrar novamente' })
    )
    await flush()

    expect(screen.getByText(MENSAGEM_SUCESSO)).toBeInTheDocument()
    expect(registrarMock).toHaveBeenLastCalledWith('Ana', {
      verificarDuplicidade: true,
    })
    expect(
      screen.queryByRole('button', { name: 'Tentar registrar novamente' })
    ).not.toBeInTheDocument()
  })

  it('mantém o erro quando o retry também falha', async () => {
    await concluirComFalha()

    registrarMock.mockRejectedValueOnce(new Error('falha de novo'))
    fireEvent.click(
      screen.getByRole('button', { name: 'Tentar registrar novamente' })
    )
    await flush()

    expect(screen.getByText(MENSAGEM_ERRO_REGISTRO)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Tentar registrar novamente' })
    ).toBeInTheDocument()
  })
})
