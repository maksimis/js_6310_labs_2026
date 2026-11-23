import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SourcesPanel } from './SourcesPanel'

test('показывает фрагмент, процент релевантности и доступную ссылку', async () => {
  const user = userEvent.setup()

  render(<SourcesPanel sources={[{ id: 'state', title: 'Состояние', excerpt: 'Изменение состояния обновляет интерфейс.', relevance: 0.92, url: '#document-state' }]} />)
  expect(screen.getByText('Изменение состояния обновляет интерфейс.')).toBeInTheDocument()
  expect(screen.getByText('92%')).toBeInTheDocument()
  const link = screen.getByRole('link', { name: 'Открыть источник: Состояние' })

  expect(link).toHaveAttribute('href', '#document-state')
  await user.tab()
  expect(link).toHaveFocus()
})

test('пустой список показывает подсказку вместо ссылок', () => {
  render(<SourcesPanel sources={[]} />)
  expect(screen.getByText('Пока нет найденных фрагментов. Спросите о state, props или эффектах.')).toBeInTheDocument()
  expect(screen.getByLabelText('Найдено источников: 0')).toHaveTextContent('0')
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
})

test('новые данные заменяют источники, проценты округляются', () => {
  const { rerender } = render(<SourcesPanel sources={[{ id: 'a', title: 'Первая', excerpt: 'Один', relevance: 0, url: '#a' }]} />)

  expect(screen.getByLabelText('Релевантность: 0%')).toBeInTheDocument()
  rerender(<SourcesPanel sources={[
    { id: 'b', title: 'Вторая', excerpt: 'Два', relevance: 0.666, url: '#b' },
    { id: 'c', title: 'Третья', excerpt: 'Три', relevance: 1, url: '#c' },
  ]} />)
  expect(screen.queryByText('Первая')).not.toBeInTheDocument()
  expect(screen.getByLabelText('Найдено источников: 2')).toHaveTextContent('2')
  expect(screen.getByLabelText('Релевантность: 67%')).toBeInTheDocument()
  expect(screen.getByLabelText('Релевантность: 100%')).toBeInTheDocument()
  expect(screen.getAllByRole('link')).toHaveLength(2)
})
