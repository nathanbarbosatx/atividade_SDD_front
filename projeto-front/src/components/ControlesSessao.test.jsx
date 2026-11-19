import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ControlesSessao from './ControlesSessao'

function renderizar(props = {}) {
  const callbacks = {
    onNomeChange: vi.fn(),
    onIniciar: vi.fn(),
    onDesistir: vi.fn(),
  }

  render(
    <ControlesSessao
      nome=""
      emExecucao={false}
      erroValidacao=""
      {...callbacks}
      {...props}
    />
  )

  return callbacks
}

describe('ControlesSessao', () => {
  it('renderiza campo e botões', () => {
    renderizar()

    expect(screen.getByLabelText('Nome do participante')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Iniciar Foco' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Desistir' })).toBeInTheDocument()
  })

  it('propaga a alteração do nome', () => {
    const { onNomeChange } = renderizar()

    fireEvent.change(screen.getByLabelText('Nome do participante'), {
      target: { value: 'Ana' },
    })

    expect(onNomeChange).toHaveBeenCalledWith('Ana')
  })

  it('aciona o início do foco', () => {
    const { onIniciar } = renderizar()

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Foco' }))

    expect(onIniciar).toHaveBeenCalledTimes(1)
  })

  it('aciona a desistência durante a execução', () => {
    const { onDesistir } = renderizar({ emExecucao: true })

    fireEvent.click(screen.getByRole('button', { name: 'Desistir' }))

    expect(onDesistir).toHaveBeenCalledTimes(1)
  })

  it('desabilita entrada e início durante a execução', () => {
    renderizar({ emExecucao: true })

    expect(screen.getByLabelText('Nome do participante')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Iniciar Foco' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Desistir' })).toBeEnabled()
  })

  it('habilita entrada e início fora da execução', () => {
    renderizar({ emExecucao: false })

    expect(screen.getByLabelText('Nome do participante')).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Iniciar Foco' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Desistir' })).toBeDisabled()
  })

  it('exibe mensagem de validação', () => {
    renderizar({ erroValidacao: 'Informe seu nome' })

    expect(screen.getByText('Informe seu nome')).toBeInTheDocument()
  })

  it('não exibe mensagem sem validação', () => {
    renderizar()

    expect(screen.queryByText('Informe seu nome')).not.toBeInTheDocument()
  })
})
