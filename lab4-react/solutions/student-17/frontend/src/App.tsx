import { useState } from 'react'
import { BookShelf } from 'ui-library'
import type { Book, ReadingStatus } from 'ui-library'
import './App.css'

const INITIAL_BOOKS: Book[] = [
  { id: '1', title: 'Мастер и Маргарита', author: 'М. Булгаков', cover: '/covers/master.jpg', status: 'read', rating: 5 },
  { id: '2', title: 'JavaScript для чайников', author: 'Крис Минник, Ева Холланд', cover: '/covers/js.png', status: 'reading', rating: 4 },
  { id: '3', title: 'Преступление и наказание', author: 'Ф. Достоевский', cover: '/covers/prest.png', status: 'want', rating: 0 },
  { id: '4', title: 'Гарри Поттер и философский камень', author: 'Дж. Роулинг', cover: '/covers/garry.jpg', status: 'read', rating: 3 },
  { id: '5', title: 'Мара и Морок', author: 'Лия Арден', cover: '/covers/mara.jpg', status: 'want', rating: 0 },
  { id: '6', title: 'Прирожденный профайлер', author: 'Дженнифер Линн Барнс', cover: '/covers/prof.jpg', status: 'reading', rating: 4 },
  { id: '7', title: 'Убийство в старинном особняке', author: 'Андрей Волковский', cover: '/covers/osob.jpg', status: 'want', rating: 0 },
  { id: '8', title: 'Убийство в «Восточном экспрессе»', author: 'Агата Кристи', cover: '/covers/agata.jpg', status: 'want', rating: 0 },
  { id: '9', title: 'Отцы и дети', author: 'И.С. Тургенев', cover: '/covers/otec.jpeg', status: 'want', rating: 0 },
  { id: '10', title: 'Мёртвые души', author: 'Н.В. Гоголь', cover: '/covers/dushi.png', status: 'want', rating: 0 },
]

export function App(): JSX.Element {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS)

  const handleRatingChange = (bookId: string, rating: number): void => {
    setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, rating } : b)))
  }

  const handleStatusChange = (bookId: string, status: ReadingStatus): void => {
    setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, status } : b)))
  }

  return (
    <main className="app">
      <h1>Моя книжная полка</h1>
      <BookShelf
        books={books}
        onRatingChange={handleRatingChange}
        onStatusChange={handleStatusChange}
      />
    </main>
  )
}