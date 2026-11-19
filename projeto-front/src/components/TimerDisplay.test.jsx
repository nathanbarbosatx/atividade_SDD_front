import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TimerDisplay from './TimerDisplay'

function renderizar(props = {}) {
  return render(
    <TimerDisplay
      segundosRestantes={1500}
      emExecucao={false}
      status="ociosa"
      {...props}
    />
  )
}

describe('TimerDisplay', () => {
  it.each([
    ['interrompida', false, 'Sessão interrompida'],
    ['concluida', false, 'Sessão concluída'],
    ['executando', true, 'Foco em andamento'],
    ['ociosa', false, 'Pronto para iniciar'],
  ])('exibe o rótulo do status %s', (status, emExecucao, rotulo) => {
    renderizar({ status, emExecucao })

    expect(screen.getByText(rotulo)).toBeInTheDocument()
  })

  it('aplica a classe ativo durante a execução', () => {
    const { container } = renderizar({ emExecucao: true })

    expect(container.querySelector('.timer-display')).toHaveClass('ativo')
  })

  it('não aplica a classe ativo fora da execução', () => {
    const { container } = renderizar({ emExecucao: false })

    expect(container.querySelector('.timer-display')).not.toHaveClass('ativo')
  })

  it.each([
    [1500, '25:00'],
    [0, '00:00'],
    [65, '01:05'],
    [9, '00:09'],
  ])('formata %i segundos como %s', (segundos, esperado) => {
    renderizar({ segundosRestantes: segundos })

    expect(screen.getByText(esperado)).toBeInTheDocument()
  })

  it.each([
    [1500, '0'],
    [750, '141'],
    [0, '283'],
    [2000, '0'],
    [-10, '283'],
  ])('calcula o anel para %i segundos', (segundos, dashOffset) => {
    const { container } = renderizar({ segundosRestantes: segundos })

    expect(container.querySelector('.ring-progress')).toHaveAttribute(
      'stroke-dashoffset',
      dashOffset
    )
  })
})
