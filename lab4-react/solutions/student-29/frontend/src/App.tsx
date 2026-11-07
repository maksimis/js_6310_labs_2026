import { useState } from 'react'

import { Gallery } from '@my-app/ui-library'

import type { ImageCardProps } from '@my-app/ui-library'
import '@my-app/ui-library/style.css'

import './App.css'

// Тестовые данные для галереи
const initialImages: ImageCardProps[] = [
  {
    imageUrl: '/images/sea.jpg',
    title: 'Закат на море',
    album: 'Природа',
    onDownload: () => downloadImage('/images/sea.jpg', 'sea.jpg'),
    onDelete: () => alert('Удаление: Закат на море'),
  },
  {
    imageUrl: '/images/mount.jpg',
    title: 'Горный пейзаж',
    album: 'Путешествия',
    onDownload: () => downloadImage('/images/mount.jpg', 'mount.jpg'),
    onDelete: () => alert('Удаление: Горный пейзаж'),
  },
  {
    imageUrl: '/images/city.jpg',
    title: 'Городские огни',
    album: 'Города',
    onDownload: () => downloadImage('/images/city.jpg', 'city.jpg'),
    onDelete: () => alert('Удаление: Городские огни'),
  },
  {
    imageUrl: '/images/les.png',
    title: 'Лесная тропа',
    album: 'Природа',
    onDownload: () => downloadImage('/images/les.png', 'les.png'),
    onDelete: () => alert('Удаление: Лесная тропа'),
  },
  {
    imageUrl: '/images/space.jpg',
    title: 'Космос',
    album: 'Космос',
    onDownload: () => downloadImage('/images/space.jpg', 'space.jpg'),
    onDelete: () => alert('Удаление: Космос'),
  },
]

const downloadImage = (url: string, filename: string) => {
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function App() {
  const [images, setImages] = useState(initialImages)

  const handleDelete = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const imagesWithDelete = images.map((img, index) => ({
    ...img,
    onDelete: () => handleDelete(index),
  }))

  return (
    <div className="app">
      <header className="app-header">
        <h1>Галерея изображений</h1>
        <p>Демонстрация компонентов Gallery и ImageCard</p>
        
      </header>

      <main className="app-main">
        <section className="section">
          <Gallery items={imagesWithDelete} />
        </section>
      </main>
    </div>
  )
}

export default App