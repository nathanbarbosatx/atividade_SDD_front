import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./pages/PomodoroPage', () => ({
  default: () => <main data-testid="pagina-pomodoro-mock" />,
}))

describe('App', () => {
  it('renderiza a página do Pomodoro', () => {
    render(<App />)

    expect(screen.getByTestId('pagina-pomodoro-mock')).toBeInTheDocument()
  })
})
