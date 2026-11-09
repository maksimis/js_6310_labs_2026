import express from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { saveImage,} from '../services/imageService.js';
import { getAlbumImages } from '../services/albumService.js';

const UPLOAD_DIR = path.resolve('uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const app = express();
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

// POST /api/images — загрузка изображения
app.post('/api/images', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Файл не передан (поле "image")' });
  }
  const result = saveImage({
    filename: req.file.filename,
    mime: req.file.mimetype,
    size: req.file.size,
    ownerId: req.body.ownerId || 'api-user',
  });
  if (!result.ok) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: result.error });
  }
  return res.status(201).json({ id: result.image.id, url: result.image.url });
});

// GET /api/albums/:albumId/images — список изображений альбома
app.get('/api/albums/:albumId/images', (req, res) => {
  const { albumId } = req.params;
  if (!albumId) return res.status(400).json({ error: 'albumId обязателен' });
  const result = getAlbumImages(albumId);
  if (!result.ok) return res.status(404).json({ error: result.error });
  return res.json(result.images);
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

export default app;