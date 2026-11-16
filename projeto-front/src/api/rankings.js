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

export async function registrarSessaoConcluida(nomeParticipante) {
  const nome = nomeParticipante.trim()
  const rankings = await getRankings()
  const existente = (rankings || []).find(
    (item) => normalizeName(item.nome) === normalizeName(nome)
  )
  const agora = new Date().toISOString()

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
