import React from 'react'

import styles from './Gallery.module.css'
import { ImageCard, ImageCardProps } from '../ImageCard/ImageCard'

export interface GalleryProps {
  items: ImageCardProps[]
}

export const Gallery: React.FC<GalleryProps> = ({ items }) => {
  return (
    <div className={styles.gallery}>
      {items.map((item, index) => (
        <div key={index} className={styles.galleryItem}>
          <ImageCard {...item} />
        </div>
      ))}
    </div>
  )
}