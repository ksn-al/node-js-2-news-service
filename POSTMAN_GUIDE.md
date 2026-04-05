# Postman API Testing Guide

## Как импортировать коллекцию

1. Открой Postman
2. Нажми `File` → `Import` (или используй `Ctrl+O`)
3. Выбери файл `postman-collection.json` из той папки проекта
4. Коллекция будет загружена со всеми переменными и запросами

## Структура коллекции

### 1. **Auth** — Аутентификация
   - `Register User` — Регистрация нового пользователя
   - `Login User` — Вход в систему, получение JWT-токена

### 2. **Newsposts CRUD** — API для работы с новостями
   - `Get All Newsposts` — GET /api/newsposts?page=0&size=10
   - `Get Single Newspost` — GET /api/newsposts/:id
   - `Create Newspost` — POST /api/newsposts
   - `Update Newspost` — PUT /api/newsposts/:id
   - `Delete Newspost` — DELETE /api/newsposts/:id

### 3. **Test Scenario** — Полный сценарий тестирования
   1. Регистрация пользователя
   2. Login пользователя
   3. Получение всех новостей
   4. Получение одной новости (первой)
   5. Создание новой новости
   6. Редактирование созданной новости
   7. Удаление новости

## Переменные (окружение)

Коллекция включает следующие переменные:

| Переменная | Значение | Тип | Описание |
|---|---|---|---|
| `base_url` | http://localhost:8000 | string | URL сервера |
| `email` | testuser@example.com | string | Email для регистрации/входа |
| `password` | testpassword123 | string | Пароль |
| `token` | _динамически_ | string | JWT-токен (устанавливается после login) |
| `newspost_id` | _динамически_ | string | ID первой новости (заполняется из ответа) |
| `created_newspost_id` | _динамически_ | string | ID созданной новости |
| `newspost_*` | см. ниже | string | Данные для создания/обновления новости |

### Жанры новостей (newspost_genre)
- `Politic`
- `Business`
- `Sport`
- `Other`

## Как запустить тестирование

### Способ 1: Пошаговое тестирование
1. Запусти сервер: `npm run server` (в папке file-db-project)
2. В Postman открой вкладку `Auth`
3. Выполни `Register User` (или будут ошибки, если уже есть пользователь)
4. Затем выполни `Login User`
5. Перейди в `Newsposts CRUD` и тестируй каждый endpoint

### Способ 2: Автоматический запуск сценария
1. Запусти сервер: `npm run server`
2. В Postman: Collection → Test Scenario → Run (или нажми Run Collection)
3. Постман выполнит все 7 шагов по очереди

### Способ 3: Использование Postman Runner
1. Нажми большую кнопку `Run` в левой панели
2. Выбери коллекцию "FileDB Newsposts API"
3. Убедись, что выбран правильный Environment (с переменными)
4. Нажми `Run`

## Особенности автоматизации

### Сохранение переменных между запросами
После каждого успешного запроса переменные обновляются:
- **Login** → сохраняется `token`
- **Get All Newsposts** → сохраняется `newspost_id` (есть ли посты)
- **Create Newspost** → сохраняется `created_newspost_id`

### Tests (скрипты в коллороватых вкладках)
Каждый запрос содержит скрипт проверки ответа. Они проверяют:
- Статус код ответа (200, 201, 404 и т.д.)
- Сохранение важных ID в переменные
- Логирование результата в консоль

## Требования для БД

**Первый запуск:**
1. Если БД пустая (новая регистрация) — работает всё
2. Если пользователь уже есть — Register вернёт 400 (ошибка), используй Login

**Заполнение БД:**
Коллекция автоматически создаёт тестовый пост (`Breaking News`) и удаляет его в конце.

## Кастомизация

### Изменить email и пароль:
1. Collection Variables → измени `email` и `password`
2. Все запросы Auth будут использовать новые значения

### Изменить жанр новости:
1. Collection Variables → чанзж `newspost_genre` (Politic, Business, Sport, Other)

### Изменить базовый URL:
1. Collection Variables → чанзж `base_url` на свой адрес сервера

## Примеры ответов

### Register (201 Created)
```json
{
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login (200 OK)
```json
{
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get All Newsposts (200 OK)
```json
[
  {
    "id": 1,
    "title": "Breaking News",
    "text": "This is test newspost",
    "genre": "Other",
    "isPrivate": false,
    "createDate": "2026-04-05T10:30:00Z"
  }
]
```

### Create Newspost (201 Created)
```json
{
  "id": 1,
  "title": "Breaking News",
  "text": "This is test newspost",
  "genre": "Other",
  "isPrivate": false,
  "createDate": "2026-04-05T10:30:00Z"
}
```

## Ошибки

| Статус | Описание | Решение |
|---|---|---|
| `400` | Невалидный payload (email, пароль, title и т.д.) | Проверь формат данных, переменные |
| `401` | Нет токена или токен невалидный | Запусти Login перед запросами к /api/newsposts |
| `404` | Ресурс не найден (новость с таким ID) | Сначала создай новость, потом обновляй/удаляй |
| `500` | Ошибка сервера | Проверь консоль сервера (npm run server) |

## Советы

✅ Всегда запускай сценарий с начала (Register → Login)  
✅ Используй Postman Console (View → Show Postman Console) для отладки  
✅ Проверь, что переменные `token` и `created_newspost_id` заполняются корректно  
✅ Если тест не удаётся, проверь ответ (покажет точную ошибку)

---

**Готово!** Коллекция включает все требуемые endpoints, полный сценарий, переменные и автоматизацию через Tests скрипты.
