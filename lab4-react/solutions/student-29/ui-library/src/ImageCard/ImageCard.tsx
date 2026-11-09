import React from 'react'

import styles from './ImageCard.module.css'

export interface ImageCardProps {
  imageUrl: string
  title: string
  album: string
  onDownload: () => void
  onDelete: () => void
}

export const ImageCard: React.FC<ImageCardProps> = ({
  imageUrl,
  title,
  album,
  onDownload,
  onDelete,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={title} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title} title={title}>
          {title}
        </h3>
        <p className={styles.album}>{album}</p>
        <div className={styles.actions}>
          <button onClick={onDownload} className={`${styles.btn} ${styles.downloadBtn}`}>
            Скачать
          </button>
          <button onClick={onDelete} className={`${styles.btn} ${styles.deleteBtn}`}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}