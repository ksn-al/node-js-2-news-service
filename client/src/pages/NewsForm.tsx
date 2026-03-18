import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createNewspost,
  deleteNewspost,
  getNewspostById,
  updateNewspost,
} from '../api';

export default function NewsForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadForEdit() {
      if (!isEdit) return;

      if (!id || Number.isNaN(Number(id))) {
        setError('Некоректний ID новини');
        setLoading(false);
        return;
      }

      try {
        const news = await getNewspostById(Number(id));
        setTitle(news.title);
        setText(news.text);
      } catch (e) {
        setError('Не вдалося завантажити новину для редагування');
      } finally {
        setLoading(false);
      }
    }

    loadForEdit();
  }, [id, isEdit]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!title.trim() || !text.trim()) {
      setError('Поля заголовка і тексту є обовязковими');
      return;
    }

    setSaving(true);

    try {
      if (isEdit) {
        if (!id) return;
        const updated = await updateNewspost(Number(id), {
          title: title.trim(),
          text: text.trim(),
        });
        navigate(`/newsposts/${updated.id}`);
      } else {
        const created = await createNewspost({
          title: title.trim(),
          text: text.trim(),
        });
        navigate(`/newsposts/${created.id}`);
      }
    } catch (e) {
      setError('Не вдалося зберегти новину');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id) {
      return;
    }

    const confirmed = window.confirm('Ви дійсно хочете видалити цю новину?');

    if (!confirmed) {
      return;
    }

    setError(null);
    setSaving(true);

    try {
      await deleteNewspost(Number(id));
      navigate('/');
    } catch (e) {
      setError('Не вдалося видалити новину');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="status">Завантаження...</p>;
  }

  return (
    <div className="page">
      <div className="page-title-block">
        <span className="page-kicker">{isEdit ? 'Редактор' : 'Створення'}</span>
        <h1>{isEdit ? 'Редагування новини' : 'Нова новина'}</h1>
        <p className="page-subtitle">
          {isEdit
            ? 'Оновіть заголовок або текст та збережіть зміни.'
            : 'Заповніть форму, щоб додати нову новину до списку.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="news-form form-panel">
        <label htmlFor="title">Заголовок</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="text">Текст</label>
        <textarea
          id="text"
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        {error ? <p className="status error">{error}</p> : null}

        <div className="actions-row">
          <button type="submit" disabled={saving}>
            {saving
              ? 'Збереження...'
              : isEdit
                ? 'Підтвердити редагування'
                : 'Створити новину'}
          </button>
          {isEdit ? (
            <button type="button" className="danger-button" onClick={handleDelete} disabled={saving}>
              Видалити новину
            </button>
          ) : null}
          <button type="button" onClick={() => navigate('/')}>
            Повернутися до списку
          </button>
        </div>
      </form>
    </div>
  );
}
