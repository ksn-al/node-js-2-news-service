import express from 'express';
import path from 'path';
import authRouter from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { logger } from './logger';
import passport, { requireAuth } from './passport';
import newspostsRouter from './routes/newsposts';
import userRouter from './routes/user';

const app = express();

// Middleware
app.use(express.json());
app.use(requestLogger);
app.use(passport.initialize());

// API маршруты
app.use('/auth', authRouter);
app.use('/api/newsposts', requireAuth, newspostsRouter);
app.use('/user', userRouter);

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

app.use(errorHandler);

// Запуск сервера
const HOST = process.env.HOST || 'localhost';
const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, HOST, () => {
  logger.info(`Server started at http://${HOST}:${PORT}`);
});
