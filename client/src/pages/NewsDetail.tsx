import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNewspostById, NewspostData } from '../api';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState<NewspostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!id || Number.isNaN(Number(id))) {
        setError('Некоректний ID новини');
        setLoading(false);
        return;
      }

      try {
        const data = await getNewspostById(Number(id));
        setNews(data);
      } catch (e) {
        setError('Не вдалося завантажити новину');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return <p className="status">Завантаження...</p>;
  }

  if (error || !news) {
    return (
      <div className="page">
        <p className="status error">{error || 'Новину не знайдено'}</p>
        <button type="button" onClick={() => navigate('/')}>
          Повернутися до списку
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-title-block">
        <span className="page-kicker">Перегляд новини</span>
        <h1>{news.title}</h1>
        <p className="page-subtitle">
          Жанр: {news.genre} | {news.isPrivate ? 'Приватна' : 'Публічна'} | Автор: {news.author?.email || 'Невідомий'}
        </p>
      </div>

      <div className="content-panel">
        <p className="detail-text">{news.text}</p>
      </div>

      <div className="actions-row">
        <button type="button" onClick={() => navigate(`/newsposts/${news.id}/edit`)}>
          Редагувати
        </button>
        <button type="button" onClick={() => navigate('/')}>
          Повернутися до списку
        </button>
      </div>
    </div>
  );
}
