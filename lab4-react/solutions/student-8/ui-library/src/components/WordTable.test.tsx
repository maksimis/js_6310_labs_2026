import { render, screen, fireEvent } from '@testing-library/react';
import { WordTable } from './WordTable';

describe('WordTable', () => {
  const words = [{ id: 1, word: 'dog', translation: 'собака', context: 'The dog barks', contextTranslation: 'Собака лает' }];

  test('раскрывает контекст', () => {
    render(<WordTable words={words} />);
    fireEvent.click(screen.getByText('dog'));
    expect(screen.getByText(/The dog barks/i)).toBeInTheDocument();
  });

  test('раскрывает контекст второго слова', () => {
    const words2 = [{ id: 2, word: 'cat', translation: 'кот', context: 'The cat meows', contextTranslation: 'Кот мяукает' }];
    render(<WordTable words={words2} />);
    fireEvent.click(screen.getByText('cat'));
    expect(screen.getByText(/The cat meows/i)).toBeInTheDocument();
  });
});