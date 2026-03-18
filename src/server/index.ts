import express from 'express';
import path from 'path';
import newspostsRouter from './routes/newsposts';

const app = express();

// Middleware
app.use(express.json());

// API маршруты
app.use('/api/newsposts', newspostsRouter);

// Роздача статичних файлів (фронтенд)
const publicPath = path.join(__dirname, '../../client/build');
app.use(express.static(publicPath));

// Головна сторінка
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// SPA fallback для фронтенд-маршрутів (окрім API)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Запуск сервера
const HOST = process.env.HOST || 'localhost';
const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, HOST, () => {
  console.log(`✅ Сервер запущений на http://${HOST}:${PORT}`);
});
