import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllNewsposts, NewspostData } from '../api';

export default function NewsList() {
  const [newsposts, setNewsposts] = useState<NewspostData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAllNewsposts();
        setNewsposts(data);
      } catch (error) {
        console.error('Не вдалося завантажити новини', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <p className="status">Завантаження...</p>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-block">
          <span className="page-kicker">Новинний сервіс</span>
          <h1>Останні новини</h1>
        </div>
        <button onClick={() => navigate('/newsposts/new')}>Додати новину</button>
      </div>

      {newsposts.length === 0 ? (
        <div className="empty-state">
          <p>Поки що немає жодної новини.</p>
          <button type="button" onClick={() => navigate('/newsposts/new')}>
            Створити першу новину
          </button>
        </div>
      ) : (
        <div className="news-list">
          {newsposts.map((item) => (
            <Link key={item.id} to={`/newsposts/${item.id}`} className="news-card news-card-link">
              <span className="news-badge">Новина</span>
              <h2>{item.title}</h2>
              <p className="text-preview">{item.text}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
