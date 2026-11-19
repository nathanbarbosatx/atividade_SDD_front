const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function parseResponse(response) {
  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`)
  }
  if (response.status === 204) return null
  return response.json()
}

export async function getRankings() {
  const response = await fetch(`${API_URL}/rankings`)
  return parseResponse(response)
}

function normalizeName(name) {
  return name.trim().toLocaleLowerCase('pt-BR')
}

const JANELA_DUPLICIDADE_MS = 15000

function foiRegistradaRecentemente(existente, agoraMs) {
  if (!existente?.dataUltimoFoco) return false
  const registradaEm = new Date(existente.dataUltimoFoco).getTime()
  if (Number.isNaN(registradaEm)) return false
  return Math.abs(agoraMs - registradaEm) < JANELA_DUPLICIDADE_MS
}

// O registro lê o ranking e depois grava (POST/PATCH) sem transação atômica.
// Duas conclusões simultâneas do mesmo participante podem gerar lost update.
export async function registrarSessaoConcluida(
  nomeParticipante,
  { verificarDuplicidade = false } = {}
) {
  const nome = nomeParticipante.trim()
  const rankings = await getRankings()
  const existente = (rankings || []).find(
    (item) => normalizeName(item.nome) === normalizeName(nome)
  )
  const agoraMs = Date.now()
  const agora = new Date(agoraMs).toISOString()

  if (verificarDuplicidade && foiRegistradaRecentemente(existente, agoraMs)) {
    return existente
  }

  if (existente) {
    const payload = {
      nome: existente.nome,
      tempoTotalMinutos: Number(existente.tempoTotalMinutos || 0) + 25,
      dataUltimoFoco: agora,
    }
    const response = await fetch(`${API_URL}/rankings/${existente.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return parseResponse(response)
  }

  const payload = {
    nome,
    tempoTotalMinutos: 25,
    dataUltimoFoco: agora,
  }
  const response = await fetch(`${API_URL}/rankings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return parseResponse(response)
}
