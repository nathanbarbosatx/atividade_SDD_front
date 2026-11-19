import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getRankings, registrarSessaoConcluida } from './rankings'

const URL_PADRAO = 'http://localhost:3001'
const AGORA = new Date('2026-11-18T12:00:00.000Z')

const fetchMock = vi.fn()

function respostaJson(dados, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(dados),
  }
}

function respostaSemConteudo(status = 204) {
  return { ok: true, status, json: vi.fn() }
}

function congelarTempo() {
  vi.useFakeTimers()
  vi.setSystemTime(AGORA)
}

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock)
  fetchMock.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('getRankings', () => {
  it('retorna os dados da API', async () => {
    fetchMock.mockResolvedValueOnce(respostaJson([{ id: '1' }]))

    const dados = await getRankings()

    expect(dados).toEqual([{ id: '1' }])
    expect(fetchMock).toHaveBeenCalledWith(`${URL_PADRAO}/rankings`)
  })

  it('lança erro quando a resposta não é ok', async () => {
    fetchMock.mockResolvedValueOnce(respostaJson(null, 500))

    await expect(getRankings()).rejects.toThrow('Erro na API: 500')
  })

  it('retorna null quando a resposta não tem conteúdo', async () => {
    fetchMock.mockResolvedValueOnce(respostaSemConteudo())

    await expect(getRankings()).resolves.toBeNull()
  })
})

describe('configuração da URL', () => {
  it('usa a URL padrão quando VITE_API_URL não está definido', async () => {
    fetchMock.mockResolvedValueOnce(respostaJson([]))

    await getRankings()

    expect(fetchMock).toHaveBeenCalledWith(`${URL_PADRAO}/rankings`)
  })

  it('usa VITE_API_URL quando definido', async () => {
    vi.stubEnv('VITE_API_URL', 'http://api.exemplo')
    vi.resetModules()
    fetchMock.mockResolvedValueOnce(respostaJson([]))

    const modulo = await import('./rankings')
    await modulo.getRankings()

    expect(fetchMock).toHaveBeenCalledWith('http://api.exemplo/rankings')
  })
})

describe('registrarSessaoConcluida', () => {
  it('atualiza participante existente com +25 minutos', async () => {
    congelarTempo()
    fetchMock
      .mockResolvedValueOnce(
        respostaJson([
          {
            id: '1',
            nome: '  ARTHUR  ',
            tempoTotalMinutos: 150,
            dataUltimoFoco: '2026-11-12T19:30:00Z',
          },
        ])
      )
      .mockResolvedValueOnce(respostaJson({ id: '1', tempoTotalMinutos: 175 }))

    const resultado = await registrarSessaoConcluida('  arthur  ')

    expect(fetchMock).toHaveBeenNthCalledWith(2, `${URL_PADRAO}/rankings/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: '  ARTHUR  ',
        tempoTotalMinutos: 175,
        dataUltimoFoco: AGORA.toISOString(),
      }),
    })
    expect(resultado).toEqual({ id: '1', tempoTotalMinutos: 175 })
  })

  it('cria participante quando o nome não existe', async () => {
    congelarTempo()
    fetchMock
      .mockResolvedValueOnce(
        respostaJson([{ id: '1', nome: 'Arthur', tempoTotalMinutos: 150 }])
      )
      .mockResolvedValueOnce(respostaJson({ id: '2' }, 201))

    await registrarSessaoConcluida('  Novo  ')

    expect(fetchMock).toHaveBeenNthCalledWith(2, `${URL_PADRAO}/rankings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Novo',
        tempoTotalMinutos: 25,
        dataUltimoFoco: AGORA.toISOString(),
      }),
    })
  })

  it('trata lista nula como vazia e cria participante', async () => {
    congelarTempo()
    fetchMock
      .mockResolvedValueOnce(respostaSemConteudo())
      .mockResolvedValueOnce(respostaJson({ id: '2' }, 201))

    await registrarSessaoConcluida('Ana')

    expect(fetchMock.mock.calls[1][1].method).toBe('POST')
  })

  it('trata tempoTotalMinutos ausente como zero', async () => {
    congelarTempo()
    fetchMock
      .mockResolvedValueOnce(
        respostaJson([
          { id: '1', nome: 'Ana', dataUltimoFoco: '2026-11-12T19:30:00Z' },
        ])
      )
      .mockResolvedValueOnce(respostaJson({}))

    await registrarSessaoConcluida('Ana')

    const corpo = JSON.parse(fetchMock.mock.calls[1][1].body)
    expect(corpo.tempoTotalMinutos).toBe(25)
  })

  it('propaga erro ao atualizar participante', async () => {
    fetchMock
      .mockResolvedValueOnce(
        respostaJson([{ id: '1', nome: 'Ana', tempoTotalMinutos: 25 }])
      )
      .mockResolvedValueOnce(respostaJson(null, 500))

    await expect(registrarSessaoConcluida('Ana')).rejects.toThrow('Erro na API: 500')
  })

  it('propaga erro ao criar participante', async () => {
    fetchMock
      .mockResolvedValueOnce(respostaJson([]))
      .mockResolvedValueOnce(respostaJson(null, 500))

    await expect(registrarSessaoConcluida('Ana')).rejects.toThrow('Erro na API: 500')
  })
})

describe('proteção contra duplicidade', () => {
  it('não grava quando o registro é recente', async () => {
    congelarTempo()
    const existente = {
      id: '1',
      nome: 'Ana',
      tempoTotalMinutos: 50,
      dataUltimoFoco: AGORA.toISOString(),
    }
    fetchMock.mockResolvedValueOnce(respostaJson([existente]))

    const resultado = await registrarSessaoConcluida('ana', {
      verificarDuplicidade: true,
    })

    expect(resultado).toEqual(existente)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('grava quando dataUltimoFoco é inválida', async () => {
    congelarTempo()
    fetchMock
      .mockResolvedValueOnce(
        respostaJson([
          {
            id: '1',
            nome: 'Ana',
            tempoTotalMinutos: 50,
            dataUltimoFoco: 'data-invalida',
          },
        ])
      )
      .mockResolvedValueOnce(respostaJson({}))

    await registrarSessaoConcluida('ana', { verificarDuplicidade: true })

    expect(fetchMock.mock.calls[1][1].method).toBe('PATCH')
  })

  it('grava quando não há dataUltimoFoco', async () => {
    congelarTempo()
    fetchMock
      .mockResolvedValueOnce(
        respostaJson([{ id: '1', nome: 'Ana', tempoTotalMinutos: 50 }])
      )
      .mockResolvedValueOnce(respostaJson({}))

    await registrarSessaoConcluida('ana', { verificarDuplicidade: true })

    expect(fetchMock.mock.calls[1][1].method).toBe('PATCH')
  })

  it('grava quando o registro é antigo', async () => {
    congelarTempo()
    fetchMock
      .mockResolvedValueOnce(
        respostaJson([
          {
            id: '1',
            nome: 'Ana',
            tempoTotalMinutos: 50,
            dataUltimoFoco: '2026-11-12T19:30:00Z',
          },
        ])
      )
      .mockResolvedValueOnce(respostaJson({}))

    await registrarSessaoConcluida('ana', { verificarDuplicidade: true })

    expect(fetchMock.mock.calls[1][1].method).toBe('PATCH')
  })

  it('grava quando a verificação de duplicidade está desligada', async () => {
    congelarTempo()
    fetchMock
      .mockResolvedValueOnce(
        respostaJson([
          {
            id: '1',
            nome: 'Ana',
            tempoTotalMinutos: 50,
            dataUltimoFoco: AGORA.toISOString(),
          },
        ])
      )
      .mockResolvedValueOnce(respostaJson({}))

    await registrarSessaoConcluida('ana')

    expect(fetchMock.mock.calls[1][1].method).toBe('PATCH')
  })

  it('grava quando não existe participante com o nome', async () => {
    congelarTempo()
    fetchMock
      .mockResolvedValueOnce(
        respostaJson([
          {
            id: '1',
            nome: 'Outro',
            tempoTotalMinutos: 50,
            dataUltimoFoco: AGORA.toISOString(),
          },
        ])
      )
      .mockResolvedValueOnce(respostaJson({ id: '2' }, 201))

    await registrarSessaoConcluida('Novo', { verificarDuplicidade: true })

    expect(fetchMock.mock.calls[1][1].method).toBe('POST')
  })
})
