import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Ranking from './Ranking'

function renderizar(props = {}) {
  const onTentarNovamente = vi.fn()

  render(
    <Ranking
      itens={[]}
      carregando={false}
      erro=""
      onTentarNovamente={onTentarNovamente}
      {...props}
    />
  )

  return { onTentarNovamente }
}

describe('Ranking', () => {
  it('exibe o estado de carregamento', () => {
    renderizar({ carregando: true })

    expect(screen.getByText('Carregando ranking...')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('exibe erro e permite nova tentativa', () => {
    const { onTentarNovamente } = renderizar({ erro: 'Falha ao carregar' })

    expect(screen.getByText('Falha ao carregar')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onTentarNovamente).toHaveBeenCalledTimes(1)
  })

  it('exibe o estado vazio', () => {
    renderizar()

    expect(screen.getByText('Nenhum participante registrado ainda.')).toBeInTheDocument()
  })

  it('ordena e destaca o top 3 com medalhas', () => {
    renderizar({
      itens: [
        { id: '3', nome: 'Caio', tempoTotalMinutos: 100 },
        { nome: 'Bia', tempoTotalMinutos: 125 },
        { id: '1', nome: 'Ana', tempoTotalMinutos: 150 },
      ],
    })

    const itens = screen.getAllByRole('listitem')

    expect(itens).toHaveLength(3)
    expect(within(itens[0]).getByText('Ana')).toBeInTheDocument()
    expect(within(itens[0]).getByText('🥇')).toBeInTheDocument()
    expect(within(itens[1]).getByText('Bia')).toBeInTheDocument()
    expect(within(itens[1]).getByText('🥈')).toBeInTheDocument()
    expect(within(itens[2]).getByText('Caio')).toBeInTheDocument()
    expect(within(itens[2]).getByText('🥉')).toBeInTheDocument()
  })

  it('ordena participantes sem tempo informado', () => {
    renderizar({
      itens: [
        { nome: 'Ana' },
        { nome: 'Bia' },
        { nome: 'Caio' },
      ],
    })

    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('não exibe a tabela completa com até 3 participantes', () => {
    renderizar({
      itens: [
        { id: '1', nome: 'Ana', tempoTotalMinutos: 150 },
        { id: '2', nome: 'Bia', tempoTotalMinutos: 125 },
        { id: '3', nome: 'Caio', tempoTotalMinutos: 100 },
      ],
    })

    expect(screen.queryByText(/Ver ranking completo/)).not.toBeInTheDocument()
  })

  it('exibe a tabela completa com mais de 3 participantes', () => {
    renderizar({
      itens: [
        { id: '1', nome: 'Ana', tempoTotalMinutos: 150 },
        { id: '2', nome: 'Bia', tempoTotalMinutos: 125 },
        { id: '3', nome: 'Caio', tempoTotalMinutos: 100 },
        { nome: 'Duda' },
      ],
    })

    expect(screen.getByText('Ver ranking completo (4)')).toBeInTheDocument()
    expect(screen.getAllByText('🥇')).toHaveLength(2)
    expect(screen.getAllByText('🥈')).toHaveLength(2)
    expect(screen.getAllByText('🥉')).toHaveLength(2)
    expect(screen.getByText('4º')).toBeInTheDocument()
    expect(screen.getByText('Duda')).toBeInTheDocument()
  })
})
